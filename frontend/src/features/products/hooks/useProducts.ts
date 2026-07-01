import { useState, useEffect, useCallback } from 'react';
import supabase from '../../../lib/supabaseClient';

export interface Product {
  id: string;
  sku: string;
  nama: string;
  harga: number;
  unit: string;
  min_stock: number;
  created_at: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products from Supabase products table
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('nama', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }
      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Gagal mengambil data produk.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new product
  const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error(`SKU "${product.sku}" sudah digunakan oleh produk lain.`);
        }
        throw insertError;
      }
      
      setProducts((prev) => [...prev, data].sort((a, b) => a.nama.localeCompare(b.nama)));
      return { data, error: null };
    } catch (err: any) {
      console.error('Error adding product:', err);
      return { data: null, error: err.message || 'Gagal menambahkan produk.' };
    }
  };

  // Update an existing product
  const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'created_at'>>) => {
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        if (updateError.code === '23505') {
          throw new Error(`SKU "${updates.sku}" sudah digunakan oleh produk lain.`);
        }
        throw updateError;
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? data : p)).sort((a, b) => a.nama.localeCompare(b.nama))
      );
      return { data, error: null };
    } catch (err: any) {
      console.error('Error updating product:', err);
      return { data: null, error: err.message || 'Gagal memperbarui produk.' };
    }
  };

  // Delete a product by ID
  const deleteProduct = async (id: string) => {
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { error: null };
    } catch (err: any) {
      console.error('Error deleting product:', err);
      return { error: err.message || 'Gagal menghapus produk.' };
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
export default useProducts;
