require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDatabase = require('./config/db');
const createCorsOptions = require('./config/cors');
const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors(createCorsOptions(process.env.CLIENT_URL)));
app.use(express.json({ limit: '20kb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/enquiries', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }), enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('Unable to start Flex Gym: configure a JWT_SECRET of at least 32 characters in server/.env.');
  process.exit(1);
}

connectDatabase()
  .then(() => app.listen(port, () => console.log(`Flex Gym API listening on port ${port}`)))
  .catch((error) => {
    const code = error.code ? ` (${error.code})` : '';
    console.error(`Unable to start Flex Gym: MongoDB connection failed${code}. Check server/.env, Atlas Network Access, and firewall/DNS access.`);
    process.exit(1);
  });
