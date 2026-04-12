import React from 'react';
import { ShoppingBag, ShoppingCart, Calendar, Package, Tag, Star } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function ProductCard({ product }) {
  const { getStockStatus, addToCart } = useProducts();
  const navigate = useNavigate();
  const status = getStockStatus(product.stock, product.minStock);

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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="group w-full max-w-[280px] mx-auto cursor-pointer"
    >
      <div className="rich-card bg-white border border-zinc-100 rounded-xl overflow-hidden flex flex-col h-auto p-3 shadow-rich hover:shadow-float transition-all duration-300">

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

          {/* Price & Low Stock Overlays */}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md border border-zinc-100 shadow-sm">
            <span className="text-xs font-bold text-zinc-900">Rs.{product.price}</span>
          </div>
          {product.stock > 0 && product.stock <= product.minStock && (
            <div className="absolute top-2 left-2 bg-amber-50/90 text-amber-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-amber-200/50">
              Low Stock
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col space-y-3">
          <div>
            <h3 className="text-[13px] font-bold text-zinc-900 line-clamp-1 leading-tight">{product.name}</h3>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              ))}
              <Star className="w-2.5 h-2.5 fill-zinc-200 text-zinc-200" />
            </div>
          </div>

          {/* Consolidated Metadata Grid */}
          <div className="grid grid-cols-2 gap-x-2 border-t border-zinc-50 pt-2.5">
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
          <div className="flex items-center gap-2 bg-zinc-50 px-2 py-1.5 rounded-lg border border-zinc-100">
            <Tag className="w-2.5 h-2.5 text-blue-600" />
            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-tight truncate">{status.label}</span>
          </div>

          {/* Compact Primary Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.stock > 0) addToCart(product);
            }}
            disabled={product.stock === 0}
            className={`w-full py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2
              ${product.stock > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-600/10'
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