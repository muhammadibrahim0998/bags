import React from 'react';
import { Search, ShoppingCart, Download, LogOut, TrendingUp, Menu, Store } from 'lucide-react';
import { useShift } from '../contexts/ShiftContext';
import { useUser } from '../contexts/UserContext';
import { useSettings } from '../contexts/SettingsContext';
import { useProducts } from '../contexts/ProductContext';

export function Navbar({
  cartCount,
  onCartClick,
  onExport,
  onShiftClick,
  dailySales,
  dailyProfit,
  onMenuClick,
  user
}) {
  const { currentSession } = useShift();
  const { logout, isSuperAdmin, isShopAdmin } = useUser();
  const { settings } = useSettings();
  const { searchTerm, setSearchTerm } = useProducts();
  const fmt = (n) => `${settings.currency || 'Rs.'} ${(n || 0).toLocaleString('en-PK')}`;
  const shopName = settings?.shopName || 'NexFlow';
  const logoUrl = settings?.logoUrl || null;

  return (
    <nav className="sticky top-0 z-50 w-full glass-light border-b border-zinc-200/50 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between h-16 gap-4 px-6 max-w-[1600px] mx-auto">

        {/* Left: Branding & Search */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative bg-blue-600 rounded-xl w-9 h-9 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105 overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={shopName} className="w-full h-full object-cover" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
                </svg>
              )}
            </div>
            <h1 className="text-lg font-black tracking-tighter text-zinc-900 hidden xl:block uppercase italic">{shopName}</h1>
          </div>

          {!isSuperAdmin() && (
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products or categories..."
                className="w-[200px] lg:w-[260px] bg-zinc-100/80 border border-zinc-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-blue-500 transition-all outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 text-xs font-bold">✕</button>
              )}
            </div>
          )}
        </div>

        {/* Center: Live Stats Pill */}
        {!isSuperAdmin() && !isShopAdmin() && (
          <div className="hidden lg:flex items-center bg-white border border-zinc-200 rounded-full p-1 shadow-sm">
            <div className="flex items-center gap-4 px-4 py-1">
              <div className="flex flex-col">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Today's Sales</span>
                <span className="text-xs font-black text-zinc-900 mt-0.5">{fmt(dailySales)}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px] text-emerald-700 font-bold">+{fmt(dailyProfit)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button onClick={onShiftClick} className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-all">
            <div className={`w-1.5 h-1.5 rounded-full ${currentSession ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`} />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {currentSession?.shiftType || 'No Active Shift'}
            </span>
          </button>

          <div className="h-6 w-px bg-zinc-200 mx-1 hidden sm:block"></div>

          <button onClick={onCartClick} className="relative p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 active:scale-95">
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-zinc-900 text-white text-[9px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 ml-1">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-zinc-900 leading-none">{user?.fullName}</span>
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter mt-1">{user?.role?.replace('_', ' ')}</span>
            </div>
            <button onClick={logout} className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}