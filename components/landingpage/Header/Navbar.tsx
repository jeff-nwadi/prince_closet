'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import '@/i18n';
import { opacity, background } from './anim';
import Nav from './Nav/Nav';
import { useCart } from '@/lib/cartContext';
import { User, LogOut, LayoutDashboard, Search, ChevronDown, X } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function Header() {
    const [isActive, setIsActive] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const userMenuRef = useRef<HTMLDivElement>(null);
    
    const router = useRouter();
    const { t } = useTranslation();
    const { cartCount } = useCart();
    const { data: session, isPending } = authClient.useSession();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        // Run once on mount in case the page is already scrolled
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close search modal on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsSearchOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="fixed w-full box-border bg-[#f4f0ea] py-4 px-3 lg:px-16 z-50 border-b border-[#dfcac3]">
            <div className="flex items-center justify-center text-[12px] sm:text-[15px] font-normal relative min-h-[32px] md:min-h-[40px]">
                <div onClick={() => {setIsActive(!isActive)}} className="absolute left-0 flex items-center gap-2 cursor-pointer z-10">
                    <div className={`w-[22.5px] relative pointer-events-none before:content-[''] after:content-[''] before:h-[1px] after:h-[1px] before:w-full after:w-full before:bg-black after:bg-black before:relative after:relative before:block after:block before:transition-all after:transition-all before:duration-1000 after:duration-1000 before:ease-[cubic-bezier(0.76,0,0.24,1)] after:ease-[cubic-bezier(0.76,0,0.24,1)] ${isActive ? "before:-rotate-45 before:top-[1px] after:rotate-45 after:-top-[1px]" : "before:top-[4px] after:-top-[4px]"}`}></div>
                    <div className="relative flex items-center">
                        <motion.p variants={opacity} animate={!isActive ? "open" : "closed"} className="m-0 text-[16px] md:text-[20px]"><span className='hidden md:flex'>{t('menu')}</span> </motion.p>
                        <motion.p variants={opacity} animate={isActive ? "open" : "closed"} className="m-0 absolute opacity-0 text-[16px] md:text-[20px]">{t('close')}</motion.p>
                    </div>
                </div>
                
                <Link href="/" className="no-underline text-[#4A3129] heading text-[18px] md:text-[24px] z-10 select-none">
                    <span className="inline">{t('brandName')}</span>
                </Link>

                <motion.div variants={opacity} animate={!isActive ? "open" : "closed"} className="flex gap-4 md:gap-[24px] absolute right-0 items-center z-10">
                    
                    {/* Search Icon */}
                    <button onClick={() => setIsSearchOpen(true)} className="flex items-center justify-center hover:opacity-60 transition-opacity">
                        <Search size={20} strokeWidth={1.5} color="#4D3D30" />
                    </button>

                    {isPending ? (
                        <div className="w-[20px] h-[20px] animate-pulse bg-[#dfcac3] rounded-full"></div>
                    ) : session ? (
                        <div className="relative" ref={userMenuRef}>
                            <button 
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                                className="flex items-center justify-center hover:opacity-60 transition-opacity"
                            >
                                <User size={20} strokeWidth={1.5} className={isUserMenuOpen ? 'text-black' : 'text-[#4D3D30]'} />
                            </button>
                            
                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                        className="absolute right-0 top-full mt-4 w-56 bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 py-2 flex flex-col overflow-hidden ring-1 ring-black/5"
                                    >
                                        <div className="px-5 py-3 border-b border-[#dfcac3]/30">
                                            <p className="text-[#4A3129] font-medium text-[15px] truncate">Hi, {session.user.name}</p>
                                            <p className="text-[#4A3129]/60 text-[12px] truncate">{session.user.email}</p>
                                        </div>
                                        <Link href="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#dfcac3]/20 text-[#4A3129] transition-all duration-200 text-[14px] font-medium group">
                                            <LayoutDashboard size={18} className="text-[#4A3129]/60 group-hover:text-[#4A3129] transition-colors" /> <span>Dashboard</span>
                                        </Link>
                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#dfcac3]/30 to-transparent my-1"></div>
                                        <button onClick={async () => { await authClient.signOut(); window.location.reload(); }} className="flex items-center gap-3 px-5 py-3.5 hover:bg-red-50/50 text-red-600 transition-all duration-200 w-full text-left text-[14px] font-medium group">
                                            <LogOut size={18} className="text-red-500/60 group-hover:text-red-600 transition-colors" /> <span>Logout</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link href="/login" className='m-0 hover:opacity-60 transition-opacity flex items-center'>
                            <User size={20} strokeWidth={1.5} color="#4D3D30" />
                        </Link>
                    )}
                    
                    {/* Cart Icon */}
                    <Link href="/cart" className="flex items-center justify-center gap-2 cursor-pointer relative hover:opacity-60 transition-opacity">
                        <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.66602 1.66667H2.75449C2.9595 1.66667 3.06201 1.66667 3.1445 1.70437C3.2172 1.73759 3.2788 1.79102 3.32197 1.85829C3.37096 1.93462 3.38546 2.0361 3.41445 2.23905L3.80887 5M3.80887 5L4.68545 11.4428C4.79669 12.2604 4.85231 12.6692 5.04777 12.977C5.22 13.2481 5.46692 13.4637 5.75881 13.5978C6.09007 13.75 6.50264 13.75 7.32777 13.75H14.4593C15.2448 13.75 15.6375 13.75 15.9585 13.6087C16.2415 13.4841 16.4842 13.2832 16.6596 13.0285C16.8585 12.7397 16.9319 12.3539 17.0789 11.5823L18.1819 5.79141C18.2337 5.51984 18.2595 5.38405 18.222 5.27792C18.1892 5.18481 18.1243 5.1064 18.039 5.05668C17.9417 5 17.8035 5 17.527 5H3.80887ZM8.33268 17.5C8.33268 17.9602 7.95959 18.3333 7.49935 18.3333C7.03911 18.3333 6.66602 17.9602 6.66602 17.5C6.66602 17.0398 7.03911 16.6667 7.49935 16.6667C7.95959 16.6667 8.33268 17.0398 8.33268 17.5ZM14.9993 17.5C14.9993 17.9602 14.6263 18.3333 14.166 18.3333C13.7058 18.3333 13.3327 17.9602 13.3327 17.5C13.3327 17.0398 13.7058 16.6667 14.166 16.6667C14.6263 16.6667 14.9993 17.0398 14.9993 17.5Z" stroke="#4D3D30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#4A3129] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </Link>
                </motion.div>
            </div>
            
            <motion.div variants={background} initial="initial" animate={isActive ? "open" : "closed"} className="bg-black opacity-50 h-full w-full absolute left-0 top-full"></motion.div>
            
            <AnimatePresence mode="wait">
                {isActive && <Nav onClose={() => setIsActive(false)} />}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-[60] bg-[#4A3129]/20 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: -30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/80 backdrop-blur-2xl w-full max-w-3xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden p-3 border border-white/60 ring-1 ring-[#dfcac3]/30 group"
                        >
                            <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
                                <div className="pl-4 pr-2">
                                    <Search size={24} className="text-[#4A3129]/40 group-focus-within:text-[#4A3129] transition-colors duration-300" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Search for premium products, collections..." 
                                    className="w-full bg-transparent border-none outline-none py-4 px-2 text-[16px] md:text-[20px] text-[#4A3129] placeholder:text-[#4A3129]/30 font-satoshi font-medium"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)} 
                                    className="mr-2 p-2.5 rounded-full hover:bg-[#dfcac3]/20 hover:text-black text-[#4A3129]/60 transition-all duration-300"
                                >
                                    <X size={20} />
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
