require('dotenv').config();
const mongoose = require('mongoose');
const connectDatabase = require('../config/db');
const MembershipPlan = require('../models/MembershipPlan');
const Trainer = require('../models/Trainer');
const GymSettings = require('../models/GymSettings');

const plans = [
  { name: 'Monthly', durationInDays: 30, price: 999, benefits: ['Gym access for 30 days', 'Starter orientation'], isSample: true },
  { name: 'Quarterly', durationInDays: 90, price: 2499, benefits: ['Gym access for 90 days', 'Progress check-in'], isSample: true },
  { name: 'Half-Yearly', durationInDays: 180, price: 4499, benefits: ['Gym access for 180 days', 'Progress check-ins'], isSample: true },
  { name: 'Annual', durationInDays: 365, price: 7999, benefits: ['Gym access for 365 days', 'Progress check-ins'], isSample: true }
];

const trainers = [
  { name: 'Aarav Sharma', specialization: 'Strength & conditioning', experience: 'Sample profile', bio: 'A sample trainer profile for demonstrating the Flex Gym website. Replace this biography with verified information.', image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80', isSample: true },
  { name: 'Meera Patel', specialization: 'Mobility & general fitness', experience: 'Sample profile', bio: 'A sample trainer profile for demonstrating the Flex Gym website. Replace this biography with verified information.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', isSample: true },
  { name: 'Kabir Deshmukh', specialization: 'Functional training', experience: 'Sample profile', bio: 'A sample trainer profile for demonstrating the Flex Gym website. Replace this biography with verified information.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', isSample: true }
];

async function seed() {
  await connectDatabase();
  for (const plan of plans) await MembershipPlan.updateOne({ name: plan.name }, { $setOnInsert: plan }, { upsert: true });
  for (const trainer of trainers) await Trainer.updateOne({ name: trainer.name }, { $setOnInsert: trainer }, { upsert: true });
  await GymSettings.updateOne({ key: 'main' }, {
    $setOnInsert: {
      location: 'Gorewada Road, Nagpur, Maharashtra',
      openingHours: 'Monday–Saturday: 6:00 AM–10:00 PM\nSunday: 7:00 AM–1:00 PM',
      hoursAreSample: true
    }
  }, { upsert: true });
  console.log('Demo plans, trainer profiles, and hours are ready. Replace all sample content in the admin dashboard.');
}

seed()
  .catch((error) => {
    console.error(`Demo data was not seeded: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => { if (mongoose.connection.readyState !== 0) await mongoose.disconnect(); });
