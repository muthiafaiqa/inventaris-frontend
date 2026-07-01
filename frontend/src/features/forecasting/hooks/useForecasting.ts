import { useState, useEffect, useCallback } from 'react';
import { useProducts } from '../../products/hooks/useProducts';
import { useSales } from '../../sales/hooks/useSales';
import { calculateTrend, type ForecastResult } from '../utils/trendMoment';

export interface ForecastingDataPoint {
  periode: string;
  actual: number;
  forecast: number;
}

export function useForecasting() {
  const { products, loading: productsLoading } = useProducts();
  const { fetchSalesByProduct } = useSales();

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [forecastResult, setForecastResult] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPeriodLabel, setNextPeriodLabel] = useState<string>('');

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Helper to determine the next period label (month and year)
  const calculateNextPeriodLabel = (lastBulan: number, lastTahun: number) => {
    const nextBulan = lastBulan === 12 ? 1 : lastBulan + 1;
    const nextTahun = lastBulan === 12 ? lastTahun + 1 : lastTahun;
    return `${monthNames[nextBulan - 1]} ${nextTahun}`;
  };

  // Run forecasting for the selected product
  const runForecasting = useCallback(async (productId: string) => {
    if (!productId) {
      setForecastResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await fetchSalesByProduct(productId);
      if (fetchError) {
        throw new Error(fetchError);
      }

      if (!data || data.length === 0) {
        setForecastResult(null);
        setError('Belum ada data historis penjualan untuk produk ini.');
        return;
      }

      if (data.length < 3) {
        setForecastResult(null);
        setError('Data penjualan produk ini kurang dari 3 periode. Peramalan memerlukan minimal 3 periode data.');
        return;
      }

      // Sort data chronologically (earliest to latest)
      const sortedSales = [...data].sort((a, b) => {
        if (a.tahun !== b.tahun) {
          return a.tahun - b.tahun;
        }
        return a.bulan - b.bulan;
      });

      // Run Trend calculation
      const result = calculateTrend(sortedSales);
      setForecastResult(result);

      // Determine next period month and year label
      const lastPoint = sortedSales[sortedSales.length - 1];
      const nextLabel = calculateNextPeriodLabel(lastPoint.bulan, lastPoint.tahun);
      setNextPeriodLabel(nextLabel);

    } catch (err: any) {
      console.error('Error generating forecast:', err);
      setError(err.message || 'Gagal menghitung peramalan.');
      setForecastResult(null);
    } finally {
      setLoading(false);
    }
  }, [fetchSalesByProduct]);

  // Set default product when products list is loaded
  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  // Re-run forecasting whenever selected product changes
  useEffect(() => {
    if (selectedProductId) {
      runForecasting(selectedProductId);
    }
  }, [selectedProductId, runForecasting]);

  // Determine accuracy category based on MAPE values
  const getMapeCategory = (mapeVal: number) => {
    if (mapeVal < 10) return { label: 'Sangat Baik (Sangat Akurat)', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25' };
    if (mapeVal < 20) return { label: 'Baik (Akurat)', color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/25' };
    if (mapeVal < 50) return { label: 'Layak (Cukup Akurat)', color: 'text-amber-500 bg-amber-500/10 border-amber-500/25' };
    return { label: 'Buruk (Tidak Akurat)', color: 'text-red-500 bg-red-500/10 border-red-500/25' };
  };

  const getMonthName = (value: number) => {
    return monthNames[value - 1] || '';
  };

  const combinedLoading = loading || productsLoading;
  const actualData = forecastResult ? forecastResult.points.map((p) => p.actual) : [];
  const forecastData = forecastResult ? forecastResult.points.map((p) => p.forecast) : [];
  const mape = forecastResult ? forecastResult.mape : null;
  const nextPeriodForecast = forecastResult ? forecastResult.nextPeriodForecast : null;

  return {
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
    mapeCategory: forecastResult ? getMapeCategory(forecastResult.mape) : null,
    loading: combinedLoading,
    error,
    getMonthName,
    refetchForecast: () => selectedProductId && runForecasting(selectedProductId),
  };
}
export default useForecasting;
