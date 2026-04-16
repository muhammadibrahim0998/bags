import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shopSchema } from '../schemas/shopSchema';
import api from '../services/api';
import {
    Store, Plus, Building2, Edit2, Trash2, X, Check,
    LayoutDashboard, Users, Activity, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '../contexts/ProductContext';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

export function SuperAdminDashboard() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [editingShop, setEditingShop] = useState(null);
    const [editData, setEditData] = useState({ name: '', address: '', contactNumber: '', status: 'active' });
    const [viewingShop, setViewingShop] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAdminPassword, setShowAdminPassword] = useState(false);
    const { searchTerm } = useProducts();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(shopSchema),
        defaultValues: {
            name: '',
            address: '',
            contactNumber: '',
            adminFullName: '',
            adminUsername: '',
            adminPassword: ''
        }
    });

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            const res = await api.get('/shops');
            setShops(res.data);
        } catch (error) {
            toast.error('Failed to load shops');
        } finally {
            setLoading(false);
        }
    };

    const onAddShop = async (data) => {
        try {
            await api.post('/shops', data);
            toast.success('Shop created!');
            reset();
            fetchShops();
        } catch (err) {
            const serverError = err.response?.data?.message || 'Failed to create shop';
            toast.error(serverError);
        }
    };

    const handleDeleteShop = (shop) => {
        setDeleteDialog({
            isOpen: true,
            id: shop._id,
            name: shop.name
        });
    };

    const confirmDeleteShop = async () => {
        const { id } = deleteDialog;
        setIsDeleting(true);
        try {
            await api.delete(`/shops/${id}`);
            toast.success("Shop deleted successfully");
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            fetchShops();
        } catch (err) {
            toast.error("Failed to delete shop");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateShop = async (id) => {
        try {
            await api.put(`/shops/${id}`, editData);
            toast.success("Shop updated successfully");
            setEditingShop(null);
            fetchShops();
        } catch (err) {
            toast.error("Failed to update shop");
        }
    };

    const startEdit = (shop) => {
        setActiveTab('management'); // Switch to management tab if not there
        setEditingShop(shop._id);
        setEditData({
            name: shop.name || '',
            address: shop.address || '',
            contactNumber: shop.contactNumber || '',
            status: shop.status
        });
        // Scroll to management section if needed - added a slight delay to ensure tab is rendered
        setTimeout(() => {
            const el = document.getElementById(`shop-manage-${shop._id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 shadow-[0_0_15px_rgba(22,163,74,0.3)]"></div>
            </div>
        );
    }

    const activeShops = shops.filter(shop => shop.status === 'active').length;
    const inactiveShops = shops.length - activeShops;

    const filteredShops = shops.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.contactNumber?.includes(searchTerm)
    );

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-green-500/10 rounded-[1.5rem] border border-green-500/20">
                        <Building2 className="w-8 h-8 text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tighter leading-none uppercase">
                            Global Dashboard
                        </h1>
                        <p className="text-[var(--color-text-secondary)] font-bold uppercase text-[10px] tracking-[0.4em] mt-2">
                            General Management
                        </p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-2 bg-[var(--color-surface-card)] p-1.5 rounded-[1.5rem] border border-[var(--color-border-subtle)] shadow-sm overflow-x-auto w-full md:w-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'overview'
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'text-zinc-500 hover:text-zinc-900'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('management')}
                        className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'management'
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'text-zinc-500 hover:text-zinc-900'
                            }`}
                    >
                        Manage Shops
                    </button>
                </div>
            </div>

            {activeTab === 'overview' ? (
                /* Overview Content (Integrated from SuperAdminOverview) */
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white border border-zinc-100 rounded-xl p-8 shadow-rich flex items-center gap-6 group">
                            <div className="p-5 bg-green-500/10 rounded-2xl border border-green-500/20 group-hover:scale-110 transition-transform">
                                <Building2 className="w-8 h-8 text-[var(--color-primary)]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Network Shops</p>
                                <h3 className="text-4xl font-black text-zinc-900 mt-1 tracking-tighter">{shops.length}</h3>
                            </div>
                        </div>
                        <div className="bg-white border border-zinc-100 rounded-xl p-8 shadow-rich flex items-center gap-6 group">
                            <div className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                <Activity className="w-8 h-8 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Active Access</p>
                                <h3 className="text-4xl font-black text-zinc-900 mt-1 tracking-tighter">{activeShops}</h3>
                            </div>
                        </div>
                        <div className="bg-white border border-zinc-100 rounded-xl p-8 shadow-rich flex items-center gap-6 group">
                            <div className="p-5 bg-rose-500/10 rounded-2xl border border-rose-500/20 group-hover:scale-110 transition-transform">
                                <Store className="w-8 h-8 text-rose-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Suspended Stores</p>
                                <h3 className="text-4xl font-black text-zinc-900 mt-1 tracking-tighter">{inactiveShops}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 sm:p-10 shadow-rich">
                        <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-[0.2em] mb-10">Registered Store Network</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredShops.map(shop => (
                                <div key={shop._id} className="p-8 rounded-xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-green-500/30 transition-all shadow-sm hover:shadow-rich group/card">
                                    <div className="flex items-center justify-between mb-6 relative">
                                        <div className="p-4 bg-white rounded-2xl border border-zinc-100 group-hover/card:scale-110 transition-transform shadow-inner">
                                            <Store className="w-7 h-7 text-zinc-400 group-hover/card:text-green-500 transition-colors" />
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all group-hover/card:opacity-0 group-hover/card:scale-0 ${shop.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                                {shop.status}
                                            </span>
                                            {/* Card Action Overlay */}
                                            <div className="absolute top-0 right-0 flex items-center gap-1.5 opacity-0 group-hover/card:opacity-100 transition-all scale-75 group-hover/card:scale-100 origin-right">
                                                <button onClick={() => setViewingShop(shop)} className="p-2.5 bg-white text-zinc-400 hover:text-green-600 rounded-xl border border-zinc-100 shadow-sm transition-all" title="View Details"><Eye className="w-4 h-4" /></button>
                                                <button onClick={() => startEdit(shop)} className="p-2.5 bg-white text-zinc-400 hover:text-amber-600 rounded-xl border border-zinc-100 shadow-sm transition-all" title="Edit Shop"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteShop(shop)} className="p-2.5 bg-white text-zinc-400 hover:text-rose-600 rounded-xl border border-zinc-100 shadow-sm transition-all" title="Delete Shop"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-black text-zinc-900 mb-2 truncate tracking-tight uppercase group-hover/card:text-green-600 transition-colors">{shop.name}</h4>
                                    <p className="text-[11px] font-black text-zinc-400 truncate tracking-[0.1em] uppercase">{shop.address || "Global Access"}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Management Content (Integrated from SuperAdminDashboard) */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Create Shop Form */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-rich h-fit">
                        <h2 className="text-xl font-black mb-6 text-zinc-900 flex items-center gap-3 uppercase tracking-tight">
                            <Plus className="w-6 h-6 text-green-600" />
                            Register New Shop
                        </h2>
                        <form onSubmit={handleSubmit(onAddShop)} className="space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 pl-1">Shop Name</label>
                                    <input
                                        {...register('name')}
                                        className={`w-full px-5 py-3 rounded-xl border ${errors.name ? 'border-rose-500/50 bg-rose-50/50' : 'border-zinc-100 bg-zinc-50'} text-zinc-900 text-sm font-bold placeholder:text-zinc-300 outline-none focus:bg-white focus:border-green-500/40 transition-all`}
                                        placeholder="Ex: Premium Supermarket"
                                    />
                                    {errors.name && <p className="text-[9px] font-bold text-rose-500 mt-1 pl-1 uppercase tracking-tighter">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 pl-1">Address</label>
                                    <input
                                        {...register('address')}
                                        className={`w-full px-5 py-3 rounded-xl border ${errors.address ? 'border-rose-500/50 bg-rose-50/50' : 'border-zinc-100 bg-zinc-50'} text-zinc-900 text-sm font-bold placeholder:text-zinc-300 outline-none focus:bg-white focus:border-green-500/40 transition-all`}
                                        placeholder="123 Business Avenue"
                                    />
                                    {errors.address && <p className="text-[9px] font-bold text-rose-500 mt-1 pl-1 uppercase tracking-tighter">{errors.address.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 pl-1">Phone</label>
                                    <input
                                        {...register('contactNumber')}
                                        type="tel"
                                        className={`w-full px-5 py-3 rounded-xl border ${errors.contactNumber ? 'border-rose-500/50 bg-rose-50/50' : 'border-zinc-100 bg-zinc-50'} text-zinc-900 text-sm font-bold placeholder:text-zinc-300 outline-none focus:bg-white focus:border-green-500/40 transition-all`}
                                        placeholder="+92 300 1234567"
                                    />
                                    {errors.contactNumber && <p className="text-[9px] font-bold text-rose-500 mt-1 pl-1 uppercase tracking-tighter">{errors.contactNumber.message}</p>}
                                </div>
                            </div>
                            <div className="pt-6 border-t border-zinc-50">
                                <h3 className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-4">Admin Credentials</h3>
                                <div className="space-y-4">
                                    <div>
                                        <input
                                            {...register('adminFullName')}
                                            className={`w-full px-5 py-3 rounded-xl border ${errors.adminFullName ? 'border-rose-500/50 bg-rose-50/50' : 'border-zinc-100 bg-zinc-50'} text-zinc-900 text-sm font-bold outline-none focus:bg-white focus:border-green-500/40 transition-all`}
                                            placeholder="Full Name"
                                        />
                                        {errors.adminFullName && <p className="text-[9px] font-bold text-rose-500 mt-1 pl-1 uppercase tracking-tighter">{errors.adminFullName.message}</p>}
                                    </div>
                                    <input
                                        {...register('adminUsername')}
                                        autoComplete="off"
                                        className={`w-full px-5 py-3 rounded-xl border ${errors.adminUsername ? 'border-rose-500/50 bg-rose-50/50' : 'border-zinc-100 bg-zinc-50'} text-zinc-900 text-sm font-bold outline-none focus:bg-white focus:border-green-500/40 transition-all`}
                                        placeholder="username"
                                    />
                                    <input
                                        {...register('adminPassword')}
                                        type="password"
                                        autoComplete="new-password"
                                        className={`w-full px-5 py-3 rounded-xl border ${errors.adminPassword ? 'border-rose-500/50 bg-rose-50/50' : 'border-zinc-100 bg-zinc-50'} text-zinc-900 text-sm font-bold outline-none focus:bg-white focus:border-blue-500/40 transition-all`}
                                        placeholder="password"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-green-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 shadow-lg shadow-green-500/20 active:scale-95 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Registering...' : 'Create Shop'}
                            </button>
                        </form>
                    </div>

                    {/* Shops List for Management */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 pl-2">Modify Existing Access</h3>
                        {filteredShops.map(shop => {
                            const isEditing = editingShop === shop._id;
                            return (
                                <div key={shop._id} id={`shop-manage-${shop._id}`} className="bg-white p-5 rounded-2xl border border-zinc-100 flex items-center justify-between shadow-sm hover:shadow-rich hover:border-green-500/20 transition-all group/shop relative overflow-hidden">
                                    <div className="flex items-center gap-5 flex-1 min-w-0">
                                        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-100 transition-colors group-hover/shop:bg-green-50/50 flex-shrink-0">
                                            <Store className="w-6 h-6 text-zinc-400 group-hover/shop:text-green-500 transition-colors" />
                                        </div>
                                        {isEditing ? (
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                                                <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="px-3 py-2 rounded-lg border border-zinc-100 bg-zinc-50 text-zinc-900 text-xs font-bold focus:bg-white outline-none" placeholder="Name" />
                                                <input value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} className="px-3 py-2 rounded-lg border border-zinc-100 bg-zinc-50 text-zinc-900 text-xs font-bold focus:bg-white outline-none" placeholder="Address" />
                                                <input value={editData.contactNumber} onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value })} className="px-3 py-2 rounded-lg border border-zinc-100 bg-zinc-50 text-zinc-900 text-xs font-bold focus:bg-white outline-none" placeholder="Phone" />
                                                <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="px-3 py-2 rounded-lg border border-zinc-100 bg-zinc-50 text-zinc-900 text-xs font-bold focus:bg-white outline-none">
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-tight truncate">{shop.name}</h3>
                                                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest mt-0.5 truncate">
                                                    {shop.address || 'Global'} {shop.contactNumber && `• ${shop.contactNumber}`}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                                        {isEditing ? (
                                            <>
                                                <button onClick={() => handleUpdateShop(shop._id)} className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all border border-emerald-100"><Check className="w-4 h-4" /></button>
                                                <button onClick={() => setEditingShop(null)} className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-zinc-600 rounded-lg transition-all border border-zinc-100"><X className="w-4 h-4" /></button>
                                            </>
                                        ) : (
                                            <>
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all group-hover/shop:opacity-0 group-hover/shop:scale-90 ${shop.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                    {shop.status}
                                                </span>
                                                <div className="flex items-center gap-2 opacity-0 group-hover/shop:opacity-100 absolute right-5 transition-all translate-x-4 group-hover/shop:translate-x-0">
                                                    <button onClick={() => setViewingShop(shop)} className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all border border-zinc-100" title="View Details"><Eye className="w-4 h-4" /></button>
                                                    <button onClick={() => startEdit(shop)} className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all border border-zinc-100" title="Edit Shop"><Edit2 className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDeleteShop(shop)} className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-zinc-100" title="Delete Shop"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Global Delete Confirmation Modal */}
                    <DeleteConfirmationModal
                        isOpen={deleteDialog.isOpen}
                        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                        onConfirm={confirmDeleteShop}
                        title="Confirm Shop Deletion"
                        message="Are you sure you want to delete this shop and all its users? This cannot be undone."
                        itemName={deleteDialog.name}
                        isDeleting={isDeleting}
                    />

                    {/* Shop View Modal */}
                    {viewingShop && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-100 animate-in zoom-in-95 duration-300">
                                <div className="relative p-10">
                                    <button
                                        onClick={() => setViewingShop(null)}
                                        className="absolute top-8 right-8 p-2 bg-zinc-50 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-xl transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="p-6 bg-green-500/10 rounded-3xl border border-green-500/20">
                                            <Store className="w-10 h-10 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">{viewingShop.name}</h2>
                                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${viewingShop.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                                    {viewingShop.status}
                                                </span>
                                            </div>
                                            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">{viewingShop.address || "Global Access Point"}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-50">
                                        <div>
                                            <h4 className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-4 pl-1">Store Identity</h4>
                                            <div className="space-y-4">
                                                <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100/50">
                                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Internal Reference</p>
                                                    <p className="text-xs font-bold text-zinc-600 truncate">#{viewingShop._id.toUpperCase()}</p>
                                                </div>
                                                <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100/50">
                                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Contact Access</p>
                                                    <p className="text-xs font-bold text-zinc-600">{viewingShop.contactNumber || "Not Provided"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-emerald-600 tracking-[0.2em] mb-4 pl-1">Primary Administrator</h4>
                                            <div className="space-y-4">
                                                <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100/50">
                                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Authorized Official</p>
                                                    <p className="text-xs font-bold text-zinc-800">{viewingShop.adminFullName || "System Owner"}</p>
                                                </div>
                                                <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100/50">
                                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">System Username</p>
                                                    <p className="text-xs font-bold text-zinc-800">@{viewingShop.adminUsername || "admin"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            startEdit(viewingShop);
                                            setViewingShop(null);
                                        }}
                                        className="w-full mt-10 py-4 bg-zinc-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Enter Administrative Bridge
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
