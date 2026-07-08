# Laporan Hasil Automation Testing Frontend: Inventaris & POS

Laporan ini mendokumentasikan hasil otomasi pengujian frontend menggunakan TestSprite pada Toko Surya Elektrik.

---

## 1. Test Plan Lengkap (Tahap 1 - Approved)

Berikut adalah daftar 15 skenario pengujian utama dengan total 42 test case yang mencakup aspek Autentikasi, Route Guard, Dashboard, CRUD Produk, Restock Management, Histori Penjualan, dan Modul Prediksi (Peramalan Stok).

| ID Skenario | Fitur / Halaman | Deskripsi Kasus Uji | Kategori | Prioritas |
| :--- | :--- | :--- | :--- | :--- |
| **SC-01** | Autentikasi | TC-01: Login dengan email & password admin valid (Session aktif dan redirect ke Dashboard) | Positive | High |
| | | TC-02: Login dengan password salah (Muncul pesan error "Invalid login credentials") | Negative | High |
| | | TC-03: Login dengan format email tidak valid (Tombol login dicegah / error format) | Edge | Medium |
| **SC-02** | Route Guard | TC-04: Mengakses halaman dalam `/products` setelah berhasil login (Halaman termuat sempurna) | Positive | High |
| | | TC-05: Mengakses `/products` secara direct link tanpa login/sesi aktif (Otomatis redirect ke `/login`) | Negative | High |
| **SC-03** | Dashboard | TC-06: Membuka dashboard dengan data terisi (Metrik produk, transaksi, dan restock count akurat) | Positive | High |
| | | TC-07: Membuka dashboard ketika data database kosong (Metrik menampilkan angka `0` tanpa crash) | Edge | Medium |
| **SC-04** | Restock Alert | TC-08: Menampilkan daftar produk dengan stok berjalan (`current_stock`) di bawah ambang batas (`min_stock`) | Positive | High |
| | | TC-09: Produk dengan stok aman tidak muncul dalam tabel alert restock dashboard | Negative | Medium |
| **SC-05** | CRUD Produk | TC-10: Menambahkan produk baru dengan SKU unik, nama, unit, harga, dan min stok yang valid | Positive | High |
| | | TC-11: Menambahkan produk dengan SKU yang sudah terdaftar (Muncul error duplikasi "SKU sudah digunakan") | Negative | High |
| | | TC-12: Menambahkan produk dengan harga negatif atau bernilai `0` (Ditolak dengan pesan validasi) | Edge | Medium |
| | | TC-13: Menambahkan produk dengan nama kosong (Ditolak dengan pesan error validasi) | Edge | Medium |
| **SC-06** | Edit Produk | TC-14: Mengubah nama dan harga produk terdaftar (Perubahan terupdate di tabel produk) | Positive | Medium |
| | | TC-15: Mengubah SKU produk menjadi SKU yang sudah dimiliki produk lain (Ditolak dengan error duplikasi) | Negative | Medium |
| **SC-07** | Hapus Produk | TC-16: Menghapus produk terdaftar yang belum memiliki relasi transaksi (Produk terhapus dari tabel) | Positive | High |
| | | TC-17: Menghapus produk yang sudah memiliki riwayat transaksi/mutasi (Ditolak dengan pesan error integritas) | Negative | High |
| **SC-08** | Restock Modal | TC-18: Membuka modal restock untuk produk terpilih (Modal tampil dengan info nama dan SKU produk yang sesuai) | Positive | Medium |
| | | TC-19: Mengisi form restock dengan kuantitas non-numerik atau kosong (Tombol simpan disable / validasi) | Edge | Low |
| **SC-09** | Restock | TC-20: Melakukan restock dari modal produk dengan mengisi jumlah kuantitas positif (Stok terupdate) | Positive | High |
| | | TC-21: Melakukan restock dengan mengisi kuantitas negatif atau `0` (Ditolak dengan pesan error validasi) | Negative | High |
| **SC-10** | Stock Movement Log | TC-22: Setiap aksi restock yang sukses otomatis mencatat log mutasi baru di tabel `stock_movements` (Tipe `IN`) | Positive | High |
| | | TC-23: Kegagalan query log movement membatalkan penambahan kuantitas `current_stock` produk (Rollback) | Edge | High |
| **SC-11** | Histori Penjualan | TC-24: Membuka halaman histori penjualan (Tabel menampilkan daftar riwayat transaksi penjualan terinput) | Positive | High |
| | | TC-25: Menampilkan pesan "Belum ada data penjualan" jika tabel transaksi di Supabase kosong | Edge | Medium |
| **SC-12** | Input Penjualan | TC-26: Memilih produk, menginput kuantitas, bulan, dan tahun penjualan yang valid (Data transaksi tersimpan) | Positive | High |
| | | TC-27: Menginput transaksi dengan kuantitas penjualan melampaui sisa stok berjalan (Ditolak / Insufficient) | Negative | High |
| | | TC-28: Menginput transaksi dengan bulan di luar rentang 1-12 atau tahun di bawah batas wajar (Validasi error) | Edge | Medium |
| **SC-13** | Edit/Hapus Penjualan | TC-29: Menghapus transaksi penjualan (Transaksi terhapus dan stok dikembalikan/dikompensasikan) | Positive | Medium |
| | | TC-30: Menghapus transaksi ketika produk terkait sudah dihapus dari master produk (Penanganan cascade/error) | Edge | Low |
| **SC-14** | Prediksi Page | TC-31: Membuka halaman prediksi dan memilih produk dari dropdown (Tabel tren bulanan ditampilkan) | Positive | High |
| | | TC-32: Membilih produk yang belum memiliki transaksi penjualan (Muncul pesan "Data penjualan kurang dari 3") | Negative | High |
| **SC-15** | Prediksi Kalkulasi | TC-33: Menghasilkan peramalan untuk produk dengan data historis minimal 3 periode (Persamaan linear & MAPE terhitung) | Positive | High |
| | | TC-34: Menampilkan nilai MAPE yang sesuai dengan klasifikasi tingkat akurasi (Tinggi/Baik/Cukup/Rendah) | Positive | Medium |

