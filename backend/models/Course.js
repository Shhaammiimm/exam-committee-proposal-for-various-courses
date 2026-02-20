const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  courseTitle: { type: String, required: true },
  examType: { type: String, required: true },
  credit: { type: String, required: true },
  level: { type: String, required: true },
  semester: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
