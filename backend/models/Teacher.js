const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, default: '' },
  department: { type: String, default: '' },
  university: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
