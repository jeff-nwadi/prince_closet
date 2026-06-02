'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { height } from '../anim';
import Body from './Body/Page';
import Footer from './Footer/Page';
import Image from './Image/NavImage';

const links = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Shop",
    href: "/shop",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Lookbook",
    href: "/lookbook",
  },
  {
    title: "Contact",
    href: "/contact",
  }
]

const linksBrand = [
  {
    title: "New Arrivals",
    href: "/new-arrivals",
    src: "img_1.png"
  },
  {
    title: "Jeans",
    href: "/designer",
    src: "img_2.png"
  },
  {
    title: "Tees",
    href: "/t-shirts",
    src: "tees.png"
  },
  {
    title: "Hoddies & Sweatshirts",
    href: "/hoodies-sweatshirts",
    src: "hoddies.png"
  },
  {
    title: "Headwear",
    href: "/headwear",
    src: "cap.png"
  }
]


export default function Index() {

  const [selectedLink, setSelectedLink] = useState({isActive: false, index: 0});
  const [selectedLinkBrand, setSelectedLinkBrand] = useState({isActive: false, index: 0});

  return (
    <motion.div variants={height} initial="initial" animate="enter" exit="exit" className="overflow-hidden">
      <div className="flex gap-[10px] mb-[30px] min-[1000px]:mb-0 min-[1000px]:justify-between">
        <div className="flex justify-between">
          <div className='flex-col justify-between'>
             <Body links={links} selectedLink={selectedLink} setSelectedLink={setSelectedLink}/>
          </div>
         <div className='flex-col justify-between'>
          <Body links={linksBrand} selectedLink={selectedLinkBrand} setSelectedLink={setSelectedLinkBrand}/>
         </div>
        </div>
        <Image src={linksBrand[selectedLinkBrand.index].src} isActive={selectedLinkBrand.isActive}/>
      </div>
    </motion.div>
  )
}