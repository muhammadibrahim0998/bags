import {
  ShoppingBag, ShoppingCart, Calendar, Package,
  Tag, Star, MoreVertical, Eye, Edit2, Trash2, X
} from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export function ProductCard({ product, onEdit, onDelete, onView }) {
  const { getStockStatus, addToCart } = useProducts();
  const { isShopAdmin, isSuperAdmin } = useUser();
  const navigate = useNavigate();
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const menuRef = useRef(null);

  const isAdmin = isShopAdmin() || isSuperAdmin();

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowAdminMenu(false);
      }
    };
    if (showAdminMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAdminMenu]);

  const today = new Date();
  const expiryDate = product.expiryDate ? new Date(product.expiryDate) : null;
  const isExpired = expiryDate && expiryDate < today;
  const isNearExpiry = expiryDate && !isExpired && (expiryDate - today) < (15 * 24 * 60 * 60 * 1000);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="group w-full max-w-[280px] mx-auto cursor-pointer"
    >
      <div className="rich-card bg-white border-t-4 border-l-4 border-black border-b-[10px] border-r-[8px] rounded-2xl overflow-hidden flex flex-col h-auto p-3 shadow-[0_15px_35px_rgba(0,0,0,0.5)] group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.9)] group-hover:border-zinc-800 transition-all duration-300">

        {/* Compact Image: 4:3 Aspect Ratio */}
        <div className="relative aspect-[4/3] w-full bg-zinc-50 rounded-lg overflow-hidden flex items-center justify-center mb-3">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-9/12 h-9/12 object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ShoppingBag className="w-8 h-8 text-zinc-300" />
          )}

          {/* Admin Actions Trigger - Only for Admins */}
          {isAdmin && (
            <div className="absolute top-2 right-2 z-20" ref={menuRef}>
              <div className="flex items-center gap-1.5">
                <AnimatePresence>
                  {showAdminMenu && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.95 }}
                      className="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-zinc-200 p-1 rounded-xl shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); setShowAdminMenu(false); }}
                        className="p-1.5 text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-px h-3 bg-zinc-200 mx-0.5" />
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(product); setShowAdminMenu(false); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(product); setShowAdminMenu(false); }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAdminMenu(!showAdminMenu);
                  }}
                  className={`p-1.5 rounded-lg border transition-all duration-300 ${showAdminMenu
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                    : 'bg-white/90 border-zinc-200 text-zinc-600 hover:bg-white hover:border-zinc-300 shadow-sm'
                    }`}
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Badges & Overlays */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {product.stock > 0 && product.stock <= product.minStock && (
              <div className="bg-amber-50/90 text-amber-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-amber-200/50 shadow-sm backdrop-blur-sm">
                Low Stock
              </div>
            )}
            {product.stock === 0 && (
              <div className="bg-rose-50/90 text-rose-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-rose-200/50 shadow-sm backdrop-blur-sm">
                Sold Out
              </div>
            )}
          </div>

          {!showAdminMenu && (
            <div className={`absolute ${isAdmin ? 'bottom-2 right-2' : 'top-2 right-2'} bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md border border-zinc-100 shadow-sm z-10 transition-all`}>
              <span className="text-xs font-bold text-zinc-900">Rs.{product.price}</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col space-y-3">
          <div className="mb-0">
            <h3 className="text-[13px] font-bold text-zinc-900 pb-0 line-clamp-1 leading-tight">{product.name}</h3>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              ))}
              <Star className="w-2.5 h-2.5 fill-zinc-200 text-zinc-200" />
            </div>
          </div>

          {/* Consolidated Metadata Grid */}
          <div className="grid grid-cols-2 gap-x-2 border-t border-zinc-50 pt-1">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Expiry</span>
              <div className="flex items-center gap-1">
                <Calendar className={`w-2.5 h-2.5 ${isExpired ? 'text-red-500' : isNearExpiry ? 'text-amber-500' : 'text-zinc-400'}`} />
                <span className="text-[10px] font-medium text-zinc-800">{formatDate(expiryDate)}</span>
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Stock</span>
              <div className="flex items-center gap-1">
                <Package className={`w-2.5 h-2.5 ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`} />
                <span className="text-[10px] font-medium text-zinc-800">{product.stock} pcs</span>
              </div>
            </div>
          </div>

          {/* Condition Badge */}
          <div className="flex items-center gap-2 bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
            <Tag className="w-2.5 h-2.5 text-green-" />
            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-tight truncate">{status.label}</span>
          </div>

          {/* Compact Primary Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.stock > 0) addToCart(product);
            }}
            disabled={product.stock === 0}
            className={`w-full py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-[0.1em] transition-all duration-300 flex items-center justify-center gap-2
              ${product.stock > 0
                ? 'bg-[#2D5A27] hover:bg-[#1B3817] text-white border-t border-b-4 border-[#12290D] shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_15px_rgba(0,0,0,0.3)] active:translate-y-[2px] active:border-b-0'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'}`}
          >
            {product.stock > 0 ? (
              <><ShoppingCart className="w-3.5 h-3.5" /> Add To Cart</>
            ) : (
              'Out of Stock'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}