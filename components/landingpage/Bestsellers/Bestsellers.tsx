'use client'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { products } from '@/lib/products'

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

// We select the first 3 products from products.ts as our Bestsellers
const bestsellerProducts = products.slice(0, 3)

type Product = typeof products[0]

const ProductCard = ({ product, index, isInView }: { product: Product; index: number; isInView: boolean }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/shop/${product.id}`} className='block w-full h-full'>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={0.2 + index * 0.15}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ y: -6, transition: { duration: 0.35, ease: EASE } }}
        className='cursor-pointer h-full'
      >
        <div className='flex flex-col items-center bg-[#e3dbcf] pb-3 pl-3 pr-3 pt-3 h-full'>
          {/* Image wrapper — both images stacked, crossfade via opacity */}
          <div className='relative w-full h-[420px] overflow-hidden'>
            {/* Base image */}
            <Image
              src={product.image}
              alt={product.title}
              fill
              className='object-cover transition-opacity duration-700 ease-in-out'
              style={{ opacity: hovered ? 0 : 1 }}
            />
            {/* Hover image */}
            {product.hoverImage && (
              <Image
                src={product.hoverImage}
                alt={product.title}
                fill
                className='object-cover transition-opacity duration-700 ease-in-out'
                style={{ opacity: hovered ? 1 : 0 }}
              />
            )}
          </div>
          <div className='flex justify-between w-full pt-5 text-[#4A3129] font-medium'>
            <p>{product.title}</p>
            <p>{product.price}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

const Bestsellers = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { isInView } = useInView(ref, { margin: '-80px' })
  return (
    <div ref={ref} data-scroll-section className='py-20 lg:py-32 px-3 lg:px-16 bg-[#f4f0ea]'>
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
          className='body-text w-[70%] md:w-[50%] lg:w-[30%] text-sm sm:text-base md:text-lg text-[#8a7d72] max-w-md font-mono leading-relaxed'
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