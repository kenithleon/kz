import React from 'react'
import { TbBrandMeta } from 'react-icons/tb';
import { IoLogoInstagram } from 'react-icons/io5';
import { RiTwitterXLine } from 'react-icons/ri';
const Topbar = () => {
  return (
    <div className='bg-black text-white'>
        <div className='container mx-auto flex justify-between items-center py-3 px-4 pl-10'> 
            <div className='hidden md:flex items-center space-x-5 '>
                <a href='#' className='hover:text-gray-300'>
                    <TbBrandMeta className='h-8 w-6'/>
                </a>
                <a href='#' className='hover:text-gray-300'>
                    <IoLogoInstagram className='h-8 w-6'/>
                </a>
                <a href='#' className='hover:text-gray-300'>
                    <RiTwitterXLine className='h-8 w-6'/>
                </a>
            </div>
               <div className='text-sm md:text-base text-center md:mx-0 mx-auto '>
                <span>We ship worldwide - Fast and reliable shipping</span>
               </div>
               <div className='text-md hidden md:block pr-2' > 
                <a href='tel:+123456789' className='hover:text-gray-300'>
                    +1 (234) 567-89
                </a>
               </div>

        </div>
    </div>
  )
}

export default Topbar