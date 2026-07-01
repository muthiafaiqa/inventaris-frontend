import { useState } from 'react';
import { Search, Loader2, Calendar, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SalesRecord } from '../hooks/useSales';

export interface SalesTableProps {
  sales: SalesRecord[];
  loading: boolean;
  onDelete: (record: SalesRecord) => void;
  page: number;
  onPageChange: (page: number) => void;
}

export function SalesTable({ 
  sales, 
  loading, 
  onDelete,
  page,
  onPageChange
}: SalesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter sales list based on product name or SKU search (applied to the current page's records)
  const filteredSales = sales.filter((record) => {
    const query = searchQuery.toLowerCase();
    const productNama = record.products?.nama.toLowerCase() || '';
    const productSku = record.products?.sku.toLowerCase() || '';
    const monthName = getMonthName(record.bulan).toLowerCase();
    const yearStr = record.tahun.toString();

    return (
      productNama.includes(query) ||
      productSku.includes(query) ||
      monthName.includes(query) ||
      yearStr.includes(query)
    );
  });

  const isPreviousDisabled = page === 1 || loading;
  const isNextDisabled = sales.length < 10 || loading;

  const handlePrevPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (sales.length === 10) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-none border border-slate-300 dark:border-slate-800 overflow-hidden">
      {/* Search Bar & Stats */}
      <div className="p-3.5 border-b border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Cari Produk, SKU, atau periode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors text-xs"
          />
        </div>
        <div className="text-[10px] font-bold font-mono tracking-wider text-slate-450 dark:text-slate-500 uppercase">
          PAGE RECORD COUNT: <span className="text-slate-900 dark:text-slate-200">{filteredSales.length}</span> / {sales.length}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-2">
            <Loader2 size={24} className="text-slate-400 dark:text-slate-500 animate-spin" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">LOADING RECORD DATA...</p>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
            <Calendar size={32} className="text-slate-300 dark:text-slate-700" />
            <p className="text-[10px] font-mono uppercase tracking-wider">NO RECORDS FOUND</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-[11px] font-mono">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider border-b border-slate-300 dark:border-slate-800">
                <th className="py-2.5 px-4 w-16 text-center">NO</th>
                <th className="py-2.5 px-4 w-32">SKU</th>
                <th className="py-2.5 px-4 font-sans">NAMA PRODUK</th>
                <th className="py-2.5 px-4 w-44">PERIODE</th>
                <th className="py-2.5 px-4 w-32 text-right">QTY SOLD</th>
                <th className="py-2.5 px-4 w-20 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
              {filteredSales.map((record, index) => {
                const absoluteIndex = (page - 1) * 10 + index + 1;
                return (
                  <tr 
                    key={record.id} 
                    className="hover:bg-slate-50/[0.4] dark:hover:bg-slate-950/20 transition-colors duration-200 text-xs"
                  >
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-400 dark:text-slate-500">
                      {absoluteIndex.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {record.products?.sku || '-'}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {record.products?.nama || 'Produk Terhapus'}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 font-medium">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{`${getMonthName(record.bulan)} ${record.tahun}`}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {record.qty_sold.toLocaleString('id-ID')}{' '}
                      <span className="text-[9px] font-sans font-semibold text-slate-400 uppercase tracking-wider">
                        {record.products?.unit || ''}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => onDelete(record)}
                          className="p-1.5 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-300 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
        <button
          onClick={handlePrevPage}
          disabled={isPreviousDisabled}
          className="flex items-center space-x-1 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold px-2.5 py-1 border border-slate-300 dark:border-slate-800 rounded-none transition-colors duration-200 ease-in-out text-[10px] uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={12} />
          <span>PREV</span>
        </button>
        
        <span className="text-[10px] font-bold font-mono tracking-[0.2em] text-slate-450 dark:text-slate-500 uppercase">
          PAGE {page}
        </span>

        <button
          onClick={handleNextPage}
          disabled={isNextDisabled}
          className="flex items-center space-x-1 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold px-2.5 py-1 border border-slate-300 dark:border-slate-800 rounded-none transition-colors duration-200 ease-in-out text-[10px] uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>NEXT</span>
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
export default SalesTable;
