import { useState, useEffect } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { useRestock } from '../hooks/useRestock';
import type { Product } from '../hooks/useProducts';

export interface RestockModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function RestockModal({ isOpen, product, onClose, onSuccess }: RestockModalProps) {
  const [jumlah, setJumlah] = useState<number | ''>('');
  const [keterangan, setKeterangan] = useState('');
  const { executeRestock, loading, error, setError } = useRestock();

  useEffect(() => {
    if (isOpen) {
      setJumlah('');
      setKeterangan('');
      setError(null);
    }
  }, [isOpen, setError]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success } = await executeRestock(product, Number(jumlah));
    if (success) {
      alert(`Stok produk ${product.nama} berhasil ditambah sebanyak ${jumlah} ${product.unit}.`);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-none w-full max-w-md border border-slate-300 dark:border-slate-800 z-10 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
            RESTOCK BARANG
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:border-slate-300 dark:hover:border-slate-750 text-slate-450 hover:text-slate-600 border border-transparent rounded-none transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {error && (
              <div className="bg-red-500/5 border border-red-500/30 text-red-700 dark:text-red-400 p-3 rounded-none text-xs flex items-start space-x-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Product Meta Info Display */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-none space-y-1 font-mono text-[10px]">
              <div>
                <span className="text-slate-400 uppercase tracking-wider">PRODUK:</span>{' '}
                <span className="text-slate-800 dark:text-slate-200 font-bold">[{product.sku}] - {product.nama}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider">STOK SEKARANG:</span>{' '}
                <span className="text-slate-800 dark:text-slate-200 font-bold">{(product.current_stock ?? product.stok ?? 0).toLocaleString()} {product.unit}</span>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1.5">
                Jumlah Tambahan ({product.unit})
              </label>
              <input
                type="number"
                min="1"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Masukkan jumlah stok masuk..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-none px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-slate-500 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1.5">
                Keterangan / Catatan Log
              </label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Penerimaan dari supplier..."
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-none px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-slate-500 resize-none"
              />
            </div>
          </div>

          {/* Footer actions */}
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
              disabled={loading}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold px-3 py-1.5 border border-slate-900 dark:border-white rounded-none transition-colors text-[10px] uppercase tracking-wider disabled:opacity-40"
            >
              {loading && <Loader2 size={12} className="animate-spin text-slate-400" />}
              <span>PROSES RESTOCK</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default RestockModal;
