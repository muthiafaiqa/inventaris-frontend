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
      <div className="relative bg-white dark:bg-slate-900 rounded-none w-full max-w-md shadow-none border border-slate-300 dark:border-slate-800 z-10 overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
            {mode === 'add' ? 'TAMBAH PRODUK BARU' : 'UBAH DATA PRODUK'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:border-slate-300 dark:hover:border-slate-750 text-slate-450 hover:text-slate-600 border border-transparent rounded-none transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {/* Form Error Message */}
            {formError && (
              <div className="bg-red-500/5 border border-red-500/30 text-red-700 dark:text-red-400 p-3 rounded-none text-xs flex items-center space-x-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1.5">
                SKU KODE
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Contoh: SKU-L10W-PH"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-none px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-slate-500 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1.5">
                NAMA PRODUK
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Lampu LED Philips 10W"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-none px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-slate-500 font-sans"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1.5">
                  SATUAN
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-none px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-slate-500 font-bold uppercase tracking-wider"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1.5">
                  MINIMAL STOK
                </label>
                <input
                  type="number"
                  min="0"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Min. Stok"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-none px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-slate-500 font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1.5">
                HARGA PRODUK (RP)
              </label>
              <input
                type="number"
                min="0"
                value={harga}
                onChange={(e) => setHarga(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Contoh: 75000"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-none px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-slate-500 font-mono font-bold"
                required
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-300 dark:border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold px-3 py-1.5 border border-slate-300 dark:border-slate-800 rounded-none transition-colors text-[10px] uppercase tracking-wider"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold px-3 py-1.5 border border-slate-900 dark:border-white rounded-none transition-colors text-[10px] uppercase tracking-wider disabled:opacity-40"
            >
              {submitting && <Loader2 size={12} className="animate-spin text-slate-450" />}
              <span>{mode === 'add' ? 'SIMPAN' : 'PERBARUI'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ProductFormModal;
