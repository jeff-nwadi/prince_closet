'use client';

import { RefreshCw, MapPin, Headphones } from 'lucide-react';
import Link from 'next/link';

const links = [
  {
    title: 'Return Center',
    description: 'Start a return, track requests, or view our policy.',
    icon: RefreshCw,
    href: '/returns',
    color: 'text-purple-600 bg-purple-50 group-hover:bg-[#534AB7] group-hover:text-white',
  },
  {
    title: 'Address Book',
    description: 'Manage your primary shipping and billing locations.',
    icon: MapPin,
    href: '/addresses',
    color: 'text-amber-600 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white',
  },
  {
    title: 'Contact Support',
    description: 'Need help with an order? Speak with our 24/7 team.',
    icon: Headphones,
    href: '/support',
    color: 'text-green-600 bg-green-50 group-hover:bg-green-600 group-hover:text-white',
  },
];

export default function DashboardBottomNav() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {links.map((link) => {
        const IconComponent = link.icon;
        return (
          <Link
            key={link.title}
            href={link.href}
            className="group flex flex-col p-5 bg-white border border-gray-200/70 rounded-xl hover:shadow-md hover:border-purple-200/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-300 ${link.color}`}
              >
                <IconComponent className="h-4.5 w-4.5 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#534AB7] transition-colors duration-200">
                {link.title}
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-2.5 leading-relaxed">
              {link.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
