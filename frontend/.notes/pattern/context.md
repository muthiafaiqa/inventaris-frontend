# Test Plan: Inventaris & POS Surya Elektrik Frontend

Dokumen ini mendokumentasikan perencanaan pengujian frontend (User Interface & Flow Bisnis) untuk sistem POS & prediksi inventaris Surya Elektrik. Test plan ini telah mencakup 15 skenario pengujian utama dengan total 42 test case, termasuk kategori (Positive, Negative, Edge) dan tingkat prioritasnya.

---

## Ringkasan Skenario Pengujian

| Scenario ID | Halaman / Fitur | Deskripsi Alur Bisnis |
| :--- | :--- | :--- |
| **SC-01** | Autentikasi (`/login`) | Alur masuk ke sistem menggunakan email dan password admin. |
| **SC-02** | Route Guard | Proteksi rute halaman internal agar tidak dapat diakses tanpa login. |
| **SC-03** | Dashboard Overview (`/`) | Tampilan metrik total produk, periode, dan restock alert. |
| **SC-04** | Restock Alert Dashboard | Deteksi otomatis produk yang membutuhkan restock di dashboard. |
| **SC-05** | CRUD Produk - Tambah | Penambahan produk baru dengan SKU unik ke master produk. |
| **SC-06** | CRUD Produk - Edit | Pengubahan detail informasi nama, unit, harga, dan batas minimal stok. |
| **SC-07** | CRUD Produk - Hapus | Penghapusan produk aktif dari daftar master produk. |
| **SC-08** | Restock Modal | Interaksi modal form penambahan stok produk. |
| **SC-09** | Restock Eksekusi | Proses penambahan stok produk secara langsung dari master produk. |
| **SC-10** | Stock Movement Log | Pencatatan mutasi penambahan stok produk ke database. |
| **SC-11** | Histori Penjualan (`/sales`) | Visualisasi daftar riwayat transaksi penjualan bulanan. |
| **SC-12** | Input Penjualan | Form penginputan data transaksi penjualan bulanan baru. |
| **SC-13** | Edit/Hapus Penjualan | Penghapusan catatan transaksi penjualan dari histori. |
| **SC-14** | Prediksi Page (`/forecast`) | Tampilan tren penjualan bulanan dan pemilihan produk. |
| **SC-15** | Prediksi Kalkulasi | Perhitungan persamaan regresi linear Trend Moment dan MAPE. |

---

## Detail Skenario & Test Cases

### Skenario 1: Autentikasi Admin (`/login`)
*   **TC-01 [POSITIVE] - High Priority:**
    Login sukses menggunakan data valid (email admin terdaftar dan password cocok), pengguna diarahkan ke Dashboard.
*   **TC-02 [NEGATIVE] - High Priority:**
    Login gagal jika password yang dimasukkan salah, menampilkan pesan error "Invalid login credentials".
*   **TC-03 [EDGE] - Medium Priority:**
    Tombol masuk terkunci atau menampilkan error validasi format ketika format email tidak valid.

### Skenario 2: Proteksi Halaman (Route Guard)
*   **TC-04 [POSITIVE] - High Priority:**
    Mengakses halaman dalam `/products` setelah berhasil login (halaman termuat dengan sempurna).
*   **TC-05 [NEGATIVE] - High Priority:**
    Mengakses `/products` atau `/forecast` secara direct link tanpa sesi login aktif, otomatis dialihkan ke `/login`.

### Skenario 3: Dashboard Overview (`/`)
*   **TC-06 [POSITIVE] - High Priority:**
    Dashboard memuat metrik total produk, total periode penjualan, dan restock alert secara akurat dari Supabase.
*   **TC-07 [EDGE] - Medium Priority:**
    Metrik dashboard menampilkan angka `0` secara aman tanpa crash/blank page jika database kosong.
*   **TC-35 [EDGE] - Low Priority:**
    Menampilkan state loading skeleton atau pesan fallback secara elegan ketika koneksi internet lambat / offline.

### Skenario 4: Restock Alert Dashboard
*   **TC-08 [POSITIVE] - High Priority:**
    Tabel alert menampilkan daftar produk dengan stok berjalan (`current_stock`) di bawah ambang batas (`min_stock`).
*   **TC-09 [NEGATIVE] - Medium Priority:**
    Produk dengan stok berjalan di atas ambang batas (`current_stock >= min_stock`) tidak ditampilkan di tabel alert.

### Skenario 5: Pembuatan Produk Baru (Master Produk)
*   **TC-10 [POSITIVE] - High Priority:**
    Menambahkan produk baru dengan SKU unik, nama, unit, harga, dan batas minimal stok yang valid.
*   **TC-11 [NEGATIVE] - High Priority:**
    Gagal menyimpan produk baru jika SKU yang diketik sudah dimiliki produk lain (muncul pesan error duplikasi).
*   **TC-12 [EDGE] - Medium Priority:**
    Gagal menyimpan produk jika input harga atau batas minimal stok diisi dengan nilai negatif.
*   **TC-13 [EDGE] - Medium Priority:**
    Gagal menyimpan produk jika input nama kosong (muncul pesan error validasi input).
*   **TC-36 [EDGE] - Medium Priority:**
    Menambahkan produk dengan harga berupa angka desimal (harga tersimpan dan terformat rapi).

