import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import CreatableSelect from 'react-select/creatable';
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../schemas/productSchema";
import { X, Plus, Upload, Loader2, Trash2, AlertCircle, ShoppingBag, ShieldCheck, Calendar, Link as LinkIcon, Star } from "lucide-react";
import { uploadImages } from "../services/api";

export function ProductModal({ isOpen, onClose, onSave, product, mode, categories = [] }) {
  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "", category: "", stock: 0, minStock: 0, price: 0, costPrice: 0,
      images: [], description: "", mfgDate: "", expiryDate: ""
    }
  });

  const [uploading, setUploading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const fileInputRef = useRef(null);

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (images.length >= 5) return;
    const url = imageUrlInput.trim();
    if (!url.startsWith('http')) return; // Basic validation
    setValue("images", [...images, url]);
    setImageUrlInput("");
    if (images.length === 0) setSelectedImageIndex(0);
  };

  const images = watch("images") || [];
  const currentCategory = watch("category");

  // Sync form with product prop
  useEffect(() => {
    if (isOpen) {
      if (product && mode !== "add") {
        reset({
          name: product.name || "",
          category: product.category || "",
          stock: product.stock || 0,
          minStock: product.minStock || 0,
          price: product.price || 0,
          costPrice: product.costPrice || 0,
          images: product.images || [],
          description: product.description || "",
          mfgDate: product.mfgDate ? new Date(product.mfgDate).toISOString().split('T')[0] : "",
          expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : "",
        });
      } else {
        reset({
          name: "",
          category: product?.category || "",
          stock: 0,
          minStock: 0,
          price: 0,
          costPrice: 0,
          images: [],
          description: "",
          mfgDate: "",
          expiryDate: ""
        });
      }
      setSelectedImageIndex(0);
    }
  }, [product, mode, isOpen, categories, reset]);

  const onSubmit = (data) => {
    onSave({
      ...data,
      price: parseFloat(data.price) || 0,
      stock: parseFloat(data.stock) || 0,
      minStock: parseFloat(data.minStock) || 0,
      costPrice: parseFloat(data.costPrice) || 0,
      lastUpdated: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const newImageUrls = await uploadImages(files);
      setValue("images", [...images, ...newImageUrls].slice(0, 5));
    } catch (error) {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Container with stable width to prevent collapse */}
      <div className="relative w-[95%] sm:w-[500px] bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-hide z-10 mx-auto">

        {/* Header - Sticky */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-base)]/50 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[var(--color-primary)] rounded-xl">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight italic uppercase">
              {mode === "add" ? "New Product" : mode === "edit" ? "Edit Product" : "View Product"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-2.5 hover:bg-[var(--color-surface-base)] rounded-xl transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-8 overflow-y-auto space-y-5 sm:space-y-6 premium-scrollbar flex-1">

          {/* Main Info Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest pl-1">Product Name *</label>
              <input
                {...register("name")}
                disabled={mode === "view"}
                className={`w-full bg-[var(--color-surface-base)] border ${errors.name ? 'border-[var(--color-danger)]/50' : 'border-[var(--color-border-subtle)]'} rounded-2xl py-3.5 px-5 text-sm font-bold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]/40 focus:bg-[var(--color-surface-card)] transition-all placeholder:text-[var(--color-text-muted)]`}
                placeholder="Ex: Organic Tomatoes"
              />
              {errors.name && <p className="text-[var(--color-danger)] text-[10px] font-bold pl-1 uppercase tracking-tighter mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest pl-1">
                Category
              </label>

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    isClearable
                    isDisabled={mode === 'view'}
                    options={categories.filter(c => c !== "All").map(c => ({ value: c, label: c }))}
                    onChange={(val) => field.onChange(val ? val.value : "")}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.preventDefault();
                    }}
                    value={field.value ? { label: field.value, value: field.value } : null}
                    placeholder="Select or create..."
                    classNamePrefix="nexus-select"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: 'var(--color-surface-base)',
                        borderRadius: '1rem',
                        borderColor: errors.category ? 'rgba(244, 63, 94, 0.5)' : (state.isFocused ? 'var(--color-primary)' : 'var(--color-border-subtle)'),
                        padding: '4px',
                        fontWeight: 'bold',
                        boxShadow: state.isFocused ? '0 0 0 1px var(--color-primary)' : 'none',
                        '&:hover': { borderColor: errors.category ? 'rgba(244, 63, 94, 0.8)' : 'var(--color-primary)' }
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: 'var(--color-surface-card)',
                        borderRadius: '1rem',
                        border: '1px solid var(--color-border-subtle)',
                        overflow: 'hidden',
                        zIndex: 50
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? 'var(--color-primary-light)' : 'transparent',
                        color: 'var(--color-text-primary)',
                        fontSize: '14px',
                        cursor: 'pointer'
                      })
                    }}
                  />
                )}
              />
              {errors.category && <p className="text-rose-500 text-[10px] font-bold pl-1 uppercase mt-1">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest pl-1">Price (PKR) *</label>
              <input
                type="number"
                step="any"
                {...register("price")}
                disabled={mode === "view"}
                className={`w-full bg-[var(--color-surface-base)] border ${errors.price ? 'border-[var(--color-danger)]/50' : 'border-[var(--color-border-subtle)]'} rounded-2xl py-3.5 px-5 text-sm font-bold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]/40 focus:bg-[var(--color-surface-card)] transition-all`}
              />
              {errors.price && <p className="text-[var(--color-danger)] text-[10px] font-bold pl-1 uppercase tracking-tighter mt-1">{errors.price.message}</p>}
            </div>
          </div>

          {/* Stock Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[var(--color-surface-base)]/40 rounded-[2.5rem] border border-[var(--color-border-subtle)]">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">Current Stock</label>
              <input type="number" step="any" {...register("stock")} disabled={mode === "view"} className="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] rounded-2xl py-3 px-4 text-sm font-bold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]/40 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">Min. Alert</label>
              <input type="number" step="any" {...register("minStock")} disabled={mode === "view"} className="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] rounded-2xl py-3 px-4 text-sm font-bold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]/40 transition-all" />
            </div>
          </div>

          {/* Dates Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[var(--color-primary)]/5 rounded-[2.5rem] border border-[var(--color-primary)]/10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest pl-1">Mfg. Date</label>
              <div className="relative">
                <input id="mfgDate" type="date" {...register("mfgDate")} disabled={mode === "view"} className="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] rounded-2xl py-3 pl-4 pr-10 text-[11px] font-black text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]/40 transition-all [&::-webkit-calendar-picker-indicator]:hidden" />
                {mode !== "view" ? (
                  <button type="button" onClick={() => document.getElementById('mfgDate')?.showPicker?.()} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-all" title="Open calendar">
                    <Calendar className="w-4 h-4" />
                  </button>
                ) : (
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)] opacity-50" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--color-danger)] uppercase tracking-widest pl-1">Expiry Date</label>
              <div className="relative">
                <input id="expiryDate" type="date" {...register("expiryDate")} disabled={mode === "view"} className="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] rounded-2xl py-3 pl-4 pr-10 text-[11px] font-black text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]/40 transition-all [&::-webkit-calendar-picker-indicator]:hidden" />
                {mode !== "view" ? (
                  <button type="button" onClick={() => document.getElementById('expiryDate')?.showPicker?.()} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-lg transition-all" title="Open calendar">
                    <Calendar className="w-4 h-4" />
                  </button>
                ) : (
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-danger)] opacity-50" />
                )}
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest pl-1">Gallery ({images.length}/5)</label>
            <div className="relative aspect-video bg-[var(--color-surface-base)] rounded-[2.5rem] overflow-hidden border-2 border-dashed border-[var(--color-border-subtle)] flex items-center justify-center group/preview">
              {images.length > 0 ? (
                <img src={images[selectedImageIndex]} alt="Preview" className="w-full h-full object-contain bg-[var(--color-surface-base)]" />
              ) : (
                <div className="text-center text-[var(--color-text-muted)]">
                  <Upload className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No images yet</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <div key={idx} className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${selectedImageIndex === idx ? 'border-[var(--color-primary)] shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'border-[var(--color-border-subtle)] opacity-40 hover:opacity-100'}`} onClick={() => setSelectedImageIndex(idx)}>
                  <img src={img} className="w-full h-full object-cover" />

                  {mode !== "view" && idx !== 0 && (
                    <button type="button" title="Set as Primary Cover" onClick={(e) => {
                      e.stopPropagation();
                      const newImages = [...images];
                      const [moved] = newImages.splice(idx, 1);
                      newImages.unshift(moved);
                      setValue("images", newImages);
                      setSelectedImageIndex(0);
                    }} className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-md text-white rounded-lg p-1 shadow-2xl hover:text-amber-400 hover:scale-110 transition-all">
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {mode !== "view" && (
                    <button type="button" title="Delete Image" onClick={(e) => {
                      e.stopPropagation();
                      const newImages = images.filter((_, i) => i !== idx);
                      setValue("images", newImages);
                      if (selectedImageIndex >= newImages.length) setSelectedImageIndex(Math.max(0, newImages.length - 1));
                    }} className="absolute top-1 right-1 bg-[var(--color-danger)] text-white rounded-lg p-1 shadow-xl hover:scale-110 transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {mode !== "view" && images.length < 5 && (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 border-2 border-dashed border-[var(--color-border-subtle)] rounded-2xl flex items-center justify-center bg-[var(--color-surface-base)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface-base)] transition-all shrink-0">
                  {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                </button>
              )}
            </div>

            {mode !== "view" && images.length < 5 && (
              <div className="flex gap-2 relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                  placeholder="Paste an external image URL..."
                  className="flex-1 bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]/40 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  disabled={!imageUrlInput.trim()}
                  className="px-6 bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] font-black text-[10px] uppercase tracking-widest rounded-xl hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5 disabled:opacity-50 transition-all"
                >
                  Add URL
                </button>
              </div>
            )}

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest pl-1">Description</label>
            <textarea {...register("description")} disabled={mode === "view"} className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] rounded-xl py-4 px-6 text-sm font-bold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]/40 focus:bg-[var(--color-surface-card)] transition-all min-h-[120px] resize-none placeholder:text-[var(--color-text-muted)]" placeholder="Enter product details..." />
          </div>
        </form>

        {/* Footer - Sticky */}
        <div className="p-6 sm:p-8 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] flex gap-4 z-10 shrink-0">
          <button type="button" onClick={onClose} className="flex-1 py-4 px-6 bg-[var(--color-surface-base)] hover:bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95">
            {mode === "view" ? "Close" : "Cancel"}
          </button>
          {mode !== "view" && (
            <button type="button" onClick={handleSubmit(onSubmit)} className="flex-[1.5] py-4 px-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-[var(--color-text-primary)] rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[var(--color-primary)]/20 transition-all active:scale-95">
              {mode === "add" ? "Create Product" : "Update Product"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}