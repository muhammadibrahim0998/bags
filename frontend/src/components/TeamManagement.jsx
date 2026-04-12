import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, User as UserIcon, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { MemberForm } from './MemberForm';
import { toast } from 'sonner';

export function TeamManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (data) => {
    setError('');
    try {
      await api.post('/users', data);
      toast.success('Member successfully registered to NexusOS');
      setIsAdding(false);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Authorization Protocol Failed';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div className="bg-surface-card rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-[var(--color-border-subtle)] animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-12 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"></div>
            <h2 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tighter uppercase leading-none">Team Personnel</h2>
          </div>
          <p className="text-[var(--color-text-muted)] font-bold tracking-[0.4em] uppercase text-[10px] pl-6">Access Control & Authorization Layer</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-[var(--color-text-primary)] rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[var(--color-primary)]/20 hover:scale-[1.05] active:scale-95 transition-all"
          >
            <UserPlus className="w-5 h-5 transition-transform hover:rotate-12" />
            Add Member
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-12">
          <MemberForm
            onSubmit={handleCreate}
            onCancel={() => setIsAdding(false)}
            isSubmitting={loading}
          />
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center bg-[var(--color-surface-base)] rounded-xl border border-[var(--color-border-subtle)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] mb-4"></div>
          <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">Identifying Members...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((u) => (
            <div key={u._id} className="group relative bg-[var(--color-surface-base)] hover:bg-[var(--color-surface-base)] p-8 rounded-xl border border-[var(--color-border-subtle)] hover:border-blue-500/30 transition-all shadow-2xl overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border border-[var(--color-border-subtle)] transition-transform group-hover:scale-110 ${u.role === 'admin' ? 'bg-blue-500/20 text-[var(--color-primary)]' : 'bg-[var(--color-surface-base)] text-[var(--color-text-muted)]'}`}>
                    {u.role === 'admin' ? <Shield className="w-7 h-7" /> : <UserIcon className="w-7 h-7" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-lg font-black text-[var(--color-text-primary)] truncate tracking-tighter uppercase">{u.fullName}</h4>
                    <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-500/40 rounded-full"></span>
                      @{u.username} • {u.preferredShift === 'day' ? '☀️ Day' : u.preferredShift === 'night' ? '🌙 Night' : '🔄 Both'}
                    </p>
                    {u.phoneNumber && (
                      <p className="text-[9px] font-bold text-[var(--color-text-muted)] mt-1 flex items-center gap-1.5 opacity-60">
                        <Phone className="w-3 h-3" /> {u.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${u.role === 'admin' ? 'bg-blue-500/10 text-[var(--color-primary)] border-blue-500/20' : 'bg-[var(--color-surface-base)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)]'}`}>
                    {u.role}
                  </span>
                  {u.username !== 'admin' && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="p-3 bg-[var(--color-surface-base)] text-[var(--color-text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-[var(--color-border-subtle)] opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <Trash2 className="w-5 h-5 transition-transform hover:rotate-12" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[10px] font-black text-[var(--color-text-muted)] relative z-10">
                <div className="flex items-center gap-2 uppercase tracking-[0.2em]">
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${u.status === 'active' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-slate-700 shadow-slate-700/50'}`}></div>
                  {u.status}
                </div>
                <span className="uppercase tracking-[0.1em] opacity-40">Personnel ID: {u._id.slice(-6).toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
