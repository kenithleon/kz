import React from 'react'
import { Link } from 'react-router-dom'
import featured from '../../assets/featured.webp'
const FeaturedCollection = () => {
  return (
    <section className='py-16 px-4 lg:px-0'>
        <div className='container mx-auto flex flex-col-reverse lg:flex-row items-center bg-black rounded-3xl'>
            {/* Left Content */}
            <div className='lg:w-1/2 p-8 text-center lg:text-left'>
            <h2 className='text-lg font-semibold text-white mb-2'>
                Comfort and Style
            </h2>
            <h2 className='text-4xl lg:text-5xl font-bold mb-6 text-white'>
                Appareal made for your Everyday Life
            </h2>
            <p className='text-lg text-gray-400 mb-6'>
                Discover high-quality, comfortable clothing that efoortlessly blends style and functionality. Perfect for your daily adventures.
            </p>
            <Link to="/collections/all" className="bg-white text-black font-bold px-6
            py-3 rounded-lg hover:bg-gray-300">
                Shop Now
                </Link>
            </div>
            {/* Right Image */}
            <div className='lg:w-1/2'>
            <img src={featured} alt="Featured Collection" 
            className='w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl'
            />

            </div>
        </div>

    </section>
  )
}

export default FeaturedCollection