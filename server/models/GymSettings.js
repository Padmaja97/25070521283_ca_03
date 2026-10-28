const mongoose = require('mongoose');

const gymSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  location: { type: String, default: 'Gorewada Road, Nagpur, Maharashtra', trim: true, maxlength: 160 },
  openingHours: { type: String, default: '', trim: true, maxlength: 500 },
  hoursAreSample: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('GymSettings', gymSettingsSchema);
