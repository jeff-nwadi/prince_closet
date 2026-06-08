import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { products } from '@/lib/products'
import ProductGallery from '@/components/Shop/ProductGallery'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = products.find((p) => p.id === Number(id))

  if (!product) notFound()

  const images = [product.image, product.image2]

  return (
    <div className='min-h-screen bg-[#f4f0ea] pt-28 pb-20 px-6 sm:px-12 md:px-16'>

      {/* Back link */}
      <Link
        href='/shop'
        className='inline-flex items-center gap-2 text-[#4a3129] uppercase text-sm font-normal hover:opacity-70 transition-opacity mb-10'
      >
        ← Back to Shop
      </Link>

      {/* Main layout: gallery + details */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16'>

        {/* Left — image gallery with thumbnails */}
        <ProductGallery images={images} title={product.title} />

        {/* Right — product details */}
        <div className='flex flex-col gap-6'>
          <span className='text-xs uppercase tracking-widest text-[#4a3129]/60'>
            {product.category.replace('-', ' ')}
          </span>

          <h1 className='heading text-[#4A3129] uppercase text-[28px] md:text-[36px] leading-tight'>
            {product.title}
          </h1>

          <p className='text-[22px] font-normal text-[#4a3129]'>{product.price}</p>

          <p className='text-[14px] text-[#4a3129]/75 leading-relaxed max-w-sm'>
            {product.description}
          </p>

          {/* Sizes */}
          <div>
            <p className='text-xs uppercase tracking-widest text-[#4a3129] mb-3'>Select Size</p>
            <div className='flex flex-wrap gap-2'>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className='px-4 py-2 border border-[#4A3129] text-[#4a3129] uppercase text-sm font-normal hover:bg-[#4a3129] hover:text-white transition-all duration-300'
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Accordions */}
          <div className='border-t border-[#4a3129]/20 mt-2'>
            {['Material', 'Care', 'Shipping'].map((label) => (
              <details key={label} className='border-b border-[#4a3129]/20 group'>
                <summary className='flex justify-between items-center py-4 cursor-pointer list-none text-sm uppercase tracking-widest text-[#4a3129] font-normal select-none'>
                  {label}
                  <span className='text-xl leading-none transition-transform duration-200 group-open:rotate-45'>+</span>
                </summary>
                <p className='text-sm text-[#4a3129]/70 pb-4 leading-relaxed'>
                  {label === 'Material' && 'Crafted from 100% organic, sustainably sourced materials.'}
                  {label === 'Care' && 'Machine wash cold. Tumble dry low. Do not bleach.'}
                  {label === 'Shipping' && 'Free standard shipping on orders over $100. Express available at checkout.'}
                </p>
              </details>
            ))}
          </div>

          {/* Quantity + Add to cart */}
          <div className='flex flex-col gap-3 mt-2'>
            <div className='flex items-center border border-[#4A3129] w-fit'>
              <button className='px-4 py-3 text-[#4a3129] hover:bg-[#4a3129] hover:text-white transition-all duration-200 text-lg leading-none'>−</button>
              <span className='px-6 py-3 text-sm text-[#4a3129] border-x border-[#4a3129]/30 min-w-[48px] text-center'>1</span>
              <button className='px-4 py-3 text-[#4a3129] hover:bg-[#4a3129] hover:text-white transition-all duration-200 text-lg leading-none'>+</button>
            </div>
            <button className='w-full bg-[#4A3129] text-white uppercase text-sm font-normal py-4 tracking-widest hover:bg-[#4a3129]/80 transition-all duration-300'>
              Add to Bag
            </button>
          </div>
        </div>
      </div>

      {/* You may also like */}
      <div className='mt-24'>
        <div className='mb-10'>    
        <h2 className='heading text-[#4A3129] uppercase text-[20px] md:text-[28px] mb-2'>You may also like</h2>
        <p className='text-[14px] md:text-[16px] lg:w-[30%] font-normal text-[#4a3129]'>Continue your jornuey with these carefully curated pieces, inspired by your recent selection.</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 '>
          {products
            .filter((p) => p.id !== product.id)
            .slice(0, 3)
            .map((p) => (
              <Link href={p.link} key={p.id} className='group flex flex-col gap-3 bg-[#e3dbcf] p-3'>
                <div className='relative w-full h-[320px] overflow-hidden'>
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                </div>
                <div className='flex justify-between'>
                  <h3 className='text-sm uppercase tracking-wide text-[#4a3129]'>{p.title}</h3>
                  <p className='text-sm text-[#4a3129]'>{p.price}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>

    </div>
  )
}