import { useState, useMemo } from 'react';
import { Search, Loader2, Calendar, Trash2 } from 'lucide-react';
import type { SalesRecord } from '../hooks/useSales';

export interface SalesTableProps {
  sales: SalesRecord[];
  loading: boolean;
  onDelete: (record: SalesRecord) => void;
}

export function SalesTable({ sales, loading, onDelete }: SalesTableProps) {
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

  // Filter sales list based on product name or SKU search
  const filteredSales = useMemo(() => {
    return sales.filter((record) => {
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
  }, [sales, searchQuery]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Search Bar & Stats */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Cari Produk, SKU, atau periode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
          />
        </div>
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Menampilkan <span className="text-slate-800 dark:text-slate-200">{filteredSales.length}</span> rekap penjualan
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 size={36} className="text-cyan-500 animate-spin" />
            <p className="text-slate-400 font-medium text-sm">Memuat riwayat penjualan...</p>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <Calendar size={48} className="text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-medium">Belum ada data penjualan historis.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6 w-16 text-center">No</th>
                <th className="py-4 px-6 w-32">SKU</th>
                <th className="py-4 px-6">Nama Produk</th>
                <th className="py-4 px-6 w-44">Periode</th>
                <th className="py-4 px-6 w-36 text-center">Qty Terjual</th>
                <th className="py-4 px-6 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredSales.map((record, index) => (
                <tr 
                  key={record.id} 
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors text-sm"
                >
                  <td className="py-4 px-6 text-center font-medium text-slate-400 dark:text-slate-500">
                    {index + 1}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs tracking-wider">
                      {record.products?.sku || '-'}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-200">
                    {record.products?.nama || 'Produk Terhapus'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 font-medium">
                      <Calendar size={14} className="text-cyan-500" />
                      <span>{`${getMonthName(record.bulan)} ${record.tahun}`}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-slate-900 dark:text-white">
                    {`${record.qty_sold.toLocaleString('id-ID')} `}
                    <span className="text-xs font-semibold text-slate-400">
                      {record.products?.unit || ''}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => onDelete(record)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 rounded-lg transition-colors"
                        title="Hapus Data"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
export default SalesTable;
