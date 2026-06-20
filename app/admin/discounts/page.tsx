'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, X, Loader2, Tag, ToggleLeft, ToggleRight } from 'lucide-react';

type Discount = {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: string;
  status: 'Active' | 'Inactive';
  usageCount: number;
  maxUsage: number | null;
  expiresAt: string | null;
  createdAt: string;
};

const emptyForm = { code: '', type: 'percentage' as 'percentage' | 'fixed', value: '', status: 'Active' as 'Active' | 'Inactive', maxUsage: '', expiresAt: '' };

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchDiscounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/discounts');
      const data = await res.json();
      setDiscounts(data.discounts ?? []);
    } catch { setDiscounts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDiscounts(); }, [fetchDiscounts]);

  const handleCreate = async () => {
    if (!form.code || !form.value) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: form.value,
          status: form.status,
          maxUsage: form.maxUsage ? Number(form.maxUsage) : null,
          expiresAt: form.expiresAt || null,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setForm(emptyForm);
        fetchDiscounts();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to create discount');
      }
    } finally { setSaving(false); }
  };

  const handleToggle = async (d: Discount) => {
    setToggling(d.id);
    try {
      await fetch('/api/admin/discounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: d.id, status: d.status === 'Active' ? 'Inactive' : 'Active' }),
      });
      setDiscounts((prev) => prev.map((item) => item.id === d.id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item));
    } finally { setToggling(null); }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete discount code "${code}"?`)) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/discounts?id=${id}`, { method: 'DELETE' });
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
    } finally { setDeleting(null); }
  };

  const active = discounts.filter((d) => d.status === 'Active').length;
  const inactive = discounts.filter((d) => d.status === 'Inactive').length;

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Codes', value: discounts.length, color: 'text-[#4a3129]' },
          { label: 'Active', value: active, color: 'text-green-600' },
          { label: 'Inactive', value: inactive, color: 'text-[#8a7d72]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-[#dfcac3]/50 rounded-lg p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-[#8a7d72] font-medium mb-2">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div />
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#4a3129] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#3A241C] transition-colors"
        >
          <Plus size={14} /> Create Code
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#dfcac3]/30 flex justify-between items-center">
          <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider">Discount Codes</h2>
          {loading && <Loader2 size={14} className="animate-spin text-[#8a7d72]" />}
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center"><Loader2 size={24} className="animate-spin text-[#dfcac3]" /></div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#dfcac3]/30 text-[10px] uppercase tracking-widest text-[#8a7d72]">
                  <th className="font-medium p-4">Code</th>
                  <th className="font-medium p-4">Type</th>
                  <th className="font-medium p-4">Value</th>
                  <th className="font-medium p-4">Usage</th>
                  <th className="font-medium p-4">Expires</th>
                  <th className="font-medium p-4">Status</th>
                  <th className="font-medium p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#4a3129]">
                {discounts.map((d) => {
                  const usagePct = d.maxUsage ? Math.min(100, Math.round((d.usageCount / d.maxUsage) * 100)) : null;
                  return (
                    <tr key={d.id} className="border-b border-[#dfcac3]/20 last:border-0 hover:bg-[#f4f0ea]/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Tag size={12} className="text-[#8a7d72]" />
                          <span className="font-bold font-mono tracking-widest">{d.code}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[#8a7d72] capitalize">{d.type}</td>
                      <td className="p-4 font-bold">
                        {d.type === 'percentage' ? `${d.value}%` : `₦${Number(d.value).toLocaleString('en-NG')}`}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span>{d.usageCount}{d.maxUsage ? ` / ${d.maxUsage}` : ''}</span>
                          {usagePct !== null && (
                            <div className="h-1 w-16 bg-[#f4f0ea] rounded-full overflow-hidden">
                              <div className="h-full bg-[#4a3129] rounded-full" style={{ width: `${usagePct}%` }} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-[#8a7d72]">
                        {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${d.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {toggling === d.id ? (
                            <Loader2 size={14} className="animate-spin text-[#8a7d72]" />
                          ) : (
                            <button onClick={() => handleToggle(d)} className="text-[#8a7d72] hover:text-[#4a3129] transition-colors" aria-label={`Toggle ${d.code}`}>
                              {d.status === 'Active' ? <ToggleRight size={18} className="text-green-600" /> : <ToggleLeft size={18} />}
                            </button>
                          )}
                          {deleting === d.id ? (
                            <Loader2 size={14} className="animate-spin text-red-400" />
                          ) : (
                            <button onClick={() => handleDelete(d.id, d.code)} className="text-[#8a7d72] hover:text-red-500 transition-colors" aria-label={`Delete ${d.code}`}>
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {discounts.length === 0 && !loading && (
                  <tr><td colSpan={7} className="p-12 text-center text-[#8a7d72]">No discount codes yet.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3129]/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[#dfcac3]/30">
              <h3 className="font-bold text-[#4a3129] text-sm uppercase tracking-wider">Create Discount Code</h3>
              <button onClick={() => setShowModal(false)} className="text-[#8a7d72] hover:text-[#4a3129]"><X size={18} /></button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              {[
                { label: 'Code', key: 'code', type: 'text', placeholder: 'e.g. WELCOME10' },
                { label: 'Value', key: 'value', type: 'number', placeholder: 'e.g. 10' },
                { label: 'Max Usage', key: 'maxUsage', type: 'number', placeholder: 'Unlimited if blank' },
                { label: 'Expires At', key: 'expiresAt', type: 'date', placeholder: '' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form] as string}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="bg-transparent border-b border-[#dfcac3] pb-2 text-sm text-[#4a3129] outline-none focus:border-[#4a3129] transition-all"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60">Type</label>
                <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as 'percentage' | 'fixed' }))} className="bg-[#f4f0ea] border border-[#dfcac3]/50 px-3 py-2 text-xs text-[#4a3129] outline-none">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (₦)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60">Status</label>
                <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as 'Active' | 'Inactive' }))} className="bg-[#f4f0ea] border border-[#dfcac3]/50 px-3 py-2 text-xs text-[#4a3129] outline-none">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-[#dfcac3]/30 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#8a7d72] hover:text-[#4a3129]">Cancel</button>
              <button onClick={handleCreate} disabled={saving} className="px-6 py-2 bg-[#4a3129] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#3A241C] disabled:opacity-50 flex items-center gap-2">
                {saving && <Loader2 size={12} className="animate-spin" />}
                Create Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
