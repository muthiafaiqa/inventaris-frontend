import { useState, useMemo } from 'react';
import { 
  Search, 
  Pencil, 
  Trash2, 
  Loader2, 
  PackageOpen,
  Plus
} from 'lucide-react';
import type { Product } from '../hooks/useProducts';

export interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onRestock: (product: Product) => void;
}

export function ProductTable({ products, loading, onEdit, onDelete, onRestock }: ProductTableProps) {
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
    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none overflow-hidden">
      {/* Search Bar & Stats */}
      <div className="p-3.5 border-b border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Cari SKU atau Nama Produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors text-xs"
          />
        </div>
        <div className="text-[10px] font-bold font-mono tracking-wider text-slate-450 dark:text-slate-500 uppercase">
          PRODUCTS RECORD COUNT: <span className="text-slate-900 dark:text-slate-200">{filteredProducts.length}</span> / {products.length}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-2">
            <Loader2 size={24} className="text-slate-400 dark:text-slate-500 animate-spin" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">LOADING PRODUCTS DATA...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
            <PackageOpen size={32} className="text-slate-300 dark:text-slate-700" />
            <p className="text-[10px] font-mono uppercase tracking-wider">NO PRODUCTS FOUND</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-[11px] font-mono tracking-tight">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-300 dark:border-slate-800">
                <th className="py-2.5 px-4 w-16 text-center">NO</th>
                <th className="py-2.5 px-4 w-32">SKU</th>
                <th className="py-2.5 px-4 font-sans">NAMA PRODUK</th>
                <th className="py-2.5 px-4 w-24">SATUAN</th>
                <th className="py-2.5 px-4 w-36 text-right">HARGA</th>
                <th className="py-2.5 px-4 w-24 text-center">STOK</th>
                <th className="py-2.5 px-4 w-28 text-center">MIN. STOK</th>
                <th className="py-2.5 px-4 w-36 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/[0.4] dark:hover:bg-slate-950/20 transition-colors duration-200 text-xs"
                >
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-400 dark:text-slate-500">
                    {(index + 1).toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-750 dark:text-slate-300">
                    {product.sku}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {product.nama}
                  </td>
                  <td className="py-2.5 px-4 font-mono">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-none text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      {product.unit}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatRupiah(product.harga)}
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                    {(product.current_stock ?? product.stok ?? 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono font-medium text-slate-600 dark:text-slate-400">
                    {product.min_stock.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex justify-center items-center space-x-1">
                      <button
                        onClick={() => onRestock(product)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-none font-bold text-[9px] uppercase tracking-wider flex items-center space-x-1"
                        title="Restock Produk"
                      >
                        <Plus size={10} />
                        <span>RESTOCK</span>
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1 border border-transparent hover:border-slate-300 dark:hover:border-slate-750 text-slate-450 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors"
                        title="Ubah Produk"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-1 border border-transparent hover:border-slate-300 dark:hover:border-slate-750 text-slate-450 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                        title="Hapus Produk"
                      >
                        <Trash2 size={11} />
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
