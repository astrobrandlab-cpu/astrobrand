import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Hero from '../components/layout/Hero';
import mockupImage from '../assets/mockup.jpg';
import archwayImage from '../assets/archway.jpg';
import ctaBackground from '../assets/cta_bg.jpg';

const TrustedBy = () => {
  const logos = [
    // Instagram
    <div key="ig" className="flex items-center gap-1.5 mx-6">
      <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.75 2h8.5C19.42 2 22 4.58 22 7.75v8.5c0 3.17-2.58 5.75-5.75 5.75h-8.5C4.58 22 2 19.42 2 16.25v-8.5C2 4.58 4.58 2 7.75 2zm8.5 1.5h-8.5C5.41 3.5 3.5 5.41 3.5 7.75v8.5c0 2.34 1.91 4.25 4.25 4.25h8.5c2.34 0 4.25-1.91 4.25-4.25v-8.5C20.5 5.41 18.59 3.5 16.25 3.5zm-4.25 4a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm4.5-2.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-black" style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>Instagram</span>
    </div>,
    // YouTube
    <div key="yt" className="flex items-center gap-1.5 mx-6">
      <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.582 6.186a2.6 2.6 0 0 0-1.826-1.841C18.143 3.9 12 3.9 12 3.9s-6.143 0-7.756.445a2.6 2.6 0 0 0-1.826 1.841C2 7.822 2 12 2 12s0 4.178.418 5.814a2.6 2.6 0 0 0 1.826 1.841c1.613.445 7.756.445 7.756.445s6.143 0 7.756-.445a2.6 2.6 0 0 0 1.826-1.841C22 16.178 22 12 22 12s0-4.178-.418-5.814zM9.996 15.111v-6.222l5.503 3.111-5.503 3.111z" />
      </svg>
      <span className="text-[17px] font-bold tracking-tighter text-black" style={{ fontFamily: "Arial, sans-serif" }}>YouTube</span>
    </div>,
    // Meta
    <div key="mt" className="flex items-center gap-1.5 mx-6">
      <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.012 11.975c-.63 0-1.226.176-1.745.485-.291-.564-.523-1.127-.665-1.545a16.892 16.892 0 0 0 1.625-1.928 2.053 2.053 0 0 1 1.57-.732 2.062 2.062 0 1 1 0 4.124c-.266 0-.52-.05-.75-.138a4.015 4.015 0 0 0-.035-.266zm10.158-2.613c-1.378-2.455-4.48-3.176-6.666-1.545a13.393 13.393 0 0 0-3.492 4.492 13.565 13.565 0 0 0-3.486-4.487c-2.186-1.63-5.289-.91-6.667 1.545-1.077 1.916-.838 4.457 1.05 6.467 1.83 1.954 4.544 2.805 6.49 2.805a4.267 4.267 0 0 0 2.614-.852 4.267 4.267 0 0 0 2.613.852c1.947 0 4.661-.851 6.491-2.805 1.888-2.01 2.127-4.551 1.053-6.472zm-7.25 4.636a4.088 4.088 0 0 1-2.908 1.155 4.09 4.09 0 0 1-2.907-1.155c-1.704-1.821-3.666-3.075-4.524-4.604-.766-1.364-.265-2.88 1.161-3.945 1.455-1.083 3.32-.423 4.364.912a15.424 15.424 0 0 1 1.906 2.923 15.342 15.342 0 0 1 1.907-2.923c1.043-1.335 2.908-1.995 4.363-.912 1.426 1.065 1.927 2.581 1.161 3.945-.858 1.529-2.82 2.783-4.523 4.604z" />
      </svg>
      <span className="text-xl tracking-tight text-black" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Meta</span>
    </div>,
    // LinkedIn
    <div key="li" className="flex items-center gap-1.5 mx-6">
      <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight text-black" style={{ fontFamily: "Arial, sans-serif" }}>LinkedIn</span>
    </div>
  ];

  return (
    <div className="w-full bg-[#FAF7F2] py-4 border-y border-[#E8E2D9] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left Text */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left shrink-0 z-10 bg-[#FAF7F2] md:pr-4">
          <span className="text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-0.5">Trusted By</span>
          <span className="text-[11px] font-bold text-gray-800 tracking-wide uppercase">200+ Astrologers</span>
        </div>

        {/* Logos Marquee */}
        <div className="flex-1 overflow-hidden relative opacity-80">
          {/* Gradient fade effect on edges for the slider */}
          <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-[#FAF7F2] to-transparent z-10 hidden md:block"></div>
          <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-[#FAF7F2] to-transparent z-10 hidden md:block"></div>

          <div className="flex w-[200%] animate-marquee items-center py-2">
            {/* First set of logos */}
            <div className="flex w-1/2 justify-around items-center">
              {logos}
            </div>
            {/* Second set of logos identical to the first to create infinite loop */}
            <div className="flex w-1/2 justify-around items-center">
              {logos}
            </div>
          </div>
        </div>

        {/* Right avatars */}
        <div className="flex items-center gap-3 shrink-0 z-10 bg-[#FAF7F2] md:pl-4 hidden md:flex">
          <div className="flex -space-x-2">
            <div className="w-9 h-9 rounded-full border-2 border-[#FAF7F2] bg-gradient-to-br from-[#A48255] to-[#7A5E38] text-white text-xs font-bold flex items-center justify-center relative z-10 shadow-sm">
              M
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-[#FAF7F2] bg-gradient-to-br from-[#7A5E38] to-[#554026] text-white text-xs font-bold flex items-center justify-center relative z-20 shadow-sm">
              R
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-[#FAF7F2] bg-gradient-to-br from-[#D4AF37] to-[#A48255] text-white text-xs font-bold flex items-center justify-center relative z-30 shadow-sm">
              V
            </div>
          </div>
          <span className="text-gray-500 font-bold ml-1 text-lg">›</span>
        </div>

      </div>
    </div>
  );
};

const LandingPageMockup = () => (
  <section className="py-16 md:py-20 bg-[#F6F4F0]">
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24">

      {/* Left Image Side */}
      <div className="w-full md:w-[55%] flex justify-center md:justify-end" data-aos="fade-right">
        <div className="relative w-full max-w-[850px] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
          <img
            src={mockupImage}
            alt="Astrology Website Mockup"
            className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700"
          />
        </div>
      </div>

      {/* Right Text Side */}
      <div className="w-full md:w-[45%] flex flex-col items-start pl-0 md:pl-8 lg:pl-16" data-aos="fade-left">
        <span className="text-[#967C5A] text-[11px] font-bold tracking-[0.25em] uppercase mb-4 block">
          Limited Time Offer
        </span>

        <h2 className="text-4xl md:text-[3.5rem] font-serif font-medium text-[#1A1A1A] leading-[1.1] tracking-tight mb-2">
          Create Your Own <br />
          Astrology <br />
          Landing Page
        </h2>
        <div className="text-4xl md:text-[3.5rem] font-serif font-medium text-[#1A1A1A] leading-none mb-6 tracking-tight flex items-baseline gap-2 md:gap-3">
          in Just <span className="text-[#A48255] font-semibold text-[3.25rem] md:text-[4.25rem] tracking-tighter leading-none">₹999</span>
        </div>

        <p className="text-[#4A4A4A] text-lg font-medium leading-relaxed mb-10 max-w-[480px]">
          A beautiful, modern and high-converting landing page to start getting clients online.
        </p>

        <Link to="/checkout" className="px-10 py-4 bg-[#A48255] text-white rounded-full text-lg font-medium hover:bg-[#8e6e44] transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 w-fit">
          Get Your Landing Page →
        </Link>
      </div>

    </div>
  </section>
);

const ServicesDiagram = () => {
  const services = [
    {
      title: "Brand\nPositioning",
      color: "bg-[#F5ECE2]",
      offset: "md:translate-y-4",
      icon: (
        <svg className="w-10 h-10 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM4 20h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4v2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 16h4" />
        </svg>
      )
    },
    {
      title: "Content\nCreation",
      color: "bg-[#F4E0E4]",
      offset: "md:translate-y-20",
      icon: (
        <svg className="w-10 h-10 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Website\nDevelopment",
      color: "bg-[#E3E1F2]",
      offset: "md:-translate-y-2",
      icon: (
        <svg className="w-10 h-10 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Lead\nFunnels",
      color: "bg-[#F1E5D9]",
      offset: "md:translate-y-12",
      icon: (
        <svg className="w-10 h-10 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      )
    },
    {
      title: "WhatsApp\nAutomation",
      color: "bg-[#E2EFDF]",
      offset: "md:translate-y-2",
      icon: (
        <svg className="w-10 h-10 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: "Paid\nAds",
      color: "bg-[#EAE0D3]",
      offset: "md:-translate-y-12",
      icon: (
        <svg className="w-10 h-10 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-[#FAF7F2] overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 -left-32 w-[600px] h-[600px] bg-[#E3E1F2] rounded-full mix-blend-multiply filter blur-[120px] opacity-70"></div>
      <div className="absolute top-0 -right-20 w-[500px] h-[500px] bg-[#F4E0E4] rounded-full mix-blend-multiply filter blur-[120px] opacity-40"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="text-[#967C5A] text-[12px] font-bold tracking-[0.25em] uppercase mb-4 block">
          Our Services
        </span>
        <h2 className="text-4xl md:text-[3.5rem] font-serif font-medium text-[#1A1A1A] leading-[1.1] mb-12 md:mb-16 tracking-tight">
          Everything an Astrologer Needs<br className="hidden md:block" /> to Grow Online
        </h2>

          <div className="relative w-full max-w-[1250px] mx-auto min-h-[300px]">
          {/* Custom Wavy Line */}
          <div className="absolute top-[75px] left-0 w-full h-[200px] -translate-y-1/2 pointer-events-none hidden md:block z-0">
            <svg className="w-full h-full text-[#C8AA82] opacity-70" viewBox="0 0 1000 200" preserveAspectRatio="none" fill="none">
              <path d="M-50,150 C100,-20 200,250 350,80 C500,-20 600,220 750,100 C900,-20 1000,220 1050,50" stroke="currentColor" strokeWidth="1" />
              <path d="M-50,140 C100,-30 200,240 350,70 C500,-30 600,210 750,90 C900,-30 1000,210 1050,40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Service Nodes */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-4 relative z-10 w-full">
            {services.map((s, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className={`flex flex-col items-center transition-transform duration-500 hover:-translate-y-2 ${s.offset}`}>
                <div className={`w-[130px] h-[130px] md:w-[150px] md:h-[150px] rounded-full ${s.color} shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center mb-6 border border-white border-opacity-50 backdrop-blur-sm`}>
                  {s.icon}
                </div>
                <span className="text-[16px] font-bold text-[#1A1A1A] leading-[1.3] whitespace-pre-line text-center tracking-tight">
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProblemSolution = () => (
  <section className="py-24 md:py-32 bg-gradient-to-br from-[#FAF8F5] to-[#F3EBEB] overflow-hidden relative">

    {/* Abstract background shapes */}
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#EBE5F0] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#F2E5DD] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16 lg:gap-24 relative z-10">

      {/* Left Image Side */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-start" data-aos="fade-right">
        <div className="relative w-full max-w-[650px] aspect-[4/3] rounded-[2.5rem] rounded-tr-[10rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[12px] border-white/60">
          <img
            src={archwayImage}
            alt="Astrology Archway"
            className="w-full h-full object-cover transform hover:scale-[1.03] transition-transform duration-700"
          />
        </div>
      </div>

      {/* Right Text Side */}
      <div className="w-full md:w-1/2 flex flex-col items-start pt-8 md:pt-0" data-aos="fade-left">
        <span className="text-[#967C5A] text-[11px] font-bold tracking-[0.25em] uppercase mb-4 block">
          The Problem
        </span>

        <h2 className="text-4xl md:text-[3.25rem] font-serif font-medium text-[#1A1A1A] leading-[1.1] mb-6 tracking-tight">
          Your Astrology is Powerful.<br className="hidden md:block" /> Is Your Brand Communicating It?
        </h2>

        <p className="text-[#4A4A4A] text-[17px] font-medium leading-relaxed mb-10 max-w-[500px]">
          Many astrologers have deep knowledge, but struggle with visibility, consistent content, website, leads and conversions. We bridge that gap with a complete brand and growth system.
        </p>

        <Link to="/checkout" state={{ plan: { name: 'Strategy Call', price: '99' } }} className="px-10 py-4 bg-[#232121] text-white rounded-full text-[17px] font-medium hover:bg-black transition-all flex items-center justify-center gap-3 shadow-lg hover:-translate-y-0.5 w-fit">
          Book a Strategy Call for ₹99 <span className="text-xl leading-none">→</span>
        </Link>
      </div>

    </div>
  </section>
);

const PricingPaths = () => {
  const paths = [
    {
      name: 'Orbit',
      subtitle: 'Build Your Presence',
      price: '15,000',
      icon: (
        <svg className="w-[60px] h-[60px] text-[#8B6532]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
      color: 'bg-[#FDF6EA]',
      btnColor: 'bg-[#B4884B]'
    },
    {
      name: 'Aura',
      subtitle: 'Become a Recognised\nAuthority',
      price: '25,000',
      icon: (
        <svg className="w-[60px] h-[60px] text-[#5E3F39]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2v2m0 16v2m8-10h2M2 12h2m13.657-7.071l1.414 1.414M4.929 19.071l1.414-1.414m0-14.142l1.414 1.414m11.314 11.314l1.414 1.414" />
        </svg>
      ),
      color: 'bg-[#F2E8F4]',
      btnColor: 'bg-[#4B3E52]'
    },
    {
      name: 'Celestial',
      subtitle: 'Build a Premium\nPersonal Brand',
      price: '45,000',
      icon: (
        <svg className="w-[60px] h-[60px] text-[#9A5C41]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2l2.4 7.4L22 12l-7.6 2.6L12 22l-2.4-7.4L2 12l7.6-2.6L12 2z" />
        </svg>
      ),
      color: 'bg-[#FBEAE7]',
      btnColor: 'bg-[#B16A4C]'
    },
    {
      name: 'Astro Brand OS',
      subtitle: 'Complete Digital\nGrowth System',
      price: '75,000+',
      icon: (
        <svg className="w-[60px] h-[60px] text-[#2C3B24]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(-25 12 12)" strokeWidth="1.5" />
        </svg>
      ),
      color: 'bg-[#E5F1E5]',
      btnColor: 'bg-[#435939]'
    }
  ];

  return (
    <section className="py-20 md:py-24 bg-gradient-to-br from-[#4A3B32] to-[#2C211C] px-4 md:px-0">
      <div className="max-w-[1400px] w-full mx-auto bg-[#FAF7F2] rounded-3xl md:rounded-[5rem] px-6 py-16 sm:px-12 lg:px-20 text-center relative shadow-2xl overflow-hidden">

        {/* Floating sparkles */}
        <div className="absolute top-20 left-[35%] text-[#D4AF37] opacity-60">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 9.5L23 12l-9.5 1.5L12 23l-1.5-9.5L1 12l9.5-1.5z" /></svg>
        </div>
        <div className="absolute top-28 right-[30%] text-[#D4AF37] opacity-60 scale-75">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 9.5L23 12l-9.5 1.5L12 23l-1.5-9.5L1 12l9.5-1.5z" /></svg>
        </div>

        <div className="flex items-center justify-center gap-4 mb-20 relative z-10" data-aos="fade-up">
          <div className="h-[1px] w-12 md:w-16 bg-[#967C5A]"></div>
          <span className="text-[#967C5A] text-[12px] font-bold tracking-[0.25em] uppercase">
            Choose Your Growth Path
          </span>
          <div className="h-[1px] w-12 md:w-16 bg-[#967C5A]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 relative z-10">
          {paths.map((p, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className={`${p.color} rounded-[4rem] md:rounded-[6rem] pt-16 pb-14 px-4 flex flex-col items-center hover:-translate-y-2 transition-transform duration-500 group shadow-sm hover:shadow-lg`}>
              <div className="mb-10 transform group-hover:scale-110 transition-transform duration-500">
                {p.icon}
              </div>
              <h3 className="text-[26px] font-medium text-[#1A1A1A] mb-3 tracking-tight">{p.name}</h3>
              <p className="text-[13.5px] text-[#4A4A4A] h-10 leading-tight whitespace-pre-line font-medium mb-2">
                {p.subtitle}
              </p>
              <div className="mt-8 mb-12 flex items-baseline gap-1">
                <span className="text-[30px] font-semibold text-[#1A1A1A] tracking-tight">₹{p.price}</span>
                <span className="text-[14px] font-bold text-[#1A1A1A]">/ month</span>
              </div>
              <Link to="/checkout" state={{ plan: { name: p.name, price: p.price } }} className={`w-12 h-12 rounded-full ${p.btnColor} text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md`}>
                <span className="text-xl leading-none">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessTimeline = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      desc: 'Understand your goals and current presence',
      color: 'bg-[#F2E5D5]',
      offset: 'md:-translate-y-8',
      icon: (
        <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      num: '02',
      title: 'Strategy',
      desc: 'Create your brand and content roadmap',
      color: 'bg-[#F5DAC7]',
      offset: 'md:translate-y-12',
      icon: (
        <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      num: '03',
      title: 'Create',
      desc: 'Produce high-quality content and assets',
      color: 'bg-[#EBDDF0]',
      offset: 'md:-translate-y-2',
      icon: (
        <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <rect x="3" y="6" width="18" height="12" rx="3" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      num: '04',
      title: 'Grow',
      desc: 'Implement funnels, ads and automation',
      color: 'bg-[#F6DEE2]',
      offset: 'md:translate-y-8',
      icon: (
        <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 14-4-4-6 6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 18v3m4-6v6m4-9v9" />
        </svg>
      )
    },
    {
      num: '05',
      title: 'Scale',
      desc: 'Optimise, retain and help you grow consistently',
      color: 'bg-[#F4EAE3]',
      offset: 'md:-translate-y-6',
      icon: (
        <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l2.4 7.4L22 12l-7.6 2.6L12 22l-2.4-7.4L2 12l7.6-2.6L12 2z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 bg-[#FAF7F2] overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

        {/* Floating sparkles */}
        <div className="absolute top-10 left-[25%] text-[#D4AF37] opacity-60 scale-75 hidden md:block">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 9.5L23 12l-9.5 1.5L12 23l-1.5-9.5L1 12l9.5-1.5z" /></svg>
        </div>
        <div className="absolute top-12 right-[25%] text-[#D4AF37] opacity-60 scale-75 hidden md:block">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 9.5L23 12l-9.5 1.5L12 23l-1.5-9.5L1 12l9.5-1.5z" /></svg>
        </div>

        <span className="text-[#967C5A] text-[11px] font-bold tracking-[0.25em] uppercase mb-4 block">
          How It Works
        </span>
        <h2 className="text-4xl md:text-[3.5rem] font-serif font-medium text-[#1A1A1A] leading-[1.1] mb-20 md:mb-28 tracking-tight">
          A Simple 5-Step Process
        </h2>

        <div className="relative w-full max-w-[1250px] mx-auto min-h-[300px]">
          {/* Custom Wavy Line */}
          <div className="absolute top-[35%] left-0 w-full h-[150px] -translate-y-1/2 pointer-events-none hidden md:block z-0">
            <svg className="w-full h-full text-[#C8AA82] opacity-60" viewBox="0 0 1000 150" preserveAspectRatio="none" fill="none">
              <path d="M-50,80 C150,80 150,150 300,120 C450,90 450,50 600,60 C750,70 800,120 950,100 C1000,90 1050,70 1100,70" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="450" cy="73" r="5" fill="#967C5A" />
            </svg>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-12 md:gap-4 relative z-10">
            {steps.map((s, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 150} className={`flex flex-col items-center w-full md:w-[18%] ${s.offset}`}>
                <span className="text-[17px] font-bold text-[#1A1A1A] mb-3">{s.num}</span>
                <div className={`w-[90px] h-[90px] md:w-[110px] md:h-[110px] rounded-full ${s.color} shadow-sm flex items-center justify-center mb-5 hover:scale-105 transition-transform duration-500`}>
                  {s.icon}
                </div>
                <h3 className="text-[19px] font-bold text-[#1A1A1A] mb-2 tracking-tight">{s.title}</h3>
                <p className="text-[13px] md:text-[14px] text-[#4A4A4A] leading-snug px-2 text-center font-medium">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => (
  <section className="py-24 bg-[#F5F0E8]">
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="text-[#8B7355] text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase mb-3 block">Real Stories. Real Growth.</span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] leading-tight">Astrologers Who Trusted Us</h2>
        </div>
        <a href="#cases" className="text-sm font-medium text-[#2C2C2C] hover:underline hidden md:block">
          View All Case Studies →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Dr. Mehak S.', role: 'Numerologist & Tarot Expert', text: 'My consultations have increased 3x after working with Astro Brand Lab. The content and strategy is outstanding.' },
          { name: 'Pandit R. Sharma', role: 'Vedic Astrologer', text: 'They understood my vision completely and created a premium brand and website. The leads are now consistent and genuine.' },
          { name: 'Sonika M.', role: 'Past Life Therapist', text: 'From content to ads to a WhatsApp automation, everything is handled professionally. Highly recommended!' }
        ].map((t, i) => (
          <div key={i} data-aos="fade-up" data-aos-delay={i * 150} className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#E8E2D9] relative shadow-sm">
            <span className="absolute top-4 left-4 text-xs font-bold text-[#D4AF37]">0{i + 1}</span>
            <div className="flex gap-4 mt-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A48255] to-[#7A5E38] text-white font-bold flex items-center justify-center text-base shrink-0 shadow-sm">
                {t.name[0]}
              </div>
              <div>
                <p className="text-sm text-[#2C2C2C] italic mb-4">"{t.text}"</p>
                <h4 className="font-bold text-[#2C2C2C] text-sm">{t.name}</h4>
                <span className="text-xs text-[#666]">{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const BottomCTA = () => (
  <section className="relative w-full overflow-hidden bg-[#FAF7F2]">
    <div className="relative w-full h-[550px] md:h-[650px] flex items-center">
      {/* Background Image */}
      <img 
        src={ctaBackground} 
        alt="Ready to grow" 
        className="absolute inset-0 w-full h-full object-cover object-center z-0" 
      />
      
      {/* Text Content Overlay */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 md:px-20 lg:px-32">
        <div className="max-w-[450px]" data-aos="fade-up" data-aos-duration="1000">
          <span className="text-white/80 text-[11px] font-bold tracking-[0.3em] uppercase mb-4 block drop-shadow-md">
            READY TO GROW?
          </span>
          <h2 className="text-[2.75rem] md:text-[4rem] font-serif font-medium text-white leading-[1.05] mb-5 tracking-tight drop-shadow-lg">
            Book Your ₹99 <br />Strategy Call
          </h2>
          <p className="text-white/90 text-[15.5px] font-medium leading-relaxed mb-8 max-w-[420px] drop-shadow-md">
            A 20-minute focused call to understand your brand, identify gaps and create a 90-day growth plan.
          </p>
          <Link to="/checkout" state={{ plan: { name: 'Strategy Call', price: '99' } }} className="px-10 py-4 bg-[#FDFBF7] text-[#1A1A1A] rounded-full text-[16px] font-bold hover:bg-white transition-all flex items-center justify-center gap-3 shadow-2xl hover:scale-105 w-fit">
            Book a Strategy Call for ₹99 <span className="text-xl leading-none">→</span>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="w-full bg-[#FAF7F2] pt-24 pb-10 border-t border-[#EBE2D5] relative overflow-hidden">
    {/* Soft glowing orb in background */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F2E5DD] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
        
        {/* Column 1: Brand */}
        <div className="lg:col-span-1">
          <h3 className="text-[28px] font-serif font-medium text-[#1A1A1A] mb-5 tracking-tight">Astro Brand Lab.</h3>
          <p className="text-[14.5px] text-[#4A4A4A] leading-relaxed font-medium mb-8 max-w-[280px]">
            The complete digital growth system for modern astrologers, tarot readers, and cosmic guides.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="w-10 h-10 rounded-full border border-[#DCD3C6] flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-[#DCD3C6] flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors" aria-label="YouTube">
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </a>
          </div>
        </div>

        {/* Column 2: Links */}
        <div className="lg:col-span-1 lg:pl-12">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#967C5A] uppercase mb-6">Explore</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-[14.5px] font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors">Our Services</a></li>
            <li><a href="#" className="text-[14.5px] font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors">Pricing Paths</a></li>
            <li><a href="#" className="text-[14.5px] font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors">Success Stories</a></li>
            <li><a href="#" className="text-[14.5px] font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors">How it Works</a></li>
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div className="lg:col-span-1">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#967C5A] uppercase mb-6">Legal</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-[14.5px] font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-[14.5px] font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-[14.5px] font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors">Refund Policy</a></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="lg:col-span-1">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#967C5A] uppercase mb-6">Get in Touch</h4>
          <p className="text-[14.5px] font-medium text-[#4A4A4A] mb-4 leading-relaxed">
            Have questions? We're here to help you grow your cosmic brand.
          </p>
          <a href="mailto:hello@astrobrandlab.com" className="text-[16px] font-bold text-[#1A1A1A] border-b-2 border-[#1A1A1A] pb-1 hover:text-[#967C5A] hover:border-[#967C5A] transition-colors inline-block mt-2">
            hello@astrobrandlab.com
          </a>
        </div>
      </div>

      <div className="pt-8 border-t border-[#EBE2D5] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[13px] font-medium text-[#666]">
          © 2026 Astro Brand Lab. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-[13px] font-medium text-[#666]">
          <span className="flex items-center gap-1.5"><span className="text-[#967C5A] text-[15px]">★</span> Expert Guidance</span>
          <span className="flex items-center gap-1.5"><span className="text-[#967C5A] text-[15px]">♡</span> Built with Love</span>
        </div>
      </div>
    </div>
  </footer>
);

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Hero />
      <TrustedBy />
      <LandingPageMockup />
      <ServicesDiagram />
      <ProblemSolution />
      <PricingPaths />
      <ProcessTimeline />
      <Testimonials />
      <BottomCTA />
      <Footer />
    </div>
  );
};

export default Home;
