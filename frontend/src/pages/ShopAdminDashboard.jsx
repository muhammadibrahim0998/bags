import { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { AnalyticsCards } from '../components/AnalyticsCards';
import { RevenueCards } from '../components/RevenueCards';
import { InventoryTable } from '../components/InventoryTable';
import { SalesHistory } from '../components/SalesHistory';
import { LowStockBanner } from '../components/LowStockBanner';
import { TeamManagement } from '../components/TeamManagement';
import { ShiftHistory } from '../components/ShiftHistory';
import { useUser } from '../contexts/UserContext';
import { Users, LayoutDashboard, Plus, History } from 'lucide-react';
import { IntelligenceFeed } from '../components/IntelligenceFeed';
import { UpdateBanner } from '../components/UpdateBanner';

export function ShopAdminDashboard({
  onAddProduct, onEditProduct, onDeleteProduct, onViewProduct, onExport,
  onEditSale, onDeleteSale, onReturnSale, onViewSale,
  dailySales, monthlySales, yearlySales, dailyProfit, monthlyProfit, yearlyProfit
}) {
  const [activeTab, setActiveTab] = useState('inventory');
  const { user, isShopAdmin } = useUser();

  const {
    products, loading,
    sales, getStockStatus
  } = useProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-[var(--color-background)] min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Calculate top level sums directly from products state for AnalyticsCards
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8 animate-in fade-in duration-700 bg-[var(--color-background)] min-h-screen text-[var(--color-text-primary)]">

      {/* Premium Update Banner */}
      <UpdateBanner />

      {/* Main Overview Section - Upgraded with @container and Premium Tokens */}
      <div className="@container mb-10 flex flex-col @md:flex-row @md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            {/* The "Branding" accent bar */}
            <div className="w-2.5 h-12 bg-[var(--color-primary)] rounded-full shadow-sm"></div>
            <h2 className="text-4xl @lg:text-5xl font-black tracking-tighter leading-none text-[var(--color-text-primary)]">
              Business Overview
            </h2>
          </div>
          <p className="text-[var(--color-text-secondary)] font-bold pl-6 max-w-2xl leading-relaxed text-sm uppercase tracking-tight">
            Real-time summary of your inventory health, sales performance, and recent activity levels.
          </p>
        </div>
      </div>

      {/* Tab Switcher & Actions - Upgraded with Glassmorphism feel */}
      {isShopAdmin() && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 w-full animate-in slide-in-from-left-4">
          <div className="flex items-center gap-2 bg-[var(--color-surface-card)] p-2 rounded-xl border border-[var(--color-border-subtle)] shadow-sm overflow-x-auto w-full md:w-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.15em] transition-all ${activeTab === 'inventory'
                ? 'bg-green-600 text-[var(--color-text-primary)] shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Inventory & Sales
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.15em] transition-all ${activeTab === 'team'
                ? 'bg-green-600 text-[var(--color-text-primary)] shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
            >
              <Users className="w-3.5 h-3.5" />
              Team Management
            </button>
            <button
              onClick={() => setActiveTab('shifts')}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.15em] transition-all ${activeTab === 'shifts'
                ? 'bg-green-600 text-[var(--color-text-primary)] shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
            >
              <History className="w-3.5 h-3.5" />
              Shift Records
            </button>
          </div>

          <button
            onClick={onAddProduct}
            className="btn-primary flex justify-center items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap w-full sm:w-auto self-start sm:self-auto group"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            Add Product
          </button>
        </div>
      )}

      {/* Logic Branching (Kept exactly as provided) */}
      {activeTab === 'team' && isShopAdmin() ? (
        <TeamManagement />
      ) : activeTab === 'shifts' && isShopAdmin() ? (
        <ShiftHistory />
      ) : (
        <>
          <RevenueCards
            dailySales={dailySales}
            monthlySales={monthlySales}
            yearlySales={yearlySales}
            dailyProfit={dailyProfit}
            monthlyProfit={monthlyProfit}
            yearlyProfit={yearlyProfit}
          />

          <IntelligenceFeed products={products} />

          <AnalyticsCards
            totalProducts={products.length}
            totalValue={totalValue}
            lowStockProducts={products.filter(p => p.stock > 0 && p.stock <= p.minStock)}
            outOfStockProducts={products.filter(p => p.stock === 0)}
          />


          {/* Vertical Stack: Table & Activity - Upgraded spacing and card containers */}
          <div className="flex flex-col gap-12 mt-10">

            {/* Inventory Table Section */}
            <section id="inventory-table" className="w-full space-y-6">
              <div className="flex items-center gap-3 px-2">
                <div className="w-2 h-7 bg-green-600/30 rounded-full"></div>
                <h3 className="text-2xl font-black text-[var(--color-text-primary)] uppercase tracking-[0.2em]">Global Inventory</h3>
              </div>
              <div className="rich-card overflow-hidden">
                <InventoryTable
                  onEdit={onEditProduct}
                  onDelete={onDeleteProduct}
                  onView={onViewProduct}
                  onExport={onExport}
                />
              </div>
            </section>

            {/* Recent Activity Section */}
            <section className="w-full space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[var(--color-text-primary)] uppercase tracking-[0.2em]">Recent Shop Activity</h3>
                  <p className="text-[10px] text-green-600 font-black tracking-[0.4em] uppercase">SYNCED WITH CLOUD</p>
                </div>
              </div>
              <div className="rich-card overflow-hidden">
                <SalesHistory
                  sales={sales}
                  handleDeleteSale={onDeleteSale}
                  openEditSaleModal={onEditSale}
                  onReturnSale={onReturnSale}
                  onViewSale={onViewSale}
                  onExport={onExport}
                />
              </div>
            </section>
          </div>
        </>
      )}

    </div>
  );
}
