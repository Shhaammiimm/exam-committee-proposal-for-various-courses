const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const External = require('../models/External');
const ExamRelated = require('../models/ExamRelated');
const ExternalExaminer = require('../models/ExternalExaminer');

router.get('/data', async (req, res) => {
  try {
    const teachers = await Teacher.find().lean();
    const externalList = await External.find().lean();

    res.json({
      teachers: teachers
        .filter((t) => t.name)
        .map((t) => ({
          name: t.name,
          designation: t.designation || '',
          department: t.department || '',
          university: t.university || ''
        })),
      external: externalList.map((e) => ({
        teacherName: e.teacherName,
        designation: e.designation || '',
        department: e.department,
        university: e.university
      }))
    });
  } catch (error) {
    console.error('Error loading exam related data:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      questionMaker,
      questionMakerDesignation,
      internalTeacher1,
      internalTeacher1Designation,
      internalTeacher2,
      internalTeacher2Designation,
      scrutinizer,
      scrutinizerDesignation,
      externalName,
      externalDesignation,
      externalDepartment,
      externalUniversity
    } = req.body;

    await ExamRelated.insertMany([
      { name: questionMaker, rank: questionMakerDesignation },
      { name: internalTeacher1, rank: internalTeacher1Designation },
      { name: internalTeacher2, rank: internalTeacher2Designation },
      { name: scrutinizer, rank: scrutinizerDesignation }
    ]);
    await ExternalExaminer.create({
      name: externalName,
      designation: externalDesignation || '',
      dept: externalDepartment,
      uni: externalUniversity
    });

    res.json({ success: true, message: 'Exam related details saved successfully' });
  } catch (error) {
    console.error('Error saving exam related:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
