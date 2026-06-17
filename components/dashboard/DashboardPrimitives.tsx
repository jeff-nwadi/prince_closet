// Shared primitive components used across the dashboard

import React from 'react';

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = 'purple' | 'green' | 'amber' | 'red' | 'gray';

const badgeStyles: Record<BadgeVariant, string> = {
  purple: 'bg-purple-100 text-purple-700',
  green:  'bg-green-100  text-green-700',
  amber:  'bg-amber-100  text-amber-700',
  red:    'bg-red-100    text-red-600',
  gray:   'bg-gray-100   text-gray-500',
};

export function Badge({
  children,
  variant = 'gray',
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-none whitespace-nowrap ${badgeStyles[variant]}`}
    >
      {children}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
import type { OrderStatus } from './DashboardData';

const statusConfig: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
  delivered:  { label: 'Delivered',  variant: 'green'  },
  'in-transit': { label: 'In Transit', variant: 'amber'  },
  returned:   { label: 'Returned',   variant: 'gray'   },
  processing: { label: 'Processing', variant: 'purple' },
  pending:    { label: 'Pending Payment', variant: 'amber' },
  failed:     { label: 'Failed',     variant: 'red'    },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, variant } = statusConfig[status];
  return <Badge variant={variant}>{label}</Badge>;
}

// ─── Section Card ─────────────────────────────────────────────────────────────
export function SectionCard({
  title,
  action,
  children,
  className = '',
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white border border-gray-200/70 rounded-xl p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-sm font-medium text-gray-900">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Product Thumbnail ────────────────────────────────────────────────────────
export function ProductThumb({
  colorClass,
  size = 'md',
}: {
  colorClass: string;
  size?: 'sm' | 'md';
}) {
  const dim = size === 'sm' ? 'h-10 w-10' : 'h-12 w-12';
  return (
    <div
      className={`${dim} ${colorClass} rounded-lg flex-shrink-0 flex items-center justify-center`}
      aria-hidden="true"
    >
      <svg
        className="h-5 w-5 text-gray-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5"
        />
      </svg>
    </div>
  );
}
