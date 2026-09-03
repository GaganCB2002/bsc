import mongoose from 'mongoose';

// The in-memory MongoDB fallback is only ever used in non-production environments
// (e.g. a developer running the app without a local Mongo). It is intentionally
// disabled in production to prevent silent data loss.

let mongoServer;

const connectDB = async () => {
  const isProd = process.env.NODE_ENV === 'production';

  // Production must use a real MongoDB.
  if (isProd && (!process.env.MONGO_URI || process.env.MONGO_URI.includes('mongodb-memory-server'))) {
    throw new Error('MONGO_URI must point to a real MongoDB in production');
  }

  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: isProd ? 10000 : 2000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Mongoose will attempt to reconnect.');
    });
  } catch (err) {
    // In production, do NOT silently fall back to an in-memory database.
    if (isProd) {
      console.error(`❌ MongoDB Connection Error (production): ${err.message}`);
      throw err;
    }

    // Dev only: fall back to mongodb-memory-server so contributors can run without
    // installing Mongo locally. Ephemeral data is intentional.
    if (process.env.DISABLE_INMEM_FALLBACK === '1') {
      console.error('In-memory fallback disabled (DISABLE_INMEM_FALLBACK=1)');
      throw err;
    }

    try {
      console.log(`⚠️ Primary MongoDB unavailable (${err.message}). Falling back to In-Memory DB (dev only)...`);
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const seedDatabase = (await import('../seed/seedData.js')).default;
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log('🌱 Seeding In-Memory Database with demo data...');
      await seedDatabase(false);
      console.log('✨ In-Memory Database seeded successfully!');
    } catch (memErr) {
      console.error(`❌ MongoDB Connection Error: ${memErr.message}`);
      throw memErr;
    }
  }
};

export const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB shutdown:', err);
    process.exit(1);
  }
};

export default connectDB;
