import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { useProducts, type Product } from '../hooks/useProducts';
import { ProductTable } from '../components/ProductTable';
import { ProductFormModal } from '../components/ProductFormModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

export default function ProductsPage() {
  const { 
    products, 
    loading, 
    error, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Delete confirmation states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Master Produk
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Kelola SKU, nama barang, harga, satuan, dan minimal stok inventaris Toko Surya Elektrik.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-98"
        >
          <Plus size={18} />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Database Fetch Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertTriangle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table Sub-Component */}
      <ProductTable
        products={products}
        loading={loading}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteConfirm}
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
    </div>
  );
}
