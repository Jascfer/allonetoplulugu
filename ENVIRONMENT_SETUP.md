# Environment Variables Setup

## Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/all-one-toplulugu
MONGODB_DB=all-one-toplulugu

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,txt

# CORS
FRONTEND_URL=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=7d
```

## Frontend (.env)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## MongoDB Atlas Setup
1. https://cloud.mongodb.com adresine gidin
2. Hesap oluşturun
3. Cluster oluşturun
4. Database Access → User oluşturun
5. Network Access → IP adresinizi ekleyin
6. Connection String'i alın

## Vercel Environment Variables
Vercel Dashboard → Project → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/all-one-toplulugu
MONGODB_DB=all-one-toplulugu
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-domain.vercel.app
```

## Railway Environment Variables
Railway Dashboard → Project → Variables:

```
PORT=5000
MONGODB_URI=${{MongoDB.MONGODB_URI}}
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-domain.com
```

## Render Environment Variables
Render Dashboard → Service → Environment:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/all-one-toplulugu
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-domain.com
```
