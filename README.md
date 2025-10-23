# All One Topluluğu - Not Paylaşım Sitesi

Modern, animasyonlu ve responsive bir not paylaşım platformu. Öğrencilerin ders notlarını paylaşabileceği, arayabileceği ve indirebileceği profesyonel bir web uygulaması.

## 🚀 Özellikler

- **Modern Dark Theme**: Göz yormayan karanlık tema tasarımı
- **Responsive Design**: Mobil, tablet ve masaüstü uyumlu
- **Profesyonel Animasyonlar**: Framer Motion ile smooth animasyonlar
- **Arama Sistemi**: Ders, konu ve sınıf seviyesine göre filtreleme
- **Ders Kategorileri**: Matematik, Fizik, Kimya, Biyoloji ve daha fazlası
- **Günlük Sorular**: Her gün yeni sorular ve cevaplar
- **Not İndirme**: Anında PDF indirme özelliği

## 🛠️ Teknolojiler

- **React 19** - Modern React hooks ve functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Professional animations
- **Lucide React** - Beautiful icons
- **Vercel** - Deployment platform

## 📦 Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd all-one-toplulugu
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Development server'ı başlatın:
```bash
npm start
```

4. Tarayıcınızda `http://localhost:3000` adresini açın.

## 🚀 Deployment

### Vercel ile Deployment

1. [Vercel](https://vercel.com) hesabı oluşturun
2. GitHub repository'nizi Vercel'e bağlayın
3. Otomatik deployment başlayacak

### Custom Domain

1. Vercel dashboard'da projenizi seçin
2. Settings > Domains bölümüne gidin
3. Custom domain'inizi ekleyin
4. DNS ayarlarınızı güncelleyin

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 768px
- **Desktop**: > 768px

## 🎨 Renk Paleti

- **Primary Green**: #22c55e
- **Dark Background**: #0f172a
- **Card Background**: #1e293b
- **Border**: #334155
- **Text**: #ffffff / #d1d5db

## 📂 Proje Yapısı

```
src/
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── SubjectCategories.tsx
│   ├── DailyQuestion.tsx
│   └── RecentNotes.tsx
├── App.tsx
├── index.tsx
└── index.css
```

## 🔧 Geliştirme

### Yeni Bileşen Ekleme
1. `src/components/` klasöründe yeni dosya oluşturun
2. TypeScript interface'leri tanımlayın
3. Framer Motion animasyonları ekleyin
4. Tailwind CSS ile styling yapın

### Animasyon Ekleme
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **Website**: [all-one-toplulugu.vercel.app](https://all-one-toplulugu.vercel.app)
- **Email**: info@all-one-toplulugu.com

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!