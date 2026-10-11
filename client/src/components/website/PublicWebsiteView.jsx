import React, { useState } from 'react';
import { API_URL } from '../../context/AuthContext';
import {
  Calendar, Clock, Star, CheckCircle2, Shield, Heart,
  Sparkles, Compass, MessageCircle, Send, ArrowRight,
  ChevronDown, ChevronUp, Instagram, Youtube, Facebook,
  Twitter, Globe, Phone, MapPin, Award, UserCheck, Check,
  Moon, Sun, Flame, Sparkle
} from 'lucide-react';

export const PublicWebsiteView = ({ website, isPreview = false, onBookService = null }) => {
  const {
    design = {},
    visibility = {},
    logo = { type: 'text', text: 'Dr. Mehak Sharma' },
    navItems = ['About', 'Services', 'Consultation', 'Reviews', 'FAQ'],
    hero = {},
    about = {},
    serviceTitle = 'Specialized Consultations & Services',
    services = [],
    testimonialsTitle = 'What Happy Clients Say',
    testimonials = [],
    faqTitle = 'Frequently Asked Questions',
    faq = [],
    social = {},
    footerText = ''
  } = website || {};

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: services[0]?.name || 'Kundali & Birth Chart Reading',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick horoscope widget state
  const [selectedZodiac, setSelectedZodiac] = useState('Aries (Mesh)');

  // Design tokens & styling
  const fontMap = {
    serif: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    cinzel: "'Cinzel', serif",
    sans: "'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif",
    mono: "'Space Mono', monospace",
  };

  const currentFont = fontMap[design.fontFamily] || fontMap.serif;
  const h1Size = parseInt(design.headingSize || '48', 10);
  const bodySize = parseInt(design.bodySize || '16', 10);
  const primaryColor = design.primaryColor || '#A48255';
  const bgColor = design.backgroundColor || '#FAF7F2';
  const textColor = design.textColor || '#1A1A1A';

  const isDarkMode = bgColor === '#1A1208' || bgColor === '#0F0A1A' || textColor === '#FFFFFF';
  const astrologerName = logo?.text || about?.title?.replace(/^About\s+/, '') || 'Astrologer';

  // Smooth scroll handler
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServiceSelect = (serviceName) => {
    setFormData(prev => ({ ...prev, service: serviceName }));
    if (onBookService) onBookService(serviceName);
    scrollToSection('consultation');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    const newLead = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      service: formData.service,
      dateOfBirth: formData.dateOfBirth,
      timeOfBirth: formData.timeOfBirth,
      placeOfBirth: formData.placeOfBirth,
      message: formData.message,
      status: 'new'
    };

    // Save lead directly to MongoDB database
    try {
      const slug = website?.slug || 'dr-mehak';
      await fetch(`${API_URL}/websites/public/${slug}/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
    } catch (err) {
      console.warn('Failed to save lead to MongoDB database', err);
    }

    // Save lead locally as instant cache so it displays immediately in the dashboard
    try {
      const existingLeads = JSON.parse(localStorage.getItem('astrobrand_leads') || '[]');
      localStorage.setItem('astrobrand_leads', JSON.stringify([
        { ...newLead, id: Date.now(), createdAt: new Date().toISOString(), source: 'Landing Page' },
        ...existingLeads
      ]));
    } catch (err) {
      console.warn('Failed to save lead to localStorage', err);
    }

    setFormSubmitted(true);
  };

  // WhatsApp quick chat link
  const cleanPhone = (social?.whatsapp || '+919876543210').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Namaste ${astrologerName}, I visited your website and would like to book an astrology consultation.`)}`;

  return (
    <div
      className="min-h-screen transition-colors duration-300 relative select-text"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: currentFont,
        fontSize: `${bodySize}px`,
      }}
    >
      {/* ────────────────── HEADER ────────────────── */}
      {visibility.header !== false && (
        <header
          className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors"
          style={{
            backgroundColor: isDarkMode ? 'rgba(26, 18, 8, 0.95)' : 'rgba(250, 247, 242, 0.95)',
            borderColor: `${textColor}15`
          }}
        >
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-md shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                ✦
              </div>
              <div>
                <a 
                  href="#top" 
                  className="text-2xl md:text-3xl font-bold tracking-tight hover:opacity-90 transition-opacity block leading-none"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {astrologerName}
                </a>
                <span className="text-[10px] uppercase font-sans font-bold tracking-widest opacity-60 block mt-1">
                  Vedic Astrology & Spiritual Guidance
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-sans font-semibold tracking-wide">
              {navItems.map((item, idx) => {
                const sectionId = item.toLowerCase().replace(/\s+/g, '-');
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToSection(sectionId)}
                    className="hover:opacity-100 opacity-70 transition-all capitalize py-1 relative group cursor-pointer"
                    style={{ color: textColor }}
                  >
                    <span>{item}</span>
                    <span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" 
                      style={{ backgroundColor: primaryColor }}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Header CTA */}
            <div className="hidden sm:flex items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden xl:flex items-center gap-2 text-xs font-sans font-bold opacity-80 hover:opacity-100 transition-opacity"
              >
                <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>WhatsApp Instant</span>
              </a>

              <button
                type="button"
                onClick={() => scrollToSection('consultation')}
                className="px-6 py-3 rounded-full text-xs font-sans uppercase font-bold tracking-widest text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                Book Consultation
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-black/5"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-0.5 bg-current mb-1.5" />
              <div className="w-6 h-0.5 bg-current mb-1.5" />
              <div className="w-6 h-0.5 bg-current" />
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div
              className="lg:hidden px-6 py-5 border-t space-y-3 shadow-2xl animate-in slide-in-from-top-4"
              style={{
                backgroundColor: bgColor,
                borderColor: `${textColor}15`
              }}
            >
              {navItems.map((item, idx) => {
                const sectionId = item.toLowerCase().replace(/\s+/g, '-');
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToSection(sectionId)}
                    className="block w-full text-left py-2.5 text-base font-sans font-semibold hover:opacity-80 border-b border-black/5"
                  >
                    {item}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => scrollToSection('consultation')}
                className="w-full mt-3 py-3.5 rounded-xl text-xs font-sans uppercase font-bold tracking-widest text-white text-center block shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                Book Consultation Now
              </button>
            </div>
          )}
        </header>
      )}

      {/* ────────────────── LUXURY HERO SECTION ────────────────── */}
      {visibility.hero !== false && (
        <section
          id="top"
          className="relative py-16 md:py-28 px-6 overflow-hidden"
          style={{
            backgroundColor: hero.bgType === 'color' ? (hero.bgColor || bgColor) : 'transparent',
            backgroundImage: hero.bgType === 'image' && hero.bgImageUrl ? `url(${hero.bgImageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Ambient Celestial Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full filter blur-[120px] opacity-20 pointer-events-none" style={{ backgroundColor: primaryColor }} />
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full filter blur-[100px] opacity-15 pointer-events-none" style={{ backgroundColor: '#D4AF37' }} />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Headline & Credibility */}
              <div className="lg:col-span-7 text-left space-y-6">
                
                {/* Badge */}
                {hero.badge && (
                  <div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans font-bold tracking-widest uppercase shadow-sm border"
                    style={{
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor,
                      borderColor: `${primaryColor}30`,
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>{hero.badge}</span>
                  </div>
                )}

                {/* Main Headline with Serif Typography */}
                <h1
                  className="font-bold leading-[1.08] tracking-tight"
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    fontSize: `clamp(38px, 5.5vw, ${h1Size + 8}px)`,
                    color: textColor,
                  }}
                >
                  {hero.title || 'Unlock Cosmic Clarity & Shape Your Destiny'}
                </h1>

                {/* Subtitle */}
                <p
                  className="max-w-xl text-base md:text-lg leading-relaxed opacity-85 font-sans"
                  style={{ color: textColor }}
                >
                  {hero.subtitle || 'Personalized Vedic astrology readings, Kundali Milan, and intuitive guidance to navigate life transitions with confidence and peace.'}
                </p>

                {/* Quick Trust Chips */}
                <div className="flex flex-wrap items-center gap-4 pt-2 font-sans text-xs opacity-80">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Authentic Parashara Vedic Principles</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>100% Confidential 1-on-1 Sessions</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Simple Practical Remedies</span>
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => scrollToSection('consultation')}
                    className="px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span>{hero.buttonText || 'Book 1-on-1 Consultation'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('services')}
                    className="px-8 py-4 rounded-full font-sans font-bold text-sm tracking-wide border transition-all hover:bg-black/5 flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      borderColor: `${textColor}30`,
                      color: textColor,
                    }}
                  >
                    <span>Explore Specialized Readings</span>
                  </button>
                </div>

                {/* Social Proof Quote */}
                <div className="pt-6 border-t flex items-center gap-4" style={{ borderColor: `${textColor}15` }}>
                  <div className="flex text-amber-500">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} className="text-base">{s}</span>
                    ))}
                  </div>
                  <div className="text-xs font-sans opacity-75">
                    <strong>4.9 / 5 Rating</strong> from 5,000+ happy clients across India & worldwide
                  </div>
                </div>

              </div>

              {/* Right Column: Celestial Astrologer Portrait Card */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[420px]">
                  
                  {/* Decorative Golden Mandala Outer Ring */}
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-dashed opacity-40 animate-spin pointer-events-none"
                    style={{ 
                      borderColor: primaryColor,
                      animationDuration: '60s'
                    }}
                  />

                  {/* Celestial Glow backdrop */}
                  <div 
                    className="absolute -inset-4 rounded-3xl opacity-30 filter blur-xl pointer-events-none"
                    style={{ backgroundColor: primaryColor }}
                  />

                  {/* Astrologer Card Container */}
                  <div 
                    className="relative rounded-3xl p-6 border shadow-2xl backdrop-blur-md overflow-hidden text-center"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255, 255, 255, 0.92)',
                      borderColor: `${textColor}20`
                    }}
                  >
                    
                    {/* Portrait Image */}
                    <div className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 shadow-xl mb-6 ring-4 ring-[#E8E2D9]" style={{ borderColor: '#FFFFFF' }}>
                      <img
                        src={about?.imageUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"}
                        alt={astrologerName}
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Astrologer Title */}
                    <div className="space-y-1 mb-4">
                      <h3 
                        className="text-2xl font-bold tracking-tight"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {astrologerName}
                      </h3>
                      <p className="text-xs font-sans uppercase font-bold tracking-widest" style={{ color: primaryColor }}>
                        {about?.subtitle || '12+ Years Experience • Vedic Master'}
                      </p>
                    </div>

                    {/* Floating Badges inside card */}
                    <div className="grid grid-cols-2 gap-2.5 pt-3 border-t text-left" style={{ borderColor: `${textColor}10` }}>
                      <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60">
                        <span className="text-[10px] font-sans font-bold uppercase text-amber-800 block">Experience</span>
                        <span className="text-sm font-bold text-amber-950 font-sans">12+ Years Vedic</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60">
                        <span className="text-[10px] font-sans font-bold uppercase text-emerald-800 block">Consultations</span>
                        <span className="text-sm font-bold text-emerald-950 font-sans">5,000+ Guided</span>
                      </div>
                    </div>

                    {/* Instant Slot CTA */}
                    <button
                      type="button"
                      onClick={() => scrollToSection('consultation')}
                      className="mt-4 w-full py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider text-white shadow transition-all hover:opacity-95"
                      style={{ backgroundColor: primaryColor }}
                    >
                      ⚡ Reserve Today's Available Slot
                    </button>

                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ────────────────── TRUST BADGES BAR ────────────────── */}
      <section
        className="py-8 px-6 border-y"
        style={{
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          borderColor: `${textColor}15`
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}18`, color: primaryColor }}>
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left font-sans">
              <span className="text-xs font-bold uppercase tracking-wider block">12+ Years Lineage</span>
              <span className="text-[11px] opacity-60">Gold Medalist Astrologer</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}18`, color: primaryColor }}>
              <Heart className="w-5 h-5" />
            </div>
            <div className="text-left font-sans">
              <span className="text-xs font-bold uppercase tracking-wider block">5,000+ Consultations</span>
              <span className="text-[11px] opacity-60">High Client Loyalty</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}18`, color: primaryColor }}>
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-left font-sans">
              <span className="text-xs font-bold uppercase tracking-wider block">100% Confidential</span>
              <span className="text-[11px] opacity-60">Private 1-on-1 Meet</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}18`, color: primaryColor }}>
              <Star className="w-5 h-5" />
            </div>
            <div className="text-left font-sans">
              <span className="text-xs font-bold uppercase tracking-wider block">4.9 ★ Rating</span>
              <span className="text-[11px] opacity-60">Google & WhatsApp Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── ABOUT SECTION ────────────────── */}
      {visibility.about !== false && (
        <section
          id="about"
          className="py-20 md:py-28 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              
              {/* Astrologer Image Side */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[380px]">
                  <div
                    className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 relative"
                    style={{ borderColor: '#FFFFFF' }}
                  >
                    <img
                      src={about.imageUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"}
                      alt={astrologerName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute -bottom-6 -right-4 px-5 py-3 rounded-2xl shadow-xl text-white font-sans font-bold text-xs uppercase tracking-wider"
                    style={{ backgroundColor: primaryColor }}
                  >
                    ★ Authentic Vedic Guru
                  </div>
                </div>
              </div>

              {/* Bio & Credentials */}
              <div className="md:col-span-7 space-y-6 text-left">
                <span
                  className="text-xs font-sans font-bold uppercase tracking-widest block"
                  style={{ color: primaryColor }}
                >
                  Lineage & Background
                </span>

                <h2
                  className="font-bold tracking-tight"
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: `clamp(30px, 4vw, ${Math.round(h1Size * 0.85)}px)` 
                  }}
                >
                  {about.title || `About ${astrologerName}`}
                </h2>

                <p
                  className="text-sm font-sans font-bold uppercase tracking-wider opacity-70"
                  style={{ color: primaryColor }}
                >
                  {about.subtitle || '12+ Years Experience • 5,000+ Consultations • Gold Medalist Astrologer'}
                </p>

                <p className="text-base leading-relaxed opacity-85 font-sans whitespace-pre-line">
                  {about.text || 'Namaste! I am a dedicated Vedic Astrologer, Numerologist, and Spiritual Counselor helping individuals discover their true life path, overcome career obstacles, resolve relationship disharmony, and find inner peace through authentic planetary analysis and practical remedies.'}
                </p>

                {/* Counter Grid */}
                {about.stats && about.stats.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t" style={{ borderColor: `${textColor}15` }}>
                    {about.stats.map((st, sIdx) => (
                      <div key={sIdx} className="p-3.5 rounded-2xl bg-white/60 border border-[#E8E2D9] text-center">
                        <div className="text-2xl font-bold font-sans" style={{ color: primaryColor }}>
                          {st.value}
                        </div>
                        <div className="text-[11px] font-sans font-semibold uppercase tracking-wider opacity-60 mt-1">
                          {st.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('consultation')}
                    className="px-8 py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-wider text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Schedule a Personal Reading →
                  </button>
                </div>

              </div>

            </div>
          </div>
        </section>
      )}

      {/* ────────────────── SPECIALIZED SERVICES SECTION ────────────────── */}
      {visibility.services !== false && (
        <section
          id="services"
          className="py-20 md:py-28 px-6 border-t"
          style={{
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
            borderColor: `${textColor}10`
          }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <span
              className="text-xs font-sans font-bold uppercase tracking-widest block mb-2"
              style={{ color: primaryColor }}
            >
              Consultations & Offerings
            </span>
            <h2
              className="font-bold tracking-tight mb-4"
              style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: `clamp(32px, 4.5vw, ${Math.round(h1Size * 0.9)}px)` 
              }}
            >
              {serviceTitle || 'Specialized Consultations & Services'}
            </h2>
            <p className="max-w-xl mx-auto opacity-75 mb-14 text-sm font-sans leading-relaxed">
              Every consultation includes comprehensive birth chart analysis, planetary dasha timeline, and simple practical Vedic remedies.
            </p>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {(services || []).filter(srv => srv.active !== false).map((srv) => (
                <div
                  key={srv.id}
                  className="rounded-3xl p-6 border flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative group bg-white"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
                    borderColor: srv.badge ? primaryColor : `${textColor}15`
                  }}
                >
                  {srv.badge && (
                    <span
                      className="absolute -top-3 right-5 px-3 py-1 rounded-full text-[10px] font-sans font-bold tracking-wider uppercase text-white shadow"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {srv.badge}
                    </span>
                  )}

                  <div>
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-xl font-bold"
                      style={{
                        backgroundColor: `${primaryColor}18`,
                        color: primaryColor
                      }}
                    >
                      ✦
                    </div>

                    <h3 
                      className="font-bold text-xl mb-1 leading-snug"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {srv.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs font-sans opacity-60 mb-3">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{srv.duration || '30 mins'}</span>
                      <span>•</span>
                      <span>{srv.category || 'Vedic'}</span>
                    </div>

                    <p className="text-xs font-sans opacity-75 mb-5 leading-relaxed">
                      {srv.desc}
                    </p>

                    {srv.features && srv.features.length > 0 && (
                      <ul className="space-y-2 mb-6 text-xs font-sans opacity-85">
                        {srv.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 border-t" style={{ borderColor: `${textColor}10` }}>
                    <div className="flex items-baseline justify-between mb-4 font-sans">
                      <span className="text-xs uppercase font-bold opacity-60">Session Fee</span>
                      <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                        {srv.price}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleServiceSelect(srv.name)}
                      className="w-full py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Book This Session →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ────────────────── CONSULTATION BOOKING FORM ────────────────── */}
      {visibility.consultation !== false && (
        <section
          id="consultation"
          className="py-20 md:py-28 px-6"
        >
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-3xl border shadow-2xl p-8 md:p-12 relative overflow-hidden"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                borderColor: `${textColor}15`
              }}
            >
              <div className="text-center max-w-xl mx-auto mb-10">
                <span
                  className="text-xs font-sans font-bold uppercase tracking-widest block mb-2"
                  style={{ color: primaryColor }}
                >
                  Direct Appointment
                </span>
                <h2
                  className="font-bold tracking-tight mb-3"
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: `clamp(28px, 4vw, ${Math.round(h1Size * 0.85)}px)` 
                  }}
                >
                  Book Your Consultation
                </h2>
                <p className="text-sm font-sans opacity-70">
                  Fill in your birth details and preferred consultation type. {astrologerName} will review your details and confirm your consultation slot.
                </p>
              </div>

              {formSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in">
                  <div
                    className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold font-serif">Request Received Successfully!</h3>
                  <p className="text-sm font-sans opacity-80 max-w-md mx-auto leading-relaxed">
                    Thank you <strong>{formData.name}</strong>. {astrologerName}'s team has received your consultation enquiry for <strong>{formData.service}</strong>. We will message you on WhatsApp at <strong>{formData.phone}</strong> with slot options.
                  </p>
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${astrologerName}, I just submitted a booking request for ${formData.service} on your website.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-sans uppercase font-bold tracking-wider text-white shadow"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirm Faster via WhatsApp</span>
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="mt-4 px-6 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-wider border hover:bg-black/5"
                  >
                    Book Another Session
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6 text-left font-sans">
                  
                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                        style={{
                          backgroundColor: `${textColor}05`,
                          borderColor: `${textColor}20`,
                          color: textColor
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                        style={{
                          backgroundColor: `${textColor}05`,
                          borderColor: `${textColor}20`,
                          color: textColor
                        }}
                      />
                    </div>
                  </div>

                  {/* Email & Service */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. rahul@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                        style={{
                          backgroundColor: `${textColor}05`,
                          borderColor: `${textColor}20`,
                          color: textColor
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                        Select Consultation Service *
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                        style={{
                          backgroundColor: `${textColor}05`,
                          borderColor: `${textColor}20`,
                          color: textColor
                        }}
                      >
                        {(services || []).filter((s) => s.active !== false).map((s) => (
                          <option key={s.id} value={s.name} style={{ color: '#1A1A1A' }}>
                            {s.name} ({s.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Birth Details Box */}
                  <div className="p-5 rounded-2xl border" style={{ borderColor: `${textColor}15`, backgroundColor: `${textColor}03` }}>
                    <div className="text-xs font-bold uppercase tracking-wider mb-3 opacity-90 flex items-center gap-1.5" style={{ color: primaryColor }}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Birth Details (Essential for Vedic Kundali Analysis)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1 opacity-70">Birth Date</label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderColor: `${textColor}20`,
                            color: '#1A1A1A'
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1 opacity-70">Birth Time (Exact)</label>
                        <input
                          type="time"
                          value={formData.timeOfBirth}
                          onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderColor: `${textColor}20`,
                            color: '#1A1A1A'
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1 opacity-70">Birth Place (City, State)</label>
                        <input
                          type="text"
                          placeholder="e.g. Jaipur, Rajasthan"
                          value={formData.placeOfBirth}
                          onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderColor: `${textColor}20`,
                            color: '#1A1A1A'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message / Query */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                      Specific Questions or Concerns (Optional)
                    </label>
                    <textarea
                      rows="3"
                      placeholder="e.g. Inquiring about marriage timing, career change, or financial remedies..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 resize-none"
                      style={{
                        backgroundColor: `${textColor}05`,
                        borderColor: `${textColor}20`,
                        color: textColor
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Appointment Request</span>
                    </button>
                    <p className="text-center text-xs opacity-60 mt-3">
                      🔒 Your details are 100% confidential and never shared with third parties.
                    </p>
                  </div>

                </form>
              )}

            </div>
          </div>
        </section>
      )}

      {/* ────────────────── REVIEWS SECTION ────────────────── */}
      {visibility.testimonials !== false && (
        <section
          id="reviews"
          className="py-20 md:py-28 px-6 border-t"
          style={{
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
            borderColor: `${textColor}10`
          }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <span
              className="text-xs font-sans font-bold uppercase tracking-widest block mb-2"
              style={{ color: primaryColor }}
            >
              Client Experiences
            </span>
            <h2
              className="font-bold tracking-tight mb-4"
              style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: `clamp(32px, 4.5vw, ${Math.round(h1Size * 0.9)}px)` 
              }}
            >
              {testimonialsTitle || 'What Happy Clients Say'}
            </h2>
            <p className="max-w-xl mx-auto opacity-75 mb-14 text-sm font-sans leading-relaxed">
              Read authentic feedback from individuals and families guided through life crossroads.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left font-sans">
              {(testimonials || []).map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl p-6 border flex flex-col justify-between shadow-sm bg-white"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
                    borderColor: `${textColor}15`
                  }}
                >
                  <div>
                    {/* Stars */}
                    <div className="flex text-amber-500 mb-4">
                      {Array.from({ length: t.rating || 5 }).map((_, sI) => (
                        <Star key={sI} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>

                    <p className="text-sm opacity-85 leading-relaxed italic mb-6">
                      "{t.text}"
                    </p>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: `${textColor}10` }}>
                    <div>
                      <h4 className="font-bold text-sm leading-snug">{t.name}</h4>
                      <p className="text-xs opacity-60">{t.location || 'India'} • {t.service || 'Reading'}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ────────────────── FAQ SECTION ────────────────── */}
      {visibility.faq !== false && (
        <section
          id="faq"
          className="py-20 md:py-28 px-6"
        >
          <div className="max-w-4xl mx-auto text-left font-sans">
            <div className="text-center mb-12">
              <span
                className="text-xs font-bold uppercase tracking-widest block mb-2"
                style={{ color: primaryColor }}
              >
                Clear Answers
              </span>
              <h2
                className="font-bold tracking-tight mb-3"
                style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: `clamp(30px, 4vw, ${Math.round(h1Size * 0.85)}px)` 
                }}
              >
                {faqTitle || 'Frequently Asked Questions'}
              </h2>
            </div>

            <div className="space-y-4">
              {(faq || []).map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border transition-all overflow-hidden"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                      borderColor: isOpen ? primaryColor : `${textColor}15`
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      className="w-full p-5 text-left font-bold text-base flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span>{item.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 shrink-0" style={{ color: primaryColor }} />
                      ) : (
                        <ChevronDown className="w-5 h-5 shrink-0 opacity-50" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-sm opacity-80 leading-relaxed border-t" style={{ borderColor: `${textColor}10` }}>
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ────────────────── FOOTER ────────────────── */}
      {visibility.footer !== false && (
        <footer
          className="py-12 px-6 border-t font-sans text-xs"
          style={{
            backgroundColor: isDarkMode ? '#0F0A05' : '#1A1A1A',
            color: '#FAF7F2',
            borderColor: 'rgba(255,255,255,0.1)'
          }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 
                className="text-2xl font-bold tracking-tight mb-1 text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {astrologerName}
              </h3>
              <p className="opacity-60 text-xs">
                {footerText || `© ${new Date().getFullYear()} ${astrologerName}. All spiritual consultations are guidance-based.`}
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </footer>
      )}

      {/* ────────────────── FLOATING WHATSAPP CTA ────────────────── */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full text-white font-sans font-bold text-xs uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all bg-[#25D366] hover:bg-[#20ba5a]"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Chat with {astrologerName}</span>
      </a>

    </div>
  );
};

export default PublicWebsiteView;
