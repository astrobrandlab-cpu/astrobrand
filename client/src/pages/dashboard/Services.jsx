import React, { useState, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, IndianRupee, Clock, ToggleLeft, ToggleRight, 
  Search, X, Check, CheckCircle2, Sparkles, Eye, AlertCircle, Tag, 
  HelpCircle, ExternalLink, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWebsite } from '../../context/WebsiteContext';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_SERVICES = [
  { 
    id: 1, 
    name: 'Marriage Astrology Consultation', 
    price: '999', 
    duration: '30 Mins', 
    category: 'Matchmaking', 
    active: true,
    desc: 'Kundali Milan, Manglik Dosha evaluation, and marriage compatibility remedies.',
    badge: 'Popular',
    features: ['36 Guna Ashtakoot check', 'Manglik dosha remedies', 'Compatibility report']
  },
  { 
    id: 2, 
    name: 'Detailed Birth Chart Reading', 
    price: '1499', 
    duration: '45 Mins', 
    category: 'General', 
    active: true,
    desc: 'In-depth analysis of Lagna, planetary mahadashas, career, and life milestones.',
    badge: 'Most Popular',
    features: ['Birth chart breakdown', 'Mahadasha predictions', 'Personalized gemstone & mantra']
  },
  { 
    id: 3, 
    name: 'Career & Wealth Guidance', 
    price: '1299', 
    duration: '30 Mins', 
    category: 'Career', 
    active: false,
    desc: 'Clarity on job switch, promotion timing, business ventures, and wealth yogas.',
    badge: '',
    features: ['Job vs business analysis', 'Auspicious timing', 'Wealth remedies']
  },
];

const CATEGORIES = [
  'Matchmaking',
  'General',
  'Career',
  'Natal Astrology',
  'Tarot & Intuition',
  'Vastu & Remedies',
  'Health & Healing',
  'Gemstones & Rudraksha'
];

const DURATIONS = [
  '20 Mins',
  '30 Mins',
  '45 Mins',
  '60 Mins',
  '90 Mins'
];

