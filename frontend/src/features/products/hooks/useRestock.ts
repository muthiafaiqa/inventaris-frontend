import { useState } from 'react';
import supabase from '../../../lib/supabaseClient';
import type { Product } from './useProducts';

export function useRestock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRestock = async (product: Product, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error('Jumlah tambahan harus berupa angka positif lebih dari 0.');
      }

      // 1. Fetch latest product to ensure calculations are correct
      const { data: latestProduct, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', product.id)
        .single();

      if (fetchError) {
        throw new Error(`Gagal mengambil data produk terbaru: ${fetchError.message}`);
      }

      const currentStock = latestProduct?.current_stock ?? 0;
      const newStock = currentStock + quantity;

      // Query 1: Update current_stock on the products table
      const { error: updateError } = await supabase
        .from('products')
        .update({ current_stock: newStock })
        .eq('id', product.id);

      if (updateError) {
        if (updateError.code === 'PGRST204') {
          throw new Error('Kolom "current_stock" tidak ditemukan di database products. Silakan tambahkan kolom tersebut terlebih dahulu di Supabase.');
        }
        throw updateError;
      }

      // Query 2: Log the movement into stock_movements table
      const { error: insertError } = await supabase
        .from('stock_movements')
        .insert([
          {
            id: crypto.randomUUID(),
            product_id: product.id,
            quantity: quantity,
            type: 'IN',
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      return { success: true, error: null };
    } catch (err: any) {
      console.error('Error in executeRestock:', err);
      const errMsg = err.message || 'Terjadi kesalahan saat memproses restock.';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    executeRestock,
    loading,
    error,
    setError
  };
}
export default useRestock;
