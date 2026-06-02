
import { translate } from '../../anim';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <div className="flex items-end flex-wrap text-[12px] uppercase mt-[40px] min-[1000px]:justify-between">
            <ul className="w-1/2 mt-[10px] overflow-hidden list-none p-0 min-[1000px]:w-auto">
                <motion.li 
                    custom={[0.3, 0]} 
                    variants={translate} initial="initial" 
                    animate="enter" 
                    exit="exit">
                    <span className="text-[#9f9689]">Made by:</span>Studio Lumio
                </motion.li>
            </ul>
            <ul className="w-1/2 mt-[10px] overflow-hidden list-none p-0 min-[1000px]:w-auto">
                <motion.li  
                    custom={[0.3, 0]} 
                    variants={translate} initial="initial" 
                    animate="enter" 
                    exit="exit">
                    <span className="text-[#9f9689]">Typography:</span> Google Fonts
                </motion.li>
            </ul>
            <ul className="w-1/2 mt-[10px] overflow-hidden list-none p-0 min-[1000px]:w-auto">
                <motion.li
                    custom={[0.3, 0]} 
                    variants={translate} initial="initial" 
                    animate="enter" 
                    exit="exit">
                    <span className="text-[#9f9689]">Images:</span> Freepik, Envato
                </motion.li>
            </ul>
            <ul className="w-1/2 mt-[10px] overflow-hidden list-none p-0 min-[1000px]:w-auto">
                <motion.li
                    custom={[0.3, 0]} 
                    variants={translate} initial="initial" 
                    animate="enter" 
                    exit="exit">
                    Privacy Policy
                </motion.li>
                <motion.li 
                    custom={[0.3, 0]} 
                    variants={translate} initial="initial" 
                    animate="enter" 
                    exit="exit">
                    Terms & Conditions
                </motion.li>
            </ul>
        </div>
    )
}