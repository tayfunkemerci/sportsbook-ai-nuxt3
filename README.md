# Sportsbook AI

AI destekli spor bahis simülasyon platformu. Gerçek para kullanmadan spor bahisleri oynamayı simüle eden, yapay zeka destekli bir deneyim platformu.

## Özellikler

### 🔐 Kimlik Doğrulama Sistemi
- Kullanıcı kaydı ve girişi (Supabase Auth)
- Email/şifre ile giriş
- Magic link ile şifresiz giriş
- Oturum yönetimi

### 💰 Bakiye Sistemi
- Her yeni kullanıcıya 1000$ başlangıç bakiyesi
- Bakiye yükleme özelliği
- Bahis oynarken bakiye kontrolü
- Pinia store ile bakiye yönetimi

### 🎲 Bahis Sistemi
- Aktif bahisleri listeleme
- Bahis oynama
- Bahis geçmişi
- Oranlar ve potansiyel kazanç hesaplama

### 🤖 AI Tahminleri
- Google Gemini AI entegrasyonu
- Her bahis için detaylı tahmin analizi
- Geçmiş veriler ve güncel form analizi
- Güven oranı ile tahminler

### 🎨 Arayüz Özellikleri
- Modern ve responsive tasarım
- Dark/Light mode desteği
- Kullanıcı profil sayfası
- Bahis geçmişi tablosu
- Liderlik tablosu

## Teknik Detaylar

### 🛠 Teknoloji Stack
- Nuxt.js 3 framework'ü
- Supabase veritabanı ve kimlik doğrulama
- Pinia state management
- Tailwind CSS ile stil yönetimi
- TypeScript ile tip güvenliği

### 🔒 Güvenlik
- Row Level Security (RLS) ile veri güvenliği
- Middleware ile sayfa erişim kontrolü
- Güvenli bakiye işlemleri
- Hata yönetimi

### 📊 Veritabanı Yapısı
- `users` tablosu (id, email, balance)
- `bets` tablosu (id, user_id, title, amount, odds, status)
- İlişkisel veri modeli
- Otomatik timestamp'ler

### ⚡️ Performans Optimizasyonları
- Bakiye cache'leme
- Tek sayfa uygulaması (SPA)
- Lazy loading
- Optimistik UI güncellemeleri

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Üretime derle
npm run build
```

## Ortam Değişkenleri

`.env` dosyasında aşağıdaki değişkenleri tanımlayın:

```env
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
GEMINI_API_KEY=your-gemini-api-key
```

## Lisans

MIT
