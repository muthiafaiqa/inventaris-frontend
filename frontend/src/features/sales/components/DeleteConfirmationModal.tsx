import { useState, useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  productName: string;
  periodName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmationModal({ 
  isOpen, 
  productName, 
  periodName,
  onClose, 
  onConfirm 
}: DeleteConfirmationModalProps) {
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDeleting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content Card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden animate-scale-up">
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center text-red-500 dark:text-red-400">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Hapus Data Penjualan?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Apakah Anda yakin ingin menghapus data penjualan <span className="font-semibold text-slate-800 dark:text-slate-200">"{productName}"</span> periode <span className="font-semibold text-slate-800 dark:text-slate-200">{periodName}</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
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
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-red-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting && <Loader2 size={16} className="animate-spin" />}
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeleteConfirmationModal;
