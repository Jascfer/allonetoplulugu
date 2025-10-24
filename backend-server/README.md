# All One Backend Server

Bu backend servisi All One Topluluğu için geliştirilmiştir.

## Özellikler

- ✅ **User Authentication** - Kayıt olma ve giriş yapma
- ✅ **JWT Token** - Güvenli authentication
- ✅ **MongoDB** - Veritabanı entegrasyonu
- ✅ **File Upload** - Not dosyaları yükleme
- ✅ **Notes Management** - Not yönetimi
- ✅ **Rate Limiting** - API koruması
- ✅ **CORS** - Frontend entegrasyonu

## Kurulum

1. **Dependencies yükle:**
```bash
npm install
```

2. **Environment variables ayarla:**
```bash
cp env.example .env
# .env dosyasını düzenle
```

3. **Serveri başlat:**
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş yapma
- `GET /api/auth/me` - Mevcut kullanıcı bilgileri

### Notes
- `GET /api/notes` - Tüm notları listele
- `GET /api/notes/:id` - Tekil not detayı
- `POST /api/notes` - Yeni not oluştur
- `PUT /api/notes/:id/download` - İndirme sayısını artır

### Upload
- `POST /api/upload` - Dosya yükleme

### Health Check
- `GET /api/health` - Server durumu

## Deployment

### Railway
1. Railway hesabı oluştur
2. GitHub repository'yi bağla
3. Environment variables ayarla
4. Deploy et

### Render
1. Render hesabı oluştur
2. Web Service oluştur
3. GitHub repository'yi bağla
4. Environment variables ayarla
5. Deploy et

## Environment Variables

- `MONGODB_URI` - MongoDB bağlantı string'i
- `JWT_SECRET` - JWT token secret key
- `PORT` - Server port (varsayılan: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL (CORS için)

