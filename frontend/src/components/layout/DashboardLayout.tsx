import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  History, 
  TrendingUp, 
  LogOut, 
  User, 
  Menu, 
  X 
} from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };


  const navItems = [
    { name: 'Ringkasan', path: '/', icon: LayoutDashboard },
    { name: 'Master Produk', path: '/products', icon: Package },
    { name: 'Historis Penjualan', path: '/sales', icon: History },
    { name: 'Peramalan Stok', path: '/forecasting', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white flex items-center justify-between px-4 py-4 border-b border-slate-800">
        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Surya Elektrik
        </span>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1 hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 min-h-screen">
        <div className="p-6 border-b border-slate-800">
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Surya Elektrik
          </span>
          <p className="text-xs text-slate-500 mt-1">Sistem Inventaris v1.0</p>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                  : 'hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer / User Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <User size={18} className="text-cyan-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate" title={user?.email || 'Administrator'}>
                {user?.email ? user.email.split('@')[0] : 'Administrator'}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'Admin Utama'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-950/30 hover:bg-red-900/40 border border-red-900/30 hover:border-red-800/40 text-red-400 text-sm font-medium rounded-xl transition-all"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-slate-900 text-slate-300 h-full shadow-2xl z-50 animate-slide-in">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Surya Elektrik
              </span>
              <button onClick={() => setIsMobileOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                      : 'hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <item.icon size={20} />
                  <span className="font-medium text-sm">{item.name}</span>
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <User size={18} className="text-cyan-400" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate" title={user?.email || 'Administrator'}>
                    {user?.email ? user.email.split('@')[0] : 'Administrator'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || 'Admin Utama'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-950/30 hover:bg-red-900/40 border border-red-900/30 hover:border-red-800/40 text-red-400 text-sm font-medium rounded-xl transition-all"
              >
                <LogOut size={16} />
                <span>Keluar</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header - Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Sistem Inventaris & Peramalan Toko Surya Elektrik
          </span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Koneksi API Aktif</span>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-6 md:p-8 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
