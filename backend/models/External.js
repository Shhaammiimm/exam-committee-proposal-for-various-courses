const mongoose = require('mongoose');

const externalSchema = new mongoose.Schema({
  teacherName: { type: String, required: true },
  designation: { type: String, default: '' },
  department: { type: String, required: true },
  university: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('External', externalSchema);
