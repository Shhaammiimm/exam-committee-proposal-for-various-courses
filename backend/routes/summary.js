const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const CourseSelection = require('../models/CourseSelection');
const ExamCommittee = require('../models/ExamCommittee');
const ExamRelated = require('../models/ExamRelated');
const ExternalExaminer = require('../models/ExternalExaminer');

router.get('/', async (req, res) => {
  try {
    const exam = await Exam.findOne().sort({ createdAt: -1 }).lean();
    const course = await CourseSelection.findOne().sort({ createdAt: -1 }).lean();
    const committee = await ExamCommittee.findOne().sort({ createdAt: -1 }).lean();
    const examRelatedDocs = await ExamRelated.find().sort({ createdAt: -1 }).limit(4).lean();
    const external = await ExternalExaminer.findOne().sort({ createdAt: -1 }).lean();

    const examRelatedList = [];
    examRelatedDocs.reverse().forEach((row) => {
      examRelatedList.push(row.name || '');
      examRelatedList.push(row.rank || '');
    });

    res.json({
      exam: exam
        ? {
            degree: exam.degree || '',
            level: exam.level || '',
            semester: exam.semester || '',
            year: exam.year || ''
          }
        : { degree: '', level: '', semester: '', year: '' },
      course: course
        ? {
            name: course.name || '',
            courseCode: course.courseCode || '',
            courseTitle: course.courseTitle || '',
            examType: course.examType || '',
            credit: course.credit || ''
          }
        : { name: '', courseCode: '', courseTitle: '', examType: '', credit: '' },
      committee: committee
        ? {
            chairman: committee.chairman || '',
            chairmanDesignation: committee.cname || '',
            member1: committee.mem1 || '',
            member1Designation: committee.name1 || '',
            member2: committee.mem2 || '',
            member2Designation: committee.name2 || ''
          }
        : {
            chairman: '',
            chairmanDesignation: '',
            member1: '',
            member1Designation: '',
            member2: '',
            member2Designation: ''
          },
      examRelated: examRelatedList,
      external: external
        ? {
            name: external.name || '',
            designation: external.designation || '',
            dept: external.dept || '',
            uni: external.uni || ''
          }
        : { name: '', designation: '', dept: '', uni: '' }
    });
  } catch (error) {
    console.error('Error loading summary:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
