# pharmacity-frontend

Vue 3 + Vite Telegram Mini App — farmatsevtika ombori dashboard.

## Ishga tushirish

```bash
cd pharmacity-frontend

npm install

# .env sozlash (dev da shart emas — vite proxy ishlaydi)
cp .env.example .env

# Dev server (backend port 8000 da ishlashi kerak)
npm run dev
# → http://localhost:5173

# Test: brauzerda ochish
# http://localhost:5173?chat_id=YOUR_TELEGRAM_ID
```

## Build (production)

```bash
npm run build
# dist/ papkasi yaratiladi — uni HTTPS serverga joylashtiring
```

## Telegram Mini App ulanish

`Bot Settings → Menu Button → Web App URL` ga deploy URL ni kiriting.

## Tuzilish

```
src/
├── main.js
├── App.vue                  ← Shell: routing, transitions
├── assets/main.css          ← Global CSS variables
├── composables/
│   ├── useApi.js            ← Barcha API chaqiruvlari
│   └── useTelegram.js       ← Telegram SDK wrapper
├── stores/
│   └── dashboard.js         ← Pinia: state + SSE
├── components/
│   ├── LoadingScreen.vue
│   ├── AccessDenied.vue
│   ├── AppHeader.vue
│   ├── BottomNav.vue
│   ├── UpdateToast.vue
│   ├── StatCard.vue
│   ├── MaterialCard.vue
│   └── ProductCard.vue
└── views/
    ├── OverviewView.vue     ← Statistika, chart, top dorilar
    ├── MaterialsView.vue    ← Qidiruv + real-time qoldiqlar
    ├── ProductsView.vue     ← Retseptlar, expand ko'rinish
    └── BatchesView.vue      ← Ishlab chiqarish tarixi
```
