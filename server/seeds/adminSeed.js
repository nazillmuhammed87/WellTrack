const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config/config');

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@welltrack.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = await User.create({
      fullName: 'WellTrack Admin',
      email: 'admin@welltrack.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      verifiedAt: new Date()
    });

    console.log('Admin user created:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
