'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '@/i18n';
import { opacity, background } from './anim';
import Nav from './Nav/Nav';
import { useCart } from '@/lib/cartContext';


export default function Header() {

    const [isActive, setIsActive] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { t } = useTranslation();
    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        // Run once on mount in case the page is already scrolled
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed w-full box-border bg-[#f4f0ea] py-4 px-3 lg:px-16 z-50 border-b border-[#dfcac3]">
            <div className="flex items-center justify-center text-[12px] sm:text-[15px] font-normal relative min-h-[32px] md:min-h-[40px]">
                <div onClick={() => {setIsActive(!isActive)}} className="absolute left-0 flex items-center gap-2 cursor-pointer z-10">
                    <div className={`w-[22.5px] relative pointer-events-none before:content-[''] after:content-[''] before:h-[1px] after:h-[1px] before:w-full after:w-full before:bg-black after:bg-black before:relative after:relative before:block after:block before:transition-all after:transition-all before:duration-1000 after:duration-1000 before:ease-[cubic-bezier(0.76,0,0.24,1)] after:ease-[cubic-bezier(0.76,0,0.24,1)] ${isActive ? "before:-rotate-45 before:top-[1px] after:rotate-45 after:-top-[1px]" : "before:top-[4px] after:-top-[4px]"}`}></div>
                    <div className="relative flex items-center">
                        <motion.p variants={opacity} animate={!isActive ? "open" : "closed"} className="m-0 text-[16px] md:text-[20px]">{t('menu')}</motion.p>
                        <motion.p variants={opacity} animate={isActive ? "open" : "closed"} className="m-0 absolute opacity-0 text-[16px] md:text-[20px]">{t('close')}</motion.p>
                    </div>
                </div>
                <Link href="/" className="no-underline text-[#4A3129] heading text-[18px] md:text-[24px] z-10 select-none">
                    {/* <span className="md:hidden">P Closet</span> */}
                    <span className="inline">{t('brandName')}</span>
                </Link>
                <motion.div variants={opacity} animate={!isActive ? "open" : "closed"} className="flex gap-[30px] absolute right-0 items-center z-10">
                    <Link href="/login" className="hidden sm:block m-0 hover:opacity-60 transition-opacity">{t('Login')}</Link>
                    <Link href="/signup" className="hidden sm:block m-0 hover:opacity-60 transition-opacity">{t('Create Account')}</Link>
                    <Link href="/cart" className="flex items-center justify-center gap-2 cursor-pointer relative">
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
        </div>
    )
}