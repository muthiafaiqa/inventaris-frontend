import { useState, useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  productName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmationModal({ 
  isOpen, 
  productName, 
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
      <div className="relative bg-white dark:bg-slate-900 rounded-none w-full max-w-sm border border-slate-300 dark:border-slate-800 z-10 overflow-hidden">
        <div className="p-5 text-center space-y-3">
          <div className="mx-auto w-10 h-10 bg-red-500/5 text-red-600 dark:text-red-500 rounded-none flex items-center justify-center border border-red-500/20">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              KONFIRMASI PENGHAPUSAN
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus produk <span className="font-bold text-slate-800 dark:text-slate-200">"{productName}"</span>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </p>
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
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 border border-red-600 rounded-none transition-colors text-[10px] uppercase tracking-wider disabled:opacity-40"
          >
            {deleting && <Loader2 size={12} className="animate-spin" />}
            <span>HAPUS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeleteConfirmationModal;
