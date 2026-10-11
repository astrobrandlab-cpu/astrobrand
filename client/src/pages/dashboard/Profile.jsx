import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Save, Upload, Trash2, CheckCircle2, User, 
  Sparkles, ExternalLink, Globe, Phone, Mail, MapPin, 
  Award, Languages, FileText
} from 'lucide-react';
import { useAuth, API_URL } from '../../context/AuthContext';
import { useWebsite } from '../../context/WebsiteContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser, token } = useAuth();
  const { website, saveWebsite } = useWebsite();

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [avatar, setAvatar] = useState(() => user?.avatar || '');
  const [coverImage, setCoverImage] = useState(() => user?.coverImage || '');
  const [toastMessage, setToastMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || 'vikas',
    professionalName: user?.profile?.professionalName || (user?.name ? `Astro ${user.name}` : 'Astro vikas'),
    email: user?.email || 'vikas@test.com',
    phone: user?.phone || '+91 98765 43210',
    whatsapp: user?.whatsapp || user?.phone || '+91 98765 43210',
    experience: user?.profile?.experience || '8',
    specialization: user?.profile?.specialization || 'Vedic Astrology & Kundali',
    bio: user?.profile?.bio || 'Guiding lives through authentic Vedic astrology and practical planetary remedies.',
    about: user?.profile?.about || `Namaste! I am ${user?.name || 'vikas'}, a practicing Vedic Astrologer helping clients find clarity, peace, and direction in life.`,
    location: user?.profile?.location || 'India',
    languages: user?.profile?.languages?.join(', ') || 'English, Hindi'
  });

  // Keep state synced with auth user
  useEffect(() => {
    if (user?.avatar) {
      setAvatar(user.avatar);
    }
  }, [user?.avatar]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Avatar file selection
  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB.');
      return;
    }

    setIsUploading(true);

    // 1. Read as Data URL for instant preview & offline persistence
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target.result;
      setAvatar(dataUrl);

      // Save to AuthContext & localStorage
      updateUser({ avatar: dataUrl });

      // Sync with live website about section photo
      if (saveWebsite && website) {
        saveWebsite({
          about: {
            ...(website.about || {}),
            imageUrl: dataUrl
          }
        });
      }

      setIsUploading(false);
      showToast('Profile photo updated successfully!');
    };
    reader.readAsDataURL(file);

    // 2. Also try backend upload if authenticated
    if (token && !token.startsWith('demo_')) {
      try {
        const uploadData = new FormData();
        uploadData.append('avatar', file);

        fetch(`${API_URL}/users/avatar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadData
        }).then(res => res.json()).then(data => {
          if (data.success && data.avatar) {
            updateUser({ avatar: data.avatar });
          }
        }).catch(err => {
          console.warn('Backend avatar upload notice:', err);
        });
      } catch (err) {
        console.warn('Avatar upload network issue:', err);
      }
    }
  };

  // Handle Cover file selection
  const handleCoverFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target.result;
      setCoverImage(dataUrl);
      updateUser({ coverImage: dataUrl });
      showToast('Profile banner updated!');
    };
    reader.readAsDataURL(file);
  };

  // Remove photo (revert to clean initials)
  const handleRemovePhoto = () => {
    setAvatar('');
    updateUser({ avatar: '' });
    if (saveWebsite && website) {
      saveWebsite({
        about: {
          ...(website.about || {}),
          imageUrl: ''
        }
      });
    }
    showToast('Profile photo removed. Using initials.');
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();

    // 1. Update Auth user
    updateUser({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      avatar: avatar,
      coverImage: coverImage,
      profile: {
        professionalName: formData.professionalName,
        experience: formData.experience,
        specialization: formData.specialization,
        bio: formData.bio,
        about: formData.about,
        location: formData.location,
        languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean)
      }
    });

    // 2. Sync with live website context
    if (saveWebsite && website) {
      saveWebsite({
        logo: {
          ...(website.logo || {}),
          text: formData.professionalName || formData.fullName
        },
        about: {
          ...(website.about || {}),
          title: `About ${formData.professionalName || formData.fullName}`,
          text: formData.about,
          imageUrl: avatar || website?.about?.imageUrl || ''
        }
      });
    }

    showToast('All profile changes saved and synced with your live website!');
  };

  const userInitial = (formData.fullName || user?.name || 'A')[0].toUpperCase();

  return (
    <div className="animate-in fade-in duration-300 pb-16 space-y-6">
      
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-[#A48255]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#967C5A]">Account Settings</span>
          </div>
          <h2 className="text-3xl font-serif font-medium text-[#1A1A1A]">My Profile</h2>
          <p className="text-sm text-[#666] font-medium">
            Update your personal and professional information. Photo and bio sync with your live landing page.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/dashboard/preview"
            className="hidden sm:flex items-center gap-2 px-4 py-3 bg-[#FAF7F2] hover:bg-[#F2EFEA] border border-[#E8E2D9] text-[#1A1A1A] rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Globe className="w-4 h-4 text-[#A48255]" />
            <span>Preview Live Site</span>
          </Link>

          <button 
            type="button"
            onClick={handleSave}
            className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-white rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      {/* ── Toast Alert ── */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-emerald-800 text-sm font-medium animate-in fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage('')} 
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Hidden File Inputs ── */}
      <input 
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarFile}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />
      <input 
        type="file"
        ref={coverInputRef}
        onChange={handleCoverFile}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />

      {/* ── Profile Card ── */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm overflow-hidden">
        
        {/* Cover Banner */}
        <div 
          className="h-48 md:h-56 relative transition-all bg-[#2C2417]"
          style={coverImage ? {
            backgroundImage: `url(${coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {
            backgroundImage: 'linear-gradient(135deg, #2C2417 0%, #4A3A26 50%, #1A1208 100%)'
          }}
        >
          {/* Subtle astrological stars / overlay pattern */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
          
          <button 
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-4 right-4 px-3 py-2 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-xl text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/20 shadow-sm cursor-pointer"
            title="Change banner cover"
          >
            <Camera className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">Change Cover</span>
          </button>
        </div>

        {/* Profile Avatar & Quick Controls */}
        <div className="px-6 md:px-10 pb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 pt-2">
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              {/* Circular Avatar Container */}
              <div className="relative group -mt-16 md:-mt-20 shrink-0">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt={formData.fullName} 
                    className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white shadow-xl object-cover bg-white ring-2 ring-[#E8E2D9]"
                  />
                ) : (
                  <div 
                    onClick={() => avatarInputRef.current?.click()}
                    className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-[#A48255] via-[#8E6E44] to-[#5C4528] text-white flex flex-col items-center justify-center select-none cursor-pointer hover:opacity-95 transition-all ring-2 ring-[#E8E2D9]"
                    title="Click to upload profile photo"
                  >
                    <span className="text-4xl md:text-5xl font-serif font-bold leading-none">{userInitial}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 mt-1 flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Upload
                    </span>
                  </div>
                )}

                {/* Floating Camera Upload Button */}
                <button 
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2.5 bg-[#A48255] hover:bg-[#8e6e44] text-white rounded-full shadow-lg border-2 border-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title="Upload New Profile Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Identity & Upload Controls */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">{formData.fullName || 'vikas'}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {user?.plan || 'Professional'}
                  </span>
                </div>
                <p className="text-xs text-[#777] font-medium mb-3">
                  {formData.professionalName} • {formData.specialization}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#F2EFEA] border border-[#E8E2D9] rounded-lg text-xs font-bold text-[#1A1A1A] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#A48255]" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                  </button>

                  {avatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold text-red-600 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}

                  <span className="text-[11px] text-[#888] ml-1">
                    (JPG, PNG or WEBP up to 5MB)
                  </span>
                </div>
              </div>
            </div>

            {/* Sync Badge */}
            <div className="bg-[#FAF7F2] border border-[#E8E2D9] rounded-2xl p-3.5 sm:max-w-xs text-xs text-[#555] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#A48255] shrink-0 mt-0.5" />
              <span>
                Your photo and bio automatically sync with your public astrology landing page.
              </span>
            </div>

          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* Section 1: Personal Information */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E8E2D9]">
                <User className="w-4 h-4 text-[#A48255]" />
                <h3 className="text-lg font-bold text-[#1A1A1A]">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-2">
                    Full Legal Name *
                  </label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 bg-[#FAF7F2] font-semibold text-[#1A1A1A]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-2">
                    Professional Brand Name (Shown on Website) *
                  </label>
                  <input 
                    type="text" 
                    name="professionalName" 
                    value={formData.professionalName} 
                    onChange={handleChange} 
                    required
                    placeholder="e.g. Astro Vikas, Acharya Vikas"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 bg-[#FAF7F2] font-semibold text-[#1A1A1A]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 bg-[#FAF7F2] font-medium text-[#1A1A1A]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-2">
                    Location / City
                  </label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="e.g. New Delhi, India"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 bg-[#FAF7F2] font-medium text-[#1A1A1A]" 
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Professional Details */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E8E2D9]">
                <Award className="w-4 h-4 text-[#A48255]" />
                <h3 className="text-lg font-bold text-[#1A1A1A]">Astrology Specialization & Experience</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-2">
                    Primary Specialization
                  </label>
                  <input 
                    type="text" 
                    name="specialization" 
                    value={formData.specialization} 
                    onChange={handleChange} 
                    placeholder="e.g. Vedic Astrology, Kundali Milan, Tarot" 
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 bg-[#FAF7F2] font-medium text-[#1A1A1A]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-2">
                    Years of Experience
                  </label>
                  <input 
                    type="number" 
                    name="experience" 
                    value={formData.experience} 
                    onChange={handleChange} 
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 bg-[#FAF7F2] font-medium text-[#1A1A1A]" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-2">
                    Languages Spoken
                  </label>
                  <input 
                    type="text" 
                    name="languages" 
                    value={formData.languages} 
                    onChange={handleChange} 
                    placeholder="e.g. English, Hindi, Punjabi" 
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 bg-[#FAF7F2] font-medium text-[#1A1A1A]" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-2">
                    Short Bio (Hero Section Headline)
                  </label>
                  <input 
                    type="text" 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleChange} 
                    placeholder="A concise, powerful tagline that builds trust with clients" 
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 bg-[#FAF7F2] font-medium text-[#1A1A1A]" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-2">
                    Detailed About (Appears on Live Website About Section)
                  </label>
                  <textarea 
                    name="about" 
                    value={formData.about} 
                    onChange={handleChange} 
                    rows="4" 
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 bg-[#FAF7F2] font-medium text-[#1A1A1A] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Contact & Booking Numbers */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E8E2D9]">
                <Phone className="w-4 h-4 text-[#A48255]" />
                <h3 className="text-lg font-bold text-[#1A1A1A]">Contact & Consultation Numbers</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-2">
                    Calling Phone Number
                  </label>
                  <input 
                    type="text" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 bg-[#FAF7F2] font-medium text-[#1A1A1A]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-2">
                    WhatsApp Number (Receives Client Bookings)
                  </label>
                  <input 
                    type="text" 
                    name="whatsapp" 
                    value={formData.whatsapp} 
                    onChange={handleChange} 
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 bg-[#FAF7F2] font-medium text-[#1A1A1A]" 
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                className="px-8 py-3.5 bg-[#1A1A1A] hover:bg-black text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" /> Save Profile & Sync Website
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
};

export default Profile;
