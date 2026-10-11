import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'astrobrand_website_config';

export const initialWebsiteData = {
  slug: 'dr-mehak',
  template: 'premium-astrology',
  status: 'published',
  publishedAt: '2026-09-15T00:00:00.000Z',
  customDomain: 'dr-mehak.com',
  subdomain: 'dr-mehak.astrobrand.in',
  design: {
    fontFamily: 'serif',
    primaryColor: '#A48255',
    backgroundColor: '#FAF7F2',
    textColor: '#1A1A1A',
    headingSize: '48',
    bodySize: '16',
  },
  visibility: {
    header: true,
    hero: true,
    about: true,
    services: true,
    testimonials: true,
    faq: true,
    consultation: true,
    footer: true,
  },
  logo: {
    type: 'text',
    text: 'Dr. Mehak Sharma',
    imageUrl: '',
  },
  navItems: ['About', 'Services', 'Consultation', 'Reviews', 'FAQ'],
  hero: {
    badge: '★ Certified Vedic Astrologer & Tarot Master',
    title: 'Unlock Cosmic Clarity & Shape Your Destiny',
    subtitle: 'Personalized Vedic astrology readings, Kundali Milan, and intuitive guidance to navigate life transitions with confidence and peace.',
    buttonText: 'Book Consultation',
    bgType: 'color',
    bgColor: '#FAF7F2',
    bgImageUrl: '',
    overlayOpacity: '40',
  },
  about: {
    title: 'About Dr. Mehak Sharma',
    subtitle: '12+ Years Experience • 5,000+ Consultations • Gold Medalist Astrologer',
    text: 'Namaste! I am Dr. Mehak Sharma, a dedicated Vedic Astrologer, Numerologist, and Spiritual Counselor based in India. Over the last 12 years, I have helped thousands of individuals discover their true life path, overcome career obstacles, resolve relationship disharmony, and find inner peace through authentic planetary analysis and practical Vedic remedies.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    stats: [
      { label: 'Years Experience', value: '12+' },
      { label: 'Happy Clients', value: '5,000+' },
      { label: 'Countries Served', value: '18+' },
      { label: 'Client Rating', value: '4.9 ★' },
    ]
  },
  serviceTitle: 'Specialized Consultations & Services',
  services: [
    {
      id: 1,
      name: 'Kundali & Birth Chart Reading',
      price: '₹1,499',
      duration: '45 mins',
      category: 'Natal Astrology',
      desc: 'In-depth analysis of your birth chart (Lagna, Rashi, Navamsha), planetary mahadashas, and life milestones.',
      badge: 'Most Popular',
      features: ['Birth chart breakdown', 'Career & marriage timing', 'Personalized gemstone & mantra remedies', 'Recording provided']
    },
    {
      id: 2,
      name: 'Marriage Matchmaking (Kundali Milan)',
      price: '₹1,999',
      duration: '60 mins',
      category: 'Relationships',
      desc: 'Authentic 36-guna Milan, Manglik Dosha evaluation, compatibility insights, and Vedic remedies for harmony.',
      badge: 'Recommended',
      features: ['36 Guna Ashtakoot check', 'Manglik dosha remedies', 'Longevity & health compatibility', 'Family harmony guidance']
    },
    {
      id: 3,
      name: 'Career & Financial Horoscope',
      price: '₹1,299',
      duration: '30 mins',
      category: 'Career & Wealth',
      desc: 'Clarity on job switch, promotion timing, business ventures, foreign settlement chances, and wealth yogas.',
      features: ['Job vs business analysis', 'Auspicious timing for new ventures', 'Wealth block remedies', 'Dasha timing roadmap']
    },
    {
      id: 4,
      name: 'Intuitive Tarot Card Session',
      price: '₹999',
      duration: '30 mins',
      category: 'Tarot & Intuition',
      desc: 'Instant clarity for specific dilemmas, relationship crossroads, or immediate decision-making.',
      features: ['Up to 4 specific questions', 'Immediate practical clarity', 'Angel guide message', 'Mindset coaching']
    }
  ],
  testimonialsTitle: 'What Happy Clients Say',
  testimonials: [
    {
      name: 'Riya Sengupta',
      location: 'Mumbai',
      service: 'Career Consultation',
      rating: 5,
      text: 'Dr. Mehak was spot on with her predictions about my job switch timeline. Her recommended remedies brought me so much clarity and confidence!',
      date: 'October 2026'
    },
    {
      name: 'Rohan & Ananya',
      location: 'New Delhi',
      service: 'Kundali Milan',
      rating: 5,
      text: 'Our families were very anxious about Manglik Dosha, but Dr. Mehak explained everything logically with Vedic backing and suggested simple puja remedies. We are happily married now!',
      date: 'September 2026'
    },
    {
      name: 'Vikramaditya Roy',
      location: 'Bangalore',
      service: 'Birth Chart Reading',
      rating: 5,
      text: 'The best astrologer I have ever consulted. She does not instill fear; instead she gives uplifting remedies and genuine psychological peace.',
      date: 'September 2026'
    }
  ],
  faqTitle: 'Frequently Asked Questions',
  faq: [
    {
      question: 'How do online consultations take place?',
      answer: 'Consultations are conducted 1-on-1 via private Google Meet or WhatsApp Video Call at your booked time. You will receive the meeting link immediately upon booking.'
    },
    {
      question: 'Do I need my exact birth time?',
      answer: 'For Vedic Astrology (Kundali), exact birth time, date, and place are essential. If you do not have exact birth time, Tarot card readings or Prashna Kundali (Horary Astrology) can be booked.'
    },
    {
      question: 'Will I be recommended expensive gemstones or remedies?',
      answer: 'No. Dr. Mehak strictly emphasizes simple, authentic Vedic remedies like specific mantras, mindful charity (daan), meditation, and routine adjustments. Gemstones are only suggested when genuinely beneficial.'
    },
    {
      question: 'Is my personal information and consultation confidential?',
      answer: 'Yes, 100%. All personal details, birth charts, questions, and session discussions are kept strictly confidential.'
    }
  ],
  social: {
    instagram: 'https://instagram.com/dr_mehak_astrology',
    youtube: 'https://youtube.com/@astromehak',
    facebook: 'https://facebook.com/astromehak',
    twitter: '',
    whatsapp: '+919876543210',
    website: 'https://dr-mehak.com'
  },
  footerText: '© 2026 Dr. Mehak Sharma. All Rights Reserved. Empowering lives through Vedic wisdom & astrology.'
};

