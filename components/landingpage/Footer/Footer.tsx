import React from "react"
import Link from "next/link"
import { ArrowUpRight } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full min-h-[50vh] lg:min-h-[65vh] bg-[#4a3129] flex flex-col justify-between pt-16 lg:pt-24 pb-8 px-6 md:px-16 text-[#efefef] overflow-hidden z-0">
      
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start w-full z-10 gap-16 lg:gap-8">
        {/* Left: Brand & Newsletter */}
        <div className="flex flex-col gap-6 max-w-sm">
            <h3 className="text-3xl md:text-4xl font-medium heading tracking-wider">Prince&apos;s Closet</h3>
            <p className="text-[#dfcac3]/70 text-sm md:text-base font-light leading-relaxed">
              Elevate your wardrobe with our premium collection of contemporary fashion. Designed for the modern tastemaker.
            </p>
            <div className="flex items-center gap-2 mt-4 border-b border-[#dfcac3]/30 pb-3 focus-within:border-[#dfcac3] transition-colors relative group">
                <input type="email" placeholder="Subscribe to our newsletter" className="bg-transparent border-none outline-none text-sm md:text-base w-full placeholder:text-[#dfcac3]/40 text-[#efefef]" />
                <button className="hover:opacity-70 transition-opacity">
                    <ArrowUpRight size={20} className="text-[#dfcac3] group-focus-within:text-white transition-colors" />
                </button>
            </div>
        </div>

        {/* Right: Links */}
        <div className="flex flex-col sm:flex-row gap-12 sm:gap-24 text-sm md:text-base font-light lg:pr-12">
          <ul className="flex flex-col gap-4 text-start">
            <span className="text-[#dfcac3]/50 text-[10px] uppercase tracking-widest font-semibold mb-2">Navigation</span>
            <Link href="/" className="hover:text-white text-[#dfcac3] transition-colors cursor-pointer flex items-center gap-1 group w-fit relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                Home <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
            </Link>
            <Link href="/shop" className="hover:text-white text-[#dfcac3] transition-colors cursor-pointer flex items-center gap-1 group w-fit relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                Shop <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
            </Link>
            <Link href="/#about" className="hover:text-white text-[#dfcac3] transition-colors cursor-pointer flex items-center gap-1 group w-fit relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                About <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
            </Link>
            <Link href="mailto:contact@princescloset.com" className="hover:text-white text-[#dfcac3] transition-colors cursor-pointer flex items-center gap-1 group w-fit relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                Contact <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
            </Link>
          </ul>
          <ul className="flex flex-col gap-4 text-start">
            <span className="text-[#dfcac3]/50 text-[10px] uppercase tracking-widest font-semibold mb-2">Categories</span>
            <Link href="/shop?category=new-arrival" className="hover:text-white text-[#dfcac3] transition-colors cursor-pointer flex items-center gap-1 group w-fit relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                New Arrivals
            </Link>
            <Link href="/#bestsellers" className="hover:text-white text-[#dfcac3] transition-colors cursor-pointer flex items-center gap-1 group w-fit relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                Best Sellers
            </Link>
            <Link href="/shop?category=bottoms-wears" className="hover:text-white text-[#dfcac3] transition-colors cursor-pointer flex items-center gap-1 group w-fit relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                Jeans
            </Link>
            <Link href="/shop?category=tees" className="hover:text-white text-[#dfcac3] transition-colors cursor-pointer flex items-center gap-1 group w-fit relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                Tees
            </Link>
            <Link href="/shop?category=hoodies" className="hover:text-white text-[#dfcac3] transition-colors cursor-pointer flex items-center gap-1 group w-fit relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                Hoodies
            </Link>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full z-10 border-t border-[#dfcac3]/20 pt-8 mt-24 gap-6">
          <p className="text-[#dfcac3]/50 text-[10px] md:text-xs tracking-widest uppercase">
              © {new Date().getFullYear()} Prince&apos;s Closet. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[#dfcac3]/70 text-xs tracking-widest font-medium">
              <Link href="#" className="hover:text-white hover:-translate-y-1 transition-all duration-300">IG</Link>
              <Link href="#" className="hover:text-white hover:-translate-y-1 transition-all duration-300">X</Link>
              <Link href="#" className="hover:text-white hover:-translate-y-1 transition-all duration-300">FB</Link>
          </div>
      </div>

      {/* Giant Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none opacity-[0.03] mix-blend-overlay">
        <h2 className="text-[100px] sm:text-[140px] md:text-[200px] lg:text-[280px] heading text-[#dfcac3] uppercase leading-none select-none whitespace-nowrap tracking-tighter">
          Prince&apos;s Closet
        </h2>
      </div>
    </footer>
  )
}

export default Footer