### Skenario 6: Pengubahan Informasi Produk (Edit Produk)
*   **TC-14 [POSITIVE] - Medium Priority:**
    Memperbarui nama, unit, dan harga produk terdaftar (perubahan langsung terupdate di tabel utama).
*   **TC-15 [NEGATIVE] - Medium Priority:**
    Gagal memperbarui produk jika SKU diubah menjadi SKU yang sudah dimiliki oleh produk lain di database.

### Skenario 7: Penghapusan Produk (Hapus Produk)
*   **TC-16 [POSITIVE] - High Priority:**
    Menghapus produk aktif yang belum memiliki relasi transaksi (produk hilang dari tabel).
*   **TC-17 [NEGATIVE] - High Priority:**
    Gagal menghapus produk jika produk sudah memiliki riwayat transaksi/mutasi (ditolak demi integritas data).

### Skenario 8: Modal Restock Produk
*   **TC-18 [POSITIVE] - Medium Priority:**
    Membuka modal restock menampilkan informasi nama produk dan SKU target secara akurat.
*   **TC-19 [EDGE] - Low Priority:**
    Tombol simpan restock dinonaktifkan jika input kuantitas diisi dengan format non-numerik atau dibiarkan kosong.
*   **TC-37 [EDGE] - Low Priority:**
    Menutup modal restock dengan menekan tombol batal atau area luar modal (kuantitas input ter-reset).

### Skenario 9: Eksekusi Restock Produk
*   **TC-20 [POSITIVE] - High Priority:**
    Melakukan restock dengan kuantitas positif (stok bertambah secara dinamis di tabel produk).
*   **TC-21 [NEGATIVE] - High Priority:**
    Gagal memproses restock jika kuantitas diisi bernilai nol atau negatif (muncul error validasi).

### Skenario 10: Pencatatan Log Stock Movement
*   **TC-22 [POSITIVE] - High Priority:**
    Setiap aksi restock sukses mencatat log mutasi baru di tabel `stock_movements` (tipe `IN`).
*   **TC-23 [EDGE] - High Priority:**
    Kegagalan pencatatan log di `stock_movements` membatalkan penambahan stok produk di tabel utama (rollback).

### Skenario 11: Tampilan Histori Penjualan
*   **TC-24 [POSITIVE] - High Priority:**
    Halaman histori penjualan memuat seluruh daftar catatan transaksi bulanan secara lengkap.
*   **TC-25 [EDGE] - Medium Priority:**
    Menampilkan pesan placeholder "Belum ada data penjualan" secara aman jika database transaksi kosong.
*   **TC-38 [EDGE] - Medium Priority:**
    Membuka histori penjualan dengan paginasi (menampilkan tombol navigasi halaman berikutnya/sebelumnya).

### Skenario 12: Penginputan Catatan Penjualan Baru
*   **TC-26 [POSITIVE] - High Priority:**
    Memilih produk, kuantitas terjual, bulan, dan tahun yang valid (transaksi sukses tercatat).
*   **TC-27 [NEGATIVE] - High Priority:**
    Gagal menyimpan jika kuantitas penjualan melebihi sisa stok berjalan produk tersebut (Insufficient Stock).
*   **TC-28 [EDGE] - Medium Priority:**
    Gagal menyimpan jika bulan diisi di luar rentang 1-12 atau tahun di luar batas wajar.
*   **TC-39 [NEGATIVE] - High Priority:**
    Menginput transaksi dengan kuantitas penjualan berupa nilai desimal atau non-bulat (ditolak oleh sistem/validasi).

### Skenario 13: Penghapusan Catatan Penjualan
*   **TC-29 [POSITIVE] - Medium Priority:**
    Menghapus catatan transaksi penjualan bulanan (jumlah stok produk yang terjual dikembalikan ke tabel produk).
*   **TC-30 [EDGE] - Low Priority:**
    Penanganan aman/cascade jika menghapus transaksi penjualan dari produk yang sudah dihapus dari master.

### Skenario 14: Halaman Prediksi Stok (Peramalan)
*   **TC-31 [POSITIVE] - High Priority:**
    Memilih produk dengan data penjualan historis di dropdown (grafik/tabel tren bulanan sukses ditampilkan).
*   **TC-32 [NEGATIVE] - High Priority:**
    Menampilkan pesan peringatan "Data penjualan kurang dari 3 periode" jika penjualan historis tidak mencukupi.
*   **TC-40 [EDGE] - Low Priority:**
    Memilih produk di dropdown prediksi lalu menekan tombol reset/clear selector (halaman kembali ke state inisial kosong).

### Skenario 15: Perhitungan Rumus Prediksi Trend Moment & MAPE
*   **TC-33 [POSITIVE] - High Priority:**
    Kalkulator peramalan menghitung persamaan linear regresi trend moment (konstanta a & b) dan memproyeksikan stok bulan berikutnya.
*   **TC-34 [POSITIVE] - Medium Priority:**
    Menghitung persentase MAPE dan menampilkan label kategori akurasi model peramalan (Tinggi/Baik/Cukup/Rendah).
*   **TC-41 [EDGE] - Medium Priority:**
    Perhitungan prediksi dengan data historis sangat besar (misal 24 periode) berjalan dengan performa cepat (di bawah 1 detik).
*   **TC-42 [NEGATIVE] - High Priority:**
    Kalkulasi peramalan mengembalikan error jika data penjualan bulanan bernilai 0 di semua periode (Determinant persamaan bernilai nol).
