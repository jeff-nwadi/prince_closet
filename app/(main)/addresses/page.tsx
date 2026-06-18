'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Plus, MoreVertical } from 'lucide-react';
import Link from 'next/link';

export default function AddressesPage() {
  return (
    <div className="w-full min-h-screen bg-[#f4f0ea] pt-28 pb-20 px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#4a3129]/60 hover:text-[#4a3129] transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h1 className="heading text-[#4A3129] uppercase text-[30px] md:text-[40px] mb-2">Address Book</h1>
              <p className="text-[#8a7d72] max-w-xl">
                Manage your saved shipping and billing addresses for a faster checkout experience.
              </p>
            </div>
            <button className="flex items-center gap-2 bg-[#4a3129] text-white px-5 py-3 rounded-xl font-medium hover:bg-[#4a3129]/90 transition-colors shrink-0">
              <Plus size={18} /> Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default Shipping */}
            <div className="bg-white rounded-2xl border border-[#dfcac3]/40 p-6 sm:p-8 relative group hover:border-[#4a3129]/30 transition-colors shadow-sm">
              <div className="absolute top-6 right-6">
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#e3dbcf]/50 text-[#4a3129] text-[10px] uppercase tracking-widest font-bold mb-4">
                <MapPin size={12} /> Default Shipping
              </div>
              <h3 className="font-bold text-[#4a3129] text-lg mb-1">Jane Doe</h3>
              <p className="text-[#4a3129]/70 text-sm leading-relaxed mb-4">
                123 Fashion Avenue<br />
                Suite 400<br />
                New York, NY 10012<br />
                United States
              </p>
              <p className="text-[#4a3129]/50 text-xs">+1 (555) 123-4567</p>
            </div>

            {/* Default Billing */}
            <div className="bg-[#e3dbcf]/20 rounded-2xl border border-[#dfcac3]/40 p-6 sm:p-8 relative group hover:border-[#4a3129]/30 transition-colors">
              <div className="absolute top-6 right-6">
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#dfcac3] text-[#4a3129]/60 text-[10px] uppercase tracking-widest font-bold mb-4">
                Billing Address
              </div>
              <h3 className="font-bold text-[#4a3129] text-lg mb-1">Jane Doe</h3>
              <p className="text-[#4a3129]/70 text-sm leading-relaxed mb-4">
                123 Fashion Avenue<br />
                Suite 400<br />
                New York, NY 10012<br />
                United States
              </p>
              <p className="text-[#4a3129]/50 text-xs">+1 (555) 123-4567</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