const WebsiteContext = createContext();

export const WebsiteProvider = ({ children }) => {
  const { user } = useAuth();

  const [website, setWebsite] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialWebsiteData, ...parsed, design: { ...initialWebsiteData.design, ...parsed.design }, visibility: { ...initialWebsiteData.visibility, ...parsed.visibility } };
      }
    } catch (e) {
      console.warn('Failed to load website from localStorage', e);
    }
    return initialWebsiteData;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);

  // Automatically personalize website when logged in user changes
  useEffect(() => {
    if (user?.name) {
      const userSlug = user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setWebsite(prev => {
        // If already customized for this user, keep as is
        if (prev.slug === userSlug && prev.logo?.text === user.name) {
          return prev;
        }

        const updated = {
          ...prev,
          slug: userSlug || 'my-astrology',
          customDomain: `${userSlug || 'my-astrology'}.com`,
          subdomain: `${userSlug || 'my-astrology'}.astrobrand.in`,
          logo: {
            ...prev.logo,
            type: 'text',
            text: user.name
          },
          about: {
            ...prev.about,
            title: `About ${user.name}`,
            text: `Namaste! I am ${user.name}, a dedicated Vedic Astrologer and spiritual counselor helping clients find clarity, peace, and direction in life.`
          },
          footerText: `© 2026 ${user.name}. All Rights Reserved. Empowering lives through Vedic wisdom & astrology.`
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}

        return updated;
      });
    }
  }, [user?.name]);

  // Sync with localStorage whenever updated
  const saveWebsite = (newData) => {
    setIsSaving(true);
    const updated = { ...website, ...newData };
    setWebsite(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setLastSavedTime(new Date());
    } catch (e) {
      console.error('Failed to save website data', e);
    }
    setTimeout(() => {
      setIsSaving(false);
    }, 600);
    return true;
  };

  const updateWebsite = (updater) => {
    setWebsite((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to auto-save website', e);
      }
      return next;
    });
  };

  const resetToDefault = () => {
    setWebsite(initialWebsiteData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialWebsiteData));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <WebsiteContext.Provider value={{ website, setWebsite, updateWebsite, saveWebsite, resetToDefault, isSaving, lastSavedTime }}>
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => {
  const ctx = useContext(WebsiteContext);
  if (!ctx) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return ctx;
};
