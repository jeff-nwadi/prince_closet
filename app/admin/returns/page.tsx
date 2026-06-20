'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

type ReturnStatus = 'Pending' | 'Approved' | 'Rejected';

type ReturnItem = {
  id: string;
  productEmoji: string;
  productName: string;
  orderNumber: string;
  customerName: string;
  reason: string;
  amount: string;
  status: ReturnStatus;
  createdAt: string;
};

const statusBadge: Record<ReturnStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReturnStatus | 'All'>('All');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/returns');
      const data = await res.json();
      setReturns(data.returns ?? []);
    } catch { setReturns([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchReturns(); }, [fetchReturns]);

  const updateStatus = async (id: string, status: ReturnStatus) => {
    setUpdating(id);
    try {
      await fetch('/api/admin/returns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setReturns((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    } finally { setUpdating(null); }
  };

  const filtered = filter === 'All' ? returns : returns.filter((r) => r.status === filter);

  const counts = {
    Pending: returns.filter((r) => r.status === 'Pending').length,
    Approved: returns.filter((r) => r.status === 'Approved').length,
    Rejected: returns.filter((r) => r.status === 'Rejected').length,
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(['Pending', 'Approved', 'Rejected'] as ReturnStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(filter === s ? 'All' : s)}
            className={`bg-white border rounded-lg p-5 shadow-sm text-left transition-all ${filter === s ? 'border-[#4a3129]' : 'border-[#dfcac3]/50 hover:border-[#dfcac3]'}`}
          >
            <p className="text-[10px] uppercase tracking-widest text-[#8a7d72] font-medium mb-2">{s}</p>
            <p className={`text-2xl font-bold ${s === 'Pending' ? 'text-amber-600' : s === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>
              {loading ? '—' : counts[s]}
            </p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#dfcac3]/30 flex justify-between items-center">
          <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider">Returns Queue</h2>
          {loading
            ? <Loader2 size={14} className="animate-spin text-[#8a7d72]" />
            : <span className="text-[10px] text-[#8a7d72]">{filtered.length} requests</span>
          }
        </div>
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 size={24} className="animate-spin text-[#dfcac3]" /></div>
        ) : (
          <div className="divide-y divide-[#dfcac3]/20">
            {filtered.map((item) => (
              <div key={item.id} className="p-5 flex items-start justify-between gap-4 hover:bg-[#f4f0ea]/30 transition-colors">
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5">{item.productEmoji}</span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-[#4a3129]">{item.productName}</p>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusBadge[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8a7d72]">{item.customerName} · #{item.orderNumber} · {item.amount}</p>
                    <p className="text-[11px] text-[#4a3129]/70 italic mt-0.5">"{item.reason}"</p>
                    <p className="text-[10px] text-[#8a7d72]">
                      Submitted: {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {updating === item.id ? (
                    <Loader2 size={16} className="animate-spin text-[#8a7d72]" />
                  ) : item.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => updateStatus(item.id, 'Approved')}
                        className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 transition-colors rounded-full"
                        aria-label={`Approve return for ${item.productName}`}
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, 'Rejected')}
                        className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-full"
                        aria-label={`Reject return for ${item.productName}`}
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => updateStatus(item.id, 'Pending')}
                      className="text-[9px] font-bold uppercase tracking-wider text-[#8a7d72] hover:text-[#4a3129] transition-colors"
                    >
                      Undo
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-12 text-center text-[#8a7d72] text-sm">
                No {filter !== 'All' ? filter.toLowerCase() : ''} return requests.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
