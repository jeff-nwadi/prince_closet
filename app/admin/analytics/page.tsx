'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const BarChart = ({ data, color = '#4a3129' }: { data: number[]; color?: string }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-24" aria-label="Bar chart">
      {data.map((val, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{ height: `${(val / max) * 100}%`, backgroundColor: color, opacity: 0.85 }}
          title={`${val.toLocaleString()}`}
        />
      ))}
    </div>
  );
};

type AnalyticsData = {
  monthLabels: string[];
  revenueData: number[];
  ordersData: number[];
  topProducts: { name: string; sales: number; revenue: string; pct: number }[];
  kpis: { totalRevenue: number; totalOrders: number; avgOrderValue: number; returnRate: number };
};

const periods = ['Last 6 Months', 'This Month', 'This Year'];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('Last 6 Months');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const months = data?.monthLabels ?? [];
  const revenueData = data?.revenueData ?? [];
  const ordersData = data?.ordersData ?? [];
  const topProducts = data?.topProducts ?? [];
  const kpis = data?.kpis;

  return (
    <div className="flex flex-col gap-6">
      {/* Period Filter */}
      <div className="flex items-center gap-2">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${period === p ? 'bg-[#4a3129] text-white' : 'bg-white border border-[#dfcac3]/50 text-[#8a7d72] hover:text-[#4a3129]'}`}
          >
            {p}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[#dfcac3]" /></div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: kpis ? `₦${kpis.totalRevenue.toLocaleString('en-NG')}` : '—', up: true },
              { label: 'Total Orders', value: kpis ? String(kpis.totalOrders) : '—', up: true },
              { label: 'Avg Order Value', value: kpis ? `₦${kpis.avgOrderValue.toLocaleString('en-NG')}` : '—', up: true },
              { label: 'Return Rate', value: kpis ? `${kpis.returnRate}%` : '—', up: false },
            ].map(({ label, value, up }) => (
              <div key={label} className="bg-white border border-[#dfcac3]/50 rounded-lg p-5 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-[#8a7d72] font-medium mb-2">{label}</p>
                <p className="text-2xl font-bold text-[#4a3129] mb-1">{value}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  Live data
                </span>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider">Monthly Revenue</h2>
                <span className="text-[10px] text-[#8a7d72]">₦ Naira</span>
              </div>
              {revenueData.length > 0
                ? <BarChart data={revenueData} color="#4a3129" />
                : <p className="text-xs text-[#8a7d72] text-center py-8">No revenue data yet</p>
              }
              <div className="flex justify-between mt-2">
                {months.map((m) => <span key={m} className="text-[10px] text-[#8a7d72] font-medium">{m}</span>)}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider">Monthly Orders</h2>
                <span className="text-[10px] text-[#8a7d72]">Count</span>
              </div>
              {ordersData.length > 0
                ? <BarChart data={ordersData} color="#dfcac3" />
                : <p className="text-xs text-[#8a7d72] text-center py-8">No order data yet</p>
              }
              <div className="flex justify-between mt-2">
                {months.map((m) => <span key={m} className="text-[10px] text-[#8a7d72] font-medium">{m}</span>)}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm p-6">
            <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider mb-5">Top Products</h2>
            {topProducts.length === 0 ? (
              <p className="text-xs text-[#8a7d72] text-center py-8">No order data yet — sales will appear here once orders are placed.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {topProducts.map((p) => (
                  <div key={p.name} className="flex items-center gap-4">
                    <div className="w-40 flex-shrink-0">
                      <p className="text-xs font-bold text-[#4a3129] truncate">{p.name}</p>
                      <p className="text-[10px] text-[#8a7d72]">{p.sales} sold · {p.revenue}</p>
                    </div>
                    <div className="flex-1 h-2 bg-[#f4f0ea] rounded-full overflow-hidden">
                      <div className="h-full bg-[#4a3129] rounded-full" style={{ width: `${p.pct}%` }} role="progressbar" aria-valuenow={p.pct} aria-valuemin={0} aria-valuemax={100} />
                    </div>
                    <span className="text-xs font-bold text-[#4a3129] w-10 text-right">{p.pct}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
