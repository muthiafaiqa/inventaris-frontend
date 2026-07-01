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
        label: 'AKURASI TINGGI',
        colorClass: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50'
      };
    } else if (mapeVal <= 20) {
      return {
        label: 'AKURASI SEDANG',
        colorClass: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50'
      };
    } else {
      return {
        label: 'AKURASI RENDAH',
        colorClass: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200/50'
      };
    }
  };

  const indicator = getMapeIndicator(mape);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Next Period Forecast Recommendation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 block">
              REKOMENDASI PENGADAAN
            </span>
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase block mt-1">
              PERIODE: {nextPeriodLabel}
            </span>
          </div>
          <div className="p-1.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-none">
            <ShoppingCart size={16} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-1">
          <span className="text-3xl font-bold font-mono tracking-tighter text-slate-900 dark:text-slate-100">
            {formattedForecast}
          </span>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            {unit}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-wide">
          Saran kuantitas pesanan baru untuk menjaga inventori.
        </p>
      </div>

      {/* 2. Accuracy Level (MAPE) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 block">
              TINGKAT AKURASI (MAPE)
            </span>
            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-none ${indicator.colorClass}`}>
              {indicator.label}
            </span>
          </div>
          <div className="p-1.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-none">
            <Percent size={16} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-1">
          <span className="text-3xl font-bold font-mono tracking-tighter text-slate-900 dark:text-slate-100">
            {formattedMape}%
          </span>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            ERROR RATE
          </span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-wide">
          Nilai deviasi model estimasi regresi data penjualan.
        </p>
      </div>

      {/* 3. Mathematical Equation (Trend Moment) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 block">
              PERSAMAAN LINEAR
            </span>
            <div className="flex items-center space-x-1">
              {isUpwardTrend ? (
                <>
                  <TrendingUp size={12} className="text-emerald-600 dark:text-emerald-500" />
                  <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-none border border-emerald-200/50">TREN MENINGKAT</span>
                </>
              ) : (
                <>
                  <TrendingDown size={12} className="text-amber-600 dark:text-amber-500" />
                  <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded-none border border-amber-200/50">TREN MENURUN</span>
                </>
              )}
            </div>
          </div>
          <div className="p-1.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-none">
            <Calculator size={16} />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block bg-slate-50 dark:bg-slate-950 px-2 py-1.5 border border-slate-200 dark:border-slate-800 font-mono text-center rounded-none">
            Y = {formattedA} {isUpwardTrend ? '+' : ''} {formattedB}X
          </span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-wide">
          Persamaan tren dengan X sebagai periode berikutnya.
        </p>
      </div>
    </div>
  );
}
export default SummaryCards;
