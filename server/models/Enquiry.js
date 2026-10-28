const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 20, default: '' },
  message: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
  status: { type: String, enum: ['New', 'Handled'], default: 'New', index: true }
}, { timestamps: { createdAt: true, updatedAt: true } });

enquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
