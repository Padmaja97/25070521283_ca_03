const mongoose = require('mongoose');
const MembershipApplication = require('../models/MembershipApplication');
const MembershipPlan = require('../models/MembershipPlan');

async function applyForMembership(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.body.planId)) return res.status(400).json({ message: 'Choose a valid membership plan.' });
    const plan = await MembershipPlan.findOne({ _id: req.body.planId, isActive: true });
    if (!plan) return res.status(404).json({ message: 'This membership plan is not available.' });
    const pending = await MembershipApplication.exists({ userId: req.user._id, status: 'Pending' });
    if (pending) return res.status(409).json({ message: 'You already have an application awaiting review.' });
    const application = await MembershipApplication.create({ userId: req.user._id, planId: plan._id });
    await application.populate('planId');
    res.status(201).json({ application });
  } catch (error) { next(error); }
}

async function myApplications(req, res, next) {
  try {
    const applications = await MembershipApplication.find({ userId: req.user._id }).populate('planId').sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) { next(error); }
}

async function allApplications(req, res, next) {
  try {
    const applications = await MembershipApplication.find().populate('userId', 'name email phone').populate('planId').sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) { next(error); }
}

async function updateApplicationStatus(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid application ID.' });
    const { status, startDate } = req.body;
    const application = await MembershipApplication.findById(req.params.id).populate('planId');
    if (!application) return res.status(404).json({ message: 'Membership application not found.' });

    if (status === 'Approved') {
      const start = startDate ? new Date(`${startDate}T00:00:00.000Z`) : new Date();
      if (Number.isNaN(start.getTime())) return res.status(400).json({ message: 'Enter a valid membership start date.' });
      application.status = 'Approved';
      application.startDate = start;
      application.endDate = new Date(start.getTime() + application.planId.durationInDays * 86400000);
    } else {
      application.status = status;
      application.startDate = null;
      application.endDate = null;
    }

    await application.save();
    await application.populate('userId', 'name email phone');
    res.json({ application });
  } catch (error) { next(error); }
}

module.exports = { applyForMembership, myApplications, allApplications, updateApplicationStatus };
