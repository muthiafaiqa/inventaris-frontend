import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

export interface StatCardsProps {
  totalProducts: number;
  totalTransactions: number;
  lowStockProductsCount: number;
  loading: boolean;
}

export function StatCards({
  totalProducts,
  totalTransactions,
  lowStockProductsCount,
  loading
}: StatCardsProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-32 animate-pulse flex flex-col justify-between"
          >
            <div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="w-1/2 h-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: Total Products */}
      <div 
        onClick={() => navigate('/products')}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-cyan-500/30 cursor-pointer transition-all group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Total Master Produk
          </span>
          <div className="p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-xl text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
            <Package size={22} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline space-x-2">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {totalProducts}
          </span>
          <span className="text-sm font-semibold text-slate-400">item</span>
        </div>
        <div className="mt-4 flex items-center text-xs font-semibold text-cyan-600 dark:text-cyan-400">
          <span>Kelola katalog produk</span>
          <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Card 2: Total Transactions */}
      <div 
        onClick={() => navigate('/sales')}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-500/30 cursor-pointer transition-all group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Total Record Penjualan
          </span>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <TrendingUp size={22} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline space-x-2">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {totalTransactions}
          </span>
          <span className="text-sm font-semibold text-slate-400">periode</span>
        </div>
        <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400">
          <span>Input historis bulanan</span>
          <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Card 3: Products Needing Restock */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Peringatan Restock
          </span>
          <div className={`p-3 rounded-xl transition-transform ${
            lowStockProductsCount > 0 
              ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 animate-pulse' 
              : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
          }`}>
            <AlertTriangle size={22} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline space-x-2">
          <span className={`text-4xl font-extrabold tracking-tight ${
            lowStockProductsCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
          }`}>
            {lowStockProductsCount}
          </span>
          <span className="text-sm font-semibold text-slate-400">produk</span>
        </div>
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          {lowStockProductsCount > 0 
            ? 'Beberapa produk berada di bawah batas stok minimal!' 
            : 'Seluruh stok barang berada dalam kondisi aman.'}
        </p>
      </div>
    </div>
  );
}
export default StatCards;
