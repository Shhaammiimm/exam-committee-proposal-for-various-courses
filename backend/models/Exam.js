const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  level: { type: String, required: true },
  semester: { type: String, required: true },
  year: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
