import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bags_db');

    // Only create the initial door-opener (Super Admin)
    // Delete existing Super Admin to ensure update
    await User.deleteMany({ role: 'super_admin' });

    const superAdmin = new User({
      username: 'ibrahim1530388@gmail.com',
      password: 'super12345',
      fullName: 'Ibrahim (Super Admin)',
      role: 'super_admin'
    });
    await superAdmin.save();
    console.log('✅ Super Admin created with email: ibrahim1530388@gmail.com');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedDB();
