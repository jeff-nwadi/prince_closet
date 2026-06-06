'use client'
import { useInView } from '@/hooks/useInView'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface SplitWordsProps {
  text: string;
  isInView: boolean;
  delayOffset?: number;
  className?: string;
}

const SplitWords = ({ 
  text, 
  isInView, 
  delayOffset = 0, 
  className = "" 
}: SplitWordsProps) => {
  const words = text.split(' ')
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden py-[0.1em] -my-[0.1em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '105%', opacity: 0 },
              visible: {
                y: '0%',
                opacity: 1,
                transition: {
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: delayOffset + idx * 0.025
                }
              }
            }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

const About = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { isInView } = useInView(ref, {
    margin: '-150px',
  })
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <div
      ref={ref}
      id="about"
      data-scroll-section
      className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 py-16 lg:py-48 px-3 lg:px-16 overflow-hidden bg-[#4A3129] items-center"
    >
      {/* Video Container - Parallax only on Desktop */}
      <div 
        data-scroll={isDesktop ? "true" : undefined}
        data-scroll-speed={isDesktop ? "1.2" : undefined}
        className="w-full relative aspect-[4/5] lg:aspect-[3/4] hidden lg:flex"
      >
        <motion.div
          className="w-full h-full relative overflow-hidden bg-[#38231c] rounded-sm group border border-[#f4f1eb]/10"
          initial={{ 
            opacity: 0, 
            scale: 1.15,
            clipPath: 'inset(10% 10% 10% 10% round 8px)'
          }}
          animate={isInView ? { 
            opacity: 1, 
            scale: 1,
            clipPath: 'inset(0% 0% 0% 0% round 0px)'
          } : { 
            opacity: 0, 
            scale: 1.15,
            clipPath: 'inset(10% 10% 10% 10% round 8px)'
          }}
          transition={{
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.1
          }}
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
        </motion.div>
      </div>

      {/* Text Container - Parallax only on Desktop */}
      <div 
        data-scroll={isDesktop ? "true" : undefined}
        data-scroll-speed={isDesktop ? "0.6" : undefined}
        className="z-10 flex flex-col justify-center"
      >
        <div className="mb-6 lg:mb-12 text-left">
          <motion.span 
            className="text-xs uppercase tracking-widest text-[#f4f1eb]/60 font-mono mb-4 lg:mb-6 block"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            The Brand Ethos
          </motion.span>
          <h2 className="text-[32px] sm:text-[44px] lg:text-[52px] heading font-serif text-[#f4f1eb] leading-tight mb-6 lg:mb-8">
            <SplitWords
              text="Curated for the modern individual"
              isInView={isInView}
              delayOffset={0.1}
            />
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-[#f4f1eb]/85 max-w-xl leading-relaxed font-light font-sans mb-4">
            <SplitWords
              text="Discover timeless style and modern essentials crafted with attention to detail. Elevate your everyday wardrobe with our carefully selected collection."
              isInView={isInView}
              delayOffset={0.25}
            />
          </p>
        </div>
        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.75
          }}
        >
          <Link href="/shop" className="inline-block px-8 py-3.5 text-white border border-[#f4f1eb]/50 hover:border-[#f4f1eb] font-semibold tracking-wider uppercase text-xs hover:bg-[#f4f1eb] hover:text-[#4A3129] transition duration-300">
            Browse Collection
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default About