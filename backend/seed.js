require('dotenv').config();
const { connectDB } = require('./db');
const Exam = require('./models/Exam');
const Course = require('./models/Course');
const CourseSelection = require('./models/CourseSelection');
const ExamCommittee = require('./models/ExamCommittee');
const ExamRelated = require('./models/ExamRelated');
const ExternalExaminer = require('./models/ExternalExaminer');
const Teacher = require('./models/Teacher');
const External = require('./models/External');

const dummyTeachers = [
  { name: 'Adiba Mahajabin Nitu', designation: 'Professor', department: 'CSE', university: 'Hajee Mohammad Danesh Science and Technology University' },
  { name: 'Dr. Md. Abdulla Al Mamun', designation: 'Professor', department: 'CSE', university: 'Hajee Mohammad Danesh Science and Technology University' },
  { name: 'Dr. Md. Delowar Hossain', designation: 'Professor', department: 'CSE', university: 'Hajee Mohammad Danesh Science and Technology University' },
  { name: 'Md. Rashedul Islam', designation: 'Associate Professor', department: 'CSE', university: 'Hajee Mohammad Danesh Science and Technology University' },
  { name: 'Pankaj Bhowmik', designation: 'Lecturer', department: 'CSE', university: 'Hajee Mohammad Danesh Science and Technology University' },
  { name: 'Md. Shajalal', designation: 'Assistant Professor', department: 'CSE', university: 'Hajee Mohammad Danesh Science and Technology University' },
  { name: 'Md. Abu Marjan', designation: 'Assistant Professor', department: 'CSE', university: 'Hajee Mohammad Danesh Science and Technology University' }
];

const dummyExternals = [
  { teacherName: 'Dr. External One', designation: 'Professor', department: 'Computer Science', university: 'Tech University' },
  { teacherName: 'Prof. External Two', designation: 'Associate Professor', department: 'Electrical Engineering', university: 'State University' },
  { teacherName: 'Dr. External Three', designation: 'Professor', department: 'ECE', university: 'National Institute' }
];

const dummyCoursesByLevelSemester = [
  { level: '1', semester: 'i', courses: [
    { courseCode: 'CSE101', courseTitle: 'Programming Fundamentals', examType: 'Theory', credit: '3' },
    { courseCode: 'CSE102', courseTitle: 'Data Structures', examType: 'Theory', credit: '3' },
    { courseCode: 'ECE101', courseTitle: 'Basic Electronics', examType: 'Theory', credit: '3' },
    { courseCode: 'CSE103', courseTitle: 'Discrete Mathematics', examType: 'Theory', credit: '3' }
  ]},
  { level: '1', semester: 'ii', courses: [
    { courseCode: 'CSE201', courseTitle: 'Algorithms', examType: 'Theory', credit: '3' },
    { courseCode: 'CSE202', courseTitle: 'Database Systems', examType: 'Theory', credit: '3' },
    { courseCode: 'ECE201', courseTitle: 'Digital Logic Design', examType: 'Theory', credit: '3' },
  ]},
  { level: '2', semester: 'i', courses: [
    { courseCode: 'CSE301', courseTitle: 'Operating Systems', examType: 'Theory', credit: '3' },
    { courseCode: 'CSE302', courseTitle: 'Computer Networks', examType: 'Theory', credit: '3' },
    { courseCode: 'ECE301', courseTitle: 'Microprocessors', examType: 'Theory', credit: '3' },
  ]},
  { level: '2', semester: 'ii', courses: [
    { courseCode: 'CSE401', courseTitle: 'Software Engineering', examType: 'Theory', credit: '3' },
    { courseCode: 'CSE402', courseTitle: 'Machine Learning', examType: 'Theory', credit: '3' },
    { courseCode: 'ECE401', courseTitle: 'Embedded Systems', examType: 'Theory', credit: '3' },
  ]},
  { level: '3', semester: 'i', courses: [
    { courseCode: 'CSE501', courseTitle: 'Advanced Programming', examType: 'Theory', credit: '3' },
    { courseCode: 'CSE502', courseTitle: 'Data Mining', examType: 'Theory', credit: '3' },
    { courseCode: 'CSE503', courseTitle: 'Computer Vision', examType: 'Theory', credit: '3' }
  ]},
  { level: '3', semester: 'ii', courses: [
    { courseCode: 'CSE601', courseTitle: 'Project Work', examType: 'Practical', credit: '6' },
    { courseCode: 'CSE602', courseTitle: 'Internship', examType: 'Practical', credit: '6' },
    { courseCode: 'CSE603', courseTitle: 'Seminar', examType: 'Practical', credit: '3' }
  ]},
  { level: '4', semester: 'i', courses: [
    { courseCode: 'CSE701', courseTitle: 'Thesis', examType: 'Practical', credit: '12' },
    { courseCode: 'CSE702', courseTitle: 'Industrial Training', examType: 'Practical', credit: '6' },
    { courseCode: 'CSE703', courseTitle: 'Comprehensive Viva', examType: 'Practical', credit: '3' }
  ]},
  { level: '4', semester: 'ii', courses: [
    { courseCode: 'CSE702', courseTitle: 'Industrial Training', examType: 'Practical', credit: '6' },
    { courseCode: 'CSE703', courseTitle: 'Comprehensive Viva', examType: 'Practical', credit: '3' },
    { courseCode: 'CSE704', courseTitle: 'Project Defense', examType: 'Practical', credit: '6' }
  ]}
];

async function seed() {
  try {
    await connectDB();

    await Teacher.deleteMany({});
    await Teacher.insertMany(dummyTeachers);
    console.log('Teachers seeded');

    await External.deleteMany({});
    await External.insertMany(dummyExternals);
    console.log('External examiners (dropdown) seeded');

    await Course.deleteMany({});
    for (const { level, semester, courses } of dummyCoursesByLevelSemester) {
      await Course.insertMany(courses.map(c => ({ ...c, level, semester })));
    }
    console.log('Courses seeded');

    // One dummy exam so "get latest" has data (optional)
    await Exam.deleteMany({});
    await Exam.create({ degree: 'CSE', level: '1', semester: 'i', year: '2023' });
    console.log('Sample exam seeded');

    await CourseSelection.deleteMany({});
    await ExamCommittee.deleteMany({});
    await ExamRelated.deleteMany({});
    await ExternalExaminer.deleteMany({});

    console.log('Seed completed. All data is stored in MongoDB Atlas.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
