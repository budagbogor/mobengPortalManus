# 🚀 Mobeng Recruitment Portal v3.0 - GitHub Setup Guide

**Repository:** https://github.com/budagbogor/mobengPortalManus  
**Status:** ✅ Uploaded to GitHub

---

## 📋 Daftar Isi

1. [Tentang Aplikasi](#tentang-aplikasi)
2. [Fitur Utama](#fitur-utama)
3. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
4. [Setup Lokal](#setup-lokal)
5. [Setup Supabase](#setup-supabase)
6. [Konfigurasi External Services](#konfigurasi-external-services)
7. [Build untuk Production](#build-untuk-production)
8. [Deployment](#deployment)

---

## 📱 Tentang Aplikasi

**Mobeng Recruitment Portal v3.0** adalah platform rekrutmen digital yang canggih dan enterprise-grade, dirancang untuk memudahkan proses seleksi kandidat dengan menggunakan teknologi AI (Google Gemini) dan sistem penilaian otomatis.

Aplikasi ini telah melalui audit lengkap, upgrade ke enterprise edition, dan implementasi 5 fitur lanjutan yang powerful.

---

## ✨ Fitur Utama

### 1. **Admin Dashboard Advanced**
- Manajemen bank soal secara dinamis
- Manajemen role dan definisi pekerjaan
- Tidak perlu mengubah kode untuk menambah/edit soal

### 2. **Autentikasi Recruiter dengan RBAC**
- Login aman dengan email/password
- Role-based access control (admin, recruiter)
- Session management yang robust

### 3. **Analytics Dashboard**
- Visualisasi data dengan Recharts
- Metrik real-time: total submission, rata-rata skor, completion rate
- Filter berdasarkan rentang waktu
- Export data untuk laporan

### 4. **Notifikasi Multi-channel**
- Email via SendGrid
- SMS via Twilio
- WhatsApp via Twilio
- Template yang dapat dikustomisasi

### 5. **Document Upload & Management**
- Upload CV dan portofolio
- Drag-and-drop interface
- Penyimpanan di Supabase Storage
- Download dan delete dokumen

### 6. **Gemini AI Integration**
- Penilaian otomatis berbasis AI
- Analisis performa kandidat
- Feedback yang intelligent
- Scoring berdasarkan Big Five Personality Traits

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 18.2.0 | Frontend framework |
| TypeScript | 4.9.5 | Type safety |
| Vite | 5.0.0 | Build tool |
| Tailwind CSS | 3.3.0 | Styling |
| Supabase | 2.39.3 | Backend & Database |
| Google Generative AI | 0.3.0 | AI Integration |
| Recharts | 2.10.3 | Data visualization |
| Lucide React | 0.263.1 | Icons |

---

## 🔧 Setup Lokal

### Prasyarat
- Node.js 16+ dan npm 10+
- Git
- Akun Supabase
- Akun Google untuk Gemini API
- Akun SendGrid (opsional)
- Akun Twilio (opsional)

### Langkah-langkah

1. **Clone Repository**
```bash
git clone https://github.com/budagbogor/mobengPortalManus.git
cd mobengPortalManus
```

2. **Install Dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Setup Environment Variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` dengan credentials Anda:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_SENDGRID_API_KEY=your-sendgrid-key (optional)
VITE_TWILIO_ACCOUNT_SID=your-twilio-sid (optional)
VITE_TWILIO_AUTH_TOKEN=your-twilio-token (optional)
VITE_TWILIO_PHONE_NUMBER=your-twilio-phone (optional)
```

4. **Jalankan Development Server**
```bash
npm run dev
```

Buka http://localhost:5173 di browser Anda.

---

## 🗄️ Setup Supabase

### 1. Buat Project Supabase
1. Buka https://app.supabase.com
2. Klik "New Project"
3. Isi nama project dan password
4. Pilih region terdekat
5. Tunggu project dibuat

### 2. Setup Database Schema
1. Buka SQL Editor di Supabase
2. Copy isi file `supabase_migration.sql`
3. Paste di SQL Editor dan klik "Run"
4. Verifikasi semua tabel sudah dibuat

### 3. Setup Storage Bucket
1. Buka Storage di Supabase
2. Klik "New Bucket"
3. Nama: `candidate-documents`
4. Set ke Private
5. Setup policies untuk upload/download

### 4. Dapatkan Credentials
1. Buka Settings → API
2. Copy Project URL dan Anon Key
3. Masukkan ke `.env.local`

---

## 📧 Konfigurasi External Services

### SendGrid (Email)
1. Buka https://sendgrid.com
2. Buat akun dan login
3. Generate API Key di Settings → API Keys
4. Verifikasi sender email di Sender Authentication
5. Masukkan API Key ke `.env.local`

### Twilio (SMS & WhatsApp)
1. Buka https://www.twilio.com
2. Buat akun dan login
3. Dapatkan Account SID dan Auth Token
4. Dapatkan Twilio Phone Number
5. Setup WhatsApp Sandbox
6. Masukkan credentials ke `.env.local`

---

## 🏗️ Build untuk Production

```bash
npm run build
```

Output akan berada di folder `dist/`. Folder ini siap untuk di-deploy.

---

## 🚀 Deployment

### Opsi 1: Vercel (Recommended)

1. Push kode ke GitHub
2. Buka https://vercel.com
3. Import project dari GitHub
4. Konfigurasi:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Tambahkan environment variables
6. Deploy!

### Opsi 2: Netlify

1. Push kode ke GitHub
2. Buka https://netlify.com
3. Connect repository
4. Konfigurasi build settings
5. Tambahkan environment variables
6. Deploy!

### Opsi 3: Custom Server

1. Build aplikasi: `npm run build`
2. Upload folder `dist/` ke server
3. Konfigurasi web server (Nginx/Apache)
4. Setup SSL certificate
5. Deploy!

---

## 📚 Dokumentasi Lengkap

Dokumentasi lengkap tersedia di folder root:

- `FINAL_REPORT.md` - Laporan hasil akhir
- `SUPABASE_SETUP_GUIDE.md` - Panduan setup Supabase
- `EXTERNAL_SERVICES_SETUP.md` - Panduan setup SendGrid & Twilio
- `TESTING_CHECKLIST.md` - Checklist testing
- `ADVANCED_FEATURES_IMPLEMENTATION.md` - Detail fitur lanjutan

---

## 🧪 Testing

### Quick Test
Buka browser console dan jalankan:
```javascript
import { runQuickTests } from './tests/quick-test.ts';
await runQuickTests();
```

### Manual Testing
Gunakan `TESTING_CHECKLIST.md` untuk panduan testing menyeluruh.

---

## 📞 Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Gemini API Docs:** https://ai.google.dev
- **Recharts Docs:** https://recharts.org
- **Tailwind CSS:** https://tailwindcss.com

---

## 📄 License

Project ini adalah proprietary software untuk Mobeng.

---

## 👨‍💻 Author

Dikembangkan oleh **Manus AI** dengan teknologi terkini dan best practices enterprise.

---

**Last Updated:** 5 Februari 2026  
**Version:** 3.0.0 Enterprise Edition
