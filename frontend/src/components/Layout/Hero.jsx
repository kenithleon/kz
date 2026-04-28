import heroImg from "../../assets/her (1).jpg"
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="relative ">
        <img src={heroImg} alt="Rabbit" className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"/>

        <div className="absolute inset-0  bg-opacity-5 flex items-center justify-center">
        <div className="text-center text-white px-6 text-shadow-lg">
          <h1 className="text-4xl md:text-9xl font-bold tracking-wider uppercase mb-4">Athleisure <br /> Ready</h1>
          <p className="text-sm  md:text-lg mb-6 text-shadow-lg">
            Explore our exclusive collection of athleisure wear that combines comfort and style for your active lifestyle.
          </p>
          <Link 
          to="collections/all" 
          className="bg-white text-black text-extrabold px-6 py-2 rounded-lg text-lg">
          Shop Now
          </Link>
        </div>
        </div>
    </section>
  )
}

export default Hero;