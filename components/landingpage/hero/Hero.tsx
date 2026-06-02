'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const outfits = [
  {
    id: 1,
    title: "Denim Tiered Dress",
    price: "$145",
    description: "Structured raw denim dress featuring a tiered ruffled skirt, cropped denim jacket top, and elegant contrast stitching. Designed for a bold, contemporary look.",
    src: "/images/img_1.png",
    offset: "translate-y-[80px] md:translate-y-[120px]", // staggered down
    speed: "0.5",
  },
  {
    id: 2,
    title: "Raw Denim Jeans",
    price: "$120",
    description: "Classic relaxed fit jeans crafted in deep indigo that develops unique character and fade patterns through organic wear.",
    src: "/images/img_2.png",
    offset: "translate-y-[30px] md:translate-y-[40px]", // staggered middle-down
    speed: "1.2",
  },
  {
    id: 3,
    title: "Core Wash Tee",
    price: "$55",
    description: "Heavyweight organic cotton tee with a custom vertical dip-dye graphic. Featuring dropped shoulders and a thick ribbed crewneck.",
    src: "/images/img_3.png",
    offset: "-translate-y-[30px] md:-translate-y-[60px]", // staggered high up
    speed: "-0.8",
  },
  {
    id: 4,
    title: "Relaxed Cargo Trousers",
    price: "$110",
    description: "Utilitarian cargo trousers featuring a relaxed silhouette, clean lines, and deep side cargo pockets for functional design.",
    src: "/images/tees.png",
    offset: "translate-y-[60px] md:translate-y-[90px]", // staggered low
    speed: "0.9",
  },
  {
    id: 5,
    title: "Minimalist Cap",
    price: "$35",
    description: "Structured six-panel cap in organic twill with an adjustable back closure and subtle, tonally embroidered branding.",
    src: "/images/img_5.png",
    offset: "-translate-y-[10px] md:-translate-y-[20px]", // staggered middle-high
    speed: "-0.3",
  },
  {
    id: 6,
    title: "Minimalist Cap",
    price: "$35",
    description: "Structured six-panel cap in organic twill with an adjustable back closure and subtle, tonally embroidered branding.",
    src: "/images/img_5.png",
    offset: "-translate-y-[10px] md:-translate-y-[20px]", // staggered middle-high
    speed: "-0.3",
  }
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(2); // Start centered on the third card (img_3)
  const trackRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [current, setCurrent] = useState(2);
  
  const targetRef = useRef(2);
  const currentRef = useRef(2);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startTargetRef = useRef(0);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateSizes = () => {
      if (trackRef.current) {
        setContainerWidth(trackRef.current.offsetWidth);
      }
    };
    
    updateSizes();
    const timer = setTimeout(updateSizes, 300);
    window.addEventListener('resize', updateSizes);
    return () => {
      window.removeEventListener('resize', updateSizes);
      clearTimeout(timer);
    };
  }, []);

  // requestAnimationFrame loop to lerp current towards target
  useEffect(() => {
    let animationFrameId: number;
    const N = outfits.length;

    const update = () => {
      const diff = targetRef.current - currentRef.current;
      
      // Calculate shortest path diff on a circular track
      const wrappedDiff = (((diff + N / 2) % N) + N) % N - N / 2;
      
      // Weighted lerp interpolation: current += (target - current) * 0.08
      currentRef.current += wrappedDiff * 0.08;
      
      // Wrap current value within [0, N]
      currentRef.current = (currentRef.current % N + N) % N;
      
      setCurrent(currentRef.current);
      
      const roundedIndex = Math.round(currentRef.current) % N;
      setActiveIndex(roundedIndex);

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Mouse wheel listener to scroll horizontally
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Increase/decrease target fractionally based on wheel scroll delta
      targetRef.current += e.deltaY * 0.003;

      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = setTimeout(() => {
        targetRef.current = Math.round(targetRef.current);
      }, 150);
    };

    track.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      track.removeEventListener('wheel', onWheel);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, [containerWidth]);

  // Global mouse event handlers for dragging stability
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - startXRef.current;
      const slideWidth = getCardWidth();
      const deltaSlides = deltaX / slideWidth;
      targetRef.current = startTargetRef.current - deltaSlides;
    };

    const handleWindowMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      targetRef.current = Math.round(targetRef.current);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [containerWidth]);

  const getCardWidth = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 290; // 240px card + 50px gap
      return 350; // 300px card + 50px gap
    }
    return 350;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startTargetRef.current = targetRef.current;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
    startTargetRef.current = targetRef.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    const slideWidth = getCardWidth();
    const deltaSlides = deltaX / slideWidth;
    targetRef.current = startTargetRef.current - deltaSlides;
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    targetRef.current = Math.round(targetRef.current);
  };

  const handleNext = () => {
    targetRef.current = Math.round(targetRef.current) + 1;
  };

  const handlePrev = () => {
    targetRef.current = Math.round(targetRef.current) - 1;
  };

  return (
    <section 
      data-scroll-section 
      className="min-h-screen bg-[#f4f0ea] pt-[120px] pb-[80px] px-6 sm:px-12 md:px-16 flex flex-col justify-between overflow-hidden relative select-none"
    >
      {/* Background Staggered Lines / Accents for depth */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] border-y border-[#4d3d30]" />

      {/* Top Header Block */}
      <div className="gap-6 z-10 flex justify-center items-center flex-col text-center w-full">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-[25px] md:text-[40px] font-medium text-[#4d3d30] heading uppercase leading-tight">
            New Arrivals
          </h1>
          <p className="mt-3 w-[80%] sm:w-[80%] md:w-[60%] text-base md:text-xl text-[#8a7d72] font-mono">
            Curated earth tones and organic textures. Built for the season ahead.
          </p>
          <button className="mt-6 flex items-center justify-between gap-3 border border-[#4d3d30]/30 hover:border-[#4d3d30] transition-colors py-2.5 px-5 bg-transparent text-[#4d3d30] text-sm tracking-wider uppercase group cursor-pointer">
            <span>Explore All</span>
            <span className="w-5 h-5 flex items-center justify-center border border-[#4d3d30]/20 rounded-full group-hover:bg-[#4d3d30] group-hover:text-[#f4f0ea] transition-all duration-300">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Staggered Carousel Track */}
      <div className="my-6 md:my-0 relative z-10 w-full flex items-center justify-center h-[520px] md:h-[620px] overflow-visible">
        <div 
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-full overflow-visible flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {outfits.map((outfit, index) => {
            const N = outfits.length;
            let diff = index - current;
            
            // Wrap diff horizontally to the closest position on the circular loop [-N/2, N/2]
            diff = (((diff + N / 2) % N) + N) % N - N / 2;
            
            const slideWidth = getCardWidth();
            
            // Exact formulas from requirements
            const x = diff * slideWidth;
            const y = Math.abs(diff) * 80;
            const scale = 1 - Math.min(Math.abs(diff) * 0.04, 0.12);
            const opacity = 1 - Math.min(Math.abs(diff) * 0.2, 0.5);
            
            // Dynamic stack ordering (centered is highest)
            const zIndex = Math.round(20 - Math.abs(diff) * 5);

            return (
              <div 
                key={outfit.id}
                onClick={() => {
                  // Scroll to this card if clicked
                  targetRef.current = targetRef.current + diff;
                }}
                style={{
                  transform: `translate3d(${x}px, ${-y}px, 0) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                  willChange: 'transform, opacity',
                }}
                className="absolute w-[240px] sm:w-[300px] cursor-pointer select-none origin-center mt-36"
              >
                {/* Image Container with aspect-[2/3] and inner image parallax */}
                <div 
                  className="relative overflow-hidden aspect-[2/3] w-full border border-[#4d3d30]/10 bg-[#e5dec9]"
                >
                  <div 
                    style={{
                      transform: `translate3d(${diff * -25}px, 0, 0) scale(1.15)`,
                      willChange: 'transform',
                    }}
                    className="absolute inset-0 w-[120%] h-full transition-transform duration-100 ease-out"
                  >
                    <Image
                      src={outfit.src}
                      alt={outfit.title}
                      fill
                      priority={index < 3}
                      className="object-cover"
                      sizes="(max-width: 768px) 240px, 300px"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation and Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end z-10 pt-4">
        {/* Navigation Arrows (Bottom Left) */}
        <div className="md:col-span-4 flex gap-3">
          <button 
            onClick={handlePrev}
            className={`w-12 h-12 flex items-center justify-center border border-[#4d3d30]/30 rounded-none bg-transparent text-[#4d3d30] cursor-pointer transition-all duration-300 hover:bg-[#4d3d30] hover:text-[#f4f0ea]`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            onClick={handleNext}
            className={`w-12 h-12 flex items-center justify-center border border-[#4d3d30]/30 rounded-none bg-transparent text-[#4d3d30] cursor-pointer transition-all duration-300 hover:bg-[#4d3d30] hover:text-[#f4f0ea]`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Spacing Column */}
        <div className="hidden md:block md:col-span-2"></div>

        {/* Active Product Details (Bottom Right) */}
        <div className="md:col-span-6 flex items-end justify-between gap-6 border-t border-[#4d3d30]/15 pt-4">
          <div className="max-w-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-xs sm:text-sm text-[#8a7d72] font-light leading-relaxed min-h-[50px]">
                  {outfits[activeIndex]?.description}
                </p>
                <div className="mt-4 flex flex-col">
                  <h3 className="text-lg md:text-xl font-medium text-[#4d3d30] uppercase tracking-wider font-sans">
                    {outfits[activeIndex]?.title}
                  </h3>
                  <span className="text-sm font-semibold text-[#8a7d72] mt-0.5">
                    {outfits[activeIndex]?.price}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-[#4d3d30]/30 rounded-none bg-transparent text-[#4d3d30] cursor-pointer transition-all duration-300 hover:bg-[#4d3d30] hover:text-[#f4f0ea] group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
