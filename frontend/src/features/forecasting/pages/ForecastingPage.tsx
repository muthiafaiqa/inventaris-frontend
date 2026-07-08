import { AlertTriangle, Loader2, Info } from 'lucide-react';
import { useForecasting } from '../hooks/useForecasting';
import { ForecastingChart } from '../components/ForecastingChart';
import { SummaryCards } from '../components/SummaryCards';

export default function ForecastingPage() {
  const {
    products,
    productsLoading,
    selectedProductId,
    setSelectedProductId,
    forecastResult,
    actualData,
    forecastData,
    mape,
    nextPeriodForecast,
    nextPeriodLabel,
    loading,
    error,
    getMonthName,
  } = useForecasting();

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const unit = selectedProduct?.unit || 'pcs';

  // Construct label and data arrays for ForecastingChart
  const chartLabels = forecastResult ? [
    ...forecastResult.points.map((p) => `${getMonthName(p.bulan)} ${p.tahun}`),
    nextPeriodLabel
  ] : [];

  const chartActual = forecastResult ? [
    ...actualData,
    null
  ] : [];

  const chartForecast = forecastResult ? [
    ...forecastData,
    nextPeriodForecast as number
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
            Prediksi Stok
          </h1>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">
            Analisis Proyeksi Kebutuhan Pengadaan Barang Menggunakan Metode Regresi Trend Moment
          </p>
        </div>
      </div>

      {/* Product Selector Control */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-full sm:w-80 space-y-1">
            <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Pilih Produk untuk Dianalisis
            </label>
            {productsLoading ? (
              <div className="flex items-center space-x-2 text-[11px] text-slate-400 py-2">
                <Loader2 size={12} className="animate-spin text-slate-400" />
                <span className="font-mono uppercase tracking-wider">LOADING PRODUCTS...</span>
              </div>
            ) : (
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-none px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-slate-500 font-bold uppercase tracking-wider"
              >
                <option value="">-- PILIH PRODUK --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.sku}] - {p.nama.toUpperCase()}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedProduct && (
            <div className="flex-1 flex flex-wrap gap-3 text-[10px] font-mono sm:self-end sm:pb-1">
              <div className="bg-slate-50 dark:bg-slate-950 px-2.5 py-1 border border-slate-200 dark:border-slate-800 rounded-none text-slate-500 dark:text-slate-400">
                SATUAN: <span className="font-bold text-slate-900 dark:text-white uppercase">{selectedProduct.unit}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 px-2.5 py-1 border border-slate-200 dark:border-slate-800 rounded-none text-slate-500 dark:text-slate-400">
                MIN. STOK: <span className="font-bold text-slate-900 dark:text-white">{selectedProduct.min_stock.toLocaleString()} {selectedProduct.unit.toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Analysis Results */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none p-16 flex flex-col items-center justify-center space-y-2">
          <Loader2 size={24} className="text-slate-400 dark:text-slate-500 animate-spin" />
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">RUNNING FORECAST MODEL CALCULATIONS...</p>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none p-6">
          <div className="max-w-md mx-auto text-center space-y-3 py-2">
            <div className="mx-auto w-10 h-10 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-none flex items-center justify-center border border-amber-500/20">
              <AlertTriangle size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                DATA HISTORIS TIDAK CUKUP
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {error}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-none border border-slate-200 dark:border-slate-800 text-left text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
              <div className="flex items-start space-x-2">
                <Info size={12} className="text-slate-500 shrink-0 mt-0.5" />
                <span>
                  <strong>INFORMASI MODEL:</strong> Regresi linear Trend Moment mensyaratkan minimal 3 data penjualan bulanan untuk menghitung kemiringan (slope) tren permintaan. Model tidak dapat mengevaluasi peramalan dengan jumlah data di bawah ketentuan batas minimum ini.
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : forecastResult && mape !== null && nextPeriodForecast !== null ? (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <SummaryCards
            nextPeriodLabel={nextPeriodLabel}
            nextPeriodForecast={nextPeriodForecast}
            mape={mape}
            a={forecastResult.a}
            b={forecastResult.b}
            unit={unit}
          />

          {/* Forecast Trend Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none p-3.5">
            <div className="pb-3 mb-3 border-b border-slate-300 dark:border-slate-800">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-850 dark:text-slate-150">
                GRAFIK PROYEKSI & PENJUALAN AKTUAL
              </h3>
            </div>
            <div>
              <ForecastingChart
                labels={chartLabels}
                actualData={chartActual}
                forecastData={chartForecast}
                unit={unit}
              />
            </div>
          </div>

          {/* Analytical Calculation Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none overflow-hidden">
            <div className="p-3.5 border-b border-slate-300 dark:border-slate-800">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-850 dark:text-slate-150">
                RINCIAN EVALUASI MODEL & DATA HISTORIS
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] font-mono tracking-tight">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-300 dark:border-slate-800">
                    <th className="py-2.5 px-4 w-20 text-center">INDEX (X)</th>
                    <th className="py-2.5 px-4 font-sans">PERIODE</th>
                    <th className="py-2.5 px-4 text-center">AKTUAL (Y)</th>
                    <th className="py-2.5 px-4 text-center">ESTIMASI (Ŷ)</th>
                    <th className="py-2.5 px-4 text-center">ERROR (Y - Ŷ)</th>
                    <th className="py-2.5 px-4 text-center">ABS ERROR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
                  {forecastResult.points.map((point, index) => {
                    const errorVal = point.actual - point.forecast;
                    const pctError = point.actual > 0 
                      ? (Math.abs(errorVal) / point.actual) * 100 
                      : 0;

                    return (
                      <tr 
                        key={`${point.tahun}-${point.bulan}`}
                        className="hover:bg-slate-50/[0.4] dark:hover:bg-slate-950/20 transition-colors duration-200 text-xs"
                      >
                        <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-400 dark:text-slate-500">
                          {index}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                          {`${getMonthName(point.bulan)} ${point.tahun}`}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                          {point.actual.toLocaleString()} <span className="text-[9px] font-sans font-semibold text-slate-400 uppercase tracking-wider">{unit}</span>
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono font-semibold text-slate-750 dark:text-slate-300">
                          {Math.round(point.forecast).toLocaleString()} <span className="text-[9px] font-sans font-semibold text-slate-400 uppercase tracking-wider">{unit}</span>
                        </td>
                        <td className={`py-2.5 px-4 text-center font-mono font-medium ${errorVal >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-amber-600 dark:text-amber-500'}`}>
                          {errorVal >= 0 ? '+' : ''}{errorVal.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                          {pctError.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                  {/* Next Period Row */}
                  <tr className="bg-indigo-500/[0.02] border-t border-slate-300 dark:border-slate-800 text-indigo-650 dark:text-indigo-400 font-bold">
                    <td className="py-2.5 px-4 text-center font-mono">
                      {forecastResult.points.length}
                    </td>
                    <td className="py-2.5 px-4 uppercase tracking-wider text-xs">
                      {nextPeriodLabel} (PROYEKSI)
                    </td>
                    <td className="py-2.5 px-4 text-center text-slate-400 font-mono">-</td>
                    <td className="py-2.5 px-4 text-center font-mono text-sm">
                      {Math.round(nextPeriodForecast).toLocaleString()} <span className="text-[9px] font-sans font-semibold uppercase tracking-wider">{unit}</span>
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono">-</td>
                    <td className="py-2.5 px-4 text-center font-mono">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none p-16 flex flex-col items-center justify-center text-slate-400 space-y-2">
          <AlertTriangle size={32} className="text-slate-300 dark:text-slate-700" />
          <p className="text-[10px] font-mono uppercase tracking-wider text-center">
            {!selectedProductId 
              ? "Silahkan pilih produk terlebih dahulu untuk memulai analisis."
              : "NO ANALYSIS DATA AVAILABLE"
            }
          </p>
        </div>
      )}
    </div>
  );
}
