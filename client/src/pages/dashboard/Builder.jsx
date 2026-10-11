import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Palette, Layout, Save, Eye, Smartphone, Monitor,
  CheckCircle, ChevronDown, ChevronUp, Type, Image,
  Plus, Trash2, Link2, Instagram, Youtube, Facebook,
  Twitter, Globe, AlignLeft, Upload, X, Edit3,
  LayoutDashboard, Columns, Menu as MenuIcon
} from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import PublicWebsiteView from '../../components/website/PublicWebsiteView';

/* ─────────────────────────────────────────────
   Small UI helpers
───────────────────────────────────────────── */
const Label = ({ children }) => (
  <label className="text-xs font-bold text-[#555] block mb-1.5 uppercase tracking-wider">{children}</label>
);

const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full px-3 py-2.5 rounded-xl border border-[#E0D9CF] bg-[#FAF7F2] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 transition-all"
  />
);

const Textarea = ({ ...props }) => (
  <textarea
    {...props}
    rows={3}
    className="w-full px-3 py-2.5 rounded-xl border border-[#E0D9CF] bg-[#FAF7F2] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 transition-all resize-none"
  />
);

const SectionPanel = ({ title, icon: Icon, isOpen, onToggle, children }) => (
  <div className="border border-[#E8E2D9] rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-[#FAF7F2] transition-colors"
    >
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-[#A48255]" />
        <span className="text-sm font-bold text-[#1A1A1A]">{title}</span>
      </div>
      {isOpen ? <ChevronUp className="w-4 h-4 text-[#888]" /> : <ChevronDown className="w-4 h-4 text-[#888]" />}
    </button>
    {isOpen && (
      <div className="px-4 pb-4 pt-2 bg-[#FDFBF7] space-y-4 border-t border-[#E8E2D9]">
        {children}
      </div>
    )}
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#A48255]" />
  </label>
);

/* ─────────────────────────────────────────────
   MAIN BUILDER
───────────────────────────────────────────── */
const Builder = () => {
  const { website, saveWebsite } = useWebsite();

  /* ── Design tokens ── */
  const [design, setDesign] = useState(() => website?.design || {
    fontFamily: 'serif',
    primaryColor: '#A48255',
    backgroundColor: '#FAF7F2',
    textColor: '#1A1A1A',
    headingSize: '48',   // px
    bodySize: '16',      // px
  });

  /* ── Section visibility ── */
  const [visibility, setVisibility] = useState(() => website?.visibility || {
    header: true, hero: true, about: true,
    services: true, testimonials: true, faq: true, footer: true, consultation: true,
  });

  /* ── Logo ── */
  const [logo, setLogo] = useState(() => website?.logo || { type: 'text', text: 'Dr. Mehak Sharma', imageUrl: '' });
  const logoInputRef = useRef();

  /* ── Nav Menu Items ── */
  const [navItems, setNavItems] = useState(() => website?.navItems || ['About', 'Services', 'Consultation', 'Reviews', 'FAQ']);

  /* ── Hero Section ── */
  const [hero, setHero] = useState(() => website?.hero || {
    badge: '★ Certified Vedic Astrologer & Tarot Master',
    title: 'Unlock Cosmic Clarity & Shape Your Destiny',
    subtitle: 'Guidance for a brighter tomorrow through Vedic Astrology and Tarot.',
    buttonText: 'Book Consultation',
    bgType: 'color',      // 'color' | 'image'
    bgColor: '#FAF7F2',
    bgImageUrl: '',
    overlayOpacity: '40', // %
  });
  const heroBgInputRef = useRef();

  /* ── About Section ── */
  const [about, setAbout] = useState(() => website?.about || {
    title: 'About Dr. Mehak Sharma',
    subtitle: '12+ Years Experience • 5,000+ Consultations • Gold Medalist Astrologer',
    text: 'I am a certified astrologer with 12+ years of experience helping thousands find clarity.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
  });

  /* ── Services ── */
  const [serviceTitle, setServiceTitle] = useState(() => website?.serviceTitle || 'Specialized Consultations & Services');

  /* ── Social Links ── */
  const [social, setSocial] = useState(() => website?.social || {
    instagram: '', youtube: '', facebook: '', twitter: '', website: '', whatsapp: '+919876543210'
  });

  /* ── Footer ── */
  const [footerText, setFooterText] = useState(() => website?.footerText || '© 2026 Dr. Mehak Sharma. All rights reserved.');

  /* ── UI state ── */
  const [activeTab, setActiveTab] = useState('design'); // 'design' | 'sections' | 'content'
  const [previewMode, setPreviewMode] = useState('desktop');
  const [openPanel, setOpenPanel] = useState('hero');
  const [saved, setSaved] = useState(false);

  /* ── Helpers ── */
  const toggleSection = (key) => setVisibility(v => ({ ...v, [key]: !v[key] }));
  const handleDesign = (k, v) => setDesign(d => ({ ...d, [k]: v }));
  const togglePanel = (key) => setOpenPanel(p => p === key ? null : key);

  const addNavItem = () => setNavItems(n => [...n, 'New Page']);
  const updateNavItem = (i, val) => setNavItems(n => n.map((x, idx) => idx === i ? val : x));
  const removeNavItem = (i) => setNavItems(n => n.filter((_, idx) => idx !== i));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogo({ type: 'image', text: logo.text, imageUrl: url });
  };

  const handleHeroBgUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setHero(h => ({ ...h, bgType: 'image', bgImageUrl: url }));
  };

  const handleSave = () => {
    saveWebsite({
      design,
      visibility,
      logo,
      navItems,
      hero,
      about,
      serviceTitle,
      social,
      footerText
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const fontMap = {
    serif: "'Playfair Display', Georgia, serif",
    sans: "'Inter', system-ui, sans-serif",
    mono: "'Space Mono', monospace",
  };

  const heroStyle = hero.bgType === 'image' && hero.bgImageUrl
    ? { backgroundImage: `url(${hero.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: hero.bgColor };

  /* ── TAB CONTENT: Design ── */
  const DesignTab = () => (
    <div className="space-y-6">

      {/* Colors */}
      <div>
        <h4 className="text-xs font-bold text-[#888] uppercase tracking-widest mb-3 flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Colors</h4>
        <div className="space-y-4">
          <div>
            <Label>Primary / Button Color</Label>
            <div className="flex items-center gap-3 flex-wrap">
              {['#A48255', '#2C3B24', '#5E3F39', '#2C4B6E', '#7B3F6E', '#1A1A1A'].map(c => (
                <button key={c} onClick={() => handleDesign('primaryColor', c)}
                  className={`w-8 h-8 rounded-full border-[3px] transition-all hover:scale-110 ${design.primaryColor === c ? 'border-[#1A1A1A] scale-110 shadow-md' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} />
              ))}
              <input type="color" value={design.primaryColor}
                onChange={e => handleDesign('primaryColor', e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer border-2 border-[#E8E2D9]"
                title="Custom color" />
            </div>
          </div>
          <div>
            <Label>Background Theme</Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Warm', color: '#FAF7F2' },
                { label: 'White', color: '#FFFFFF' },
                { label: 'Cream', color: '#FDF6EA' },
                { label: 'Dark', color: '#1A1208' },
              ].map(({ label, color }) => (
                <button key={color} onClick={() => handleDesign('backgroundColor', color)}
                  className={`p-2 rounded-xl border-2 text-xs font-bold transition-all ${design.backgroundColor === color ? 'border-[#A48255]' : 'border-[#E8E2D9] hover:border-[#A48255]/50'}`}
                  style={{ backgroundColor: color, color: color === '#1A1208' ? '#fff' : '#333' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Text Color</Label>
            <div className="flex items-center gap-3">
              {['#1A1A1A', '#2C2C2C', '#4A4A4A', '#FFFFFF'].map(c => (
                <button key={c} onClick={() => handleDesign('textColor', c)}
                  className={`w-8 h-8 rounded-full border-[3px] transition-all hover:scale-110 ${design.textColor === c ? 'border-[#A48255] scale-110' : 'border-[#E8E2D9]'}`}
                  style={{ backgroundColor: c, boxShadow: c === '#FFFFFF' ? 'inset 0 0 0 1px #ccc' : 'none' }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div>
        <h4 className="text-xs font-bold text-[#888] uppercase tracking-widest mb-3 flex items-center gap-1.5"><Type className="w-3.5 h-3.5" /> Typography</h4>
        <div className="space-y-3">
          {[
            { key: 'serif', name: 'Playfair Display', desc: 'Elegant & Traditional' },
            { key: 'sans',  name: 'Inter',             desc: 'Modern & Clean' },
            { key: 'mono',  name: 'Space Mono',        desc: 'Techy & Unique' },
          ].map(f => (
            <button key={f.key} onClick={() => handleDesign('fontFamily', f.key)}
              className={`w-full p-3.5 rounded-xl border text-left flex justify-between items-center transition-all ${design.fontFamily === f.key ? 'border-[#A48255] bg-[#FAF7F2]' : 'border-[#E8E2D9] hover:border-[#A48255]/50'}`}>
              <div>
                <span className="block text-base text-[#1A1A1A] font-bold" style={{ fontFamily: fontMap[f.key] }}>{f.name}</span>
                <span className="block text-xs text-[#888]">{f.desc}</span>
              </div>
              {design.fontFamily === f.key && <CheckCircle className="w-4 h-4 text-[#A48255] shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Font Sizes */}
      <div>
        <h4 className="text-xs font-bold text-[#888] uppercase tracking-widest mb-3 flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5" /> Font Sizes</h4>
        <div className="space-y-3">
          <div>
            <Label>Heading Size — {design.headingSize}px</Label>
            <input type="range" min="32" max="80" value={design.headingSize}
              onChange={e => handleDesign('headingSize', e.target.value)}
              className="w-full accent-[#A48255]" />
            <div className="flex justify-between text-xs text-[#888] mt-1"><span>Small (32px)</span><span>Large (80px)</span></div>
          </div>
          <div>
            <Label>Body Text Size — {design.bodySize}px</Label>
            <input type="range" min="12" max="24" value={design.bodySize}
              onChange={e => handleDesign('bodySize', e.target.value)}
              className="w-full accent-[#A48255]" />
            <div className="flex justify-between text-xs text-[#888] mt-1"><span>Small (12px)</span><span>Large (24px)</span></div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── TAB CONTENT: Sections (visibility toggles) ── */
  const SectionsTab = () => (
    <div className="space-y-2">
      <p className="text-xs text-[#888] pb-2">Toggle to show/hide each section on your live website.</p>
      {Object.keys(visibility).map(key => (
        <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-[#E8E2D9] bg-white">
          <span className="text-sm font-bold text-[#1A1A1A] capitalize">{key === 'faq' ? 'FAQ' : key}</span>
          <Toggle checked={visibility[key]} onChange={() => toggleSection(key)} />
        </div>
      ))}
    </div>
  );

  /* ── TAB CONTENT: Content editing ── */
  const ContentTab = () => (
    <div className="space-y-3">

      {/* LOGO & HEADER */}
      <SectionPanel title="Logo & Header" icon={LayoutDashboard} isOpen={openPanel === 'header'} onToggle={() => togglePanel('header')}>
        <div>
          <Label>Logo Type</Label>
          <div className="flex gap-2 mb-3">
            {['text', 'image'].map(t => (
              <button key={t} onClick={() => setLogo(l => ({ ...l, type: t }))}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${logo.type === t ? 'bg-[#A48255] text-white border-[#A48255]' : 'border-[#E8E2D9] text-[#666] hover:border-[#A48255]'}`}>
                {t === 'text' ? '🔤 Text Logo' : '🖼 Image Logo'}
              </button>
            ))}
          </div>
          {logo.type === 'text' ? (
            <div><Label>Logo Text</Label><Input value={logo.text} onChange={e => setLogo(l => ({ ...l, text: e.target.value }))} placeholder="Your Brand Name" /></div>
          ) : (
            <div>
              <Label>Logo Image</Label>
              <div className="flex items-center gap-3">
                {logo.imageUrl && <img src={logo.imageUrl} alt="logo" className="h-10 object-contain rounded-lg border border-[#E8E2D9]" />}
                <button onClick={() => logoInputRef.current.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#A48255] text-[#A48255] text-xs font-bold hover:bg-[#FAF7F2] transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload Logo
                </button>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </div>
            </div>
          )}
        </div>

        <div>
          <Label>Navigation Menu Items</Label>
          <div className="space-y-2">
            {navItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input value={item} onChange={e => updateNavItem(i, e.target.value)} />
                <button onClick={() => removeNavItem(i)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-50 border border-[#E8E2D9] transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={addNavItem}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#A48255] text-[#A48255] text-xs font-bold hover:bg-[#FAF7F2] transition-colors flex items-center justify-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Menu Item
            </button>
          </div>
        </div>
      </SectionPanel>

      {/* HERO */}
      <SectionPanel title="Hero Section" icon={Columns} isOpen={openPanel === 'hero'} onToggle={() => togglePanel('hero')}>
        <div><Label>Badge Text</Label><Input value={hero.badge} onChange={e => setHero(h => ({ ...h, badge: e.target.value }))} placeholder="e.g. Cosmic Wisdom" /></div>
        <div><Label>Main Heading</Label><Textarea value={hero.title} onChange={e => setHero(h => ({ ...h, title: e.target.value }))} /></div>
        <div><Label>Subtitle / Description</Label><Textarea value={hero.subtitle} onChange={e => setHero(h => ({ ...h, subtitle: e.target.value }))} /></div>
        <div><Label>Button Text</Label><Input value={hero.buttonText} onChange={e => setHero(h => ({ ...h, buttonText: e.target.value }))} placeholder="Book Consultation" /></div>

        <div>
          <Label>Background</Label>
          <div className="flex gap-2 mb-3">
            {['color', 'image'].map(t => (
              <button key={t} onClick={() => setHero(h => ({ ...h, bgType: t }))}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${hero.bgType === t ? 'bg-[#A48255] text-white border-[#A48255]' : 'border-[#E8E2D9] text-[#666] hover:border-[#A48255]'}`}>
                {t === 'color' ? '🎨 Solid Color' : '🖼 Background Image'}
              </button>
            ))}
          </div>
          {hero.bgType === 'color' ? (
            <div className="flex items-center gap-3">
              <input type="color" value={hero.bgColor} onChange={e => setHero(h => ({ ...h, bgColor: e.target.value }))}
                className="w-10 h-10 rounded-xl cursor-pointer border-2 border-[#E8E2D9]" />
              <span className="text-xs text-[#888]">Pick hero background color</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {hero.bgImageUrl && <img src={hero.bgImageUrl} alt="bg" className="h-12 w-20 object-cover rounded-lg border border-[#E8E2D9]" />}
                <button onClick={() => heroBgInputRef.current.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#A48255] text-[#A48255] text-xs font-bold hover:bg-[#FAF7F2] transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload Image
                </button>
                <input ref={heroBgInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroBgUpload} />
              </div>
              <div>
                <Label>Dark Overlay — {hero.overlayOpacity}%</Label>
                <input type="range" min="0" max="90" value={hero.overlayOpacity}
                  onChange={e => setHero(h => ({ ...h, overlayOpacity: e.target.value }))}
                  className="w-full accent-[#A48255]" />
              </div>
            </div>
          )}
        </div>
      </SectionPanel>

      {/* ABOUT */}
      <SectionPanel title="About Section" icon={Edit3} isOpen={openPanel === 'about'} onToggle={() => togglePanel('about')}>
        <div><Label>Section Heading</Label><Input value={about.title} onChange={e => setAbout(a => ({ ...a, title: e.target.value }))} /></div>
        <div><Label>About Text</Label><Textarea value={about.text} onChange={e => setAbout(a => ({ ...a, text: e.target.value }))} /></div>
        <div>
          <Label>Your Photo URL</Label>
          <Input value={about.imageUrl} onChange={e => setAbout(a => ({ ...a, imageUrl: e.target.value }))} placeholder="https://..." />
        </div>
      </SectionPanel>

      {/* SERVICES */}
      <SectionPanel title="Services Section" icon={Layout} isOpen={openPanel === 'services'} onToggle={() => togglePanel('services')}>
        <div><Label>Section Heading</Label><Input value={serviceTitle} onChange={e => setServiceTitle(e.target.value)} /></div>
        <p className="text-xs text-[#888] bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D9]">
          💡 Manage your actual services from <strong>Business → Services</strong> in the sidebar. They'll automatically appear here.
        </p>
      </SectionPanel>

      {/* SOCIAL LINKS */}
      <SectionPanel title="Social Links" icon={Link2} isOpen={openPanel === 'social'} onToggle={() => togglePanel('social')}>
        {[
          { key: 'instagram', icon: Instagram, placeholder: 'https://instagram.com/yourprofile', label: 'Instagram' },
          { key: 'youtube',   icon: Youtube,   placeholder: 'https://youtube.com/@yourchannel',  label: 'YouTube' },
          { key: 'facebook',  icon: Facebook,  placeholder: 'https://facebook.com/yourpage',      label: 'Facebook' },
          { key: 'twitter',   icon: Twitter,   placeholder: 'https://twitter.com/yourhandle',     label: 'Twitter / X' },
          { key: 'website',   icon: Globe,     placeholder: 'https://yourwebsite.com',            label: 'Other Website' },
        ].map(({ key, icon: Icon, placeholder, label }) => (
          <div key={key}>
            <Label>{label}</Label>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E8E2D9] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#A48255]" />
              </div>
              <Input value={social[key]} onChange={e => setSocial(s => ({ ...s, [key]: e.target.value }))} placeholder={placeholder} />
            </div>
          </div>
        ))}
      </SectionPanel>

      {/* FOOTER */}
      <SectionPanel title="Footer" icon={AlignLeft} isOpen={openPanel === 'footer'} onToggle={() => togglePanel('footer')}>
        <div><Label>Footer Copyright Text</Label><Input value={footerText} onChange={e => setFooterText(e.target.value)} /></div>
      </SectionPanel>

    </div>
  );

  /* ── PREVIEW WEBSITE STATE ── */
  const currentWebsiteState = {
    ...website,
    design,
    visibility,
    logo,
    navItems,
    hero,
    about,
    serviceTitle,
    social,
    footerText
  };

  /* ─── RENDER ─── */
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">

      {/* ── LEFT PANEL ── */}
      <div className="w-full md:w-[360px] bg-white rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col overflow-hidden shrink-0">

        {/* Tabs */}
        <div className="flex border-b border-[#E8E2D9] shrink-0">
          {[
            { key: 'design',   icon: Palette,  label: 'Design'   },
            { key: 'sections', icon: Layout,   label: 'Sections' },
            { key: 'content',  icon: Edit3,    label: 'Content'  },
          ].map(({ key, icon: Icon, label }) => (
            <button key={key}
              className={`flex-1 py-3.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab === key ? 'text-[#A48255] border-b-2 border-[#A48255] bg-[#FAF7F2]' : 'text-[#666] hover:bg-gray-50'}`}
              onClick={() => setActiveTab(key)}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'design'   && <DesignTab />}
          {activeTab === 'sections' && <SectionsTab />}
          {activeTab === 'content'  && <ContentTab />}
        </div>

        {/* Footer Save Button */}
        <div className="p-4 border-t border-[#E8E2D9] bg-[#FAF7F2] shrink-0">
          <button onClick={handleSave}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm text-sm ${saved ? 'bg-green-500 text-white' : 'bg-[#1A1A1A] hover:bg-black text-white'}`}>
            {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Configuration</>}
          </button>
        </div>
      </div>

      {/* ── RIGHT: LIVE PREVIEW ── */}
      <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl border border-gray-300 overflow-hidden shadow-inner relative">

        {/* Browser Bar */}
        <div className="h-12 bg-white border-b border-gray-300 flex items-center justify-between px-4 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4 text-center text-xs text-gray-500 bg-gray-100 py-1.5 rounded-md flex justify-center items-center gap-1.5 font-medium">
            <Eye className="w-3.5 h-3.5 text-[#A48255]" />
            <span>Live Preview — {website?.customDomain || 'dr-mehak.com'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 text-gray-400">
              <button onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'text-[#A48255] bg-[#FAF7F2]' : 'hover:text-[#1A1A1A]'}`}
                title="Mobile View">
                <Smartphone className="w-4 h-4" />
              </button>
              <button onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'text-[#A48255] bg-[#FAF7F2]' : 'hover:text-[#1A1A1A]'}`}
                title="Desktop View">
                <Monitor className="w-4 h-4" />
              </button>
            </div>
            <Link
              to="/dashboard/preview"
              className="text-xs font-bold text-[#A48255] hover:text-[#8E6E44] flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E8E2D9] hover:bg-[#FAF7F2] transition-all ml-1"
              title="Open full interactive preview"
            >
              <span>Full Preview</span>
              <Eye className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Website Preview */}
        <div className="flex-1 overflow-y-auto flex justify-center bg-gray-100 p-4">
          <div
            className={`shadow-2xl overflow-hidden transition-all duration-300 ${previewMode === 'mobile' ? 'w-[390px] rounded-[2rem]' : 'w-full rounded-xl'} h-max`}
          >
            <PublicWebsiteView website={currentWebsiteState} isPreview={true} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Builder;
