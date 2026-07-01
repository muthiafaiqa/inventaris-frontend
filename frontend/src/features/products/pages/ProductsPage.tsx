import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { useProducts, type Product } from '../hooks/useProducts';
import { ProductTable } from '../components/ProductTable';
import { ProductFormModal } from '../components/ProductFormModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { RestockModal } from '../components/RestockModal';

export default function ProductsPage() {
  const { 
    products, 
    loading, 
    error, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    refetch
  } = useProducts();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Delete confirmation states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Restock states
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [productToRestock, setProductToRestock] = useState<Product | null>(null);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenDeleteConfirm = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteConfirmOpen(true);
  };

  const handleOpenRestockModal = (product: Product) => {
    setProductToRestock(product);
    setIsRestockOpen(true);
  };

  // Submit Handler for Form
  const handleFormSubmit = async (payload: {
    sku: string;
    nama: string;
    unit: string;
    harga: number;
    min_stock: number;
  }) => {
    if (modalMode === 'add') {
      const { error: addError } = await addProduct(payload);
      return addError; // Returns error string or null
    } else if (modalMode === 'edit' && selectedProduct) {
      const { error: updateError } = await updateProduct(selectedProduct.id, payload);
      return updateError; // Returns error string or null
    }
    return 'Terjadi kesalahan sistem.';
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      const { error: delError } = await deleteProduct(productToDelete.id);
      if (delError) {
        alert(delError);
      } else {
        setIsDeleteConfirmOpen(false);
        setProductToDelete(null);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus produk.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
            Master Produk
          </h1>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">
            Pengelolaan Data Katalog SKU & Batas Aman Persediaan Barang
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold px-3 py-1.5 border border-slate-300 dark:border-slate-800 rounded-none transition-all duration-200 ease-in-out text-[10px] uppercase tracking-wider active:scale-98"
        >
          <Plus size={12} className="text-slate-500" />
          <span>TAMBAH PRODUK</span>
        </button>
      </div>

      {/* Database Fetch Error */}
      {error && (
        <div className="bg-red-500/5 border border-red-500/30 text-red-700 dark:text-red-400 p-3 rounded-none flex items-center space-x-2.5 text-[11px] font-mono font-bold uppercase tracking-wider">
          <AlertTriangle size={14} className="shrink-0" />
          <span>ERROR: {error}</span>
        </div>
      )}

      {/* Main Table Sub-Component */}
      <ProductTable
        products={products}
        loading={loading}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteConfirm}
        onRestock={handleOpenRestockModal}
      />

      {/* Form Dialog Sub-Component */}
      <ProductFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Dialog Sub-Component */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        productName={productToDelete?.nama || ''}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Restock Dialog Sub-Component */}
      <RestockModal
        isOpen={isRestockOpen}
        product={productToRestock}
        onClose={() => {
          setIsRestockOpen(false);
          setProductToRestock(null);
        }}
        onSuccess={refetch}
      />
    </div>
  );
}
