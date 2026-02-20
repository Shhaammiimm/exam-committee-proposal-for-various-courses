const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const Course = require('../models/Course');
const CourseSelection = require('../models/CourseSelection');

router.get('/', async (req, res) => {
  try {
    const exam = await Exam.findOne().sort({ createdAt: -1 });
    if (!exam) {
      return res.status(404).json({ error: 'No exam details found' });
    }

    const { level, semester } = exam;
    const courses = await Course.find({ level, semester });

    const formattedCourses = courses
      .filter((c) => c.courseCode)
      .map((c) => ({
        courseCode: c.courseCode || '',
        courseTitle: c.courseTitle || '',
        examType: c.examType || '',
        credit: c.credit || '',
        display: `${c.courseTitle || ''} ${c.examType || ''} ${c.credit || ''} (Credit)`.trim()
      }));

    res.json({ courses: formattedCourses });
  } catch (error) {
    console.error('Error loading courses:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { courseName, courseCode, courseTitle, examType, credit } = req.body;

    if (!courseName) {
      return res.status(400).json({ error: 'Course selection is required' });
    }

    const doc = await CourseSelection.create({
      name: courseName,
      courseCode: courseCode || '',
      courseTitle: courseTitle || '',
      examType: examType || '',
      credit: credit || ''
    });
    res.json({ success: true, id: doc._id, message: 'Course selected successfully' });
  } catch (error) {
    console.error('Error saving course:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
