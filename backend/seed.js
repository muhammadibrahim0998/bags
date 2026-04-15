import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Shop from './models/Shop.js';
import Item from './models/Item.js';
import Sale from './models/Sale.js';
import CashSession from './models/CashSession.js';
import Settings from './models/Settings.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inventory_dashboard');
    console.log('Connected to MongoDB for seeding...');

    // Clear entire database
    console.log('Clearing old database records...');
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Item.deleteMany({});
    await Sale.deleteMany({});
    await CashSession.deleteMany({});
    await Settings.deleteMany({});
    console.log('✅ Database cleared.');

    // Create Super Admin
    console.log('Checking for Super Admin...');
    let superAdmin = await User.findOne({ role: 'super_admin' });
    if (!superAdmin) {
      superAdmin = new User({
        username: 'superadmin',
        password: 'password123',
        fullName: 'System Super Admin',
        role: 'super_admin'
      });
      await superAdmin.save();
      console.log('✅ Super Admin created (superadmin / password123)');
    } else {
      console.log('✅ Super Admin already exists.');
    }

    const shopData = [
      {
        name: 'Main Branch',
        address: 'Kabul, Afghanistan',
        contactNumber: '0700000000',
        ownerName: 'Super Admin'
      }
    ];

    const createdShops = [];
    for (const data of shopData) {
      const shop = new Shop(data);
      await shop.save();
      
      // Create settings for each shop
      const settings = new Settings({
        shopId: shop._id,
        shopName: shop.name,
        address: shop.address,
        phone: shop.contactNumber
      });
      await settings.save();
      createdShops.push(shop);
    }
    console.log(`✅ ${createdShops.length} shops and their settings created.`);

    console.log('\n🎉 Seeding complete successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
