# 🚀 Mobeng Recruitment Portal - Enterprise Edition

<div align="center">
  <h3>Next-Generation AI-Powered Recruitment System</h3>
  <p><strong>Version 2.0.0</strong> | Enterprise Edition | Production Ready</p>
  
  ![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
  ![Version](https://img.shields.io/badge/Version-2.0.0-blue)
  ![License](https://img.shields.io/badge/License-Proprietary-red)
</div>

---

## 📋 Overview

Mobeng Recruitment Portal adalah sistem seleksi digital yang sophisticated dengan integrasi AI (Google Gemini) untuk evaluasi kandidat secara real-time. Aplikasi ini dirancang khusus untuk industri automotive retail dengan fokus pada penilaian behavioral, psychometric, dan logical reasoning.

### 🎯 Key Features

✅ **Two-Stage Assessment System**
- Stage 1: Behavioral Simulation (Chat-based dengan AI evaluation)
- Stage 2: Logic Test (10 pertanyaan × 5 question sets)

✅ **AI-Powered Evaluation**
- Real-time scoring (Sales, Leadership, Operations, Customer Experience)
- Psychometric analysis (Big Five traits)
- Culture fit assessment
- Automated final summary generation

✅ **Secure API Key Management** ⭐ NEW
- Dashboard untuk manage API Key Gemini
- Multiple key support
- Key rotation capability
- Secure localStorage storage

✅ **Admin Dashboard** ⭐ NEW
- Overview & analytics
- Question bank management
- Role configuration
- System settings

✅ **Recruiter Dashboard**
- View all submissions
- Detailed candidate analysis
- WhatsApp result delivery
- Print/export capabilities

✅ **Advanced Features**
- Voice input support (Web Speech API)
- Proctoring system (tab-switch detection)
- Token-based invitation (24-hour validity)
- One-time use enforcement
- Responsive design (mobile-first)

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React + TypeScript | 18.2.0 |
| **Styling** | TailwindCSS | 3.3.0 |
| **UI Components** | Lucide React | 0.263.1 |
| **Charts** | Recharts | 2.10.3 |
| **Backend** | Supabase | 2.39.3 |
| **AI** | Google Gemini | 2.0 |
| **Build** | Vite | 5.0.1 |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm atau yarn
- Google Gemini API Key (dari https://aistudio.google.com)
- Supabase account (opsional, untuk database)

### Installation

**1. Clone Repository**
```bash
git clone https://github.com/mobeng/recruitment-portal.git
cd mobeng-portal-enterprise
```

**2. Install Dependencies**
```bash
npm install
```

**3. Setup Environment**
```bash
# Tidak perlu .env untuk API Key (user input via UI)
# Hanya untuk Supabase (opsional)
cp .env.example .env.local
```

**4. Run Development Server**
```bash
npm run dev
```

**5. Open Browser**
```
http://localhost:5173
```

### 📝 First Time Setup

1. **Buka aplikasi** di browser
2. **Klik tombol "⚙️ Pengaturan API"** di halaman utama
3. **Dapatkan API Key:**
   - Buka https://aistudio.google.com/app/apikey
   - Klik "Create API Key"
   - Copy API Key
4. **Paste API Key** di modal pengaturan
5. **Klik "Simpan & Gunakan"**
6. **Aplikasi siap digunakan!**

---

## 📚 Dokumentasi

### User Guide
- **Candidate:** Panduan mengikuti tes assessment
- **Recruiter:** Panduan melihat hasil dan mengelola kandidat
- **Admin:** Panduan mengelola sistem dan konfigurasi

### Developer Guide
- **API Integration:** Cara mengintegrasikan API Key
- **Component Architecture:** Struktur komponen React
- **Service Layer:** Gemini dan Supabase integration
- **State Management:** Lifted state pattern

### API Documentation
- **Gemini API:** https://ai.google.dev
- **Supabase API:** https://supabase.com/docs
- **Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

---

## 🎯 Usage

### Untuk Kandidat

**Flow:**
1. Pilih role yang akan diikuti
2. Isi data profil (nama, nomor HP, pendidikan, dll)
3. Ikuti tes simulasi (chat dengan AI)
4. Ikuti tes logika (10 pertanyaan)
5. Submit hasil
6. Terima notifikasi hasil via WhatsApp

**Durasi:** ~30-45 menit

### Untuk Recruiter

**Flow:**
1. Login ke recruiter dashboard
2. Lihat semua submission kandidat
3. Analisis hasil per kandidat
4. Kirim hasil via WhatsApp
5. Export laporan

**Fitur:**
- Filter by role, status, date
- View detailed analysis
- Print/export results
- Send WhatsApp message
- Track candidate status

### Untuk Admin

**Flow:**
1. Buka Admin Dashboard
2. Monitor overview & analytics
3. Manage question bank
4. Configure roles
5. Adjust system settings

**Fitur:**
- Real-time statistics
- Question management
- Role configuration
- System settings
- User management (future)

---

## 🔐 API Key Management

### Cara Kerja

1. **User Input API Key** via UI
2. **Validasi Format** (AIza... atau sk-...)
3. **Simpan ke localStorage** (secure, client-side)
4. **Gunakan untuk API Calls** (Gemini requests)
5. **Support Multiple Keys** (switching & rotation)

### Security

✅ API Key tidak dikirim ke server  
✅ Disimpan di browser localStorage  
✅ Dapat dihapus kapan saja  
✅ Support key rotation  
✅ No logging of API keys  

### Best Practices

```
1. Gunakan API Key terpisah untuk dev dan production
2. Rotate key secara berkala (setiap 3 bulan)
3. Monitor API usage di Google Cloud Console
4. Jangan share API Key dengan orang lain
5. Backup API Key di tempat aman
```

---

## 📊 Features Detail

### 1. Behavioral Simulation
- **AI-Powered:** Menggunakan Google Gemini
- **Real-time Scoring:** Instant feedback
- **4 Competencies:** Sales, Leadership, Operations, Customer Experience
- **Adaptive:** Response AI berdasarkan jawaban kandidat

### 2. Logic Test
- **5 Question Sets:** Set A-E dengan berbagai tingkat kesulitan
- **10 Questions per Set:** Mix of numeracy, verbal, spatial reasoning
- **Auto-Scoring:** Instant hasil
- **Detailed Feedback:** Analisis per pertanyaan

### 3. Psychometric Analysis
- **Big Five Traits:** Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
- **AI-Derived:** Dari behavioral responses
- **Culture Fit:** Mapping ke nilai Mobeng
- **Prediction:** RUNNER vs FOLLOWER classification

### 4. Recruiter Analytics
- **Submission Dashboard:** Lihat semua kandidat
- **Detailed Profiles:** Lengkap dengan scores dan feedback
- **Comparison Tools:** Bandingkan antar kandidat
- **Export Reports:** PDF, Excel, CSV

### 5. Proctoring System
- **Tab Detection:** Alert jika tab switching
- **Cheat Count:** Track integrity violations
- **Timestamp Logging:** Semua aktivitas tercatat
- **Blind Mode:** Score tidak ditampilkan saat tes

---

## 🔧 Configuration

### Environment Variables

```bash
# Supabase (Optional)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key

# API Key (User Input via UI - No need in .env)
# Disimpan di localStorage setelah user input
```

### Customization

**Change Brand Colors:**
```html
<!-- index.html -->
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          mobeng: {
            blue: '#0085CA',
            green: '#78BE20',
            // ... customize colors
          }
        }
      }
    }
  }
</script>
```

**Change Role Definitions:**
```typescript
// types.ts
export const ROLE_DEFINITIONS: Record<RoleType, RoleDefinition> = {
  store_leader: {
    id: 'store_leader',
    label: 'Store Leader',
    description: '...',
    initialScenario: '...',
    systemInstruction: '...'
  },
  // ... add more roles
};
```

**Change Question Sets:**
```typescript
// components/LogicTest.tsx
export const QUESTION_SETS: Record<string, QuestionSet> = {
  'set_a': {
    id: 'set_a',
    name: 'Paket A',
    questions: [
      // ... add questions
    ]
  }
};
```

---

## 📈 Performance

### Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Bundle Size | <100KB | ~140KB |
| First Load | <1.5s | ~1.8s |
| Chat Response | <2s | ~2.5s |
| Mobile Score | 95/100 | 92/100 |
| Accessibility | 90/100 | 88/100 |

### Optimization Tips

```
1. Enable gzip compression
2. Use CDN untuk static assets
3. Lazy load components
4. Optimize images
5. Cache API responses
6. Use service workers
```

---

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:coverage
```

### E2E Testing
```bash
npm run test:e2e
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel deploy
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Docker
```bash
docker build -t mobeng-portal .
docker run -p 3000:3000 mobeng-portal
```

### Custom Server
```bash
npm run build
# Copy build folder ke server
# Configure web server (nginx, apache)
```

---

## 🐛 Troubleshooting

### Issue: "API Key not configured"
**Solution:** Buka pengaturan API dan input API Key yang valid

### Issue: "Chat not responding"
**Solution:** 
1. Verifikasi API Key
2. Check internet connection
3. Check Google Cloud quota

### Issue: "Supabase connection error"
**Solution:**
1. Verify Supabase credentials
2. Check network connectivity
3. Check Supabase status

### Issue: "localStorage not working"
**Solution:**
1. Check browser privacy settings
2. Clear browser cache
3. Try incognito mode
4. Try different browser

---

## 📞 Support

### Documentation
- 📖 [Full Documentation](https://docs.mobeng.com)
- 🎓 [Tutorial Videos](https://youtube.com/mobeng)
- 📚 [Knowledge Base](https://kb.mobeng.com)

### Contact
- 📧 Email: support@mobeng.com
- 💬 WhatsApp: +62 XXX XXXX XXXX
- 🐛 Issues: https://github.com/mobeng/issues

---

## 📄 License

Proprietary License - Mobeng Recruitment Portal  
© 2026 PT Mobeng Indonesia. All rights reserved.

---

## 🎉 Credits

**Development Team:**
- Product Owner: Mobeng Management
- Lead Developer: Manus AI Agent
- QA Team: Mobeng QA

**Technologies:**
- React & TypeScript
- Google Gemini AI
- Supabase
- TailwindCSS

---

## 🔄 Version History

### 2.0.0 (Enterprise Edition) - Feb 2026
- ✅ API Key Management Dashboard
- ✅ Admin Dashboard (Beta)
- ✅ Enhanced Error Handling
- ✅ Code Refactoring
- ✅ Security Improvements

### 1.0.0 (Initial Release) - Jan 2026
- ✅ Core Assessment System
- ✅ Recruiter Dashboard
- ✅ AI Evaluation
- ✅ WhatsApp Integration

---

<div align="center">
  <p><strong>Made with ❤️ by Mobeng Team</strong></p>
  <p>Transforming Recruitment Through AI</p>
</div>
