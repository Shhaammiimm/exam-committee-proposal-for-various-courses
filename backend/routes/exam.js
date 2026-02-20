const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');

router.post('/', async (req, res) => {
  try {
    const { degree, level, semester, session } = req.body;

    if (!degree || !level || !semester || !session) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const doc = await Exam.create({ degree, level, semester, year: session });
    res.json({ success: true, id: doc._id, message: 'Exam details saved successfully' });
  } catch (error) {
    console.error('Error saving exam details:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
