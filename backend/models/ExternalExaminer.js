const mongoose = require('mongoose');

const externalExaminerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, default: '' },
  dept: { type: String, required: true },
  uni: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ExternalExaminer', externalExaminerSchema);
