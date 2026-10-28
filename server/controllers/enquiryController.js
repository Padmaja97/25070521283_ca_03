const mongoose = require('mongoose');
const Enquiry = require('../models/Enquiry');

async function createEnquiry(req, res, next) {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({ message: 'Thanks for getting in touch. Your message has been received.', enquiry: { id: enquiry._id } });
  } catch (error) { next(error); }
}

async function listEnquiries(req, res, next) {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(300);
    res.json({ enquiries });
  } catch (error) { next(error); }
}

async function updateEnquiryStatus(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid enquiry ID.' });
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found.' });
    res.json({ enquiry });
  } catch (error) { next(error); }
}

module.exports = { createEnquiry, listEnquiries, updateEnquiryStatus };
