# All One Topluluğu Backend

Bu proje All One Topluluğu için geliştirilmiş backend API'sidir.

## 🚀 Özellikler

- **Authentication**: JWT tabanlı kullanıcı girişi ve kaydı
- **Notes Management**: Not oluşturma, düzenleme, silme ve listeleme
- **File Upload**: PDF, DOC, DOCX, TXT dosya yükleme
- **MongoDB**: Veritabanı yönetimi
- **Security**: Rate limiting, CORS, Helmet
- **Validation**: Express-validator ile veri doğrulama

## 📋 Gereksinimler

- Node.js >= 18.0.0
- MongoDB (local veya MongoDB Atlas)
- npm veya yarn

## 🛠️ Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
cd backend
npm install
```

2. **Environment variables ayarlayın:**
```bash
cp env.example .env
```

`.env` dosyasını düzenleyin:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/all-one-toplulugu
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

3. **MongoDB'yi başlatın:**
```bash
# Local MongoDB
mongod

# Veya MongoDB Atlas kullanın
```

4. **Sunucuyu başlatın:**
```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgileri

### Notes
- `GET /api/notes` - Notları listele (filtreleme ve sayfalama ile)
- `GET /api/notes/:id` - Tek not getir
- `POST /api/notes` - Yeni not oluştur
- `PUT /api/notes/:id` - Not güncelle
- `DELETE /api/notes/:id` - Not sil
- `POST /api/notes/:id/download` - İndirme sayısını artır

### Upload
- `POST /api/upload` - Dosya yükle
- `GET /api/upload/:filename` - Dosya indir
- `DELETE /api/upload/:filename` - Dosya sil

## 🔧 Geliştirme

### Scripts
```bash
npm run dev      # Development mode (nodemon)
npm start        # Production mode
```

### Veritabanı Modelleri

#### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `avatar`: String (auto-generated)
- `role`: String (user/admin)
- `isActive`: Boolean

#### Note
- `title`: String (required)
- `description`: String (required)
- `subject`: String (enum: matematik, fizik, kimya, etc.)
- `grade`: String (enum: 9, 10, 11, 12, mezun)
- `tags`: Array of Strings
- `fileUrl`: String (required)
- `fileName`: String (required)
- `fileSize`: Number (required)
- `author`: ObjectId (ref: User)
- `downloads`: Number (default: 0)
- `rating`: Number (default: 0)
- `ratingCount`: Number (default: 0)
- `isApproved`: Boolean (default: false)
- `isActive`: Boolean (default: true)

## 🚀 Deployment

### Railway
1. Railway hesabı oluşturun
2. GitHub repo'yu bağlayın
3. Environment variables ekleyin
4. Deploy edin

### Render
1. Render hesabı oluşturun
2. GitHub repo'yu bağlayın
3. Environment variables ekleyin
4. Deploy edin

### Vercel
1. Vercel hesabı oluşturun
2. GitHub repo'yu bağlayın
3. Environment variables ekleyin
4. Deploy edin

## 🔒 Güvenlik

- JWT token authentication
- Password hashing (bcrypt)
- Rate limiting
- CORS protection
- Helmet security headers
- File type validation
- Input validation

## 📝 Notlar

- Upload edilen dosyalar `./uploads` klasöründe saklanır
- JWT token süresi varsayılan 7 gündür
- Rate limit: IP başına 15 dakikada 100 istek
- Desteklenen dosya türleri: PDF, DOC, DOCX, TXT