const Services = () => {
  const { website, saveWebsite } = useWebsite();
  const { user } = useAuth();

  // Initialize services from website context or defaults
  const servicesList = useMemo(() => {
    if (website?.services && Array.isArray(website.services) && website.services.length > 0) {
      return website.services.map(s => ({
        ...s,
        price: String(s.price || '').replace(/[^0-9]/g, '') || '999',
        active: s.active !== false
      }));
    }
    return DEFAULT_SERVICES;
  }, [website?.services]);

  const [services, setServices] = useState(servicesList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null); // null when adding new
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Matchmaking',
    price: '999',
    duration: '30 Mins',
    desc: '',
    badge: '',
    active: true,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Sync back to website context
  const persistServices = (updated) => {
    setServices(updated);
    if (saveWebsite) {
      // Store formatted with rupee symbol for public view
      const formattedForWebsite = updated.map(s => ({
        ...s,
        price: `₹${s.price}`
      }));
      saveWebsite({ services: formattedForWebsite });
    }
  };

  // Open modal for adding
  const handleOpenAddModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      category: 'Matchmaking',
      price: '999',
      duration: '30 Mins',
      desc: '',
      badge: '',
      active: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      category: service.category || 'Matchmaking',
      price: service.price || '999',
      duration: service.duration || '30 Mins',
      desc: service.desc || '',
      badge: service.badge || '',
      active: service.active !== false,
    });
    setIsModalOpen(true);
  };

  // Toggle active/disabled
  const handleToggleActive = (id) => {
    const updated = services.map(s => {
      if (s.id === id) {
        const nextState = !s.active;
        showToast(nextState ? `"${s.name}" is now Active on website.` : `"${s.name}" is now Disabled.`);
        return { ...s, active: nextState };
      }
      return s;
    });
    persistServices(updated);
  };

  // Save (Add or Edit)
  const handleSaveService = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const cleanPrice = String(formData.price).replace(/[^0-9]/g, '') || '999';

    if (editingService) {
      // Update existing
      const updated = services.map(s => {
        if (s.id === editingService.id) {
          return {
            ...s,
            name: formData.name.trim(),
            category: formData.category,
            price: cleanPrice,
            duration: formData.duration,
            desc: formData.desc.trim(),
            badge: formData.badge.trim(),
            active: formData.active,
          };
        }
        return s;
      });
      persistServices(updated);
      showToast(`Service "${formData.name.trim()}" updated successfully!`);
    } else {
      // Create new
      const newService = {
        id: Date.now(),
        name: formData.name.trim(),
        category: formData.category,
        price: cleanPrice,
        duration: formData.duration,
        desc: formData.desc.trim() || 'Personalized astrology guidance and remedial solutions.',
        badge: formData.badge.trim(),
        active: formData.active,
        features: ['Personalized consultation', 'Q&A session included', 'Audio recording / summary']
      };
      const updated = [...services, newService];
      persistServices(updated);
      showToast(`New service "${formData.name.trim()}" added successfully!`);
    }

    setIsModalOpen(false);
  };

  // Delete service
  const handleDeleteService = (id) => {
    const target = services.find(s => s.id === id);
    const updated = services.filter(s => s.id !== id);
    persistServices(updated);
    setDeleteConfirmId(null);
    showToast(`Service "${target?.name || ''}" deleted.`);
  };

  // Filtered list
  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeCount = services.filter(s => s.active).length;
  const avgPrice = services.length > 0 
    ? Math.round(services.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0) / services.length)
    : 0;

  return (
    <div className="animate-in fade-in duration-300 pb-12 space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#A48255]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#967C5A]">Service Catalog</span>
          </div>
          <h2 className="text-3xl font-serif font-medium text-[#1A1A1A]">My Services</h2>
          <p className="text-sm text-[#666] font-medium">
            Manage the astrology services you offer to clients. Changes automatically update your live landing page.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/dashboard/preview"
            className="hidden sm:flex items-center gap-2 px-4 py-3 bg-[#FAF7F2] hover:bg-[#F2EFEA] border border-[#E8E2D9] text-[#1A1A1A] rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Eye className="w-4 h-4 text-[#A48255]" />
            <span>Preview on Live Site</span>
          </Link>

          <button 
            type="button"
            onClick={handleOpenAddModal}
            className="px-6 py-3 bg-[#A48255] text-white rounded-xl text-sm font-bold hover:bg-[#8e6e44] transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add New Service
          </button>
        </div>
      </div>

      {/* ── Toast Notification ── */}
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

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#967C5A] uppercase tracking-wider">Total Services</p>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mt-1">{services.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
            ✦
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#967C5A] uppercase tracking-wider">Active on Website</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{activeCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
            ✓
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#967C5A] uppercase tracking-wider">Average Price</p>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mt-1">₹{avgPrice}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
            ₹
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search services or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] focus:outline-none focus:border-[#A48255] font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-[#967C5A] uppercase tracking-wider shrink-0 mr-1">Filter:</span>
          {['All', 'Matchmaking', 'General', 'Career'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#A48255] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#666] hover:bg-[#F2EFEA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Services Table ── */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8E2D9]">
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider">Service Details</th>
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider">Pricing</th>
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-[#FDFBF7] transition-colors group">
                  
                  {/* Service Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-[#1A1A1A] text-[15px]">{service.name}</span>
                      {service.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#666] mt-0.5 flex items-center gap-2">
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[11px]">
                        {service.category}
                      </span>
                      {service.desc && (
                        <span className="truncate max-w-xs text-gray-400 text-[11px] hidden md:inline">
                          • {service.desc}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Pricing */}
                  <td className="px-6 py-4">
                    <div className="flex items-center text-[#1A1A1A] font-bold text-base">
                      <IndianRupee className="w-4 h-4 mr-0.5 text-[#A48255]" />
                      <span>{service.price}</span>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="px-6 py-4">
                    <div className="flex items-center text-[#666] text-sm font-medium">
                      <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                      <span>{service.duration}</span>
                    </div>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-6 py-4">
                    <button 
                      type="button"
                      onClick={() => handleToggleActive(service.id)}
                      className="flex items-center gap-2 text-sm font-bold cursor-pointer group/btn"
                      title={service.active ? 'Click to disable' : 'Click to activate'}
                    >
                      {service.active ? (
                        <>
                          <ToggleRight className="w-6 h-6 text-[#4CAF50] transition-transform group-hover/btn:scale-110" /> 
                          <span className="text-[#4CAF50]">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-6 h-6 text-gray-400 transition-transform group-hover/btn:scale-110" /> 
                          <span className="text-gray-500">Disabled</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-1.5">
                      <button 
                        type="button"
                        onClick={() => handleOpenEditModal(service)}
                        className="p-2 text-[#666] hover:text-[#A48255] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setDeleteConfirmId(service.id)}
                        className="p-2 text-[#666] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredServices.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#FAF7F2] rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-[#A48255]" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">
              {searchQuery ? 'No matching services found' : 'No Services Yet'}
            </h3>
            <p className="text-sm text-[#666] mb-4">
              {searchQuery 
                ? 'Try a different search keyword or clear the category filter.' 
                : 'Add your first astrology service to display on your landing page.'}
            </p>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all"
              >
                Clear Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 bg-[#A48255] text-white rounded-xl text-xs font-bold hover:bg-[#8e6e44] transition-all shadow-sm"
              >
                + Add Service Now
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF7F2]">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1A]">
                  {editingService ? 'Edit Astrology Service' : 'Add New Astrology Service'}
                </h3>
                <p className="text-xs text-[#666] mt-0.5">
                  {editingService ? 'Update details for your client offerings' : 'Create a new consultation offering for your visitors'}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Service Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-1.5">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kundali Milan & Compatibility Consultation"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] text-sm font-semibold focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 text-[#1A1A1A]"
                />
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] text-sm font-medium focus:outline-none focus:border-[#A48255] text-[#1A1A1A]"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-1.5">
                    Consultation Fee (₹) *
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      placeholder="999"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] text-sm font-bold focus:outline-none focus:border-[#A48255] text-[#1A1A1A]"
                    />
                  </div>
                </div>
              </div>

              {/* Duration & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-1.5">
                    Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] text-sm font-medium focus:outline-none focus:border-[#A48255] text-[#1A1A1A]"
                  >
                    {DURATIONS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-1.5">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Popular, Recommended"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] text-sm font-medium focus:outline-none focus:border-[#A48255] text-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#967C5A] mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Provide a quick summary of what this reading entails..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] text-sm font-medium focus:outline-none focus:border-[#A48255] text-[#1A1A1A]"
                />
              </div>

              {/* Status Toggle */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D9] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A1A]">Display on Live Website</h4>
                  <p className="text-xs text-[#666]">Enable to make this service bookable by clients</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className="cursor-pointer"
                >
                  {formData.active ? (
                    <ToggleRight className="w-7 h-7 text-[#4CAF50]" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8E2D9] text-xs font-bold text-[#666] hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#A48255] hover:bg-[#8e6e44] text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A1A1A]">Delete Service?</h3>
              <p className="text-xs text-[#666] mt-1 leading-relaxed">
                Are you sure you want to delete this service? It will no longer appear on your live astrology landing page.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 rounded-xl border border-[#E8E2D9] text-xs font-bold text-[#666] hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteService(deleteConfirmId)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Services;
