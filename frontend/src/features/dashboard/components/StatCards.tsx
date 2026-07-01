import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-850 rounded-none p-4 h-24 animate-pulse flex flex-col justify-between"
          >
            <div className="w-1/4 h-2 bg-slate-200 dark:bg-slate-800"></div>
            <div className="w-1/2 h-6 bg-slate-200 dark:bg-slate-800"></div>
          </div>
        ))}
      </div>
    );
  }

  const hasLowStock = lowStockProductsCount > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Bento Card 1: Total Products */}
      <div 
        onClick={() => navigate('/products')}
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none p-4 cursor-pointer hover:border-slate-500 dark:hover:border-slate-650 transition-all duration-200 ease-in-out group flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 block">
              TOTAL MASTER PRODUK
            </span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-3xl font-bold font-mono tracking-tighter text-slate-900 dark:text-slate-100">
                {totalProducts}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">ITEMS</span>
            </div>
          </div>
          <div className="p-1.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-none">
            <Package size={16} />
          </div>
        </div>
        <div className="mt-3 flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">
          <span>Katalog</span>
          <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">&rarr;</span>
        </div>
      </div>

      {/* Bento Card 2: Total Transactions */}
      <div 
        onClick={() => navigate('/sales')}
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none p-4 cursor-pointer hover:border-slate-500 dark:hover:border-slate-650 transition-all duration-200 ease-in-out group flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 block">
              TOTAL RECORD PENJUALAN
            </span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-3xl font-bold font-mono tracking-tighter text-slate-900 dark:text-slate-100">
                {totalTransactions}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">PERIODS</span>
            </div>
          </div>
          <div className="p-1.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-none">
            <TrendingUp size={16} />
          </div>
        </div>
        <div className="mt-3 flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">
          <span>Penjualan</span>
          <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">&rarr;</span>
        </div>
      </div>

      {/* Bento Card 3: Products Needing Restock */}
      <div 
        className={`bg-white dark:bg-slate-900 border rounded-none p-4 flex flex-col justify-between transition-all duration-200 ease-in-out ${
          hasLowStock 
            ? 'border-amber-500 dark:border-amber-600 bg-amber-500/[0.01]' 
            : 'border-slate-300 dark:border-slate-800'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] block ${
              hasLowStock ? 'text-amber-600 dark:text-amber-500' : 'text-slate-400 dark:text-slate-500'
            }`}>
              PERINGATAN RESTOCK
            </span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className={`text-3xl font-bold font-mono tracking-tighter ${
                hasLowStock ? 'text-amber-600 dark:text-amber-500' : 'text-slate-900 dark:text-slate-100'
              }`}>
                {lowStockProductsCount}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">ALERTS</span>
            </div>
          </div>
          <div className={`p-1.5 border rounded-none ${
            hasLowStock 
              ? 'border-amber-300 dark:border-amber-900/60 text-amber-600 dark:text-amber-500' 
              : 'border-slate-200 dark:border-slate-800 text-slate-400'
          }`}>
            <AlertTriangle size={16} />
          </div>
        </div>
        <p className="mt-3 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
          {hasLowStock 
            ? 'Stok berada di bawah ambang batas minimal' 
            : 'Seluruh persediaan aman'}
        </p>
      </div>
    </div>
  );
}
export default StatCards;
