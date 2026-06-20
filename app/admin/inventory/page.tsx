'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

type InventoryItem = {
  id: string;
  emoji: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  threshold: number;
};

const getStockStatus = (stock: number, threshold: number) => {
  if (stock === 0) return { label: 'Out of Stock', badge: 'bg-red-100 text-red-700', bar: 'bg-red-400' };
  if (stock <= threshold) return { label: 'Low Stock', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400' };
  return { label: 'In Stock', badge: 'bg-green-100 text-green-700', bar: 'bg-green-400' };
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [restockId, setRestockId] = useState<string | null>(null);
  const [restockAmt, setRestockAmt] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      setItems(data.inventory ?? []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const handleRestock = async (id: string) => {
    const amt = parseInt(restockAmt, 10);
    if (isNaN(amt) || amt <= 0) return;
    setUpdating(id);
    try {
      await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, restockAmount: amt }),
      });
      setItems((prev) => prev.map((item) => item.id === id ? { ...item, stock: item.stock + amt } : item));
    } finally {
      setRestockId(null);
      setRestockAmt('');
      setUpdating(null);
    }
  };

  const outOfStock = items.filter((i) => i.stock === 0).length;
  const lowStock = items.filter((i) => i.stock > 0 && i.stock <= i.threshold).length;
  const inStock = items.filter((i) => i.stock > i.threshold).length;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Products', value: items.length, color: 'text-[#4a3129]' },
          { label: 'In Stock', value: inStock, color: 'text-green-600' },
          { label: 'Needs Attention', value: outOfStock + lowStock, color: 'text-red-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-[#dfcac3]/50 rounded-lg p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-[#8a7d72] font-medium mb-2">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#dfcac3]/30 flex justify-between items-center">
          <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider">Stock Management</h2>
          {loading && <Loader2 size={14} className="animate-spin text-[#8a7d72]" />}
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
                  <th className="font-medium p-4">Stock Level</th>
                  <th className="font-medium p-4">Units</th>
                  <th className="font-medium p-4">Status</th>
                  <th className="font-medium p-4">Restock</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#4a3129]">
                {items.map((item) => {
                  const s = getStockStatus(item.stock, item.threshold);
                  const pct = Math.min(100, Math.round((item.stock / Math.max(item.threshold * 3, 50)) * 100));
                  return (
                    <tr key={item.id} className="border-b border-[#dfcac3]/20 last:border-0 hover:bg-[#f4f0ea]/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{item.emoji}</span>
                          <span className="font-bold">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[#8a7d72] font-mono text-[10px]">{item.sku}</td>
                      <td className="p-4 text-[#8a7d72]">{item.category}</td>
                      <td className="p-4 w-36">
                        <div className="h-1.5 w-full bg-[#f4f0ea] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.bar} transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="p-4 font-bold">{item.stock}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${s.badge}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="p-4">
                        {updating === item.id ? (
                          <Loader2 size={14} className="animate-spin text-[#8a7d72]" />
                        ) : restockId === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={restockAmt}
                              onChange={(e) => setRestockAmt(e.target.value)}
                              placeholder="Qty"
                              autoFocus
                              className="w-16 px-2 py-1 text-xs border border-[#dfcac3] bg-[#f4f0ea] text-[#4a3129] outline-none focus:border-[#4a3129]"
                            />
                            <button onClick={() => handleRestock(item.id)} className="text-[9px] font-bold px-2 py-1 bg-[#4a3129] text-white hover:bg-[#3A241C]">Add</button>
                            <button onClick={() => { setRestockId(null); setRestockAmt(''); }} className="text-[#8a7d72] hover:text-red-500 text-[9px] font-bold">Cancel</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRestockId(item.id)}
                            className="text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 border border-[#4a3129] text-[#4a3129] hover:bg-[#4a3129] hover:text-white transition-colors"
                          >
                            Restock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
