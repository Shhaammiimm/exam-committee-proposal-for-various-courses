const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const Exam = require('../models/Exam');
const CourseSelection = require('../models/CourseSelection');
const ExamCommittee = require('../models/ExamCommittee');
const ExamRelated = require('../models/ExamRelated');
const ExternalExaminer = require('../models/ExternalExaminer');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware);

// Chairman: create new draft proposal
router.post('/', requireRole('chairman'), async (req, res) => {
  try {
    const proposal = await Proposal.create({
      chairmanId: req.user._id,
      status: 'draft'
    });
    res.json({ success: true, proposal: { id: proposal._id, status: proposal.status } });
  } catch (err) {
    console.error('Create proposal:', err);
    res.status(500).json({ error: err.message });
  }
});

// List proposals by role
router.get('/', async (req, res) => {
  try {
    const { designation } = req.user;
    let query = {};
    if (designation === 'chairman') {
      query.chairmanId = req.user._id;
      query.status = { $in: ['draft', 'cancelled'] };
    } else if (designation === 'dean') {
      query.status = 'pending_dean';
    } else if (designation === 'vc') {
      query.status = 'pending_vc';
    } else if (designation === 'controller') {
      query.status = 'pending_controller';
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const list = await Proposal.find(query).sort({ updatedAt: -1 }).lean();
    res.json({ proposals: list });
  } catch (err) {
    console.error('List proposals:', err);
    res.status(500).json({ error: err.message });
  }
});

// Chairman: new applications (drafts only)
router.get('/new', requireRole('chairman'), async (req, res) => {
  try {
    const list = await Proposal.find({ chairmanId: req.user._id, status: 'draft' })
      .sort({ updatedAt: -1 }).lean();
    res.json({ proposals: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chairman: cancelled applications
router.get('/cancelled', requireRole('chairman'), async (req, res) => {
  try {
    const list = await Proposal.find({ chairmanId: req.user._id, status: 'cancelled' })
      .sort({ updatedAt: -1 }).lean();
    res.json({ proposals: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one proposal (for summary view)
router.get('/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).lean();
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    const isChairman = proposal.chairmanId && proposal.chairmanId.toString() === req.user._id.toString();
    const canView = isChairman ||
      (req.user.designation === 'dean' && proposal.status === 'pending_dean') ||
      (req.user.designation === 'vc' && proposal.status === 'pending_vc') ||
      (req.user.designation === 'controller' && proposal.status === 'pending_controller') ||
      proposal.status === 'approved';
    if (!canView) return res.status(403).json({ error: 'Forbidden' });
    res.json(proposal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireRole('chairman'), async (req, res) => {
  try {
    console.log("Deleting draft:", req.params.id, "by user:", req.user._id);
    const proposal = await Proposal.findOne({
      _id: req.params.id,
      chairmanId: req.user._id,
      status: 'draft'
    });
    console.log("Found proposal:", proposal);

    if (!proposal) {
      return res.status(404).json({ error: 'Draft proposal not found' });
    }

    await proposal.deleteOne();
    res.json({ success: true, message: 'Draft deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



// Update proposal data (save step: exam, course, committee, examRelated) – chairman only, draft only
router.put('/:id', requireRole('chairman'), async (req, res) => {
  try {
    const proposal = await Proposal.findOne({ _id: req.params.id, chairmanId: req.user._id, status: 'draft' });
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    const { exam, course, committee, examRelated, external } = req.body;
    if (exam) proposal.exam = exam;
    if (course) proposal.course = course;
    if (committee) proposal.committee = committee;
    if (Array.isArray(examRelated)) proposal.examRelated = examRelated;
    if (external) proposal.external = external;
    await proposal.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload signature and/or approve (advance status)
router.post('/:id/sign', async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    const { signature } = req.body;
    const role = req.user.designation;
    if (role === 'chairman') {
      if (proposal.chairmanId.toString() !== req.user._id.toString() || proposal.status !== 'draft') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      if (signature) proposal.signatures.chairman = signature;
      proposal.status = 'pending_dean';
    } else if (role === 'dean') {
      if (proposal.status !== 'pending_dean') return res.status(403).json({ error: 'Wrong status' });
      if (signature) proposal.signatures.dean = signature;
      proposal.status = 'pending_vc';
    } else if (role === 'vc') {
      if (proposal.status !== 'pending_vc') return res.status(403).json({ error: 'Wrong status' });
      if (signature) proposal.signatures.vc = signature;
      proposal.status = 'pending_controller';
    } else if (role === 'controller') {
      if (proposal.status !== 'pending_controller') return res.status(403).json({ error: 'Wrong status' });
      if (signature) proposal.signatures.controller = signature;
      proposal.status = 'approved';
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await proposal.save();
    res.json({ success: true, status: proposal.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel (reject) – dean, vc, or controller
router.post('/:id/cancel', requireRole('dean', 'vc', 'controller'), async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    const role = req.user.designation;
    const allowed = (role === 'dean' && proposal.status === 'pending_dean') ||
      (role === 'vc' && proposal.status === 'pending_vc') ||
      (role === 'controller' && proposal.status === 'pending_controller');
    if (!allowed) return res.status(403).json({ error: 'Cannot cancel this proposal' });
    proposal.status = 'cancelled';
    proposal.cancelledAt = new Date();
    proposal.cancelledBy = role;
    await proposal.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
