# Quick Reference - Phase 3 Features

## 🌐 Multilanguage API

### Single Translation
```bash
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World","targetLanguage":"hi"}'
```

### Batch Translation
```bash
curl -X POST http://localhost:5000/api/translate/batch \
  -H "Content-Type: application/json" \
  -d '{"texts":["Hello","World"],"targetLanguage":"mr"}'
```

### Language Codes
| Code | Language |
|------|----------|
| en | English |
| hi | Hindi |
| mr | Marathi |
| ta | Tamil |
| te | Telugu |
| ka | Kannada |
| ml | Malayalam |

---

## 📍 Search API

### Nearby Search (5km)
```bash
curl "http://localhost:5000/api/business/nearby?lat=19.0760&lng=72.8777&radius=5"
```

### With Service Type
```bash
curl "http://localhost:5000/api/business/nearby?lat=19.0760&lng=72.8777&radius=5&type=Beauty%20Parlour"
```

### Location Search
```bash
curl "http://localhost:5000/api/business/search/location/Koramangala"
```

---

## 🧩 Frontend Components

### Use Language Context
```tsx
import { useLanguage } from "@/lib/language-context"

const { language, setLanguage } = useLanguage()
```

### Use Translation Hook
```tsx
import { useTranslation } from "@/hooks/use-translation"

const { translate, translateMany, isTranslating } = useTranslation()
```

### Use Static Translations
```tsx
import { t } from "@/lib/translations"

const label = t("welcome", language)
```

### Language Switcher Component
```tsx
import { LanguageSwitcher } from "@/components/common/language-switcher"

// Already in header, available everywhere
```

---

## 🔧 Configuration

### Backend (.env)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/udyogini
JWT_SECRET=udyogini_jwt_secret_key_2026_change_in_production
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🚀 Start Commands

```bash
# Backend
cd Backend && npm install && npm start

# Frontend
cd Frontend && npm install && npm run dev

# Seed Database (Optional)
cd Backend && npm run seed
```

---

## 📁 Key Files

### Translation
- Backend: `Backend/routes/translationRoutes.js`
- Frontend: `Frontend/lib/translate-api.ts`
- Hook: `Frontend/hooks/use-translation.ts`
- Context: `Frontend/lib/language-context.tsx`
- Component: `Frontend/components/common/language-switcher.tsx`

### Search
- Backend: `Backend/routes/businessRoutes.js` (nearby endpoint)
- Frontend: `Frontend/components/customer/search-section.tsx`
- Dashboard: `Frontend/app/customer/dashboard/page.tsx`

---

## 🧪 Test Accounts

```
Customer:
  Phone: 9876543210
  Password: password123

Business Owner:
  Phone: 9111111113
  Password: password123
```

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| MULTILANGUAGE_GUIDE.md | Translation system guide |
| SEARCH_GUIDE.md | Search functionality guide |
| API_REFERENCE.md | Complete API reference |
| TESTING_GUIDE.md | Testing procedures |
| QUICK_START_GUIDE.md | Getting started |
| README.md | Project overview |
| PHASE_3_SUMMARY.md | Phase 3 details |

---

## ✅ Features at a Glance

| Feature | Status | Location |
|---------|--------|----------|
| 7 Languages | ✅ | Header switcher |
| 5km Search | ✅ | Dashboard search |
| Distance Display | ✅ | Business cards |
| Translation API | ✅ | /api/translate |
| Geolocation | ✅ | Nearby button |
| Service Filtering | ✅ | Search dropdown |

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Port 5000 in use | `lsof -i :5000` then kill process |
| MongoDB connection fails | Check MONGO_URI in .env |
| API not found | Ensure backend is running |
| Language not changing | Clear localStorage |
| Geolocation fails | Check browser permissions |

---

## 🎯 Feature Checklist

- [x] Multilanguage support (7 languages)
- [x] Language switcher in header
- [x] Translation API endpoints
- [x] Geolocation-based search
- [x] 5km radius filtering
- [x] Location name search
- [x] Service type filtering
- [x] Distance calculation
- [x] Frontend integration
- [x] Error handling
- [x] Documentation complete
- [x] All tests passing

---

## 🚢 Deployment

### Environment Setup
1. Set up .env with production values
2. Build frontend: `npm run build`
3. Start backend on production server
4. Deploy frontend to Vercel/Netlify

### Production Checklist
- [ ] JWT_SECRET changed
- [ ] MONGO_URI verified
- [ ] NEXT_PUBLIC_API_URL updated
- [ ] Environment variables set
- [ ] Database backed up
- [ ] Logging configured
- [ ] Monitoring enabled

---

## 📞 Support Resources

**Quick Answers**: Check documentation files
**API Issues**: See API_REFERENCE.md
**Search Issues**: See SEARCH_GUIDE.md
**Translation Issues**: See MULTILANGUAGE_GUIDE.md
**Testing Issues**: See TESTING_GUIDE.md
**Getting Started**: See QUICK_START_GUIDE.md

---

## 🎁 What You Get

✅ Production-ready multilanguage system
✅ Location-based search with 5km radius
✅ 7 languages supported (EN, HI, MR, TA, TE, KA, ML)
✅ Comprehensive documentation
✅ Complete API reference
✅ Test data and accounts
✅ Error handling
✅ Performance optimized

---

**Ready to Go!** 🚀

Backend: http://localhost:5000
Frontend: http://localhost:3000

Start both servers and begin testing!
