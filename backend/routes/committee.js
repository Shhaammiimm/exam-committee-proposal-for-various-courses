const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const ExamCommittee = require('../models/ExamCommittee');

router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find().lean();
    res.json({
      teachers: teachers
        .filter((t) => t.name)
        .map((t) => ({
          name: t.name,
          designation: t.designation || '',
          department: t.department || '',
          university: t.university || ''
        }))
    });
  } catch (error) {
    console.error('Error loading teachers:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { chairman, chairmanDesignation, member1, member1Designation, member2, member2Designation } = req.body;

    if (!chairman || !chairmanDesignation || !member1 || !member1Designation || !member2 || !member2Designation) {
      return res.status(400).json({ error: 'All committee fields are required' });
    }

    const doc = await ExamCommittee.create({
      chairman,
      cname: chairmanDesignation,
      mem1: member1,
      name1: member1Designation,
      mem2: member2,
      name2: member2Designation
    });
    res.json({ success: true, id: doc._id, message: 'Exam committee saved successfully' });
  } catch (error) {
    console.error('Error saving committee:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
