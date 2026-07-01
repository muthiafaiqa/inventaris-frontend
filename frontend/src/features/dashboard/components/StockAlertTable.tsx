import { CheckCircle2, Loader2 } from 'lucide-react';
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
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none overflow-hidden">
        <div className="p-3 border-b border-slate-300 dark:border-slate-800">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-850 dark:text-slate-150">
            DAFTAR PRODUK YANG PERLU SEGERA RESTOCK
          </h3>
        </div>
        <div className="p-8 flex flex-col items-center justify-center space-y-2">
          <Loader2 size={20} className="animate-spin text-slate-400 dark:text-slate-500" />
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none overflow-hidden">
      <div className="p-3 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-850 dark:text-slate-150">
          DAFTAR PRODUK YANG PERLU SEGERA RESTOCK
        </h3>
        {lowStockProductsCount > 0 && (
          <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 rounded-none uppercase tracking-wider">
            WARNING
          </span>
        )}
      </div>

      {lowStockProductsCount === 0 ? (
        <div className="p-8 text-center max-w-sm mx-auto space-y-2">
          <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-none flex items-center justify-center mx-auto border border-slate-200 dark:border-slate-750">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white text-xs">STATUS: SECURE</h4>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-1 leading-relaxed">
              Semua produk memiliki tingkat persediaan di atas batas minimal.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px] font-mono">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider border-b border-slate-300 dark:border-slate-800">
                <th className="py-2.5 px-4 w-32 tracking-wider">SKU</th>
                <th className="py-2.5 px-4 tracking-wider">NAMA PRODUK</th>
                <th className="py-2.5 px-4 text-right tracking-wider">MIN. STOCK</th>
                <th className="py-2.5 px-4 text-right tracking-wider">CURRENT EST.</th>
                <th className="py-2.5 px-4 text-center tracking-wider">DEFICIT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
              {lowStockProducts.map((product) => {
                const deficit = product.min_stock - product.current_stock;
                return (
                  <tr 
                    key={product.id}
                    className="hover:bg-slate-50/[0.4] dark:hover:bg-slate-950/20 transition-colors duration-200 ease-in-out"
                  >
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {product.sku}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                      {product.nama}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-500 dark:text-slate-400">
                      {product.min_stock.toLocaleString()} <span className="text-[9px] text-slate-400 uppercase tracking-wider">{product.unit}</span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-amber-600 dark:text-amber-500">
                      {product.current_stock.toLocaleString()} <span className="text-[9px] text-slate-400 uppercase tracking-wider">{product.unit}</span>
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono">
                      <span className="inline-block text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-500 px-1.5 py-0.5 rounded-none border border-amber-500/20">
                        -{deficit.toLocaleString()} {product.unit}
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
