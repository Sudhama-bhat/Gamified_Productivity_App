require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await User.findOne({ email: 'admin@gamified.com' });
  if (admin) {
    console.log('Admin found:');
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('IsActive:', admin.isActive);
    console.log('Password Hash:', admin.password);
  } else {
    console.log('Admin NOT found');
  }
  process.exit(0);
}

checkAdmin();
