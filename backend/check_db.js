import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bags_db');
        console.log('Connected to:', mongoose.connection.name);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
checkDB();
