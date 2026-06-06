'use client'

import { useState } from 'react'
import Image from 'next/image'

type Props = {
  images: string[]
  title: string
}

export default function ProductGallery({ images, title }: Props) {
  const [active, setActive] = useState(0)

  return (
    <div className='flex gap-3 lg:gap-4'>
      {/* Thumbnail strip */}
      <div className='flex flex-col gap-2 w-16 md:w-20 shrink-0'>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative w-full aspect-square overflow-hidden bg-[#e3dbcf] transition-all duration-200 ${
              active === i ? 'ring-2 ring-[#4A3129]' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Image src={img} alt={`${title} view ${i + 1}`} fill className='object-cover' />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className='relative flex-1 h-[480px] md:h-[600px] overflow-hidden bg-[#e3dbcf]'>
        <Image
          key={active}
          src={images[active]}
          alt={title}
          fill
          className='object-cover transition-opacity duration-300'
          priority
        />
      </div>
    </div>
  )
}
