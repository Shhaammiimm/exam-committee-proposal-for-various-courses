const mongoose = require('mongoose');

const examRelatedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rank: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ExamRelated', examRelatedSchema);
