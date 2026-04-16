import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inventory_dashboard');

    // Only create the initial door-opener (Super Admin)
    let superAdmin = await User.findOne({ role: 'super_admin' });
    if (!superAdmin) {
      superAdmin = new User({
        username: 'superadmin',
        password: 'password123', // Make sure to hash this if your model doesn't!
        fullName: 'System Super Admin',
        role: 'super_admin'
      });
      await superAdmin.save();
      console.log('✅ Super Admin created. You can now login and create shops via the Dashboard.');
    } else {
      console.log('✅ Super Admin already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedDB();
