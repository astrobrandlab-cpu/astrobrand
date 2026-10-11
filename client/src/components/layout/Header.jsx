import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Services', href: '/#services' },
    { name: 'Packages', href: '/#packages' },
    { name: 'Case Studies', href: '/#casestudies' },
    { name: 'About', href: '/#about' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E8E2D9] py-3 shadow-sm' 
          : 'bg-[#FDFBF7] border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="relative flex items-center justify-center w-10 h-10">
            <svg viewBox="0 0 40 40" className="w-full h-full text-[#1A1A1A]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 5 L10 35 L14 35 L20 15 L26 35 L30 35 Z" fill="currentColor"/>
              <path d="M12 25 L28 25" stroke="#D4AF37" strokeWidth="2"/>
            </svg>
          </div>
          
          <div className="flex flex-col">
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[20px] md:text-[22px] font-bold tracking-[0.05em] text-[#1A1A1A] leading-tight uppercase">
              Astro Brand Lab
            </span>
            <span className="text-[11px] text-[#555] font-medium tracking-[0.1em] uppercase mt-0.5">
              Build. Position. Grow.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="relative text-[15px] font-medium transition-colors duration-300 py-1 text-[#666666] hover:text-[#1A1A1A]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* CTA Buttons & Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#A48255] text-white rounded-full text-sm font-bold hover:bg-[#8E6E44] transition-all shadow-sm"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 pl-2">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || "User"}
                    className="w-9 h-9 rounded-full border-2 border-[#E8E2D9] object-cover hover:border-[#A48255] transition-colors"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full border-2 border-[#E8E2D9] bg-gradient-to-br from-[#A48255] to-[#7A5E38] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:border-[#A48255] transition-colors">
                    {user?.name ? user.name[0].toUpperCase() : 'A'}
                  </div>
                )}
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-bold text-[#1A1A1A] hover:text-[#A48255] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1A1A1A] text-white rounded-full text-sm font-bold hover:bg-black transition-colors shadow-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
          
          <button 
            className="lg:hidden text-[#1A1A1A] p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#FDFBF7] border-b border-[#E8E2D9] py-4 px-4 shadow-xl flex flex-col gap-2">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium p-3 rounded-xl transition-colors text-[#666] hover:bg-black/5 hover:text-[#1A1A1A]"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-[#E8E2D9] flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-[#A48255] text-white rounded-xl text-center font-bold text-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 border border-[#E8E2D9] text-[#1A1A1A] rounded-xl text-center font-bold text-sm hover:bg-black/5"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 bg-[#1A1A1A] text-white rounded-xl text-center font-bold text-sm"
                >
                  Create Astrologer Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
