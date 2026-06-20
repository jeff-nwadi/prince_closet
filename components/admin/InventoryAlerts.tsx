import Link from 'next/link';

type LowStockItem = {
  id: string;
  emoji: string;
  name: string;
  stock: number;
  threshold: number;
};

const getStatusStyle = (stock: number, threshold: number) => {
  if (stock === 0) return { badge: 'bg-red-100 text-red-700', bar: 'bg-red-400', label: 'Out of Stock' };
  return { badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400', label: 'Low Stock' };
};

export default function InventoryAlerts({ items }: { items: LowStockItem[] }) {
  return (
    <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm">
      <div className="p-5 flex justify-between items-center border-b border-[#dfcac3]/30">
        <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider">Inventory Alerts</h2>
        <Link href="/admin/inventory" className="text-[#8a7d72] text-xs hover:text-[#4a3129] hover:underline font-medium">
          Manage
        </Link>
      </div>
      <div className="p-5 flex flex-col gap-5">
        {items.length === 0 ? (
          <p className="text-xs text-[#8a7d72] text-center py-4">All products are well-stocked 🎉</p>
        ) : (
          items.map((item) => {
            const style = getStatusStyle(item.stock, item.threshold);
            const maxStock = item.threshold * 5;
            const pct = Math.max(0, Math.round((item.stock / maxStock) * 100));
            return (
              <div key={item.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <p className="text-xs font-bold text-[#4a3129]">{item.name}</p>
                      <p className="text-[10px] text-[#8a7d72]">{item.stock} units left · threshold {item.threshold}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                    {style.label}
                  </span>
                </div>
                <div className="h-1 w-full bg-[#f4f0ea] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${style.bar}`}
                    style={{ width: `${pct}%` }}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
