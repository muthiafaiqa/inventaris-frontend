import { useState, useMemo } from 'react';
import { 
  Search, 
  Pencil, 
  Trash2, 
  Loader2, 
  PackageOpen 
} from 'lucide-react';
import type { Product } from '../hooks/useProducts';

export interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, loading, onEdit, onDelete }: ProductTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.sku.toLowerCase().includes(query) ||
        product.nama.toLowerCase().includes(query)
      );
    });
  }, [products, searchQuery]);

  // Price formatter in Rupiah (IDR)
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Search Bar & Stats */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Cari SKU atau Nama Produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
          />
        </div>
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Menampilkan <span className="text-slate-800 dark:text-slate-200">{filteredProducts.length}</span> dari <span className="text-slate-800 dark:text-slate-200">{products.length}</span> produk
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 size={36} className="text-cyan-500 animate-spin" />
            <p className="text-slate-400 font-medium text-sm">Memuat data produk...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <PackageOpen size={48} className="text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-medium">Tidak ada produk ditemukan.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6 w-16 text-center">No</th>
                <th className="py-4 px-6">SKU</th>
                <th className="py-4 px-6">Nama Produk</th>
                <th className="py-4 px-6 w-24">Satuan</th>
                <th className="py-4 px-6 w-32">Harga</th>
                <th className="py-4 px-6 w-28 text-center">Min. Stok</th>
                <th className="py-4 px-6 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors text-sm"
                >
                  <td className="py-4 px-6 text-center font-medium text-slate-400 dark:text-slate-500">
                    {index + 1}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs tracking-wider">
                      {product.sku}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-200">
                    {product.nama}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/30 rounded-full">
                      {product.unit}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">
                    {formatRupiah(product.harga)}
                  </td>
                  <td className="py-4 px-6 text-center font-medium text-slate-700 dark:text-slate-300">
                    {product.min_stock}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center items-center space-x-1">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 rounded-lg transition-colors"
                        title="Ubah Produk"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 rounded-lg transition-colors"
                        title="Hapus Produk"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
export default ProductTable;
