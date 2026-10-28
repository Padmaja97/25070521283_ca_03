const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending', index: true },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null }
}, { timestamps: true });

applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('MembershipApplication', applicationSchema);
