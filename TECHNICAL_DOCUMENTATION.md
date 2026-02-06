# Dokumentasi Teknis - Mobeng Recruitment Portal v3.0

Dokumen ini memberikan gambaran teknis mendalam mengenai arsitektur, teknologi, dan struktur kode dari **Mobeng Recruitment Portal v3.0**.

---

## 1. Arsitektur Sistem

Aplikasi ini dibangun dengan arsitektur **JAMstack** (JavaScript, APIs, and Markup) modern yang berfokus pada performa, keamanan, dan skalabilitas.

### **Komponen Utama:**

| Komponen | Teknologi | Deskripsi |
|---|---|---|
| **Frontend** | React 19, Vite, TypeScript | Antarmuka pengguna (UI) yang interaktif dan responsif. Dibangun sebagai Single Page Application (SPA). |
| **Backend (BaaS)** | Supabase | Digunakan untuk otentikasi, database PostgreSQL, dan penyimpanan file (storage). |
| **AI Engine** | Google Gemini & OpenRouter | Mesin kecerdasan buatan untuk simulasi chat, analisis kepribadian, dan penilaian. |
| **Styling** | Tailwind CSS | Framework CSS utility-first untuk desain yang cepat dan konsisten. |
| **Deployment** | Vercel | Platform cloud untuk hosting dan deployment aplikasi frontend dengan CI/CD terintegrasi. |

### **Diagram Arsitektur:**

```mermaid
graph TD
    subgraph "User Interface"
        A[Kandidat] --> B{React App (Vite)};
        C[Rekruter] --> B;
    end

    subgraph "Vercel Platform"
        B -- HTTPS --> D[Static Assets (HTML/CSS/JS)];
    end

    subgraph "Backend Services"
        B -- API Calls --> E[Supabase];
        B -- API Calls --> F[AI Engine];
    end

    subgraph "Supabase (BaaS)"
        E --> G[Auth];
        E --> H[Database (PostgreSQL)];
        E --> I[Storage];
    end

    subgraph "AI Engine (Dual Provider)"
        F --> J{Google Gemini API};
        F --> K{OpenRouter API (Fallback)};
    end

    subgraph "External Services"
        E -- Webhooks/Functions --> L[Twilio (SMS/WA)];
        E -- Webhooks/Functions --> M[SendGrid (Email)];
    end
```

---

## 2. Struktur Direktori Proyek

Struktur direktori diatur untuk modularitas dan kemudahan pemeliharaan.

```
/mobeng-portal-enterprise
├── dist/                   # Output build untuk production
├── public/                 # Aset statis (favicon, dll)
├── src/
│   ├── components/         # Komponen React UI (Reusable)
│   │   ├── AdminDashboard.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ...
│   ├── services/           # Logika bisnis & koneksi API
│   │   ├── geminiService.ts  # Logika AI (Gemini & OpenRouter)
│   │   ├── supabaseClient.ts # Konfigurasi Supabase
│   │   ├── authService.ts    # Logika otentikasi
│   │   └── ...
│   ├── types/              # Definisi tipe TypeScript
│   │   └── index.ts
│   ├── App.tsx             # Komponen utama aplikasi
│   ├── index.css           # Styling global
│   └── index.tsx           # Entry point aplikasi
├── .env.local.example      # Template environment variables
├── .gitignore              # File yang diabaikan Git
├── package.json            # Dependencies & scripts
├── tsconfig.json           # Konfigurasi TypeScript
└── vite.config.ts          # Konfigurasi Vite
```

---

## 3. Alur Data & State Management

-   **State Management:** Menggunakan **React Hooks** (`useState`, `useEffect`, `useContext`) untuk state management lokal dan global yang sederhana.
-   **Data Fetching:** Dilakukan di dalam `useEffect` atau sebagai respons terhadap interaksi pengguna, dengan memanggil fungsi dari direktori `services/`.
-   **Props Drilling:** Dihindari dengan mengangkat state ke komponen induk terdekat (`App.tsx`) dan meneruskannya ke bawah.

### **Contoh Alur Data (Simulasi Chat):**

1.  **User Input:** Pengguna mengetik pesan di `ChatInterface.tsx`.
2.  **State Update:** `App.tsx` memperbarui state `messages`.
3.  **API Call:** `App.tsx` memanggil `sendMessageToGemini()` dari `geminiService.ts`.
4.  **AI Processing:** `geminiService.ts` mengirim request ke Gemini atau OpenRouter.
5.  **Response:** `geminiService.ts` menerima respons dari AI.
6.  **State Update:** `App.tsx` memperbarui state `messages` dengan respons AI dan `isThinking` menjadi `false`.
7.  **UI Render:** `ChatInterface.tsx` me-render pesan baru.

---

## 4. Teknologi & Dependencies Utama

| Library | Versi | Kegunaan |
|---|---|---|
| **React** | 19.2.4 | Core library untuk membangun UI. |
| **Vite** | 5.4.21 | Build tool generasi baru yang sangat cepat. |
| **TypeScript** | 5.5.3 | Menambahkan static typing ke JavaScript. |
| **Supabase JS** | 2.94.1 | Client library untuk berinteraksi dengan Supabase. |
| **Tailwind CSS** | 3.4.4 | Framework CSS untuk styling. |
| **Lucide React** | 0.563.0 | Library ikon yang ringan dan konsisten. |
| **Recharts** | 3.7.0 | Library charting untuk dashboard analitik. |
| **UUID** | 13.0.0 | Membuat ID unik untuk sesi dan pesan. |

---

## 5. Skema Database (Supabase)

Database dirancang dengan pendekatan relasional untuk memastikan integritas data.

-   **`submissions`**: Menyimpan semua data hasil tes dari setiap kandidat, termasuk transkrip, skor, dan analisis.
-   **`question_sets`**: Menyimpan set soal untuk tes logika (Set A, B, C, dst).
-   **`questions`**: Menyimpan pertanyaan individual yang terhubung ke `question_sets`.
-   **`roles`**: Menyimpan definisi dan kualifikasi untuk setiap posisi (Store Leader, Kasir, dll).
-   **`users`**: Tabel bawaan Supabase untuk otentikasi rekruter.
-   **`notification_logs`**: Mencatat semua notifikasi yang dikirim (Email, SMS, WhatsApp).

**Keamanan:** **Row Level Security (RLS)** diaktifkan di semua tabel untuk memastikan pengguna hanya dapat mengakses data yang diizinkan.

---

Dokumen ini memberikan fondasi untuk memahami cara kerja aplikasi. Untuk detail lebih lanjut, silakan merujuk ke kode sumber dan dokumentasi spesifik lainnya.

**Tim Manus AI**  
5 Februari 2026**
