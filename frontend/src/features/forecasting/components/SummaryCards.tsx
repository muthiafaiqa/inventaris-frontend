import { TrendingUp, TrendingDown, Percent, Calculator, ShoppingCart } from 'lucide-react';

export interface SummaryCardsProps {
  nextPeriodLabel: string;
  nextPeriodForecast: number;
  mape: number;
  a: number;
  b: number;
  unit: string;
}

export function SummaryCards({
  nextPeriodLabel,
  nextPeriodForecast,
  mape,
  a,
  b,
  unit
}: SummaryCardsProps) {
  
  // Format numbers nicely
  const formattedForecast = Math.round(nextPeriodForecast).toLocaleString('id-ID');
  const formattedMape = mape.toFixed(2);
  const formattedA = a.toFixed(2);
  const formattedB = b.toFixed(2);
  
  const isUpwardTrend = b >= 0;

  // MAPE Color Indicator configuration
  const getMapeIndicator = (mapeVal: number) => {
    if (mapeVal < 10) {
      return {
        label: 'Akurasi Tinggi (Sangat Baik)',
        colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        accentBg: 'bg-emerald-500/5',
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
      };
    } else if (mapeVal <= 20) {
      return {
        label: 'Akurasi Sedang (Baik)',
        colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        accentBg: 'bg-amber-500/5',
        iconBg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
      };
    } else {
      return {
        label: 'Akurasi Rendah (Buruk)',
        colorClass: 'text-red-500 bg-red-500/10 border-red-500/20',
        accentBg: 'bg-red-500/5',
        iconBg: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
      };
    }
  };

  const indicator = getMapeIndicator(mape);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Next Period Forecast Recommendation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Rekomendasi Pengadaan
            </p>
            <h4 className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
              Periode: {nextPeriodLabel}
            </h4>
          </div>
          <div className="p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-xl text-cyan-600 dark:text-cyan-400">
            <ShoppingCart size={20} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline space-x-1.5">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {formattedForecast}
          </span>
          <span className="text-sm font-semibold text-slate-400">
            {unit}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Jumlah pesanan barang yang disarankan untuk menjaga keseimbangan stok.
        </p>
      </div>

      {/* 2. Accuracy Level (MAPE) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tingkat Akurasi (MAPE)
            </p>
            <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 border rounded-full mt-0.5 ${indicator.colorClass}`}>
              {indicator.label}
            </span>
          </div>
          <div className={`p-3 rounded-xl ${indicator.iconBg}`}>
            <Percent size={20} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline space-x-1.5">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {formattedMape}%
          </span>
          <span className="text-xs font-medium text-slate-400">
            Nilai Error Rate
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Semakin kecil persentase error (MAPE), semakin tinggi tingkat akurasi peramalan.
        </p>
      </div>

      {/* 3. Mathematical Equation (Trend Moment) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Persamaan Linear
            </p>
            <div className="flex items-center space-x-1 mt-0.5">
              {isUpwardTrend ? (
                <>
                  <TrendingUp size={14} className="text-emerald-500" />
                  <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Tren Meningkat</span>
                </>
              ) : (
                <>
                  <TrendingDown size={14} className="text-amber-500" />
                  <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Tren Menurun</span>
                </>
              )}
            </div>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-amber-600 dark:text-amber-400">
            <Calculator size={20} />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-lg font-bold text-slate-800 dark:text-slate-200 block bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-850 font-mono text-center">
            Y = {formattedA} {isUpwardTrend ? '+' : ''} {formattedB}X
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5">
          Model regresi linier di mana <span className="font-mono">X</span> adalah periode berikutnya.
        </p>
      </div>
    </div>
  );
}
export default SummaryCards;