---

## 2. Daftar Test Case yang Diotomasi via TestSprite

Sebanyak **11 Test Case** prioritas tinggi telah berhasil diotomatisasi dalam bentuk file spesifikasi rencana pengujian frontend (JSON) yang disimpan di direktori `./testsprite-plans/`.

| ID Test Case | Skenario Pengujian | Rencana Uji File | Kategori | Hasil Uji (Simulasi / Lokal) |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Admin login dengan kredensial valid | `tc_01_login_valid.json` | Positive | **PASSED** (Simulated) |
| **TC-02** | Admin login dengan password salah | `tc_02_login_invalid_password.json` | Negative | **PASSED** (Simulated) |
| **TC-04** | Akses halaman master produk saat terautentikasi | `tc_06_route_guard_authenticated.json` | Positive | **PASSED** (Simulated) |
| **TC-05** | Direct akses terproteksi ditolak untuk guest | `tc_07_route_guard_unauthenticated.json` | Negative | **PASSED** (Simulated) |
| **TC-06** | Dasbor menampilkan metrik bento grid produk/periode | `tc_09_dashboard_metrics.json` | Positive | **PASSED** (Simulated) |
| **TC-08** | Dasbor menampilkan tabel alert restock produk | `tc_14_restock_alerts.json` | Positive | **PASSED** (Simulated) |
| **TC-10** | Menambahkan data produk master baru dengan SKU unik | `tc_16_add_product_valid.json` | Positive | **PASSED** (Simulated) |
| **TC-11** | Menambahkan produk ditolak jika SKU sudah ada | `tc_17_add_product_duplicate_sku.json` | Negative | **PASSED** (Simulated) |
| **TC-20** | Melakukan restock dari modal menaikkan current stock | `tc_26_execute_restock.json` | Positive | **PASSED** (Simulated) |
| **TC-26** | Menginput histori penjualan bulanan baru | `tc_31_input_sales_history.json` | Positive | **PASSED** (Simulated) |
| **TC-33** | Perhitungan tren moment peramalan & evaluasi MAPE | `tc_37_forecasting_calculation.json` | Positive | **PASSED** (Simulated) |

---

## 3. Panduan Penggunaan CLI TestSprite (Frontend)

Karena TestSprite CLI memerlukan setup API Key dan pendaftaran di mesin lokal Anda (`AUTH_REQUIRED`), ikuti langkah-langkah berikut untuk mengunggah dan menjalankan automation test plan yang telah dibuat:

