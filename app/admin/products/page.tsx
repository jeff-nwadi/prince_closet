'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, X, Loader2 } from 'lucide-react';

type Product = {
  id: string;
  emoji: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: 'Active' | 'Draft';
  sku: string;
};

const emptyForm = { name: '', category: '', price: '', stock: '0', emoji: '👕', status: 'Active' as 'Active' | 'Draft', sku: '' };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const openAdd = () => { setEditProduct(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, category: p.category, price: p.price, stock: String(p.stock), emoji: p.emoji, status: p.status, sku: p.sku });
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.price) return;
    setSaving(true);
    try {
      if (editProduct) {
        await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editProduct.id, ...form, stock: Number(form.stock) }),
        });
      } else {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, stock: Number(form.stock) }),
        });
      }
      setShowModal(false);
      fetchProducts();
    } finally { setSaving(false); }
  };

  const fields = [
    { label: 'Product Name', key: 'name', type: 'text', placeholder: 'e.g. Classic Logo Tee' },
    { label: 'Category', key: 'category', type: 'text', placeholder: 'e.g. Tees' },
    { label: 'Price (₦)', key: 'price', type: 'text', placeholder: 'e.g. 29500' },
    { label: 'Stock (units)', key: 'stock', type: 'number', placeholder: '0' },
    { label: 'SKU', key: 'sku', type: 'text', placeholder: 'Auto-generated if blank' },
    { label: 'Emoji', key: 'emoji', type: 'text', placeholder: '👕' },
  ] as const;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7d72]" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#dfcac3]/50 text-[#4a3129] placeholder:text-[#8a7d72] outline-none focus:border-[#4a3129] transition-colors"
          />
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#4a3129] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#3A241C] transition-colors">
          <Plus size={14} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#dfcac3]/30 flex justify-between items-center">
          <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider">Products</h2>
          {loading
            ? <Loader2 size={14} className="animate-spin text-[#8a7d72]" />
            : <span className="text-[10px] text-[#8a7d72]">{products.length} items</span>
          }
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center"><Loader2 size={24} className="animate-spin text-[#dfcac3]" /></div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#dfcac3]/30 text-[10px] uppercase tracking-widest text-[#8a7d72]">
                  <th className="font-medium p-4">Product</th>
                  <th className="font-medium p-4">SKU</th>
                  <th className="font-medium p-4">Category</th>
                  <th className="font-medium p-4">Price</th>
                  <th className="font-medium p-4">Stock</th>
                  <th className="font-medium p-4">Status</th>
                  <th className="font-medium p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#4a3129]">
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-[#dfcac3]/20 last:border-0 hover:bg-[#f4f0ea]/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{p.emoji}</span>
                        <span className="font-bold">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#8a7d72] font-mono text-[10px]">{p.sku}</td>
                    <td className="p-4 text-[#8a7d72]">{p.category}</td>
                    <td className="p-4 font-medium">₦{Number(p.price).toLocaleString('en-NG')}</td>
                    <td className="p-4">
                      <span className={p.stock === 0 ? 'text-red-600 font-bold' : p.stock < 5 ? 'text-amber-600 font-bold' : ''}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(p)} className="text-[#8a7d72] hover:text-[#4a3129] transition-colors" aria-label={`Edit ${p.name}`}>
                          <Pencil size={14} />
                        </button>
                        {deleting === p.id
                          ? <Loader2 size={14} className="animate-spin text-red-400" />
                          : <button onClick={() => handleDelete(p.id, p.name)} className="text-[#8a7d72] hover:text-red-500 transition-colors" aria-label={`Delete ${p.name}`}>
                              <Trash2 size={14} />
                            </button>
                        }
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && !loading && (
                  <tr><td colSpan={7} className="p-12 text-center text-[#8a7d72]">No products found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3129]/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[#dfcac3]/30">
              <h3 className="font-bold text-[#4a3129] text-sm uppercase tracking-wider">
                {editProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#8a7d72] hover:text-[#4a3129]"><X size={18} /></button>
            </div>
            <div className="p-6 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
              {fields.map(({ label, key, type, placeholder }) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="bg-transparent border-b border-[#dfcac3] pb-2 text-sm text-[#4a3129] outline-none focus:border-[#4a3129] transition-all"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as 'Active' | 'Draft' }))}
                  className="bg-[#f4f0ea] border border-[#dfcac3]/50 px-3 py-2 text-xs text-[#4a3129] outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-[#dfcac3]/30 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#8a7d72] hover:text-[#4a3129]">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#4a3129] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#3A241C] disabled:opacity-50 transition-colors">
                {saving ? <Loader2 size={14} className="animate-spin" /> : editProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
