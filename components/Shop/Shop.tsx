'use client';

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { products } from '@/lib/products'

const links = [
  { title: "All" , category: "all", href: "/shop" },
  { title: "New Arrival" , category: "new-arrival", href: "/shop?category=new-arrival" },
  { title: "Tees" , category: "tees", href: "/shop?category=tees" },
  { title: "Bottoms wears" , category: "bottoms-wears", href: "/shop?category=bottoms-wears" },
  { title: "Hoodies" , category: "hoodies", href: "/shop?category=hoodies" },  
  { title: "Headwear" , category: "headwear", href: "/shop?category=headwear" },
] 



// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay: i * 0.08 },
  }),
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: 'easeOut' as const, delay: i * 0.1 },
  }),
}

const ShopContent = () => {
  const searchParams = useSearchParams();
  // Use null check — null means no ?category param, i.e. "All"
  const categoryParam = searchParams.get('category');
  const currentCategory = categoryParam ?? 'all';

  const filteredProducts = currentCategory === 'all'
    ? products
    : products.filter(product => product.category === currentCategory);

  return (
    <div>
      <section className='min-h-screen pt-28 pb-20 px-6 sm:px-12 md:px-16'> 
        {/* <Link href="/" className='text-[#4a3129] hover:text-[#4A3129]/80 font-normal uppercase text-[14px] md:text-[16px] flex items-center mb-6'> <ArrowLeft size={20} className='inline-block mr-2' /> Home</Link> */}

        {/* Header */}
        <motion.div
          className='bg-[#f4f0ea]'
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.h2
            variants={fadeUp}
            className='heading text-[#4A3129] uppercase text-[20px] md:text-[30px] lg:text-[40px]'
          >
            Shop All
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className='text-[16px] font-normal text-[#4a3129] lg:w-[28%]'
          >
            Browse the full collection. Every sustainable piece we offer, all in one place.
          </motion.p>

          <motion.div variants={fadeUp} className='pt-10'>
            <p className='text-[14px] md:text-[16px] font-normal text-[#4a3129]'>{filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}</p>
          </motion.div> 
        </motion.div> 

        {/* Filter links */}
        <div className='py-10'>
          <motion.div
            className='flex flex-wrap gap-6'
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
          >
            {links.map((link, index) => {
              // For "All": active when there is NO category param in the URL
              // For others: active when categoryParam exactly matches
              const isActive = link.category === 'all'
                ? categoryParam === null
                : categoryParam === link.category;

              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'backOut' as const } },
                  }}
                >
                  <Link 
                    href={link.href} 
                    scroll={false}
                    className={`transition-all duration-300 uppercase font-normal px-4 py-2 border border-[#4A3129] ${
                      isActive 
                        ? 'bg-[#4A3129] text-white' 
                        : 'text-[#4A3129] bg-[#e3dbcf] hover:bg-[#4a3129] hover:text-white'
                    }`}
                  >
                    {link.title}
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Product grid — key forces re-mount/re-animate on category change */}
        <div>
          <motion.div
            key={currentCategory}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } } }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={cardVariants}
                custom={index}
              >
                <Link href={product.link} className='group flex flex-col gap-4 bg-[#e3dbcf] pt-3 pr-3 pl-3 pb-4'>
                  <div className='w-full h-[400px] bg-gray-200 overflow-hidden relative'>
                    {/* Primary image */}
                    <Image 
                      src={product.image}
                      alt={product.title}
                      fill
                      className='object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0'
                    />
                    {/* Hover image */}
                    <Image 
                      src={product.hoverImage}
                      alt={product.title}
                      fill
                      className='object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100'
                    />
                  </div>
                  <div className='flex justify-between w-full gap-2'>
                    <h3 className='text-lg font-medium'>{product.title}</h3>
                    <p className='text-sm'>{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Load more */}
        <motion.div
          className='text-center py-10'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Link
            href="/shop"
            scroll={false}
            className="bg-[#e3dbcf] text-[#4a3129] border transition-all duration-300 hover:bg-[#4a3129] hover:text-white border-[#4A3129] uppercase text-[16px] font-normal px-4 py-2"
          >
            Load More
          </Link>
        </motion.div>

      </section>
    </div> 
  )
}

const Shop = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}

export default Shop