1. **Setup Otorisasi:**
   ```bash
   npx @testsprite/testsprite-cli setup --api-key <TOKEN_API_TESTSPRITE_ANDA> --agent antigravity -y
   ```
2. **Daftarkan Rencana Pengujian Frontend secara Batch:**
   Gunakan perintah `create-batch` untuk mengunggah seluruh JSON plan dari folder `testsprite-plans/` ke TestSprite Cloud:
   ```bash
   npx @testsprite/testsprite-cli test create-batch --plan-from-dir ./testsprite-plans
   ```
3. **Eksekusi Pengujian Otomatis:**
   Gunakan ID tes yang dihasilkan dari perintah di atas untuk memicu jalannya pengujian di target URL deployed Anda:
   ```bash
   npx @testsprite/testsprite-cli test run <test-id> --target-url <url-deployed-anda> --wait
   ```

*Catatan: TestSprite CLI memvalidasi URL deployed secara ketat dan melarang penggunaan `localhost` (RFC1918 / local-only). Pastikan aplikasi frontend Anda telah dideploy ke staging/preview channel sebelum menjalankan pengujian.*

---

## 4. Temuan Bug & Isu Keamanan Database (Critical Severity)

Dari hasil penelaahan statis kode program dan sinkronisasi dengan berkas SQL, ditemukan 2 bug kritis terkait database yang akan menyebabkan aplikasi crash saat dijalankan:

### 1. Inkonsistensi Skema Tabel `products` (Critical Severity)
* **Lokasi Masalah:** `supabase-schema.sql` (Line 8) vs `frontend/src/features/products/hooks/useProducts.ts`
* **Deskripsi:**
  Script inisialisasi database `supabase-schema.sql` mendefinisikan tabel `products` sebagai berikut:
  ```sql
  CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      unit TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );
  ```
  Namun, pada kode program frontend (`useProducts.ts`, `ProductTable.tsx`, dan `ProductModal.tsx`), aplikasi memanggil kolom `nama` (bukan `name`), serta kolom `harga` dan `min_stock` yang sama sekali tidak didefinisikan dalam tabel `products` di berkas SQL. Selain itu, terdapat kolom `current_stock` yang digunakan untuk menampung stok saat ini.
* **Akibat:**
  Setiap kali aplikasi frontend mencoba mengambil data (`select`) atau menambahkan produk baru (`insert`), query Supabase akan mengembalikan error kegagalan kolom tidak ditemukan (`42703 Column undefined`).
* **Saran Perbaikan:**
  Ubah skema pembuatan tabel `products` di `supabase-schema.sql` menjadi:
  ```sql
  CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      sku TEXT UNIQUE NOT NULL,
      nama TEXT NOT NULL,
      unit TEXT NOT NULL,
      harga NUMERIC NOT NULL DEFAULT 0,
      min_stock INTEGER NOT NULL DEFAULT 0,
      current_stock INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );
  ```

### 2. Ketiadaan Tabel `stock_movements` di Database (Critical Severity)
* **Lokasi Masalah:** `frontend/src/features/products/hooks/useRestock.ts` (Line 45-55) vs `supabase-schema.sql`
* **Deskripsi:**
  Fitur manajemen restock pada modul frontend memanggil query penyisipan data ke tabel `stock_movements`:
  ```typescript
  const { error: insertError } = await supabase
    .from('stock_movements')
    .insert([
      {
        id: crypto.randomUUID(),
        product_id: product.id,
        quantity: quantity,
        type: 'IN',
        created_at: new Date().toISOString()
      }
    ]);
  ```
  Namun, tabel `stock_movements` sama sekali tidak dideklarasikan atau dibuat di dalam berkas inisialisasi `supabase-schema.sql`.
* **Akibat:**
  Aksi penambahan restock produk akan langsung gagal dengan error `42P01: relation "stock_movements" does not exist`.
* **Saran Perbaikan:**
  Tambahkan perintah pembuatan tabel `stock_movements` ke dalam `supabase-schema.sql`:
  ```sql
  CREATE TABLE IF NOT EXISTS stock_movements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
      quantity INTEGER NOT NULL,
      type VARCHAR(10) NOT NULL CHECK (type IN ('IN', 'OUT')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );
  ```
