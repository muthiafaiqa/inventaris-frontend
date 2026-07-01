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
      setTimeout(() => setSeedResult(null), 6000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section with Seeder Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ringkasan Dasbor
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Status terkini inventaris elektrik, rekap transaksi penjualan, dan pemberitahuan stok menipis.
          </p>
        </div>

        <button
          onClick={handleRunSeed}
          disabled={seeding || loading}
          className="flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-4 py-2.5 rounded-xl transition-all border border-slate-250 dark:border-slate-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {seeding ? (
            <Loader2 size={18} className="animate-spin text-cyan-500" />
          ) : (
            <Database size={18} className="text-cyan-500" />
          )}
          <span>{seeding ? 'Seeding Data...' : 'Seed Data Sampel'}</span>
        </button>
      </div>

      {/* Seeding Result Toast / Alert */}
      {seedResult && (
        <div className={`p-4 rounded-xl border flex items-start space-x-3 text-sm animate-fade-in ${
          seedResult.success 
            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400' 
            : 'bg-red-500/10 border-red-500/25 text-red-600 dark:text-red-400'
        }`}>
          {seedResult.success ? (
            <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
          ) : (
            <AlertOctagon size={20} className="shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-bold">{seedResult.success ? 'Seed Sukses' : 'Seed Gagal'}</h4>
            <p className="mt-0.5 text-xs opacity-90">{seedResult.message}</p>
          </div>
        </div>
      )}

      {/* Database Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <ShieldAlert size={20} className="shrink-0" />
          <span>{error}</span>
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
      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-850 flex items-start space-x-2.5 text-xs text-slate-500 dark:text-slate-400">
        <Info size={16} className="text-cyan-500 shrink-0 mt-0.5" />
        <span>
          <strong>Catatan Estimasi Stok:</strong> Mengingat modul Kasir/POS realtime berada di luar cakupan (Out-Of-Scope), sistem menghitung stok saat ini dengan mendeteksi aktivitas inventori atau melakukan simulasi deterministik. Persediaan dihitung untuk memvalidasi performa ambang batas stok minimal (Restock Alert).
        </span>
      </div>
    </div>
  );
}
