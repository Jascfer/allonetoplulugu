// api/notes.js - Not CRUD işlemleri
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
  const { method } = req;

  try {
    const { client, db } = await connectToDatabase();

    switch (method) {
      case 'GET':
        // Tüm notları getir
        const notes = await db.collection('notes').find({}).sort({ createdAt: -1 }).toArray();
        res.status(200).json({ success: true, data: notes });
        break;

      case 'POST':
        // Yeni not ekle
        const { title, description, subject, grade, tags, fileUrl, author } = req.body;
        
        const newNote = {
          title,
          description,
          subject,
          grade,
          tags,
          fileUrl,
          author,
          downloads: 0,
          rating: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await db.collection('notes').insertOne(newNote);
        res.status(201).json({ success: true, data: result.insertedId });
        break;

      case 'PUT':
        // Not güncelle
        const { id, ...updateData } = req.body;
        await db.collection('notes').updateOne(
          { _id: id },
          { $set: { ...updateData, updatedAt: new Date() } }
        );
        res.status(200).json({ success: true });
        break;

      case 'DELETE':
        // Not sil
        const { noteId } = req.body;
        await db.collection('notes').deleteOne({ _id: noteId });
        res.status(200).json({ success: true });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
}
