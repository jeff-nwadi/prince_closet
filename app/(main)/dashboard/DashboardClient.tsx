'use client';

import { motion } from 'framer-motion';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import DashboardStatsRow from '@/components/dashboard/DashboardStatsRow';
import DashboardRecentOrders from '@/components/dashboard/DashboardRecentOrders';
import DashboardShipmentTracker from '@/components/dashboard/DashboardShipmentTracker';
import DashboardWishlistPreview from '@/components/dashboard/DashboardWishlistPreview';
import DashboardBottomNav from '@/components/dashboard/DashboardBottomNav';

const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function DashboardClient({ user, orders, wishlist, shipment, stats }: { user: any; orders: any[]; wishlist: any[]; shipment: any; stats: any[] }) {
  return (
    <div className="w-full min-h-screen bg-[#f4f0ea] pt-28 pb-20 px-4 sm:px-8 md:px-16 lg:px-20">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Top bar */}
        <motion.div variants={itemVariants}>
          <DashboardTopBar user={user} />
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants}>
          <DashboardStatsRow stats={stats} />
        </motion.div>

        {/* Main Grid: Recent Orders on Left (7/12 cols), Trackers on Right (5/12 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <DashboardRecentOrders orders={orders} />
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-6">
            <DashboardShipmentTracker shipment={shipment} />
            <DashboardWishlistPreview wishlistItems={wishlist} />
          </motion.div>
        </div>

        {/* Bottom Nav Cards */}
        <motion.div variants={itemVariants}>
          <DashboardBottomNav />
        </motion.div>
      </motion.div>
    </div>
  );
}
