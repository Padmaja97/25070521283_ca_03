const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  specialization: { type: String, required: true, trim: true, maxlength: 100 },
  experience: { type: String, required: true, trim: true, maxlength: 80 },
  bio: { type: String, required: true, trim: true, maxlength: 500 },
  image: { type: String, trim: true, maxlength: 500, default: '' },
  isActive: { type: Boolean, default: true, index: true },
  isSample: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
