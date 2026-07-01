# Dokumentasi Teknis: Sistem Inventaris & Peramalan Stok (Toko Surya Elektrik)

Sistem ini adalah aplikasi web berbasis data (*data-driven*) yang dirancang khusus untuk membantu administrasi inventaris toko alat kelistrikan. Aplikasi ini memantau persediaan barang, mencatat histori transaksi penjualan bulanan, dan melakukan proyeksi pengadaan stok menggunakan algoritma **Trend Moment** dengan evaluasi tingkat akurasi **MAPE** (*Mean Absolute Percentage Error*).

---

## 📂 Struktur Proyek & Arsitektur Kode
Proyek ini dikembangkan menggunakan arsitektur **Feature-Based** untuk menjaga keterpisahan kode (*separation of concerns*), meminimalkan komponen yang terlalu gemuk (*God Components*), serta memudahkan pemeliharaan jangka panjang.

```
frontend/src/
├── components/          # Komponen UI global (Layout, Sidebar, dll)
├── features/            # Modul utama sistem berbasis fitur
│   ├── auth/            # Manajemen autentikasi JWT admin
│   ├── dashboard/       # Ringkasan data (Bento Grid & Restock Alerts)
│   ├── products/        # CRUD Katalog Master Produk
│   ├── sales/           # Pencatatan Kuantitas Penjualan Historis
│   └── forecasting/     # Utilitas & UI Peramalan Trend Moment
├── lib/                 # Konfigurasi client Supabase & Skrip Database Seeder
├── routes/              # Konfigurasi routing & Route Guard (Protected)
└── main.tsx             # Entrypoint aplikasi utama
```

---

## 🛠️ Teknologi yang Digunakan
Sistem ini menggunakan *stack* teknologi modern untuk memastikan performa yang cepat, aman, dan mudah dideploy:

*   **Frontend Core:** React.js (Vite + TypeScript) dengan pembatasan impor tipe ketat (`verbatimModuleSyntax`).
*   **Database & Backend:** Supabase (PostgreSQL relasional dengan kebijakan keamanan RLS aktif untuk akses admin).
*   **State Management:** React Custom Hooks (terisolasi per modul fitur tanpa Redux).
*   **Sistem Desain & Visual:** Tailwind CSS dengan antarmuka datar profesional (*monochromatic slate/zinc layout* dengan aksen *Indigo*).
*   **Visualisasi Data:** Chart.js & `react-chartjs-2` untuk grafik garis deret berkala.
*   **Ikonografi:** `lucide-react`.

---

## 🚀 Daftar Fitur Utama & Fungsionalitas

### 1. Dasbor Ringkasan (Dashboard Overview)
*   **Bento Grid Metrics:** Menampilkan jumlah total master produk, total periode transaksi penjualan, dan jumlah produk yang memerlukan pengadaan ulang (*Restock Alert*).
*   **Tabel Peringatan Stok:** Secara otomatis memindai daftar produk untuk mendeteksi barang dengan stok di bawah ambang batas minimal dan menampilkan jumlah unit defisit.
*   **Database Seeder:** Tombol pintas sekali klik untuk mengisi database dengan data simulasi kelistrikan (Lampu LED Philips, Kabel Supreme, Panel Surya) dan 6 bulan log penjualan historis.

### 2. CRUD Master Produk
*   **Katalog Terpusat:** Pengelolaan data inventaris mencakup Kode SKU (unik), Nama Produk, Satuan Unit (pcs, roll, dll), Harga Satuan, dan Ambang Batas Minimal Stok.
*   **Validasi Keamanan:** Proteksi terhadap penginputan duplikasi SKU yang sama serta penanganan loading state interaktif.

### 3. Rekapitulasi Histori Penjualan
*   **Pencatatan Deret Waktu:** Penginputan log transaksi penjualan bulanan (Bulan, Tahun, Kuantitas Terjual) per produk.
*   **Validasi Periode:** Mencegah penginputan ganda pada produk untuk bulan dan tahun yang sama guna menghindari bias model statistik.

### 4. Peramalan Stok (Forecasting Module)
*   **Algoritma Trend Moment:** Menghitung persamaan linear tren ($Y = a + bX$) untuk memproyeksikan penjualan pada bulan berikutnya.
*   **Evaluasi Keandalan Model (MAPE):** Menghitung persentase rata-rata deviasi estimasi model terhadap data aktual penjualan untuk memberikan tingkat keyakinan akurasi model:
    *   🟢 **MAPE < 10%:** Akurasi Sangat Tinggi (Sangat Baik).
    *   🟡 **MAPE 10% - 20%:** Akurasi Baik (Sedang).
    *   🔴 **MAPE > 20%:** Akurasi Rendah (Kurang Layak).
*   **Grafik Proyeksi:** Visualisasi grafik garis yang membandingkan tren penjualan aktual vs estimasi regresi model serta titik proyeksi masa depan.

---

## 🔄 Alur Kerja Data (*Data Flow*)

1.  **Pendaftaran Inventaris:** Admin mendaftarkan produk baru di dalam sistem dengan mengisi data SKU, nama, harga, satuan, dan target batas aman minimal stok (`min_stock`).
2.  **Perekaman Kuantitas Penjualan:** Setiap akhir bulan, kuantitas produk yang terjual dimasukkan ke dalam basis data penjualan (`sales_history`).
3.  **Pemantauan & Alert:** Dasbor secara otomatis menghitung estimasi stok berjalan dan membandingkannya dengan `min_stock`. Jika stok di bawah batas minimal, barang akan langsung didaftarkan pada tabel *Restock Alert* dengan status *Prioritas Tinggi*.
4.  **Komputasi Tren:** Modul peramalan mengambil log penjualan historis produk, mengurutkannya secara kronologis, memvalidasi batas minimal (minimal 3 periode), dan menghitung persamaan regresi Trend Moment guna menghasilkan saran kuantitas pengadaan stok bulan berikutnya.

---

## 📊 Status Implementasi Fitur

| Modul Fitur | Status | Deskripsi |
| :--- | :---: | :--- |
| **Otentikasi JWT Admin** |   ✅   | Berhasil terintegrasi dengan Supabase Auth & Route Guard. |
| **CRUD Master Produk** |   ✅   | Validasi SKU unik berjalan baik; integrasi database lancar. |
| **Input Penjualan Historis** |   ✅   | Validasi duplikasi periode (bulan & tahun) berjalan stabil. |
| **Algoritma Trend Moment** |   ✅   | Perhitungan regresi $Y = a + bX$ & evaluasi MAPE 100% presisi. |
| **Grafik Deret Waktu** |   ✅   | Integrasi react-chartjs-2 dengan garis aktual & ramalan. |
| **Dasbor Bento Grid** |   ✅   | Desain minimalis tanpa gradien/bayangan tebal sesuai standar UI Data-Driven. |
| **Database Seeder** |   ✅   | Tombol pintas `runSeed` fungsional di halaman utama Overview. |
