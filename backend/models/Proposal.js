const mongoose = require('mongoose');

const STATUS = ['draft', 'pending_dean', 'pending_vc', 'pending_controller', 'approved', 'cancelled'];

const proposalSchema = new mongoose.Schema({
  chairmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: STATUS, default: 'draft' },
  exam: {
    degree: String,
    level: String,
    semester: String,
    year: String
  },
  course: {
    name: String,
    courseCode: String,
    courseTitle: String,
    examType: String,
    credit: String
  },
  committee: {
    chairman: String,
    chairmanDesignation: String,
    member1: String,
    member1Designation: String,
    member2: String,
    member2Designation: String
  },
  examRelated: [String],
  external: {
    name: String,
    designation: String,
    dept: String,
    uni: String
  },
  signatures: {
    chairman: { type: String, default: '' },
    dean: { type: String, default: '' },
    vc: { type: String, default: '' },
    controller: { type: String, default: '' }
  },
  cancelledAt: { type: Date },
  cancelledBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
module.exports.STATUS = STATUS;
