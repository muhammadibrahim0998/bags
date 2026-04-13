import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    <nav className="sticky top-0 z-50 w-full bg-blue-500 border-b border-blue-600 shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between h-16 gap-4 px-6 max-w-[1600px] mx-auto">

        {/* Left: Branding & Search */}
        <div className="flex items-center gap-4 lg:gap-6 flex-1 md:flex-none relative">
          {!isSearchExpanded && (
            <button
              onClick={onMenuClick}
              className="p-2 -ml-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all md:hidden"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          <div className={`flex items-center gap-3 group cursor-pointer ${isSearchExpanded ? 'hidden md:flex' : 'flex'}`} onClick={() => navigate('/store')}>
            <div className="relative bg-blue-600 rounded-xl w-9 h-9 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105 overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={shopName} className="w-full h-full object-cover" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
                </svg>
              )}
            </div>
            <h1 className="text-lg font-black tracking-tighter text-white hidden xl:block uppercase italic">{shopName}</h1>
          </div>

          <div className={`relative group ${isSearchExpanded ? 'flex-1 md:flex-none' : 'hidden md:block'}`}>
            <Search
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-white transition-colors cursor-pointer md:cursor-default ${!isSearchExpanded ? 'md:block' : ''}`}
              onClick={() => {
                if (!isSearchExpanded) {
                  setIsSearchExpanded(true);
                  onSearchToggle?.(true);
                }
              }}
            />
            <input
              type="text"
              value={searchTerm}
              autoFocus={isSearchExpanded}
              onBlur={() => {
                if (!searchTerm) {
                  setIsSearchExpanded(false);
                  onSearchToggle?.(false);
                }
              }}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value && location.pathname.includes('/category/')) {
                  navigate('/store');
                }
              }}
              placeholder={isSuperAdmin() ? "Search shops..." : "Search inventory..."}
              className={`transition-all duration-300 outline-none bg-blue-700/60 backdrop-blur-sm border border-white/30 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder:text-white/70 focus:bg-blue-700/80 focus:border-white/50 
                ${isSearchExpanded ? 'w-full scale-x-100 opacity-100' : 'w-0 md:w-[200px] lg:w-[280px] scale-x-0 md:scale-x-100 opacity-0 md:opacity-100'}`}
            />
            {(searchTerm || isSearchExpanded) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setIsSearchExpanded(false);
                  onSearchToggle?.(false);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs font-bold transition-all px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dedicated Search Icon Trigger for Mobile (when not expanded) */}
          {!isSearchExpanded && (
            <button
              onClick={() => {
                setIsSearchExpanded(true);
                onSearchToggle?.(true);
              }}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Center: Live Stats Pill */}
        {!isSuperAdmin() && !isShopAdmin() && (
          <div className="hidden lg:flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 px-3 gap-4 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[9px] text-white/60 font-black uppercase tracking-widest leading-none">Today's Sales</span>
              <span className="text-xs font-black text-white mt-1">{fmt(dailySales)}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-xl border transition-colors ${dailyProfit > 0 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100' : 'bg-white/10 border-white/5 text-white'}`}>
              <TrendingUp className={`w-3 h-3 ${dailyProfit > 0 ? 'text-emerald-400' : 'text-white'}`} />
              <span className="text-[10px] font-black">+{fmt(dailyProfit)}</span>
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {!isSuperAdmin() && (
            <>
              <button onClick={onShiftClick} className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all group">
                <div className={`w-2 h-2 rounded-full ${currentSession ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]'}`} />
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest group-hover:text-white transition-colors">
                  {currentSession?.shiftType || 'No Active Shift'}
                </span>
              </button>

              <div className="h-6 w-px bg-blue-400/30 mx-1 hidden sm:block"></div>

              <button onClick={onCartClick} className="relative p-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-md shadow-white/10 active:scale-95">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-zinc-900 text-white text-[9px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 border-blue-500">
                    {cartCount}
                  </span>
                )}
              </button>
            </>
          )}

          <div className="flex items-center gap-3 pl-4 border-l border-white/10 ml-1 h-10">
            <div className="hidden md:flex flex-col items-end justify-center">
              <span className="text-xs font-black text-white leading-none">{user?.fullName}</span>
              <span className="text-[9px] font-black text-white/60 uppercase tracking-widest mt-1">{user?.role?.replace('_', ' ')}</span>
            </div>
            <button onClick={logout} className="p-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}