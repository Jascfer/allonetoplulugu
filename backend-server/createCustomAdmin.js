const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config({ path: './.env' });

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
    process.exit(1);
  }
};

const createCustomAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'lw8377429@gmail.com';
    const adminPassword = 'StRiKe626262!';
    const adminName = 'Admin User';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔐 Role:', existingAdmin.role);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff'
    });

    await adminUser.save();
    console.log('✅ Custom admin user created successfully');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Name:', adminName);
    console.log('🔐 Role: admin');

  } catch (error) {
    console.error('❌ Error creating custom admin user:', error);
  } finally {
    mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

createCustomAdmin();
