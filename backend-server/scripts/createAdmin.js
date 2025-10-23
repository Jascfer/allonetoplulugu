const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@allonetoplulugu.tr' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@allonetoplulugu.tr',
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@allonetoplulugu.tr');
    console.log('🔑 Password: Admin123!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

module.exports = createAdminUser;
