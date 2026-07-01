# Product Requirement Document (PRD) - Frontend Surya Elektrik

## 1. Identitas Sistem
Sistem Inventaris dan Peramalan Stok Barang untuk Toko Surya Elektrik. Frontend berinteraksi dengan REST API backend.

## 2. Batasan Sistem (Strict Boundary)
### IN-SCOPE (Wajib Ada):
- Autentikasi Admin (Login dengan JWT).
- CRUD Master Produk (SKU, Nama, Satuan).
- Input Data Historis Penjualan (Rekap penjualan bulanan).
- Visualisasi Peramalan (Grafik Trend Moment & MAPE).

### OUT-OF-SCOPE (Dilarang Ada):
- Sistem Kasir/POS realtime.
- Manajemen CRM/Member.
- Modul Akuntansi/Keuangan.
- Cetak Struk.

## 3. Tech Stack
- React.js (Vite + TypeScript), Tailwind CSS, React Router DOM, Axios, Chart.js.