import Link from 'next/link';

type PendingReturn = {
  id: string;
  productEmoji: string;
  productName: string;
  orderNumber: string;
  customerName: string;
  reason: string;
  amount: string;
};

export default function PendingReturns({ items }: { items: PendingReturn[] }) {
  return (
    <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm">
      <div className="p-5 flex justify-between items-center border-b border-[#dfcac3]/30">
        <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider">Pending Returns</h2>
        <Link href="/admin/returns" className="text-[#8a7d72] text-xs hover:text-[#4a3129] hover:underline font-medium">
          See all
        </Link>
      </div>
      <div className="p-5 flex flex-col gap-5">
        {items.length === 0 ? (
          <p className="text-xs text-[#8a7d72] text-center py-4">No pending return requests 🎉</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{item.productEmoji}</span>
                <div>
                  <p className="text-xs font-bold text-[#4a3129]">{item.productName}</p>
                  <p className="text-[10px] text-[#8a7d72]">{item.customerName} · #{item.orderNumber}</p>
                  <p className="text-[10px] text-[#4a3129]/60 mt-0.5 italic">"{item.reason}"</p>
                </div>
              </div>
              <Link
                href="/admin/returns"
                className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#4a3129] text-white hover:bg-[#3A241C] transition-colors"
              >
                Review
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
