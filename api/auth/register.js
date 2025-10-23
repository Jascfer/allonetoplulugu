// api/auth/register.js - Kullanıcı kaydı
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const { client, db } = await connectToDatabase();
    
    // Kullanıcı zaten var mı kontrol et
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 12);

    // Yeni kullanıcı oluştur
    const newUser = {
      name,
      email,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22c55e&color=fff`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);

    res.status(201).json({
      success: true,
      data: {
        id: result.insertedId,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}
