const mongoose = require('mongoose');

const courseSelectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courseCode: { type: String, default: '' },
  courseTitle: { type: String, default: '' },
  examType: { type: String, default: '' },
  credit: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('CourseSelection', courseSelectionSchema);
