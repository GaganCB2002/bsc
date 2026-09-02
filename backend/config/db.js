import mongoose from 'mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';
import seedDatabase from '../seed/seedData.js';

let mongoServer;

const connectDB = async () => {
  try {
    try {
      console.log('Attempting to connect to primary MongoDB...');
      const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      
      mongoose.connection.on('error', (err) => {
        console.error(`MongoDB connection error: ${err.message}`);
      });
      return;
    } catch (err) {
      console.log(`⚠️ Primary MongoDB unavailable (${err.message}). Falling back to In-Memory DB...`);
    }

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    const conn = await mongoose.connect(uri);
    console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
    
    console.log('🌱 Seeding In-Memory Database with demo data...');
    await seedDatabase(false); // pass false to avoid exiting process
    console.log('✨ In-Memory Database seeded successfully!');

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB shutdown:', err);
    process.exit(1);
  }
};

export default connectDB;
