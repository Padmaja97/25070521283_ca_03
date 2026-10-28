const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254, index: true },
  password: { type: String, required: true, minlength: 8, select: false },
  phone: { type: String, trim: true, maxlength: 20, default: '' },
  role: { type: String, enum: ['member', 'admin'], default: 'member', index: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

userSchema.pre('save', async function hashPassword() {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
