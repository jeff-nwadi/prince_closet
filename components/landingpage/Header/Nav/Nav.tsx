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
    src: "home.png"
  },
  {
    title: "Shop",
    href: "/shop",
    src: "shop.png"
  },
  {
    title: "About Us",
    href: "/about",
    src: "home.png"
  },
  {
    title: "Lookbook",
    href: "/lookbook",
    src: "lookbook.png"
  },
  {
    title: "Contact",
    href: "/contact",
    src: "contact.png"
  }
]


export default function Index() {

  const [selectedLink, setSelectedLink] = useState({isActive: false, index: 0});

  return (
    <motion.div variants={height} initial="initial" animate="enter" exit="exit" className="overflow-hidden">
      <div className="flex gap-[50px] mb-[80px] min-[1000px]:mb-0 min-[1000px]:justify-between">
        <div className="flex flex-col justify-between">
          <Body links={links} selectedLink={selectedLink} setSelectedLink={setSelectedLink}/>
          <Footer />
        </div>
        <Image src={links[selectedLink.index].src} isActive={selectedLink.isActive}/>
      </div>
    </motion.div>
  )
}