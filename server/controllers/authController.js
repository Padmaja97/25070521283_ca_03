const jwt = require('jsonwebtoken');
const User = require('../models/User');

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt };
}

function tokenFor(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
}

async function register(req, res, next) {
  try {
    const user = await User.create({ name: req.body.name, email: req.body.email, password: req.body.password, phone: req.body.phone || '' });
    res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }
    res.json({ token: tokenFor(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

function currentUser(req, res) {
  res.json({ user: publicUser(req.user) });
}

async function updateProfile(req, res, next) {
  try {
    req.user.name = req.body.name;
    req.user.phone = req.body.phone || '';
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, currentUser, updateProfile };
