const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MongoDB URI not found, running without database');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Continuing without database...');
  }
};

module.exports = connectDB;
