# 🚀 Deployment Seçenekleri

## 1. VERCEL (Önerilen - En Kolay)

### ✅ Avantajlar:
- Frontend + Backend tek platformda
- Custom domain ücretsiz
- Otomatik SSL
- CDN desteği
- Kolay kurulum

### 📋 Adımlar:

1. **Vercel hesabı oluşturun:**
   - https://vercel.com adresine gidin
   - GitHub ile giriş yapın

2. **Projeyi deploy edin:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

3. **Environment Variables ekleyin:**
   Vercel Dashboard → Project → Settings → Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/all-one-toplulugu
   MONGODB_DB=all-one-toplulugu
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://your-domain.vercel.app
   ```

4. **Custom Domain ekleyin:**
   - Settings → Domains
   - Domain'inizi ekleyin
   - DNS ayarlarını yapın

---

## 2. RAILWAY (Backend için)

### ✅ Avantajlar:
- MongoDB dahil
- Custom domain ücretsiz
- Kolay kurulum
- Güvenilir

### 📋 Adımlar:

1. **Railway hesabı oluşturun:**
   - https://railway.app

2. **Backend deploy edin:**
   - GitHub repo'yu bağlayın
   - Backend klasörünü seçin
   - Deploy edin

3. **MongoDB ekleyin:**
   - Railway Dashboard → Add Service → Database → MongoDB

4. **Environment Variables:**
   ```
   PORT=5000
   MONGODB_URI=${{MongoDB.MONGODB_URI}}
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://your-frontend-domain.com
   ```

---

## 3. RENDER (Backend için)

### ✅ Avantajlar:
- MongoDB desteği
- Custom domain ücretsiz
- Güvenilir hosting

### 📋 Adımlar:

1. **Render hesabı oluşturun:**
   - https://render.com

2. **Backend deploy edin:**
   - GitHub repo'yu bağlayın
   - Backend klasörünü seçin
   - Deploy edin

3. **MongoDB ekleyin:**
   - Render Dashboard → New → Database → MongoDB

---

## 4. NETLIFY (Frontend) + RAILWAY/RENDER (Backend)

### ✅ Avantajlar:
- Frontend ve backend ayrı
- Her ikisi de custom domain
- Kolay yönetim

### 📋 Adımlar:

1. **Frontend (Netlify):**
   ```bash
   npm run build
   # Netlify'e build klasörünü yükleyin
   ```

2. **Backend (Railway/Render):**
   - Yukarıdaki adımları takip edin

3. **API URL güncelleyin:**
   ```javascript
   const API_BASE_URL = 'https://your-backend-domain.com';
   ```

---

## 5. DIGITALOCEAN APP PLATFORM

### ✅ Avantajlar:
- Full-stack tek platformda
- MongoDB desteği
- Custom domain
- Güvenilir

### 💰 Maliyet:
- $5/ay başlangıç

---

## 🔧 Environment Variables Checklist

### Backend için:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
MONGODB_DB=all-one-toplulugu
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-domain.com
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,txt
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=7d
```

### Frontend için:
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

---

## 🎯 Önerilen Strateji

### **Seçenek 1: Vercel (Tek Platform)**
- En kolay kurulum
- Tek platformda yönetim
- Custom domain ücretsiz

### **Seçenek 2: Netlify + Railway**
- Frontend ve backend ayrı
- Her ikisi de custom domain
- Daha fazla kontrol

### **Seçenek 3: DigitalOcean**
- Enterprise seviye
- Tam kontrol
- Ücretli ama güvenilir

---

## 📝 Deployment Checklist

- [ ] MongoDB Atlas hesabı oluştur
- [ ] Domain satın al
- [ ] Environment variables hazırla
- [ ] Backend deploy et
- [ ] Frontend deploy et
- [ ] Custom domain bağla
- [ ] SSL sertifikası kontrol et
- [ ] API bağlantısını test et
- [ ] Dosya yükleme test et
- [ ] Authentication test et

