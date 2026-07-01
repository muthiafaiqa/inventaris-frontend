import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import type { LowStockItem } from '../hooks/useDashboard';

export interface StockAlertTableProps {
  lowStockProducts: LowStockItem[];
  lowStockProductsCount: number;
  loading: boolean;
}

export function StockAlertTable({
  lowStockProducts,
  lowStockProductsCount,
  loading
}: StockAlertTableProps) {
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
          <AlertTriangle size={18} className="text-amber-500 animate-pulse" />
          <h3 className="text-md font-bold text-slate-900 dark:text-white">
            Daftar Produk yang Perlu Segera Restock
          </h3>
        </div>
        <div className="p-12 flex flex-col items-center justify-center space-y-3">
          <Loader2 size={32} className="animate-spin text-cyan-500" />
          <p className="text-xs text-slate-400">Memuat analisis persediaan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle size={18} className="text-amber-500" />
          <h3 className="text-md font-bold text-slate-900 dark:text-white">
            Daftar Produk yang Perlu Segera Restock
          </h3>
        </div>
        {lowStockProductsCount > 0 && (
          <span className="text-[11px] font-bold px-2 py-0.5 bg-red-150 text-red-650 dark:bg-red-950/20 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 rounded-full uppercase tracking-wider">
            Prioritas Tinggi
          </span>
        )}
      </div>

      {lowStockProductsCount === 0 ? (
        <div className="p-12 text-center max-w-sm mx-auto space-y-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/10">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-md">Persediaan Aman</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              Semua produk saat ini memiliki stok di atas ambang batas stok minimal yang disyaratkan.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6 w-36">SKU</th>
                <th className="py-4 px-6">Nama Produk</th>
                <th className="py-4 px-6 text-right">Ambang Min (Sistem)</th>
                <th className="py-4 px-6 text-right">Stok Saat Ini (Estimasi)</th>
                <th className="py-4 px-6 text-center">Defisit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {lowStockProducts.map((product) => {
                const deficit = product.min_stock - product.current_stock;
                return (
                  <tr 
                    key={product.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-slate-550 dark:text-slate-450">
                      {product.sku}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-200">
                      {product.nama}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-slate-600 dark:text-slate-400">
                      {product.min_stock} <span className="text-xs text-slate-400">{product.unit}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-red-500 dark:text-red-400">
                      {product.current_stock} <span className="text-xs text-slate-400">{product.unit}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-block text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                        -{deficit} {product.unit}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default StockAlertTable;
