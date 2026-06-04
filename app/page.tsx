'use client';

import { useEffect } from 'react';
import Hero from '@/components/landingpage/hero/Hero';
import About from '@/components/landingpage/about/About';
import Category from '@/components/landingpage/category/Category';
import Bestsellers from '@/components/landingpage/Bestsellers/Bestsellers';
import Testimonial from '@/components/landingpage/testimonial/Testimonial';

export default function Home() {
  useEffect(() => {
    let scrollInstance: any;
    
    // Dynamic import to prevent SSR crashes on node/server side
    const initLocomotive = async () => {
      try {
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        scrollInstance = new LocomotiveScroll({
          lenisOptions: {
            wrapper: window,
            content: document.documentElement,
            lerp: 0.1,
            duration: 1.2,
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
          }
        });
      } catch (err) {
        console.error('Failed to initialize locomotive-scroll:', err);
      }
    };

    initLocomotive();

    return () => {
      if (scrollInstance && typeof scrollInstance.destroy === 'function') {
        scrollInstance.destroy();
      }
    };
  }, []);

  return (
    <main className="w-full min-h-screen bg-[#f4f0ea]">
      <Hero />
      <About/>
      <Category />
      <Bestsellers />
      <Testimonial />
    </main>
  );
}
