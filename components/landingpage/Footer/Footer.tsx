import React from "react"
import Link from "next/link"

const Footer: React.FC = () => {
  return (
    // sticky + z-0: sits beneath the page content (which has z-10 in layout)
    // and is revealed as you scroll to the bottom of the page
    <footer className="relative w-full h-[35vh] lg:h-[55vh] bg-[#4a3129] flex justify-center items-center">
      <div className="relative overflow-hidden w-full h-full flex justify-end px-6 md:px-16 text-right items-start py-12 text-[#efefef]">
        <div className="flex flex-row space-x-12 sm:space-x-16 md:space-x-24 text-sm sm:text-lg md:text-xl">
          <ul className="flex flex-col gap-2 text-start">
            <Link href="/" className="hover:underline cursor-pointer">Home</Link>
            <Link href="/shop" className="hover:underline cursor-pointer">Shop</Link>
            <Link href="/about" className="hover:underline cursor-pointer">About</Link>
             <Link href="" className="hover:underline cursor-pointer">Contact Us</Link>
          </ul>
          <ul className="flex flex-col gap-2 text-start">
            <Link href="" className="hover:underline cursor-pointer">New Arrivals</Link>
            <Link href="" className="hover:underline cursor-pointer">Best Sellers</Link>
            <Link href="" className="hover:underline cursor-pointer">Jeans</Link>
            <Link href="" className="hover:underline cursor-pointer">Tees</Link>
            <Link href="" className="hover:underline cursor-pointer">Hoodies</Link>
          </ul>
        </div>
        <h2 className="absolute bottom-6 md:bottom-8 text-[45px] left-6 text-center sm:text-[80px] md:text-[90px] lg:text-[150px] heading text-[#efefef] opacity-10 uppercase leading-none select-none whitespace-nowrap tracking-wider">
          Prince&apos;s Closet
        </h2>
      </div>
    </footer>
  )
}

export default Footer
