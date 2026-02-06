# Panduan Deployment & Troubleshooting - Mobeng Recruitment Portal v3.0

Dokumen ini menyediakan instruksi lengkap untuk melakukan deployment aplikasi ke Vercel, serta panduan untuk mengatasi masalah umum (troubleshooting).

---

## 1. Prasyarat

Sebelum memulai, pastikan Anda memiliki:

-   Akun **GitHub**
-   Akun **Vercel** (terhubung dengan akun GitHub Anda)
-   Akun **Supabase**
-   Kode aplikasi sudah di-push ke repository GitHub Anda.

---

## 2. Deployment ke Vercel (Metode Direkomendasikan)

Vercel adalah platform ideal untuk aplikasi ini karena menyediakan CI/CD, CDN global, dan SSL gratis secara otomatis.

### **Langkah 1: Import Project ke Vercel**

1.  Buka **Vercel Dashboard** (https://vercel.com/dashboard).
2.  Klik **"Add New..."** → **"Project"**.
3.  Pilih repository GitHub Anda (`mobeng-portal-manus`).
4.  Vercel akan otomatis mendeteksi bahwa ini adalah project Vite.

### **Langkah 2: Konfigurasi Project**

Biasanya, Vercel akan otomatis mengisi konfigurasi ini. Namun, pastikan pengaturannya benar:

-   **Framework Preset:** `Vite`
-   **Build Command:** `npm run build`
-   **Output Directory:** `dist`
-   **Install Command:** `npm install --legacy-peer-deps`

### **Langkah 3: Tambahkan Environment Variables**

Ini adalah langkah **paling penting**.

1.  Di halaman konfigurasi project, buka bagian **"Environment Variables"**.
2.  Tambahkan variabel berikut satu per satu:

| Variabel | Nilai | Wajib? |
|---|---|---|
| `VITE_SUPABASE_URL` | URL Supabase Anda | **Ya** |
| `VITE_SUPABASE_ANON_KEY` | Anon Key Supabase Anda | **Ya** |
| `VITE_OPENROUTER_API_KEY` | `sk-or-v1-7ded...` | Tidak (Default) |
| `VITE_GEMINI_API_KEY` | API Key Gemini Anda | Tidak |
| `VITE_SENDGRID_API_KEY` | API Key SendGrid Anda | Tidak |
| `VITE_TWILIO_ACCOUNT_SID` | SID Twilio Anda | Tidak |
| `VITE_TWILIO_AUTH_TOKEN` | Token Twilio Anda | Tidak |
| `VITE_TWILIO_PHONE_NUMBER` | Nomor Twilio Anda | Tidak |

**Penting:** Pastikan semua variabel yang akan digunakan di sisi client diawali dengan `VITE_`.

### **Langkah 4: Deploy!**

1.  Setelah semua environment variables ditambahkan, klik tombol **"Deploy"**.
2.  Vercel akan memulai proses build dan deployment.
3.  Tunggu sekitar 2-5 menit.
4.  Setelah selesai, Anda akan mendapatkan URL aplikasi yang sudah live!

### **Langkah 5: Automatic Redeployment**

Setiap kali Anda melakukan `git push` ke branch `main`, Vercel akan **otomatis** melakukan redeploy dengan perubahan terbaru. Anda tidak perlu melakukan deployment manual lagi.

---

## 3. Troubleshooting

### **Masalah: White Screen setelah Deployment**

Ini adalah masalah paling umum. Berikut adalah cara mengatasinya:

1.  **Penyebab Paling Umum: Missing Environment Variables**
    -   **Solusi:** Pastikan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` sudah ditambahkan dengan benar di Vercel Dashboard. Tanpa ini, aplikasi tidak bisa terhubung ke backend dan akan gagal render.

2.  **Penyebab Lain: JavaScript Error**
    -   **Solusi:**
        1.  Buka URL aplikasi di browser.
        2.  Buka **Developer Tools** (F12 atau Ctrl+Shift+I).
        3.  Klik tab **"Console"**.
        4.  Lihat apakah ada pesan error berwarna merah. Error tersebut akan memberi petunjuk apa yang salah (misalnya, "Cannot read properties of undefined").
        5.  Aplikasi ini sudah dilengkapi **ErrorBoundary**, yang akan menampilkan pesan error jika terjadi kesalahan fatal.

### **Masalah: Build Gagal di Vercel**

1.  **Penyebab: Dependency Mismatch**
    -   **Solusi:** Pastikan `Install Command` di Vercel diatur ke `npm install --legacy-peer-deps` untuk mengatasi potensi konflik versi antar library.

2.  **Penyebab: TypeScript Error**
    -   **Solusi:** Buka log build di Vercel Dashboard. Log akan menunjukkan baris kode mana yang menyebabkan error. Perbaiki error tersebut, commit, dan push lagi.

### **Masalah: API Calls Gagal (CORS Error)**

1.  **Penyebab:** Domain Vercel Anda belum diizinkan untuk mengakses Supabase API.
    -   **Solusi:**
        1.  Buka **Supabase Dashboard**.
        2.  Pergi ke **Settings** → **API**.
        3.  Di bagian **"CORS Origins"**, tambahkan URL Vercel Anda (misalnya, `https://mobeng-portal-manus.vercel.app`).

---

## 4. Local Development Setup

Untuk menjalankan aplikasi di komputer lokal:

1.  **Clone Repository:**
    ```bash
    git clone https://github.com/budagbogor/mobengPortalManus.git
    cd mobengPortalManus
    ```

2.  **Install Dependencies:**
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Setup Environment Variables:**
    -   Buat file bernama `.env.local` di root direktori.
    -   Copy-paste konten dari `.env.local.example`.
    -   Isi nilainya dengan credentials Anda.

4.  **Jalankan Development Server:**
    ```bash
    npm run dev
    ```

5.  Buka **http://localhost:3000** di browser Anda.

---

Dengan mengikuti panduan ini, Anda dapat dengan mudah melakukan deployment dan mengelola aplikasi Mobeng Recruitment Portal.

**Tim Manus AI**  
5 Februari 2026**
