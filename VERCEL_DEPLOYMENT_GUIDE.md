# 🚀 Vercel Deployment Guide - Mobeng Recruitment Portal v3.0

**Status:** ✅ Ready for Deployment

---

## 📋 Daftar Isi

1. [Prasyarat](#prasyarat)
2. [Langkah-langkah Deployment](#langkah-langkah-deployment)
3. [Konfigurasi Project di Vercel](#konfigurasi-project-di-vercel)
4. [Menambahkan Environment Variables](#menambahkan-environment-variables)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Prasyarat

- **Akun Vercel:** https://vercel.com
- **Repository GitHub:** https://github.com/budagbogor/mobengPortalManus
- **Credentials Siap:**
  - Supabase URL & Anon Key
  - Gemini API Key
  - SendGrid API Key (opsional)
  - Twilio Credentials (opsional)

---

## 🚀 Langkah-langkah Deployment

### 1. **Login ke Vercel**
Buka https://vercel.com/login dan login dengan akun GitHub Anda.

### 2. **Import Project**
- Klik "Add New..." → "Project"
- Klik "Continue with GitHub"
- Pilih repository `budagbogor/mobengPortalManus`
- Klik "Import"

### 3. **Konfigurasi Project**

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` (otomatis terdeteksi) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install --legacy-peer-deps` |

### 4. **Tambahkan Environment Variables**

Buka tab "Environment Variables" dan tambahkan variabel berikut:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key` |
| `VITE_GEMINI_API_KEY` | `your-gemini-api-key` |
| `VITE_SENDGRID_API_KEY` | `your-sendgrid-key` (opsional) |
| `VITE_TWILIO_ACCOUNT_SID` | `your-twilio-sid` (opsional) |
| `VITE_TWILIO_AUTH_TOKEN` | `your-twilio-token` (opsional) |
| `VITE_TWILIO_PHONE_NUMBER` | `your-twilio-phone` (opsional) |
| `VITE_APP_ENV` | `production` |

### 5. **Deploy!**
Klik tombol "Deploy". Vercel akan memulai proses build dan deployment.

---

## ✅ Post-Deployment

### 1. **Verifikasi Domain**
Setelah deployment selesai, Vercel akan memberikan domain `.vercel.app`. Buka domain tersebut dan pastikan aplikasi berjalan dengan baik.

### 2. **Custom Domain (Opsional)**
- Buka tab "Domains"
- Tambahkan custom domain Anda
- Ikuti instruksi untuk mengkonfigurasi DNS

### 3. **Test Semua Fitur**
- Lakukan testing end-to-end di lingkungan produksi
- Gunakan `TESTING_CHECKLIST.md` sebagai panduan

### 4. **Monitor Logs**
- Buka tab "Logs" untuk memonitor error dan request

---

## 🆘 Troubleshooting

### **Build Gagal**
- **Cek Build Command:** Pastikan `npm run build` sudah benar
- **Cek Dependencies:** Pastikan semua dependencies ada di `package.json`
- **Cek Node.js Version:** Vercel menggunakan Node.js 18.x secara default. Jika perlu versi lain, konfigurasikan di `package.json`:
  ```json
  "engines": {
    "node": "20.x"
  }
  ```

### **Aplikasi Error saat Runtime**
- **Cek Environment Variables:** Pastikan semua variabel sudah di-set dengan benar
- **Cek Supabase RLS:** Pastikan RLS policies tidak memblokir request
- **Cek API Keys:** Pastikan API keys valid dan tidak expired
- **Cen Vercel Logs:** Lihat logs di Vercel untuk detail error

### **Masalah CORS**
- **Supabase:** Tambahkan domain Vercel Anda ke Supabase CORS settings (Settings → API → CORS)

---

**Prepared by:** Manus AI Agent  
**Date:** 5 Februari 2026  
**Status:** ✅ Siap untuk Deployment
