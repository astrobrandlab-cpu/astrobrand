import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/Dreamy Crescent Arch Portrait.png';

const Hero = () => {
  return (
    <section className="relative w-full h-[90vh] flex items-center justify-start overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={heroImage}
          alt="Hero"
          className="w-full h-full object-cover object-right"
        />
        {/* Soft light gradient overlay on the left to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-light/95 via-light/80 to-transparent sm:w-[80%] md:w-[60%] lg:w-[50%]"></div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center h-full w-full">
        <div className="max-w-2xl text-dark mt-20 md:mt-10">
          
          {/* Subtitle */}
          <div className="mb-4" data-aos="fade-up">
            <span className="text-sm font-bold tracking-[0.2em] text-[#8C7A6B] uppercase">
              For Modern Astrologers
            </span>
          </div>
          
          {/* Headline */}
          <h1 data-aos="fade-up" data-aos-delay="150" className="text-5xl md:text-6xl lg:text-[4.5rem] font-serif font-medium leading-[1.1] mb-6 text-[#1A1A1A]">
            Turn Your <br />
            Astrology into <br />
            a Powerful Brand
          </h1>
          
          {/* Paragraph */}
          <p data-aos="fade-up" data-aos-delay="300" className="text-lg md:text-xl text-gray-800 font-medium mb-10 max-w-[480px] leading-relaxed">
            We help astrologers build a recognisable personal brand, create high-converting funnels and attract genuine clients.
          </p>
          
          {/* Button */}
          <Link to="/checkout" state={{ plan: { name: 'Strategy Call', price: '99' } }} data-aos="zoom-in" data-aos-delay="450" className="px-8 py-4 rounded-full bg-[#1F1F1F] text-white font-medium text-lg hover:bg-black transition-all flex items-center gap-3 w-fit mb-14 shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
            Book a Strategy Call for ₹99 
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          
          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 md:gap-12 pt-6" data-aos="fade-up" data-aos-delay="600">
            <div>
              <h3 className="text-3xl font-semibold mb-1 text-[#1A1A1A]">200+</h3>
              <p className="text-xs text-gray-600 leading-tight font-medium">Astrologers<br/>Supported</p>
            </div>
            
            <div className="h-10 w-px bg-gray-300"></div>
            
            <div>
              <h3 className="text-3xl font-semibold mb-1 text-[#1A1A1A]">10M+</h3>
              <p className="text-xs text-gray-600 leading-tight font-medium">Content Views<br/>Generated</p>
            </div>
            
            <div className="h-10 w-px bg-gray-300"></div>
            
            <div>
              <h3 className="text-3xl font-semibold mb-1 text-[#1A1A1A]">3X</h3>
              <p className="text-xs text-gray-600 leading-tight font-medium">Average Client<br/>Growth</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
