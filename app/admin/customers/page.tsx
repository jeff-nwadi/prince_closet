'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingBag, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

type Customer = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/customers')
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers ?? []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7d72]" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#dfcac3]/50 text-[#4a3129] placeholder:text-[#8a7d72] outline-none focus:border-[#4a3129] transition-colors"
          />
        </div>
        {!loading && <span className="text-xs text-[#8a7d72]">{filtered.length} customers</span>}
      </div>

      <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#dfcac3]/30">
          <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider">Customers</h2>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 size={24} className="text-[#dfcac3] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#dfcac3]/30 text-[10px] uppercase tracking-widest text-[#8a7d72]">
                  <th className="font-medium p-4">Customer</th>
                  <th className="font-medium p-4">Joined</th>
                  <th className="font-medium p-4">Orders</th>
                  <th className="font-medium p-4">Total Spent</th>
                  <th className="font-medium p-4">History</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#4a3129]">
                {filtered.map((c) => (
                  <>
                    <tr key={c.id} className="border-b border-[#dfcac3]/20 hover:bg-[#f4f0ea]/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 bg-[#4a3129] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold">{c.name}</p>
                            <p className="text-[#8a7d72] text-[10px]">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[#8a7d72]">
                        {new Date(c.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4 font-bold">{c.orderCount}</td>
                      <td className="p-4 font-bold">₦{c.totalSpent.toLocaleString('en-NG')}</td>
                      <td className="p-4">
                        <button
                          onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#4a3129] hover:underline"
                          aria-expanded={expandedId === c.id}
                          aria-label={`View orders for ${c.name}`}
                        >
                          <ShoppingBag size={12} />
                          Orders
                          {expandedId === c.id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === c.id && (
                      <tr key={`${c.id}-exp`} className="bg-[#f4f0ea]/40 border-b border-[#dfcac3]/20">
                        <td colSpan={5} className="px-4 py-3">
                          <div className="pl-10">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-[#8a7d72] mb-2">
                              {c.orderCount === 0 ? 'No orders yet.' : `${c.orderCount} order${c.orderCount !== 1 ? 's' : ''} — ₦${c.totalSpent.toLocaleString('en-NG')} total`}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-12 text-center text-[#8a7d72] text-sm">No customers found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
