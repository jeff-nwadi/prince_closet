'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { BadgeCheck } from 'lucide-react'
import Link from 'next/link'

import testimonial1 from "@/public/images/img_1.png"
import testimonial2 from "@/public/images/img_2.png"
import testimonial3 from "@/public/images/img_3.png"



const TestimonialCards = [
  {
    id: 1,
    image: testimonial1,
    name: "Michael Okonkwo",
    title: "Best Quality",
    batch: "Verified Buyer",
    description: "Flawless fit, and the color is even richer in person than it appeared online. The fabric feels substantial and built to last. Definitely a new wardrobe staple!",
    href: "/product/"
  },
  {
    id: 2,
    image: testimonial2,
    name: "David Martins",
    title: "Best Product",
    batch: "Verified Buyer",
    description: "The fit is perfect, the quality is amazing, and the color is even better in person.",
    href: "/product/"
  },
  {
    id: 3,
    image: testimonial3,
    name: "Abdulrahman Bashir",
    title: "Best Design",
    batch: "Verified Buyer",
    description: "I'm impressed! The material is top-notch and feels premium. It's the kind of quality you can rely on for everyday wear without worrying about it losing shape.",
    href: "/product/"
  }
]



const Testimonial = () => {
  const [active, setActive] = useState(0)
  const item = TestimonialCards[active]

  // Auto-advance every 4 seconds; reset interval on manual selection
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % TestimonialCards.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [active])

  return (
    <div data-scroll-section className='py-20 lg:py-32 px-0 lg:px-16 bg-[#f4f0ea]'>
      {/* Title block with entrance animation */}
      <div className="mb-16 lg:mb-24 px-3">
        <h2
          className='heading w-[60%] md:w-[50%] text-[20px] lg:text-[30px] text-[#4A3129] mb-4 uppercase'
        >
          Proven Quality, Trusted By Many
        </h2>
        <p
          className='body-text w-[70%] md:w-[50%] lg:w-[30%] text-sm sm:text-base md:text-lg text-[#8a7d72] max-w-md font-mono leading-relaxed'
          
        >
          Explore our curated collections of earth-toned essentials made for daily living.
        </p>
      </div>

      <div className='bg-[#e3dbcf] h-screen md:h-[40vh] lg:h-[90vh]'>
        <div key={item.id} className='flex flex-col gap-16 md:flex-row justify-between p-6 lg:p-15'>
          <div className='flex gap-8 flex-col'>
              <p className='heading text-[22px]  lg:text-[30px] lg:w-[70%]'>{item.description}</p> 
              <div className='flex flex-col gap-2'>
              <p className='text-[20px] heading'>{item.name}</p>
              <p className=' text-[16px] font-light flex items-center'><BadgeCheck size={30} className='inline' /> {item.batch}</p> 
              </div>
          </div> 
          <div className='flex flex-col items-center justify-center'>
            <div className='relative w-[300px] h-[300px]  lg:w-[300px] lg:h-[432px]'>
              <Image src={item.image} alt={item.name}  fill className='object-cover border-8 border-[#4a3129]' />
              <p className='absolute bottom-4 left-4 text-[16px] text-[#4a3129] heading'>{item.title}</p>
            </div>
            <div className='border-[#4a3129] border-2 mt-5 py-2 px-24 text-center cursor-pointer'>
              <Link href={item.href} className='text-[16px] text-[#4a3129] '>View Product</Link>
            </div>
          </div>
        </div> 

        {/* Carousel dot navigation */}
        <div className='flex gap-2 px-15 pb-8 justify-center'>
          {TestimonialCards.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`w-5 h-5 border-2 border-[#4a3129] transition-colors duration-300 ${
                i === active ? 'bg-[#4a3129]' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div> 
    </div>
  )
}

export default Testimonial