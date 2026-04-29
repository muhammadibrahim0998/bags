import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Download, LogOut, TrendingUp, Menu, Store } from 'lucide-react';
import { useShift } from '../contexts/ShiftContext';
import { useUser } from '../contexts/UserContext';
import { useSettings } from '../contexts/SettingsContext';
import { useProducts } from '../contexts/ProductContext';

export function Navbar({
  isCollapsed,
  onToggleSidebar,
  cartCount,
  onCartClick,
  onAddProduct,
  onNewSale,
  onExport,
  onShiftClick,
  dailySales,
  monthlySales,
  yearlySales,
  dailyProfit,
  monthlyProfit,
  yearlyProfit,
  onMenuClick,
  onSearchToggle,
  user
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSession } = useShift();
  const { logout, isSuperAdmin, isShopAdmin } = useUser();
  const { settings } = useSettings();
  const { searchTerm, setSearchTerm } = useProducts();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const fmt = (n) => `${settings.currency || 'Rs.'} ${(n || 0).toLocaleString('en-PK')}`;
  const shopName = settings?.shopName || 'Bags Shop';
  const logoUrl = settings?.logoUrl || null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#09090b] backdrop-blur-md border-b border-white/10 shadow-[0_4px_20px_rgba(255,255,255,0.05)] transition-all duration-300">
      <div className="flex items-center justify-between h-20 gap-2 sm:gap-4 px-4 sm:px-6 max-w-[1600px] mx-auto">

        {/* Left: Branding */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (window.innerWidth >= 768) {
                if (onToggleSidebar) onToggleSidebar();
              } else {
                if (onMenuClick) onMenuClick();
              }
            }}
            className="p-3 bg-blue-600 hover:bg-orange-500 text-white rounded-full transition-all border-t border-white/20 border-b-4 border-black/40 shadow-[0_8px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)] hover:scale-110 active:translate-y-[2px] active:border-b-0 shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => navigate('/store')}>
            <div className="relative bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center shrink-0 border-t border-white/20 border-b-4 border-black/40 shadow-[0_8px_15px_rgba(37,99,235,0.3)] overflow-hidden group-hover:bg-orange-500 transition-all">
              {logoUrl ? (
                <img src={logoUrl} alt={shopName} className="w-full h-full object-cover" />
              ) : (
                <Store className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-lg font-black text-white leading-none tracking-tighter drop-shadow-md uppercase italic">{shopName}</h1>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1 drop-shadow">Inventory Hub</span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 flex justify-center max-w-sm mx-auto">
          <div className="relative w-full group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value && location.pathname.includes('/category/')) {
                  navigate('/store');
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate('/store');
                }
              }}
              placeholder={isSuperAdmin() ? "Search shops..." : "Search inventory..."}
              className="w-full bg-white border border-zinc-200 rounded-full py-3 flex items-center pl-6 pr-14 text-sm font-bold text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-orange-500 text-white p-2.5 rounded-full transition-all shadow-[0_5px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_5px_15px_rgba(249,115,22,0.4)] hover:scale-110 active:scale-95 flex items-center justify-center border-t border-white/30"
              onClick={() => {
                if (searchTerm) navigate('/store');
              }}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {!isSuperAdmin() && (
            <>
              <button onClick={onShiftClick} className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full border-t border-white/20 border-b-4 bg-blue-600 hover:bg-orange-500 transition-all group shadow-[0_8px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)] hover:scale-105 active:translate-y-[2px] active:border-b-0">
                <div className={`w-2.5 h-2.5 rounded-full ${currentSession ? 'bg-white animate-pulse' : 'bg-orange-200 animate-pulse'}`} />
                <span className="text-xs font-black text-white uppercase tracking-widest">
                  {currentSession?.shiftType || 'No Active Shift'}
                </span>
              </button>

              <div className="h-8 w-px bg-white/30 mx-1 hidden sm:block"></div>

              <button onClick={onCartClick} className="relative p-3 bg-blue-600 hover:bg-orange-500 text-white rounded-full transition-all border-t border-white/20 border-b-4 border-black/40 shadow-[0_8px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)] hover:scale-110 active:translate-y-[2px] active:border-b-0">
                <ShoppingCart className="w-5 h-5 shadow-sm" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black h-5.5 w-5.5 rounded-full flex items-center justify-center border-2 border-blue-600 shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
            </>
          )}

          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-white/30 ml-1 h-12">
            <div className="hidden md:flex flex-col items-end justify-center">
              <span className="text-sm font-black text-white leading-none drop-shadow-lg">{user?.fullName}</span>
              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest mt-1.5">{user?.role?.replace('_', ' ')}</span>
            </div>
            <button onClick={logout} className="p-3 bg-blue-600 hover:bg-red-600 text-white rounded-full transition-all border-t border-white/20 border-b-4 border-black/40 shadow-[0_8px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_20px_rgba(220,38,38,0.4)] hover:scale-110 active:translate-y-[2px] active:border-b-0">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}