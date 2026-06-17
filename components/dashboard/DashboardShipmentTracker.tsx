'use client';

import { SectionCard, Badge } from './DashboardPrimitives';
import { Truck, Check, Package } from 'lucide-react';

export default function DashboardShipmentTracker({ shipment }: { shipment: any }) {
  if (!shipment) {
    return (
      <SectionCard title="Active Shipment">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <Package className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">No active shipments</p>
          <p className="text-xs text-gray-500 mt-1">When you place an order, its tracking details will appear here.</p>
        </div>
      </SectionCard>
    );
  }

  const { product, orderNumber, estimatedArrival, steps } = shipment;

  // Let's compute overall percent progress to show in a sub-indicator
  // Shipped (25%), In Transit (50%), Out for Delivery (75%), Delivered (100%)
  const completedCount = steps.filter((s: any) => s.completed).length;
  const activeIndex = steps.findIndex((s: any) => s.active);
  const progressPercent = activeIndex !== -1 
    ? (activeIndex * 33.33) + 16.66
    : completedCount === steps.length 
      ? 100 
      : 0;

  return (
    <SectionCard title="Active Shipment">
      <div className="flex flex-col gap-4">
        {/* Header Details */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {product}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Order {orderNumber}
            </p>
          </div>
          <Badge variant="amber">
            Est. Arrival: {estimatedArrival}
          </Badge>
        </div>

        {/* Progress Bar Container */}
        <div className="relative my-4 px-2">
          {/* Background bar */}
          <div className="absolute top-[15px] left-8 right-8 h-1 bg-gray-100 rounded-full" aria-hidden="true" />
          
          {/* Active progress bar fill */}
          <div 
            className="absolute top-[15px] left-8 h-1 bg-[#534AB7] rounded-full transition-all duration-500" 
            style={{ width: `calc(${progressPercent}% - 16px)` }}
            aria-hidden="true" 
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step: any, idx: number) => {
              const isCompleted = step.completed;
              const isActive = step.active;
              
              return (
                <div key={step.label} className="flex flex-col items-center group">
                  {/* Step node (circle) */}
                  <div
                    className={`h-8 h-8 w-8 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-[#534AB7] text-white shadow-sm'
                        : isActive
                          ? 'bg-white border-2 border-[#534AB7] text-[#534AB7] shadow-sm'
                          : 'bg-white border-2 border-gray-200 text-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
                    ) : isActive ? (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#534AB7] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#534AB7]"></span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`text-[10px] font-medium mt-2 text-center transition-colors duration-200 ${
                      isCompleted || isActive
                        ? 'text-gray-900 font-semibold'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inline Status Message */}
        <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-3 flex items-start gap-2.5 mt-1">
          <Truck className="h-4 w-4 text-[#534AB7] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-[#534AB7] font-medium leading-normal">
            Your package is out with our courier in Lagos and will be delivered today before 6:00 PM.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
