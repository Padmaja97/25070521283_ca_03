const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  durationInDays: { type: Number, required: true, min: 1, max: 3650 },
  price: { type: Number, required: true, min: 0, max: 10000000 },
  benefits: { type: [String], default: [], validate: (items) => items.length <= 20 },
  isActive: { type: Boolean, default: true, index: true },
  isSample: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
