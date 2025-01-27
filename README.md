# Ürün Yönetimi Uygulaması

Full-stack ürün yönetimi uygulaması. Next.js frontend ve Node.js backend ile geliştirilmiştir.

## Özellikler

- Ürün listeleme, ekleme, düzenleme ve silme
- Resim yükleme (Base64)
- Filtreleme özellikleri:
  - Fiyat aralığı
  - Stok durumu
  - Çeşitli sıralama seçenekleri
- Responsive tasarım
- Form validasyonları
- Yükleme ve hata durumları

## Teknolojiler

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Kurulum

### Ön Gereksinimler
- Node.js (v18+)
- MongoDB
- Git

### Backend Kurulumu

1. Backend klasörüne gidin:
cd backend

2. Gerekli bağımlılıkları yükleyin:
npm install

3. MongoDB veri tabanını docker compose ile başlatın:
docker compose up -d

5. Server'ı başlatın:
npm start

### Frontend Kurulumu

1. Frontend klasörüne gidin:
cd frontend

2. Gerekli bağımlılıkları yükleyin:
npm install

3. Development server'ı başlatın:
npm run dev -- --port 3000
