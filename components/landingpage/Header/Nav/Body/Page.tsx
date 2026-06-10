import React from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { blur, translate } from '../../anim';

interface LinkType {
    title: string;
    href: string;
    src?: string;
}

interface SelectedLinkType {
    isActive: boolean;
    index: number;
}

interface NavBodyProps {
    links: LinkType[];
    selectedLink: SelectedLinkType;
    setSelectedLink: React.Dispatch<React.SetStateAction<SelectedLinkType>>;
    onLinkClick?: () => void;
}

export default function Body({links, selectedLink, setSelectedLink, onLinkClick}: NavBodyProps) {

    const getChars = (word: string) => {
        const chars: React.JSX.Element[] = [];
        word.split("").forEach( (char, i) => {
          chars.push(
            <motion.span 
                custom={[i * 0.02, (word.length - i) * 0.01]} 
                variants={translate} initial="initial" 
                animate="enter" 
                exit="exit" 
                key={char + i}>
                {char === ' ' ? '\u00A0' : char}
            </motion.span>
            )
        })
        return chars;
    }
    
    return (
        <div className="flex flex-col mt-[40px] min-[1000px]:max-w-[1200px] min-[1000px]:mt-[80px]">
        {
            links.map( (link, index) => {
                const { title, href } = link;
                return <Link key={`l_${index}`} href={href} className="text-black no-underline" onClick={onLinkClick}>
                <motion.p 
                    className="m-0 flex overflow-hidden text-[18px] pr-[30px] pt-[10px] font-light min-[1000px]:text-[2vw] min-[1000px]:pr-[2vw]"
                    onMouseOver={() => {setSelectedLink({isActive: true, index})}} 
                    onMouseLeave={() => {setSelectedLink({isActive: false, index})}} 
                    variants={blur} 
                    animate={selectedLink.isActive && selectedLink.index != index ? "open" : "closed"}>
                    {getChars(title)}
                </motion.p>
                </Link>
            })
        }
        </div>
    )
}