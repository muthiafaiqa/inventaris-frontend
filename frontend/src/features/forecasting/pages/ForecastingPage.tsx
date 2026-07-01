import { AlertTriangle, Loader2, LineChart, Table, Info } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Peramalan Stok
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Analisis proyeksi kebutuhan stok barang berdasarkan tren historis penjualan dengan metode <strong>Trend Moment</strong>.
          </p>
        </div>
      </div>

      {/* Product Selector Control */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-full sm:w-80 space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Pilih Produk untuk Dianalisis
            </label>
            {productsLoading ? (
              <div className="flex items-center space-x-2 text-sm text-slate-400 py-2.5">
                <Loader2 size={16} className="animate-spin text-cyan-500" />
                <span>Memuat daftar produk...</span>
              </div>
            ) : (
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all font-semibold"
              >
                <option value="" disabled>-- Pilih Produk --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.sku}] - {p.nama}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedProduct && (
            <div className="flex-1 flex flex-wrap gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 sm:self-end sm:pb-2">
              <div className="bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-850">
                Satuan: <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedProduct.unit}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-850">
                Minimal Stok: <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedProduct.min_stock} {selectedProduct.unit}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Analysis Results */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-20 flex flex-col items-center justify-center space-y-4 shadow-sm">
          <Loader2 size={40} className="text-cyan-500 animate-spin" />
          <p className="text-slate-400 font-semibold text-sm">Menghitung model peramalan...</p>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <div className="max-w-md mx-auto text-center space-y-4 py-6">
            <div className="mx-auto w-14 h-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center border border-amber-500/20">
              <AlertTriangle size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                Data Historis Tidak Cukup
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {error}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 text-left text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <div className="flex items-start space-x-2">
                <Info size={16} className="text-cyan-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Mengapa perlu 3 data?</strong> Model Trend Moment menggunakan analisis regresi deret berkala untuk menghitung arah perubahan tren (slope). Kurang dari 3 data akan menghasilkan model yang sangat tidak stabil.
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-850">
              <LineChart size={18} className="text-cyan-500" />
              <h3 className="text-md font-bold text-slate-900 dark:text-white">
                Grafik Proyeksi & Penjualan Aktual
              </h3>
            </div>
            <div className="p-2">
              <ForecastingChart
                labels={chartLabels}
                actualData={chartActual}
                forecastData={chartForecast}
                unit={unit}
              />
            </div>
          </div>

          {/* Analytical Calculation Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
              <Table size={18} className="text-cyan-500" />
              <h3 className="text-md font-bold text-slate-900 dark:text-white">
                Rincian Evaluasi Model & Historis
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <th className="py-4 px-6 w-16 text-center">Index (X)</th>
                    <th className="py-4 px-6">Periode</th>
                    <th className="py-4 px-6 text-center">Penjualan Aktual (Y)</th>
                    <th className="py-4 px-6 text-center">Estimasi Model (Ŷ)</th>
                    <th className="py-4 px-6 text-center">Error (Y - Ŷ)</th>
                    <th className="py-4 px-6 text-center">Absolute Error (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {forecastResult.points.map((point, index) => {
                    const errorVal = point.actual - point.forecast;
                    const pctError = point.actual > 0 
                      ? (Math.abs(errorVal) / point.actual) * 100 
                      : 0;

                    return (
                      <tr 
                        key={`${point.tahun}-${point.bulan}`}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                      >
                        <td className="py-4 px-6 text-center font-mono font-bold text-slate-400 dark:text-slate-500">
                          {index}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-200">
                          {`${getMonthName(point.bulan)} ${point.tahun}`}
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-slate-900 dark:text-white">
                          {point.actual} <span className="text-xs font-semibold text-slate-400">{unit}</span>
                        </td>
                        <td className="py-4 px-6 text-center font-semibold text-slate-600 dark:text-slate-300">
                          {Math.round(point.forecast)} <span className="text-xs font-semibold text-slate-400">{unit}</span>
                        </td>
                        <td className={`py-4 px-6 text-center font-medium ${errorVal >= 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {errorVal >= 0 ? '+' : ''}{errorVal.toFixed(1)}
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-slate-650 dark:text-slate-350">
                          {pctError.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                  {/* Next Period Row */}
                  <tr className="bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors font-bold text-cyan-600 dark:text-cyan-400">
                    <td className="py-4 px-6 text-center font-mono">
                      {forecastResult.points.length}
                    </td>
                    <td className="py-4 px-6">
                      {nextPeriodLabel} (Proyeksi)
                    </td>
                    <td className="py-4 px-6 text-center text-slate-400">-</td>
                    <td className="py-4 px-6 text-center text-xl">
                      {Math.round(nextPeriodForecast)} <span className="text-xs font-semibold">{unit}</span>
                    </td>
                    <td className="py-4 px-6 text-center">-</td>
                    <td className="py-4 px-6 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
          <AlertTriangle size={48} className="text-slate-300 dark:text-slate-700" />
          <p className="text-sm font-medium">Tidak ada data untuk ditampilkan.</p>
        </div>
      )}
    </div>
  );
}
