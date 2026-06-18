'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Settings, User, Mail, Shield, CreditCard, ChevronRight } from 'lucide-react';
import { customer } from './DashboardData';
import Link from 'next/link';

const mockNotifications = [
  { id: 1, title: 'Order Shipped', message: 'Your order #ORD-8923-PC is on the way.', time: '2 hours ago', read: false },
  { id: 2, title: 'New Arrival', message: 'The Fall Collection is finally here. Shop now.', time: '1 day ago', read: true },
  { id: 3, title: 'Review Request', message: 'How do you like your Classic Trench?', time: '3 days ago', read: true },
];

export default function DashboardTopBar({ user }: { user?: any }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const name = user?.name || customer.name;
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <>
      <header className="flex items-center justify-between gap-4 mb-6 relative">
        {/* Left: avatar + greeting */}
        <div className="flex items-center gap-3">
          <div
            className="h-11 w-11 rounded-full bg-[#4A3129] flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <span className="text-[#f4f0ea] text-sm font-medium tracking-wide select-none">
              {initials}
            </span>
          </div>

          <div className="min-w-0">
            <p className="text-[15px] font-bold text-[#4a3129] leading-tight truncate">
              {greeting},{' '}
              <span className="text-[#8a7d72]">
                {name.split(' ')[0]}
              </span>{' '}
            </p>
            <p className="text-xs text-[#4a3129]/60 mt-0.5 leading-tight font-medium">
              {customer.location} · Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Right: icon buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(true)}
            aria-label="View notifications"
            className="relative h-10 w-10 border border-[#dfcac3] bg-white flex items-center justify-center text-[#4a3129] hover:bg-[#4a3129] hover:text-white transition-all duration-300 rounded-none cursor-pointer"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
            {/* unread dot */}
            {unreadCount > 0 && (
              <span
                className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"
                aria-label="You have unread notifications"
              />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(true)}
            aria-label="Open settings"
            className="h-10 w-10 border border-[#dfcac3] bg-white flex items-center justify-center text-[#4a3129] hover:bg-[#4a3129] hover:text-white transition-all duration-300 rounded-none cursor-pointer"
          >
            <Settings className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Notifications Slide-over */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowNotifications(false)}
              className="absolute inset-0 bg-[#2a1f1a]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-[#f4f0ea] h-full shadow-2xl flex flex-col border-l border-[#dfcac3]/50 z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#dfcac3]/50 bg-white">
                <h2 className="text-[#4A3129] uppercase tracking-widest font-bold text-sm">Notifications</h2>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[#4a3129]/60 hover:text-[#4a3129] transition-colors cursor-pointer"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {mockNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-6 border-b border-[#dfcac3]/30 flex flex-col gap-1 transition-colors hover:bg-white/50 cursor-pointer ${notification.read ? 'opacity-70' : 'bg-white'}`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-[#4a3129] text-sm uppercase tracking-wide flex items-center gap-2">
                        {!notification.read && <span className="h-1.5 w-1.5 rounded-full bg-[#534AB7] inline-block" />}
                        {notification.title}
                      </h3>
                      <span className="text-[10px] text-[#4a3129]/50 uppercase font-bold tracking-wider">{notification.time}</span>
                    </div>
                    <p className="text-[#4a3129]/80 text-sm mt-1">{notification.message}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-[#dfcac3]/50 bg-white">
                <button className="w-full py-3 border border-[#4a3129] text-[#4a3129] text-xs font-bold uppercase tracking-widest hover:bg-[#4a3129] hover:text-white transition-colors">
                  Mark all as read
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-[#2a1f1a]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl bg-[#f4f0ea] flex flex-col z-10 max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#dfcac3]/50 bg-white">
                <h2 className="text-[#4A3129] text-base font-bold">Account Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-[#4a3129]/60 hover:text-[#4a3129] transition-colors cursor-pointer"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">  
                {/* Sidebar */}
                <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[#dfcac3]/50 bg-white/50 p-4 flex flex-col gap-2">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-3 p-3 text-left w-full border transition-all ${activeTab === 'profile' ? 'bg-white border-[#dfcac3]/50 text-[#4a3129]' : 'border-transparent text-[#4a3129]/60 hover:text-[#4a3129] hover:border-[#dfcac3]/50'}`}
                  >
                    <User size={16} strokeWidth={1.5} />
                    <span className="text-xs font-bold">Profile</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-3 p-3 text-left w-full border transition-all ${activeTab === 'security' ? 'bg-white border-[#dfcac3]/50 text-[#4a3129]' : 'border-transparent text-[#4a3129]/60 hover:text-[#4a3129] hover:border-[#dfcac3]/50'}`}
                  >
                    <Shield size={16} strokeWidth={1.5} />
                    <span className="text-xs font-bold">Security</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('billing')}
                    className={`flex items-center gap-3 p-3 text-left w-full border transition-all ${activeTab === 'billing' ? 'bg-white border-[#dfcac3]/50 text-[#4a3129]' : 'border-transparent text-[#4a3129]/60 hover:text-[#4a3129] hover:border-[#dfcac3]/50'}`}
                  >
                    <CreditCard size={16} strokeWidth={1.5} />
                    <span className="text-xs font-bold">Billing</span>
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 sm:p-8 bg-white flex flex-col gap-8">
                  {activeTab === 'profile' && (
                    <div>
                      <h3 className="text-[#4A3129] text-lg font-bold mb-6">Personal Information</h3>
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2 group">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60 group-focus-within:text-[#4a3129] transition-colors">Full Name</label>
                          <input type="text" defaultValue={name} className="bg-transparent border-b border-[#dfcac3] pb-3 text-[#4a3129] outline-none focus:border-[#4a3129] transition-all" />
                        </div>
                        <div className="flex flex-col gap-2 group">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60 group-focus-within:text-[#4a3129] transition-colors">Email Address</label>
                          <input type="email" defaultValue={user?.email || "jane@example.com"} className="bg-transparent border-b border-[#dfcac3] pb-3 text-[#4a3129] outline-none focus:border-[#4a3129] transition-all" />
                        </div>
                        <div className="flex flex-col gap-2 group">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60 group-focus-within:text-[#4a3129] transition-colors">Phone Number</label>
                          <input type="tel" defaultValue="+1 (555) 123-4567" className="bg-transparent border-b border-[#dfcac3] pb-3 text-[#4a3129] outline-none focus:border-[#4a3129] transition-all" />
                        </div>
                      </div>
                      <div className="pt-8 mt-2 border-t border-[#dfcac3]/30">
                        <button className="bg-[#4A3129] text-white py-3 px-8 font-normal uppercase tracking-widest text-xs hover:bg-[#3A241C] transition-colors rounded-none">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div>
                      <h3 className="text-[#4A3129] text-lg font-bold mb-6">Update Password</h3>
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2 group">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60 group-focus-within:text-[#4a3129] transition-colors">Current Password</label>
                          <input type="password" placeholder="••••••••" className="bg-transparent border-b border-[#dfcac3] pb-3 text-[#4a3129] outline-none focus:border-[#4a3129] transition-all placeholder:text-[#4a3129]/30" />
                        </div>
                        <div className="flex flex-col gap-2 group">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60 group-focus-within:text-[#4a3129] transition-colors">New Password</label>
                          <input type="password" placeholder="••••••••" className="bg-transparent border-b border-[#dfcac3] pb-3 text-[#4a3129] outline-none focus:border-[#4a3129] transition-all placeholder:text-[#4a3129]/30" />
                        </div>
                        <div className="flex flex-col gap-2 group">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60 group-focus-within:text-[#4a3129] transition-colors">Confirm New Password</label>
                          <input type="password" placeholder="••••••••" className="bg-transparent border-b border-[#dfcac3] pb-3 text-[#4a3129] outline-none focus:border-[#4a3129] transition-all placeholder:text-[#4a3129]/30" />
                        </div>
                      </div>
                      <div className="pt-8 mt-2 border-t border-[#dfcac3]/30">
                        <button className="bg-[#4A3129] text-white py-3 px-8 font-normal uppercase tracking-widest text-xs hover:bg-[#3A241C] transition-colors rounded-none">
                          Update Password
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'billing' && (
                    <div>
                      <h3 className="text-[#4A3129] text-lg font-bold mb-6">Payment Methods</h3>
                      <div className="flex flex-col gap-4 mb-8">
                        <div className="border border-[#dfcac3] p-4 flex justify-between items-center bg-[#f4f0ea]/30">
                          <div className="flex items-center gap-4">
                            <div className="h-8 w-12 bg-[#4a3129] rounded flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
                            <div>
                              <p className="text-sm font-bold text-[#4a3129]">•••• 4242</p>
                              <p className="text-xs text-[#4a3129]/60">Expires 12/26</p>
                            </div>
                          </div>
                          <button className="text-xs text-[#4a3129] font-bold underline">Remove</button>
                        </div>
                        <button className="border border-dashed border-[#dfcac3] p-4 text-[#4a3129]/70 text-sm font-bold hover:bg-[#f4f0ea]/30 transition-colors flex justify-center items-center gap-2">
                          + Add Payment Method
                        </button>
                      </div>

                      <h3 className="text-[#4A3129] text-lg font-bold mb-4">Billing History</h3>
                      <div className="border border-[#dfcac3]/50 divide-y divide-[#dfcac3]/50">
                        <div className="p-4 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-[#4a3129]">Order #ORD-8923</p>
                            <p className="text-xs text-[#4a3129]/60">Oct 12, 2023</p>
                          </div>
                          <span className="text-sm font-bold text-[#4a3129]">€245.00</span>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-[#4a3129]">Order #ORD-7102</p>
                            <p className="text-xs text-[#4a3129]/60">Sep 04, 2023</p>
                          </div>
                          <span className="text-sm font-bold text-[#4a3129]">€120.00</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
