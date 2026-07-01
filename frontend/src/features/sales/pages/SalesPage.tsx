import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { useSales, type SalesRecord } from '../hooks/useSales';
import { useProducts } from '../../products/hooks/useProducts';
import { SalesTable } from '../components/SalesTable';
import { SalesFormModal } from '../components/SalesFormModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

export default function SalesPage() {
  const { products, loading: productsLoading } = useProducts();
  const { 
    sales, 
    loading: salesLoading, 
    error, 
    page,
    setPage,
    addSales, 
    deleteSales 
  } = useSales();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete confirmation states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<SalesRecord | null>(null);

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

  const getMonthName = (value: number) => {
    return months.find((m) => m.value === value)?.name || '';
  };

  const handleOpenAddModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenDeleteConfirm = (record: SalesRecord) => {
    setRecordToDelete(record);
    setIsDeleteConfirmOpen(true);
  };

  // Submit Handler for Form Modal
  const handleFormSubmit = async (payload: {
    product_id: string;
    bulan: number;
    tahun: number;
    qty_sold: number;
  }) => {
    const { error: addError } = await addSales(payload);
    return addError; // Returns error string or null
  };

  // Delete execution
  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;
    try {
      const { error: delError } = await deleteSales(recordToDelete.id);
      if (delError) {
        alert(delError);
      } else {
        setIsDeleteConfirmOpen(false);
        setRecordToDelete(null);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus data penjualan.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
            Historis Penjualan
          </h1>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">
            Log Rekap Kuantitas Transaksi Penjualan Bulanan
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          disabled={products.length === 0}
          className="flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold px-3 py-1.5 border border-slate-300 dark:border-slate-800 rounded-none transition-all duration-200 ease-in-out text-[10px] uppercase tracking-wider active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={12} className="text-slate-500" />
          <span>INPUT PENJUALAN</span>
        </button>
      </div>

      {/* Database Fetch Error */}
      {error && (
        <div className="bg-red-500/5 border border-red-500/30 text-red-700 dark:text-red-400 p-3 rounded-none flex items-center space-x-2.5 text-[11px] font-mono font-bold uppercase tracking-wider">
          <AlertTriangle size={14} className="shrink-0" />
          <span>ERROR: {error}</span>
        </div>
      )}

      {/* Warning if no products are configured */}
      {products.length === 0 && !productsLoading && (
        <div className="bg-amber-500/5 border border-amber-500/30 text-amber-700 dark:text-amber-500 p-3 rounded-none flex items-center space-x-2.5 text-[11px] font-mono font-bold uppercase tracking-wider">
          <AlertTriangle size={14} className="shrink-0" />
          <span>
            PEMBERITAHUAN: Tambahkan data produk di menu Master Produk terlebih dahulu.
          </span>
        </div>
      )}

      {/* Main Table Sub-Component */}
      <SalesTable
        sales={sales}
        loading={salesLoading || productsLoading}
        onDelete={handleOpenDeleteConfirm}
        page={page}
        onPageChange={setPage}
      />

      {/* Form Dialog Sub-Component */}
      <SalesFormModal
        isOpen={isModalOpen}
        products={products}
        sales={sales}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Dialog Sub-Component */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        productName={recordToDelete?.products?.nama || 'Produk'}
        periodName={recordToDelete ? `${getMonthName(recordToDelete.bulan)} ${recordToDelete.tahun}` : ''}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
