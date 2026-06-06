'use client'
import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import Link from 'next/link'

const categoryImages = [
  { id: 1, title: "Tees", image: "/images/tees.png", hoverImage: "/images/img_1.png", description: "Heavyweight organic cotton staples.", isSpecial: false },
  { id: 2, title: "Bottoms", image: "/images/img_2.png", hoverImage: "/images/img_3.png", description: "Utility cuts built for movement.", isSpecial: false },
  { id: 3, title: "Outerwear", image: "/images/img_3.png", hoverImage: "/images/img_2.png", description: "Heavyweight layerables for changing seasons.", isSpecial: false },
  { id: 4, title: "Headwear", image: "/images/cap.png", hoverImage: "/images/headwear.png", description: "Structured profiles and classic caps.", isSpecial: false },
  { id: 5, title: "New Arrivals", image: "/images/img_5.png", hoverImage: "/images/hoddies.png", description: "The latest seasonal drops.", isSpecial: false },
  { id: 6, title: "Shop All", image: "", hoverImage: "", description: "Explore the full collection.", isSpecial: true }
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: EASE,
    },
  }),
}

type CategoryItem = {
  id: number
  title: string
  image: string
  hoverImage: string
  description: string
  isSpecial: boolean
}

const CategoryCard = ({ item, index, isInView }: { item: CategoryItem; index: number; isInView: boolean }) => {
  const [hovered, setHovered] = useState(false)

  let href = '/shop';
  if (item.title === 'Tees') href = '/shop?category=tees';
  else if (item.title === 'Bottoms') href = '/shop?category=bottoms-wears';
  else if (item.title === 'Outerwear') href = '/shop?category=hoodies';
  else if (item.title === 'Headwear') href = '/shop?category=headwear';
  else if (item.title === 'New Arrivals') href = '/shop?category=new-arrival';

  return (
    <Link href={href} className='w-full flex flex-col group'>
      <motion.div
        key={item.id}
        className='w-full flex flex-col cursor-pointer border border-[#4A3129]/5 bg-[#e8e3d9]'
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"} 
        custom={0.1 + index * 0.1}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Card Content (Image or Special Block) */}
        <div className="relative w-full aspect-4/5 overflow-hidden flex rounded-none">
          {item.isSpecial ? (
            // Special 6th Card ("Shop All") split layout
            <div className="w-full h-full flex bg-[#8c7e73]">
              {/* Left cream stripe */}
              <div className="w-12 lg:w-14 h-full bg-[#e2dbcd]" />
              {/* Right description block */}
              <div className="flex-1 h-full flex flex-col justify-center items-start p-8 lg:p-10 text-left">
                <p className="text-[#f4f1eb] text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-[220px] font-mono opacity-90 transition-transform duration-500 group-hover:translate-x-1">
                  Explore the full catalog of modern essentials
                </p>
              </div>
            </div>
          ) : (
            // Standard Image Card — crossfade on hover
            <div className="w-full h-full relative bg-[#e2dbcd]/50">
              {/* Base image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className='object-cover transition-opacity duration-700 ease-in-out'
                style={{ opacity: hovered ? 0 : 1 }}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Hover image */}
              {item.hoverImage && (
                <Image
                  src={item.hoverImage}
                  alt={item.title}
                  fill
                  className='object-cover transition-opacity duration-700 ease-in-out'
                  style={{ opacity: hovered ? 1 : 0 }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              {/* Micro-overlay on hover */}
              <div className="absolute inset-0 bg-[#4A3129]/0 group-hover:bg-[#4A3129]/5 transition-colors duration-500 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Footer Banner — fixed height so hover NEVER changes card size */}
        <div className="relative bg-[#e2dbcd] px-6 h-32 flex items-center justify-between border-t border-[#4A3129]/10 transition-colors duration-300 ease-out group-hover:bg-[#4A3129]">
          <div className="flex flex-col justify-center text-left overflow-hidden gap-3">
            {/* Description: absolute, slides up on hover — NO height change */}
            {!item.isSpecial && (
              <p className="text-[16px] text-[#f4f0ea]/80 font-normal opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out pointer-events-none">
                {item.description}
              </p> 
            )}
            <span className="text-lg md:text-[20px] text-[#4A3129] heading uppercase tracking-wider font-semibold transition-colors duration-300 group-hover:text-[#f4f0ea] leading-none">
              {item.title}
            </span>
          </div>
          {/* Square Arrow Button with micro-interactions */}
          <div className="w-10 h-10 md:w-12 md:h-12 border border-[#4A3129]/30 flex items-center justify-center bg-transparent text-[#4A3129] group-hover:bg-transparent group-hover:text-[#f4f0ea] group-hover:border-[#f4f0ea]/40 transition-all duration-[400ms] ease-out flex-shrink-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-[400ms] ease-out"
            >
              <path
                d="M1.5 12.5L12.5 1.5M12.5 1.5H3.5M12.5 1.5V10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

const Category = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { isInView } = useInView(ref, { margin: '-80px' })

  return (
    <div ref={ref} data-scroll-section className='py-20 lg:py-32 px-3 lg:px-16 bg-[#f4f0ea]'>
      {/* Title block with entrance animation */}
      <div className="mb-16 lg:mb-24">
        <motion.h2
          className='heading text-[20px] md:text-[30px] text-[#4A3129] mb-4 uppercase'
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
        >
          Shop by category
        </motion.h2>
        <motion.h3
          className='body-text w-[70%] md:w-[50%] lg:w-[30%] text-sm sm:text-base md:text-lg text-[#8a7d72] max-w-md font-mono leading-relaxed'
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.15}
        >
          Explore our curated collections of earth-toned essentials made for daily living.
        </motion.h3>
      </div>

      {/* Grid container — staggered card entrance */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10'>
        {categoryImages.map((item, index) => (
          <CategoryCard key={item.id} item={item} index={index} isInView={isInView} />
        ))}
      </div>
    </div>
  )
}

export default Category
