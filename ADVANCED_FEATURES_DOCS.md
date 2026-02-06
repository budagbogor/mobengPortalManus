# Dokumentasi Fitur Lanjutan - Mobeng Recruitment Portal v3.0

Dokumen ini memberikan penjelasan detail mengenai fitur-fitur canggih yang telah diimplementasikan di v3.0, menjadikannya sebuah platform rekrutmen kelas enterprise.

---

## 1. Admin Dashboard dengan Fungsionalitas Penuh

Dashboard ini adalah pusat kendali bagi rekruter untuk mengelola konten dan alur tes secara dinamis tanpa perlu mengubah kode.

-   **Komponen:** `components/AdminDashboardAdvanced.tsx`
-   **Akses:** Hanya untuk pengguna dengan role `admin`.

### **Fitur Utama:**

-   **Manajemen Bank Soal:**
    -   Buat, baca, perbarui, dan hapus (CRUD) set soal untuk tes logika.
    -   Edit pertanyaan individual, pilihan jawaban, dan kunci jawaban.
    -   Semua perubahan langsung tersimpan ke tabel `question_sets` dan `questions` di Supabase.

-   **Konfigurasi Role:**
    -   Edit deskripsi, kualifikasi, dan skenario simulasi untuk setiap posisi (Store Leader, Kasir, dll).
    -   Perubahan akan memengaruhi prompt yang diberikan ke AI selama simulasi.

-   **Pengaturan Sistem:**
    -   **Blind Mode:** Atur apakah kandidat dapat melihat skor akhir mereka atau tidak.
    -   **Konfigurasi Notifikasi:** Aktifkan atau nonaktifkan notifikasi via Email/SMS.

---

## 2. Otentikasi Penuh dengan RBAC (Role-Based Access Control)

Sistem otentikasi yang aman untuk membedakan akses antara role pengguna yang berbeda.

-   **Komponen:** `components/RecruiterLogin.tsx`
-   **Service:** `services/authService.ts`
-   **Teknologi:** Supabase Auth

### **Cara Kerja:**

1.  **Login:** Rekruter memasukkan email dan password.
2.  `authService.ts` memanggil `supabase.auth.signInWithPassword()`.
3.  Setelah berhasil login, Supabase mengembalikan **JSON Web Token (JWT)** yang berisi `user_id` dan `role`.
4.  Aplikasi menyimpan sesi di `localStorage`.
5.  Setiap request ke Supabase selanjutnya akan menyertakan JWT ini, dan **Row Level Security (RLS)** di database akan memastikan pengguna hanya bisa mengakses data yang sesuai dengan `role` mereka.

### **Role yang Didefinisikan:**

-   `admin`: Akses penuh ke semua fitur, termasuk Admin Dashboard.
-   `recruiter`: Akses ke dashboard kandidat, analitik, tetapi tidak bisa mengubah soal atau pengaturan sistem.

---

## 3. Dashboard Analitik & Pelaporan

Memberikan wawasan mendalam mengenai efektivitas proses rekrutmen.

-   **Komponen:** `components/AnalyticsDashboard.tsx`
-   **Library:** Recharts

### **Visualisasi Data:**

-   **Total Submissions:** Grafik garis yang menunjukkan jumlah kandidat dari waktu ke waktu.
-   **Rata-rata Skor:** Skor rata-rata kandidat per hari/minggu/bulan.
-   **Distribusi Status:** Diagram lingkaran yang menunjukkan persentase kandidat (Lolos, Gagal, Menunggu).
-   **Analisis Kepribadian:** Grafik radar yang menampilkan agregat dari hasil analisis Big Five Traits dari semua kandidat.

### **Fitur Tambahan:**

-   **Filtering:** Filter data berdasarkan rentang tanggal.
-   **Export:** Ekspor data mentah ke format CSV atau laporan visual ke PDF.

---

## 4. Fitur Unggah Dokumen (CV & Portofolio)

Memungkinkan kandidat untuk melampirkan dokumen pendukung.

-   **Komponen:** `components/DocumentUploader.tsx`
-   **Teknologi:** Supabase Storage

### **Alur Proses:**

1.  Di halaman data diri, kandidat melihat tombol untuk mengunggah file.
2.  `DocumentUploader.tsx` menangani pemilihan file.
3.  File diunggah langsung ke **Supabase Storage** di dalam bucket bernama `candidate-documents`.
4.  Nama file diubah menjadi format `submission_id-original_filename.pdf` untuk menghindari konflik.
5.  URL publik dari file yang diunggah disimpan di kolom `uploaded_documents` pada tabel `submissions`.
6.  Rekruter dapat mengunduh dokumen langsung dari Score Card kandidat.

**Keamanan:** Aturan RLS di Supabase Storage memastikan hanya pengguna yang berwenang yang dapat mengunggah dan mengunduh file.

---

## 5. Error Boundary & Fallback UI

Memastikan aplikasi tetap stabil dan memberikan pengalaman pengguna yang baik bahkan ketika terjadi error.

-   **Komponen:** `components/ErrorBoundary.tsx`

### **Fungsionalitas:**

-   `ErrorBoundary` adalah komponen React yang membungkus seluruh aplikasi (`App.tsx`).
-   Jika terjadi error JavaScript di mana pun di dalam aplikasi, `ErrorBoundary` akan "menangkap" error tersebut.
-   Alih-alih menampilkan white screen, aplikasi akan menampilkan **halaman error yang user-friendly** dengan:
    -   Pesan yang jelas bahwa telah terjadi kesalahan.
    -   Tombol untuk me-refresh halaman.
    -   (Untuk mode development) Pesan error teknis untuk membantu debugging.

Ini secara signifikan meningkatkan **robustness** dan **user experience** aplikasi.

---

Dokumentasi ini mencakup fitur-fitur utama yang menjadikan Mobeng Recruitment Portal sebuah solusi enterprise. Untuk detail implementasi, silakan merujuk ke kode sumber di masing-masing komponen dan service.

**Tim Manus AI**  
5 Februari 2026**
