import React from 'react'
import { motion } from 'framer-motion';
import Image from 'next/image';
import { opacity } from '../../anim';

interface NavImageProps {
    src: string;
    isActive: boolean;
}

export default function Index({src, isActive}: NavImageProps) {
  return (
    <motion.div variants={opacity} initial="initial" animate={isActive ? "open" : "closed"} className="hidden min-[1000px]:block min-[1000px]:w-[500px] min-[1000px]:h-[450px] min-[1000px]:relative">
        <Image 
        src={`/images/${src}`}
        fill={true}
        alt="image"
        className="object-cover"
        />
    </motion.div>
  )
}