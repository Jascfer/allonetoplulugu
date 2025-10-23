// Railway'de çalıştırılacak admin oluşturma scripti
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User model (basit versiyon)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // MongoDB bağlantısı
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://alloneuser:AllOne2024!@cluster0.2nakkmh.mongodb.net/allone?retryWrites=true&w=majority';
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Admin kullanıcı kontrolü
    const existingAdmin = await User.findOne({ email: 'admin@allonetoplulugu.tr' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@allonetoplulugu.tr');
      console.log('🔑 Password: Admin123!');
      await mongoose.disconnect();
      return;
    }

    // Admin kullanıcı oluştur
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
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();
