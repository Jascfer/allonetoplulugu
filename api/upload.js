// api/upload.js - Dosya yükleme
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: './uploads',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: function ({ name, originalFilename, mimetype }) {
        // Sadece PDF dosyalarına izin ver
        return mimetype && mimetype.includes('pdf');
      }
    });

    const [fields, files] = await form.parse(req);
    
    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Dosya adını güvenli hale getir
    const fileName = `${Date.now()}-${file.originalFilename}`;
    const filePath = path.join('./uploads', fileName);
    
    // Dosyayı taşı
    fs.renameSync(file.filepath, filePath);

    // Dosya URL'sini oluştur
    const fileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${fileName}`;

    res.status(200).json({
      success: true,
      data: {
        fileName,
        fileUrl,
        fileSize: file.size,
        originalName: file.originalFilename
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
}
