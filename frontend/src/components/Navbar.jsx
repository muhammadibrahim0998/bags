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
  const shopName = settings?.shopName || 'NexFlow';
  const logoUrl = settings?.logoUrl || null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#2D5A27]/90 backdrop-blur-md border-b border-green-800/50 shadow-md transition-all duration-300">
      <div className="flex items-center justify-between h-20 gap-4 px-6 max-w-[1600px] mx-auto">

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
              className="p-2.5 -ml-2 text-white/90 hover:text-white hover:bg-white/15 rounded-full transition-all shadow-md border border-white/10"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

          <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => navigate('/store')}>
            <div className="relative bg-[#1B3817] rounded-full w-12 h-12 flex items-center justify-center shrink-0 shadow-[0_8px_15px_rgba(0,0,0,0.4)] overflow-hidden border-2 border-white/40 ring-2 ring-black/20">
              {logoUrl ? (
                <img src={logoUrl} alt={shopName} className="w-full h-full object-cover" />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
                </svg>
              )}
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white hidden md:block uppercase italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{shopName}</h1>
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
              className="w-full bg-white/90 backdrop-blur-sm rounded-full py-3 flex items-center pl-6 pr-14 text-sm font-black text-gray-800 placeholder:text-gray-400 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all shadow-[inset_0_2px_6px_rgba(0,0,0,0.15),_0_10px_20px_rgba(0,0,0,0.25)] border-b-4 border-gray-300"
            />
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1B3817] hover:bg-[#12290D] text-white p-2 rounded-full transition-all shadow-[0_5px_10px_rgba(0,0,0,0.4)] hover:scale-110 active:scale-95 active:shadow-none flex items-center justify-center border-t border-white/30"
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
              <button onClick={onShiftClick} className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full border-t border-white/20 border-b-4 border-[#12290D] bg-[#1B3817] hover:bg-[#0C1D08] transition-all group shadow-[0_8px_15px_rgba(0,0,0,0.3)] hover:scale-105 active:translate-y-[2px] active:border-b-0 active:shadow-inner">
                <div className={`w-2.5 h-2.5 rounded-full ${currentSession ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]'}`} />
                <span className="text-xs font-black text-white uppercase tracking-widest">
                  {currentSession?.shiftType || 'No Active Shift'}
                </span>
              </button>

              <div className="h-8 w-px bg-white/30 mx-1 hidden sm:block"></div>

              <button onClick={onCartClick} className="relative p-3 bg-[#1B3817] hover:bg-[#0C1D08] text-white rounded-full transition-all border-t border-white/20 border-b-4 border-[#12290D] shadow-[0_8px_15px_rgba(0,0,0,0.3)] hover:scale-110 active:translate-y-[2px] active:border-b-0 active:shadow-inner">
                <ShoppingCart className="w-5 h-5 shadow-sm" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-black h-5.5 w-5.5 rounded-full flex items-center justify-center border-2 border-[#1B3817] shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    {cartCount}
                  </span>
                )}
              </button>
            </>
          )}

          <div className="flex items-center gap-3 pl-4 border-l border-white/30 ml-1 h-12">
            <div className="hidden md:flex flex-col items-end justify-center">
              <span className="text-sm font-black text-white leading-none drop-shadow-lg">{user?.fullName}</span>
              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest mt-1.5">{user?.role?.replace('_', ' ')}</span>
            </div>
            <button onClick={logout} className="p-3 bg-[#1B3817] hover:bg-rose-700 text-white rounded-full transition-all border-t border-white/20 border-b-4 border-[#12290D] hover:border-rose-900 shadow-[0_8px_15px_rgba(0,0,0,0.3)] hover:scale-110 active:translate-y-[2px] active:border-b-0 active:shadow-inner">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}