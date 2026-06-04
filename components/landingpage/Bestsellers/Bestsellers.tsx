'use client'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import React, { useRef, useState } from 'react'
import Image from 'next/image'

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

const bestsellerProducts = [
    {
        id: 1,
        title: 'Classic Logo Tee',
        images: ['/images/tees.png', '/images/img_1.png'],
        price: '€89',
    },
    {
        id: 2,
        title: 'Linen Blend Shorts',
        images: ['/images/img_3.png', '/images/img_5.png'],
        price: '€75',
    },
    {
        id: 3,
        title: 'Oversized Hoodie',
        images: ['/images/hoddies.png', '/images/img_3.png'],
        price: '€110',
    }
]

type Product = {
  id: number
  title: string
  images: string[]
  price: string
}

const ProductCard = ({ product, index, isInView }: { product: Product; index: number; isInView: boolean }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={0.2 + index * 0.15}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: EASE } }}
      className='cursor-pointer'
    >
      <div className='flex flex-col items-center bg-[#e3dbcf] pb-3 pl-3 pr-3 pt-3'>
        {/* Image wrapper — both images stacked, crossfade via opacity */}
        <div className='relative w-full h-[420px] overflow-hidden'>
          {/* Base image */}
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className='object-cover transition-opacity duration-700 ease-in-out'
            style={{ opacity: hovered ? 0 : 1 }}
          />
          {/* Hover image */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.title}
              fill
              className='object-cover transition-opacity duration-700 ease-in-out'
              style={{ opacity: hovered ? 1 : 0 }}
            />
          )}
        </div>
        <div className='flex justify-between w-full pt-5'>
          <p>{product.title}</p>
          <p>{product.price}</p>
        </div>
      </div>
    </motion.div>
  )
}

const Bestsellers = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { isInView } = useInView(ref, { margin: '-80px' })
  return (
    <div ref={ref} data-scroll-section className='py-20 lg:py-32 px-6 lg:px-16 bg-[#f4f0ea]'>
        {/* Title block with entrance animation */}
      <div className="mb-16 lg:mb-24">
        <motion.h2
          className='heading text-[20px] md:text-[30px] text-[#4A3129] mb-4 uppercase tracking-wide'
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
        >
          Bestsellers
        </motion.h2>
        <motion.h3
          className='body-text lg:w-[30%] text-sm sm:text-base md:text-lg text-[#8a7d72] max-w-md font-mono leading-relaxed'
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.15}
        >
          Shop the crowd favorite. These are the most-loved styles our community adores. 
        </motion.h3>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {bestsellerProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} isInView={isInView} />
        ))}
      </div>
    </div>
  )
}

export default Bestsellers