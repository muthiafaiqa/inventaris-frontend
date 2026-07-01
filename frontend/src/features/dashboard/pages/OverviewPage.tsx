import { useState } from 'react';
import { Database, CheckCircle2, Loader2, AlertOctagon, ShieldAlert, Info } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { runSeed } from '../../../lib/seed';
import { StatCards } from '../components/StatCards';
import { StockAlertTable } from '../components/StockAlertTable';

export default function OverviewPage() {
  const { 
    totalProducts, 
    totalTransactions, 
    lowStockProductsCount, 
    lowStockProducts, 
    loading, 
    error, 
    refetch 
  } = useDashboard();

  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleRunSeed = async () => {
    if (!window.confirm('Apakah Anda yakin ingin melakukan seeding database? Data produk dan penjualan lama akan dibersihkan.')) {
      return;
    }
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await runSeed();
      setSeedResult(res);
      if (res.success) {
        await refetch();
      }
    } catch (err: any) {
      setSeedResult({ success: false, message: err.message || 'Gagal melakukan seeding.' });
    } finally {
      setSeeding(false);
      setTimeout(() => setSeedResult(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section with Seeder Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
            Dasbor Pemantauan
          </h1>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">
            Status Persediaan & Log Kuantitas Transaksi Penjualan
          </p>
        </div>

        <button
          onClick={handleRunSeed}
          disabled={seeding || loading}
          className="flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold px-3 py-1.5 border border-slate-300 dark:border-slate-800 rounded-none transition-all duration-200 ease-in-out text-[10px] uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {seeding ? (
            <Loader2 size={12} className="animate-spin text-slate-500" />
          ) : (
            <Database size={12} className="text-slate-500" />
          )}
          <span>{seeding ? 'SEEDING...' : 'SEED SAMPLE DATA'}</span>
        </button>
      </div>

      {/* Seeding Result Alert */}
      {seedResult && (
        <div className={`p-3 rounded-none border flex items-start space-x-3 text-[11px] font-mono transition-all duration-200 ease-in-out ${
          seedResult.success 
            ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' 
            : 'bg-red-500/5 border-red-500/30 text-red-700 dark:text-red-400'
        }`}>
          {seedResult.success ? (
            <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
          ) : (
            <AlertOctagon size={14} className="shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-bold uppercase tracking-wider">{seedResult.success ? 'SYSTEM_SEED_SUCCESS' : 'SYSTEM_SEED_FAILED'}</h4>
            <p className="mt-0.5 opacity-90">{seedResult.message}</p>
          </div>
        </div>
      )}

      {/* Database Error Banner */}
      {error && (
        <div className="bg-red-500/5 border border-red-500/30 text-red-700 dark:text-red-400 p-3 rounded-none flex items-center space-x-2.5 text-[11px] font-mono font-bold uppercase tracking-wider">
          <ShieldAlert size={14} className="shrink-0" />
          <span>ERROR: {error}</span>
        </div>
      )}

      {/* Stat Cards Grid Sub-Component */}
      <StatCards
        totalProducts={totalProducts}
        totalTransactions={totalTransactions}
        lowStockProductsCount={lowStockProductsCount}
        loading={loading}
      />

      {/* Restock Alerts Table Sub-Component */}
      <StockAlertTable
        lowStockProducts={lowStockProducts}
        lowStockProductsCount={lowStockProductsCount}
        loading={loading}
      />

      {/* Info Footnote on Stock Simulation */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-none border border-slate-300 dark:border-slate-800 flex items-start space-x-2.5 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed font-sans">
        <Info size={12} className="text-slate-500 shrink-0 mt-0.5" />
        <span>
          <strong>DOKUMENTASI SISTEM:</strong> Mengingat modul Kasir/POS berjalan di luar cakupan fungsional (*Out-Of-Scope*), kuantitas stok saat ini dievaluasi secara dinamis untuk menguji keandalan batas minimum persediaan (*Restock Warning Alert*). Data kalkulasi ini didesain sepenuhnya berdasarkan logika verifikasi inventori toko.
        </span>
      </div>
    </div>
  );
}
