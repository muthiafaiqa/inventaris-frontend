import { useState, useEffect, useMemo } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import type { Product } from '../../products/hooks/useProducts';
import type { SalesRecord } from '../hooks/useSales';

export interface SalesFormModalProps {
  isOpen: boolean;
  products: Product[];
  sales: SalesRecord[];
  onClose: () => void;
  onSubmit: (payload: {
    product_id: string;
    bulan: number;
    tahun: number;
    qty_sold: number;
  }) => Promise<string | null>;
}

export function SalesFormModal({
  isOpen,
  products,
  sales,
  onClose,
  onSubmit
}: SalesFormModalProps) {
  const [productId, setProductId] = useState('');
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [qtySold, setQtySold] = useState<number | ''>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const months = [
    { value: 1, name: 'Januari' },
    { value: 2, name: 'Februari' },
    { value: 3, name: 'Maret' },
    { value: 4, name: 'April' },
    { value: 5, name: 'Mei' },
    { value: 6, name: 'Juni' },
    { value: 7, name: 'Juli' },
    { value: 8, name: 'Agustus' },
    { value: 9, name: 'September' },
    { value: 10, name: 'Oktober' },
    { value: 11, name: 'November' },
    { value: 12, name: 'Desember' }
  ];

  // Generate year options (last 5 years to current year)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const result = [];
    for (let y = currentYear; y >= currentYear - 5; y--) {
      result.push(y);
    }
    return result;
  }, []);

  // Set default product when products list loaded
  useEffect(() => {
    if (isOpen) {
      setProductId(products[0]?.id || '');
      setBulan(new Date().getMonth() + 1);
      setTahun(new Date().getFullYear());
      setQtySold('');
      setFormError(null);
      setSubmitting(false);
    }
  }, [isOpen, products]);

  if (!isOpen) return null;

  const selectedProduct = products.find((p) => p.id === productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    const qtyNum = Number(qtySold);

    if (!productId || !bulan || !tahun || qtySold === '') {
      setFormError('Semua field wajib diisi.');
      setSubmitting(false);
      return;
    }

    if (isNaN(qtyNum) || qtyNum < 0) {
      setFormError('Kuantitas terjual harus berupa angka positif.');
      setSubmitting(false);
      return;
    }

    // Client-side validation: Check for duplicate entry (same product, month, and year)
    const isDuplicate = sales.some(
      (record) => 
        record.product_id === productId && 
        record.bulan === Number(bulan) && 
        record.tahun === Number(tahun)
    );

    if (isDuplicate) {
      const selectedProdName = selectedProduct?.nama || 'produk';
      const monthName = months.find((m) => m.value === Number(bulan))?.name;
      setFormError(`Data penjualan untuk ${selectedProdName} pada periode ${monthName} ${tahun} sudah terinput.`);
      setSubmitting(false);
      return;
    }

    const payload = {
      product_id: productId,
      bulan: Number(bulan),
      tahun: Number(tahun),
      qty_sold: qtyNum
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
            Input Penjualan Bulanan
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
                Pilih Produk
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              >
                <option value="" disabled>-- Pilih Produk Surya Elektrik --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.sku}] - {p.nama} ({p.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Bulan
                </label>
                <select
                  value={bulan}
                  onChange={(e) => setBulan(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Tahun
                </label>
                <select
                  value={tahun}
                  onChange={(e) => setTahun(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Kuantitas Terjual
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={qtySold}
                  onChange={(e) => setQtySold(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Contoh: 150"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-4 pr-16 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-slate-400 uppercase pointer-events-none">
                  {selectedProduct?.unit || 'Satuan'}
                </span>
              </div>
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
              <span>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SalesFormModal;
