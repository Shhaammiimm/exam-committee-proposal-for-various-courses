const mongoose = require('mongoose');

const examCommitteeSchema = new mongoose.Schema({
  chairman: { type: String, required: true },
  cname: { type: String, required: true },
  mem1: { type: String, required: true },
  name1: { type: String, required: true },
  mem2: { type: String, required: true },
  name2: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ExamCommittee', examCommitteeSchema);
