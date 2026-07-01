import { useState, useEffect } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import type { Product } from '../hooks/useProducts';

export interface ProductFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  product: Product | null;
  onClose: () => void;
  onSubmit: (payload: { 
    sku: string; 
    nama: string; 
    unit: string; 
    harga: number; 
    min_stock: number; 
  }) => Promise<string | null>; // Returns error string if failed, null on success
}

export function ProductFormModal({ 
  isOpen, 
  mode, 
  product, 
  onClose, 
  onSubmit 
}: ProductFormModalProps) {
  const [sku, setSku] = useState('');
  const [nama, setNama] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [harga, setHarga] = useState<number | ''>('');
  const [minStock, setMinStock] = useState<number | ''>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const units = ['pcs', 'Roll', 'Box', 'Meter', 'Pack', 'Set', 'Lusin'];

  // Initialize fields on open or change in product
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && product) {
        setSku(product.sku);
        setNama(product.nama);
        setUnit(product.unit);
        setHarga(product.harga);
        setMinStock(product.min_stock);
      } else {
        setSku('');
        setNama('');
        setUnit('pcs');
        setHarga('');
        setMinStock('');
      }
      setFormError(null);
      setSubmitting(false);
    }
  }, [isOpen, mode, product]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    const priceNum = Number(harga);
    const minStockNum = Number(minStock);

    if (!sku.trim() || !nama.trim() || !unit) {
      setFormError('Semua field wajib diisi.');
      setSubmitting(false);
      return;
    }

    if (isNaN(priceNum) || priceNum < 0) {
      setFormError('Harga harus berupa angka positif.');
      setSubmitting(false);
      return;
    }

    if (isNaN(minStockNum) || minStockNum < 0) {
      setFormError('Minimal stok harus berupa angka positif.');
      setSubmitting(false);
      return;
    }

    const payload = {
      sku: sku.trim(),
      nama: nama.trim(),
      unit,
      harga: priceNum,
      min_stock: minStockNum
    };

    try {
      const errorMsg = await onSubmit(payload);
      if (errorMsg) {
        setFormError(errorMsg);
      } else {
        onClose();
      }
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content Card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {mode === 'add' ? 'Tambah Produk Baru' : 'Ubah Data Produk'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Form Error Message */}
            {formError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center space-x-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                SKU Kode
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Contoh: SKU-L10W-PI"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Nama Produk
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Lampu LED Philip 10W"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Satuan
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Minimal Stok
                </label>
                <input
                  type="number"
                  min="0"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Min. Stok"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Harga Produk (Rp)
              </label>
              <input
                type="number"
                min="0"
                value={harga}
                onChange={(e) => setHarga(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Contoh: 75000"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              <span>{mode === 'add' ? 'Simpan' : 'Perbarui'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ProductFormModal;
