import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Plus, Minus } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { motion, AnimatePresence } from 'framer-motion';

export function CartModal({ isOpen, onClose, onCheckout }) {
  const { cart, products, addToCart, removeFromCart: onRemove, clearCart: onClear, updateQuantity: onUpdateQuantity } = useProducts();
  const [customerName, setCustomerName] = React.useState('');

  if (!isOpen) return null;

  const total = (cart || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full sm:w-[420px] h-full bg-white border-l border-zinc-200 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-black tracking-tighter uppercase italic">Sales Cart</h2>
              <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">{cart.length} Units Staged</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-900">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 premium-scrollbar bg-zinc-50/30">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-20">
              <ShoppingBag className="w-12 h-12 mb-2" />
              <p className="text-xs font-black uppercase tracking-widest">Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="flex gap-4 p-4 bg-white border border-zinc-300 rounded-2xl group transition-all shadow-sm hover:shadow-md hover:border-blue-400">
                <div className="w-16 h-16 bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-zinc-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-black text-black truncate uppercase tracking-tighter mb-0.5">{item.name}</h4>
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Quantity: {item.quantity}</p>
                    </div>
                    <button onClick={() => onRemove(item.productId)} className="p-1.5 bg-zinc-100 hover:bg-rose-500 hover:text-white text-zinc-400 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, -1, 999)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-black disabled:opacity-20 transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-[11px] font-black text-black w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, 1, item.stock)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-black disabled:opacity-20 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-base font-black text-blue-700 font-mono tracking-tighter">Rs.{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t-2 border-zinc-200 space-y-6">
            {/* Customer Name Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-black uppercase tracking-widest pl-1">Customer Identifier</label>
              <input
                type="text"
                placeholder="Ex: Walk-in Customer / Ali Khan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-zinc-50 border-2 border-zinc-200 focus:border-blue-600 rounded-xl py-3.5 px-4 text-sm font-black text-black placeholder:text-zinc-400 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] font-black text-black uppercase tracking-widest">Grand Total</span>
              <div className="text-right">
                <span className="block text-3xl font-black text-black tracking-tighter leading-none">Rs. {total.toLocaleString()}</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 block">All taxes included</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClear}
                className="px-4 py-4 text-[11px] font-black text-zinc-500 hover:text-rose-600 uppercase tracking-widest transition-colors"
              >
                Reset Cart
              </button>
              <button
                onClick={() => {
                  onCheckout(customerName);
                  setCustomerName(''); // Reset for next sale
                }}
                className="flex-1 py-4.5 bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-95 shadow-[0_12px_24px_rgba(37,99,235,0.3)] border-t border-white/20"
              >
                Complete Sale
                <ArrowRight className="w-5 h-5 opacity-90" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
