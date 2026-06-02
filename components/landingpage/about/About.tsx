'use client'
import SplitText from '@/components/animation/SplitText'
import { useInView } from '@/hooks/useInView'
import Link from 'next/link'
import { useRef } from 'react'

const About = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { isInView, onAnimationComplete } = useInView(ref, {
    margin: '-100px',
  })
  
  return (
    <div
      ref={ref}
      data-scroll-section
      className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 py-20 lg:py-48 px-6 lg:px-16 overflow-hidden bg-[#4A3129] items-center"
    >
      {/* Video Container with Locomotive Scroll Parallax */}
      <div 
        data-scroll 
        data-scroll-speed="1.2"
        className="w-full relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-[#38231c] rounded-sm group border border-[#f4f1eb]/10"
      >
        <video
          className="w-full h-full object-cover opacity-95 transition-transform duration-700 ease-out group-hover:scale-105"
          src="/images/girl.mp4"
          autoPlay
          loop
          muted
          playsInline
        ></video>
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-[#4A3129]/10 pointer-events-none" />
      </div>

      {/* Text Container with complementary Locomotive Scroll Parallax */}
      <div 
        data-scroll 
        data-scroll-speed="0.6"
        className="z-10 flex flex-col justify-center"
      >
        <div className="mb-8 lg:mb-12 text-left">
          <span className="text-xs uppercase tracking-widest text-[#f4f1eb]/60 font-mono mb-4 lg:mb-6 block">
            The Brand Ethos
          </span>
          <h2 className="text-[32px] sm:text-[44px] lg:text-[52px] heading font-serif text-[#f4f1eb] leading-tight mb-6 lg:mb-8">
            <SplitText
              baseClass="inline-block overflow-hidden"
              charClass="inline-block"
              text="Curated for the modern individual"
              triggerOnce
              isInView={isInView}
              onAnimationComplete={onAnimationComplete}
            />
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-[#f4f1eb]/85 max-w-xl leading-relaxed font-light font-sans mb-4">
            <SplitText
              baseClass="inline-block overflow-hidden"
              charClass="inline-block"
              text="Discover timeless style and modern essentials crafted with attention to detail. Elevate your everyday wardrobe with our carefully selected collection."
              triggerOnce
              isInView={isInView}
              onAnimationComplete={onAnimationComplete}
            />
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/shop" className="inline-block px-8 py-3.5 text-white border border-[#f4f1eb]/50 hover:border-[#f4f1eb] font-semibold tracking-wider uppercase text-xs hover:bg-[#f4f1eb] hover:text-[#4A3129] transition duration-300">
            Browse Collection
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About