import { useState, useEffect, useCallback } from 'react';
import supabase from '../../../lib/supabaseClient';

export interface SalesRecord {
  id: string;
  product_id: string;
  bulan: number; // 1-12
  tahun: number;
  qty_sold: number;
  created_at: string;
  products?: {
    nama: string;
    sku: string;
    unit: string;
  };
}

export function useSales() {
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Fetch sales records with pagination range (10 records per page)
  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const from = (page - 1) * 10;
      const to = from + 9;

      const { data, error: fetchError } = await supabase
        .from('sales_history')
        .select(`
          id,
          product_id,
          bulan,
          tahun,
          qty_sold,
          created_at,
          products (
            nama,
            sku,
            unit
          )
        `)
        .order('tahun', { ascending: false })
        .order('bulan', { ascending: false })
        .range(from, to);

      if (fetchError) {
        // If out of bounds error, handle it gracefully
        if (fetchError.code === 'PGRST103') {
          setSales([]);
          return;
        }
        throw fetchError;
      }
      setSales((data as any) || []);
    } catch (err: any) {
      console.error('Error fetching sales history:', err);
      setError(err.message || 'Gagal mengambil data riwayat penjualan.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Add a new sales record
  const addSales = async (record: Omit<SalesRecord, 'id' | 'created_at' | 'products'>) => {
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('sales_history')
        .insert([record])
        .select(`
          id,
          product_id,
          bulan,
          tahun,
          qty_sold,
          created_at,
          products (
            nama,
            sku,
            unit
          )
        `)
        .single();

      if (insertError) {
        // Unique key constraint violation: product_id + bulan + tahun already exists
        if (insertError.code === '23505') {
          throw new Error('Data penjualan untuk produk pada periode bulan dan tahun tersebut sudah terdaftar.');
        }
        throw insertError;
      }

      setSales((prev) => [data as any, ...prev]);
      return { data: data as any, error: null };
    } catch (err: any) {
      console.error('Error adding sales record:', err);
      return { data: null, error: err.message || 'Gagal menambahkan data penjualan.' };
    }
  };

  // Delete a sales record
  const deleteSales = async (id: string) => {
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('sales_history')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setSales((prev) => prev.filter((s) => s.id !== id));
      return { error: null };
    } catch (err: any) {
      console.error('Error deleting sales record:', err);
      return { error: err.message || 'Gagal menghapus data penjualan.' };
    }
  };

  // Fetch sales chronologically for forecasting (utility method)
  const fetchSalesByProduct = useCallback(async (productId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('sales_history')
        .select('*')
        .eq('product_id', productId)
        .order('tahun', { ascending: true })
        .order('bulan', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }
      return { data, error: null };
    } catch (err: any) {
      console.error(`Error fetching sales for product ${productId}:`, err);
      return { data: null, error: err.message || 'Gagal memuat data penjualan produk.' };
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return {
    sales,
    loading,
    error,
    page,
    setPage,
    refetch: fetchSales,
    addSales,
    deleteSales,
    fetchSalesByProduct,
  };
}
export default useSales;
