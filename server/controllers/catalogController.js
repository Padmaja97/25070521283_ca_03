const mongoose = require('mongoose');
const MembershipPlan = require('../models/MembershipPlan');
const MembershipApplication = require('../models/MembershipApplication');
const Trainer = require('../models/Trainer');

function validId(id) {
  return mongoose.isValidObjectId(id);
}

async function listPlans(req, res, next) {
  try {
    const plans = await MembershipPlan.find(req.user?.role === 'admin' ? {} : { isActive: true }).sort({ durationInDays: 1 });
    res.json({ plans });
  } catch (error) { next(error); }
}

async function createPlan(req, res, next) {
  try {
    const plan = await MembershipPlan.create({ ...req.body, isSample: false });
    res.status(201).json({ plan });
  } catch (error) { next(error); }
}

async function updatePlan(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid membership plan ID.' });
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, { ...req.body, isSample: false }, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ message: 'Membership plan not found.' });
    res.json({ plan });
  } catch (error) { next(error); }
}

async function deletePlan(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid membership plan ID.' });
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Membership plan not found.' });
    if (await MembershipApplication.exists({ planId: plan._id })) {
      return res.status(409).json({ message: 'This plan has applications. Deactivate it instead so application history is preserved.' });
    }
    await plan.deleteOne();
    res.json({ message: 'Membership plan deleted.' });
  } catch (error) { next(error); }
}

async function listTrainers(req, res, next) {
  try {
    const trainers = await Trainer.find(req.user?.role === 'admin' ? {} : { isActive: true }).sort({ name: 1 });
    res.json({ trainers });
  } catch (error) { next(error); }
}

async function createTrainer(req, res, next) {
  try {
    const trainer = await Trainer.create({ ...req.body, isSample: false });
    res.status(201).json({ trainer });
  } catch (error) { next(error); }
}

async function updateTrainer(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid trainer ID.' });
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, { ...req.body, isSample: false }, { new: true, runValidators: true });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found.' });
    res.json({ trainer });
  } catch (error) { next(error); }
}

async function deleteTrainer(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid trainer ID.' });
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found.' });
    res.json({ message: 'Trainer deleted.' });
  } catch (error) { next(error); }
}

module.exports = { listPlans, createPlan, updatePlan, deletePlan, listTrainers, createTrainer, updateTrainer, deleteTrainer };
