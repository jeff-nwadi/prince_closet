'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquare, Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    orderNumber: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', orderNumber: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f0ea] pt-28 pb-20 px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#4a3129]/60 hover:text-[#4a3129] transition-colors mb-12 text-[12px] md:text-sm uppercase tracking-wider">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16"
        >
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <h1 className="heading text-[#4A3129] uppercase text-[22px] md:text-[40px] mb-4 leading-tight">Contact Support</h1>
            <p className="text-[#8a7d72] mb-12 text-[15px] md:text-base  leading-relaxed">
              Have a question about an order, styling advice, or our return policy? We're here to help. Send us a message and we'll reply within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative">
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[#e3dbcf]/50 text-[#4a3129] border border-[#dfcac3] p-4 flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium uppercase tracking-wider">Message sent successfully. We will be in touch.</p>
                  </motion.div>
                )}
                
                {status === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 text-red-800 border border-red-200 p-4 text-sm font-medium uppercase tracking-wider"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2 group">
                  <label htmlFor="firstName" className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60 group-focus-within:text-[#4a3129] transition-colors">First Name</label>
                  <input required id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="bg-transparent border-b border-[#dfcac3] pb-3 text-[#4a3129] outline-none focus:border-[#4a3129] transition-all placeholder:text-transparent" placeholder="Jane" />
                </div>
                <div className="flex flex-col gap-2 group">
                  <label htmlFor="lastName" className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60 group-focus-within:text-[#4a3129] transition-colors">Last Name</label>
                  <input required id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="bg-transparent border-b border-[#dfcac3] pb-3 text-[#4a3129] outline-none focus:border-[#4a3129] transition-all placeholder:text-transparent" placeholder="Doe" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2 group">
                <label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60 group-focus-within:text-[#4a3129] transition-colors">Email Address</label>
                <input required id="email" name="email" value={formData.email} onChange={handleChange} type="email" className="bg-transparent border-b border-[#dfcac3] pb-3 text-[#4a3129] outline-none focus:border-[#4a3129] transition-all placeholder:text-transparent" placeholder="jane@example.com" />
              </div>

              <div className="flex flex-col gap-2 group">
                <label htmlFor="orderNumber" className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60 group-focus-within:text-[#4a3129] transition-colors">Order Number (Optional)</label>
                <input id="orderNumber" name="orderNumber" value={formData.orderNumber} onChange={handleChange} type="text" className="bg-transparent border-b border-[#dfcac3] pb-3 text-[#4a3129] outline-none focus:border-[#4a3129] transition-all placeholder:text-transparent" placeholder="ORD-XXXX-PC" />
              </div>

              <div className="flex flex-col gap-2 group">
                <label htmlFor="message" className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60 group-focus-within:text-[#4a3129] transition-colors">Message</label>
                <textarea required id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className="bg-transparent border-b border-[#dfcac3] pb-3 text-[#4a3129] outline-none focus:border-[#4a3129] transition-all resize-none placeholder:text-transparent" placeholder="How can we help you today?"></textarea>
              </div>

              <button disabled={status === 'loading'} type="submit" className="bg-[#4A3129] text-white py-4 font-normal uppercase tracking-widest text-[13px] hover:bg-[#3A241C] transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {status === 'loading' ? (
                  <><Loader2 className="animate-spin h-4 w-4" /> SENDING...</>
                ) : (
                  'SEND MESSAGE'
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Contact Info */}
          <div className="lg:col-span-5 flex flex-col gap-0 lg:pt-[110px]">
            <div className="border border-[#dfcac3] p-8 flex flex-col gap-8 bg-white/40">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 border border-[#dfcac3] flex items-center justify-center shrink-0 bg-[#f4f0ea]">
                  <MessageSquare className="h-4 w-4 text-[#4a3129]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#4a3129] text-[13px] uppercase tracking-widest mb-1">Live Chat</h3>
                  <p className="text-[#4a3129]/70 text-xs mb-3">Available Mon-Fri, 9am-6pm EST</p>
                  <button className="text-[11px] uppercase tracking-widest font-bold border-b border-[#4a3129] text-[#4a3129] pb-0.5 hover:text-[#4a3129]/70 transition-colors">Start a Chat</button>
                </div>
              </div>

              <div className="h-px w-full bg-[#dfcac3]" />

              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 border border-[#dfcac3] flex items-center justify-center shrink-0 bg-[#f4f0ea]">
                  <Mail className="h-4 w-4 text-[#4a3129]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#4a3129] text-[13px] uppercase tracking-widest mb-1">Email Us</h3>
                  <p className="text-[#4a3129]/70 text-xs mb-3">We generally reply within 24 hours.</p>
                  <a href="mailto:support@princescloset.com" className="text-[11px] uppercase tracking-widest font-bold border-b border-[#4a3129] text-[#4a3129] pb-0.5 hover:text-[#4a3129]/70 transition-colors">support@princescloset.com</a>
                </div>
              </div>

              <div className="h-px w-full bg-[#dfcac3]" />

              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 border border-[#dfcac3] flex items-center justify-center shrink-0 bg-[#f4f0ea]">
                  <Phone className="h-4 w-4 text-[#4a3129]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#4a3129] text-[13px] uppercase tracking-widest mb-1">Call Us</h3>
                  <p className="text-[#4a3129]/70 text-xs mb-3">Available Mon-Fri, 9am-6pm EST</p>
                  <a href="tel:+15551234567" className="text-[11px] uppercase tracking-widest font-bold border-b border-[#4a3129] text-[#4a3129] pb-0.5 hover:text-[#4a3129]/70 transition-colors">+1 (555) 123-4567</a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
