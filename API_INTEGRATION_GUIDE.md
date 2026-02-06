# Panduan Integrasi API - Mobeng Recruitment Portal v3.0

Dokumen ini menjelaskan cara kerja integrasi dengan API eksternal yang digunakan dalam aplikasi, termasuk AI Engine, Supabase, dan layanan notifikasi.

---

## 1. AI Engine (Dual Provider: Gemini & OpenRouter)

Aplikasi ini memiliki sistem AI yang fleksibel dengan dua penyedia layanan yang dapat saling menggantikan (fallback system).

### **File Utama:** `services/geminiService.ts`

### **Logika Pemilihan Provider:**

1.  **Prioritas Utama: Google Gemini**
    -   Aplikasi akan terlebih dahulu memeriksa apakah `VITE_GEMINI_API_KEY` tersedia di environment variables.
    -   Jika tersedia, semua request AI akan dikirim ke Google Gemini API.

2.  **Fallback: OpenRouter**
    -   Jika `VITE_GEMINI_API_KEY` **tidak ada** atau **kosong**, aplikasi akan secara otomatis beralih ke OpenRouter.
    -   Aplikasi menggunakan API Key default yang sudah di-hardcode untuk model `google/gemma-3-27b-it:free`.
    -   Ini memastikan aplikasi **tetap berfungsi penuh** bahkan tanpa konfigurasi API Key Gemini.

### **Fungsi Utama:**

-   `getAPIProvider()`: Fungsi internal yang menentukan provider mana yang aktif (Gemini atau OpenRouter).
-   `sendMessageToGemini(messages, role)`: Mengirim transkrip chat untuk mendapatkan respons AI berikutnya dalam simulasi.
-   `generateFinalSummary(submission)`: Mengirim semua data kandidat untuk dianalisis dan menghasilkan ringkasan, skor, dan analisis kepribadian.
-   `analyzePerformance(submissions)`: (Untuk dashboard analitik) Menganalisis beberapa submission untuk tren.

### **Konfigurasi Environment Variables:**

| Variabel | Wajib | Deskripsi |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Tidak | API Key dari Google AI Studio. |
| `VITE_OPENROUTER_API_KEY` | Tidak | API Key dari OpenRouter. Sudah ada nilai default. |

---

## 2. Supabase (Backend as a Service)

Supabase adalah tulang punggung dari aplikasi ini, menyediakan database, otentikasi, dan penyimpanan.

### **File Utama:** `services/supabaseClient.ts`

### **Inisialisasi Client:**

-   Client Supabase diinisialisasi menggunakan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
-   Jika credentials tidak ditemukan, aplikasi akan menampilkan error di console.

### **Interaksi dengan Supabase:**

-   **Fetching Data:** Menggunakan `supabase.from('table_name').select('*')`.
-   **Inserting Data:** Menggunakan `supabase.from('table_name').insert({ ... })`.
-   **Updating Data:** Menggunakan `supabase.from('table_name').update({ ... }).eq('id', ...)`.
-   **Authentication:** Menggunakan `supabase.auth.signInWithPassword()` dan `supabase.auth.signOut()`.
-   **Storage:** Menggunakan `supabase.storage.from('bucket_name').upload(...)`.

### **Konfigurasi Environment Variables:**

| Variabel | Wajib | Deskripsi |
|---|---|---|
| `VITE_SUPABASE_URL` | Ya | URL project Supabase Anda. |
| `VITE_SUPABASE_ANON_KEY` | Ya | Public Anon Key dari project Supabase. |

---

## 3. Layanan Notifikasi (Twilio & SendGrid)

Aplikasi ini siap untuk diintegrasikan dengan layanan notifikasi untuk mengirim undangan dan hasil tes.

### **File Utama:** `services/notificationService.ts`

### **Logika Pengiriman:**

-   Fungsi di `notificationService.ts` akan dipanggil dari **Supabase Edge Functions** atau dari sisi client (tergantung konfigurasi).
-   Saat ini, fungsi-fungsi tersebut adalah placeholder yang siap diisi dengan logika API call ke Twilio dan SendGrid.

### **Twilio (SMS & WhatsApp):**

-   **API:** Menggunakan Twilio REST API untuk mengirim pesan.
-   **Endpoint:** `https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json`

### **SendGrid (Email):**

-   **API:** Menggunakan SendGrid Mail Send API.
-   **Endpoint:** `https://api.sendgrid.com/v3/mail/send`

### **Konfigurasi Environment Variables:**

| Variabel | Wajib | Deskripsi |
|---|---|---|
| `VITE_SENDGRID_API_KEY` | Tidak | API Key dari SendGrid. |
| `VITE_TWILIO_ACCOUNT_SID` | Tidak | Account SID dari Twilio. |
| `VITE_TWILIO_AUTH_TOKEN` | Tidak | Auth Token dari Twilio. |
| `VITE_TWILIO_PHONE_NUMBER` | Tidak | Nomor telepon yang terdaftar di Twilio. |

---

## 4. Alur Integrasi End-to-End (Contoh: Kandidat Baru)

1.  **Rekruter** membuat undangan di dashboard (fitur masa depan).
2.  **Supabase Function** memanggil `notificationService.ts`.
3.  **Twilio API** mengirim link undangan via WhatsApp ke kandidat.
4.  **Kandidat** membuka link dan mengisi data.
5.  **React App** menyimpan data kandidat ke tabel `submissions` di **Supabase**.
6.  Selama simulasi, **React App** memanggil `geminiService.ts`.
7.  **Gemini/OpenRouter API** memberikan respons.
8.  Setelah selesai, **React App** meng-update submission di **Supabase** dengan hasil lengkap.
9.  **Rekruter** melihat data baru di dashboard yang di-fetch dari **Supabase**.

---

Panduan ini memberikan gambaran umum tentang bagaimana aplikasi berinteraksi dengan layanan eksternal. Untuk implementasi detail, silakan lihat kode di dalam direktori `services/`.

**Tim Manus AI**  
5 Februari 2026**
