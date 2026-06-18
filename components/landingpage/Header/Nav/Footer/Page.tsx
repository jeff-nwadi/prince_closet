
import { translate } from '../../anim';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
    return (
        <div className="flex w-full items-end flex-wrap text-[12px] uppercase mt-[40px] md:mt-[60px] min-[1000px]:justify-between border-t border-[#dfcac3] pt-6 gap-y-8">
            <ul className="w-1/2 min-[1000px]:w-auto overflow-hidden list-none p-0">
                <motion.li 
                    custom={[0.3, 0]} 
                    variants={translate} initial="initial" 
                    animate="enter" 
                    exit="exit"
                    className="flex flex-col gap-1.5 group cursor-pointer"
                >
                    <span className="text-[#9f9689] font-medium tracking-widest text-[10px]">Made by</span>
                    <span className="text-[#4A3129] relative inline-flex overflow-hidden font-semibold">
                        <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[120%]">Studio Lumio</span>
                        <span className="absolute left-0 top-[120%] inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[120%] text-[#4A3129]">Studio Lumio</span>
                    </span>
                </motion.li>
            </ul>
            <ul className="w-1/2 min-[1000px]:w-auto overflow-hidden list-none p-0">
                <motion.li  
                    custom={[0.3, 0]} 
                    variants={translate} initial="initial" 
                    animate="enter" 
                    exit="exit"
                    className="flex flex-col gap-1.5 group cursor-pointer"
                >
                    <span className="text-[#9f9689] font-medium tracking-widest text-[10px]">Typography</span>
                    <span className="text-[#4A3129] relative inline-flex overflow-hidden font-semibold">
                        <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[120%]">Google Fonts</span>
                        <span className="absolute left-0 top-[120%] inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[120%] text-[#4A3129]">Google Fonts</span>
                    </span>
                </motion.li>
            </ul>
            <ul className="w-1/2 min-[1000px]:w-auto overflow-hidden list-none p-0">
                <motion.li
                    custom={[0.3, 0]} 
                    variants={translate} initial="initial" 
                    animate="enter" 
                    exit="exit"
                    className="flex flex-col gap-1.5 group cursor-pointer"
                >
                    <span className="text-[#9f9689] font-medium tracking-widest text-[10px]">Images</span>
                    <span className="text-[#4A3129] relative inline-flex overflow-hidden font-semibold">
                        <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[120%]">Freepik, Envato</span>
                        <span className="absolute left-0 top-[120%] inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[120%] text-[#4A3129]">Freepik, Envato</span>
                    </span>
                </motion.li>
            </ul>
            <ul className="w-1/2 min-[1000px]:w-auto overflow-hidden list-none p-0 flex flex-col gap-3 min-[1000px]:items-end justify-end">
                <motion.li
                    custom={[0.3, 0]} 
                    variants={translate} initial="initial" 
                    animate="enter" 
                    exit="exit"
                >
                    <a href="#" className="flex items-center gap-1 group text-[#4A3129] hover:text-[#4A3129]/70 transition-colors duration-300 font-semibold relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-[#4A3129] hover:after:w-full after:transition-all after:duration-300">
                        Privacy Policy <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                    </a>
                </motion.li>
                <motion.li 
                    custom={[0.3, 0]} 
                    variants={translate} initial="initial" 
                    animate="enter" 
                    exit="exit"
                >
                    <a href="#" className="flex items-center gap-1 group text-[#4A3129] hover:text-[#4A3129]/70 transition-colors duration-300 font-semibold relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-[#4A3129] hover:after:w-full after:transition-all after:duration-300">
                        Terms & Conditions <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                    </a>
                </motion.li>
            </ul>
        </div>
    )
}