const User = require('../models/User');
const MembershipApplication = require('../models/MembershipApplication');
const Enquiry = require('../models/Enquiry');
const GymSettings = require('../models/GymSettings');

async function dashboard(req, res, next) {
  try {
    const [totalUsers, totalApplications, pendingApplications, approvedApplications, totalEnquiries, newEnquiries, recentApplications, recentEnquiries] = await Promise.all([
      User.countDocuments({ role: 'member' }),
      MembershipApplication.countDocuments(),
      MembershipApplication.countDocuments({ status: 'Pending' }),
      MembershipApplication.countDocuments({ status: 'Approved' }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'New' }),
      MembershipApplication.find().populate('userId', 'name email').populate('planId', 'name').sort({ createdAt: -1 }).limit(6).lean(),
      Enquiry.find().sort({ createdAt: -1 }).limit(6).lean()
    ]);
    const recentActivity = [
      ...recentApplications.map((item) => ({
        type: 'application',
        label: `${item.userId?.name || 'A member'} applied for ${item.planId?.name || 'a plan'}`,
        status: item.status,
        createdAt: item.createdAt
      })),
      ...recentEnquiries.map((item) => ({
        type: 'enquiry',
        label: `${item.name} sent an enquiry`,
        status: item.status,
        createdAt: item.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

    res.json({ stats: { totalUsers, totalApplications, pendingApplications, approvedApplications, totalEnquiries, newEnquiries }, recentActivity });
  } catch (error) { next(error); }
}

async function members(req, res, next) {
  try {
    const search = String(req.query.search || '').trim().slice(0, 80);
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const filter = { role: 'member' };
    if (safeSearch) filter.$or = [{ name: { $regex: safeSearch, $options: 'i' } }, { email: { $regex: safeSearch, $options: 'i' } }];
    const users = await User.find(filter).select('name email phone role createdAt').sort({ createdAt: -1 }).limit(300).lean();
    res.json({ users });
  } catch (error) { next(error); }
}

async function getSettings(req, res, next) {
  try {
    let settings = await GymSettings.findOne({ key: 'main' }).lean();
    if (!settings) settings = { location: 'Gorewada Road, Nagpur, Maharashtra', openingHours: '', hoursAreSample: true };
    res.json({ settings });
  } catch (error) { next(error); }
}

async function updateSettings(req, res, next) {
  try {
    const settings = await GymSettings.findOneAndUpdate(
      { key: 'main' },
      { location: req.body.location, openingHours: req.body.openingHours, hoursAreSample: false },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({ settings });
  } catch (error) { next(error); }
}

module.exports = { dashboard, members, getSettings, updateSettings };
