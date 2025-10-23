const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload dizinini oluştur
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Dosya filtresi
const fileFilter = (req, file, cb) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,txt').split(',');
  const fileExt = path.extname(file.originalname).toLowerCase().substring(1);
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error(`File type .${fileExt} is not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  }
});

module.exports = upload;
