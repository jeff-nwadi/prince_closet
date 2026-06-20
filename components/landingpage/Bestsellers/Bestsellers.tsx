'use client'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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

interface Product {
  id: string | number;
  title: string;
  price: string;
  image: string;
  hoverImage?: string;
}

const SkeletonCard = () => (
  <div className="flex flex-col items-center bg-[#e3dbcf]/50 p-3 h-[495px] w-full animate-pulse">
    <div className="w-full h-[420px] bg-[#dfcac3]/40" />
    <div className="flex justify-between w-full pt-5">
      <div className="h-5 bg-[#dfcac3]/60 w-[60%]" />
      <div className="h-5 bg-[#dfcac3]/60 w-[20%]" />
    </div>
  </div>
);

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
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          // Take the first 3 products as bestsellers
          setBestsellers((data.products ?? []).slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching bestsellers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestsellers();
  }, []);

  return (
    <div ref={ref} id="bestsellers" data-scroll-section className='py-20 lg:py-32 px-3 lg:px-16 bg-[#f4f0ea]'>
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
        {loading ? (
          [...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : bestsellers.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} isInView={isInView} />
        ))}
      </div>
    </div>
  )
}

export default Bestsellers