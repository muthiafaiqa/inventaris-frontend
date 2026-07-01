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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Historis Penjualan
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Catat rekapitulasi kuantitas penjualan produk bulanan sebagai basis perhitungan peramalan stok.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          disabled={products.length === 0}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          <span>Input Penjualan</span>
        </button>
      </div>

      {/* Database Fetch Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertTriangle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Warning if no products are configured */}
      {products.length === 0 && !productsLoading && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertTriangle size={20} className="shrink-0" />
          <span>
            Silakan tambahkan data produk terlebih dahulu di menu <strong>Master Produk</strong> sebelum menginput data penjualan.
          </span>
        </div>
      )}

      {/* Main Table Sub-Component */}
      <SalesTable
        sales={sales}
        loading={salesLoading || productsLoading}
        onDelete={handleOpenDeleteConfirm}
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
