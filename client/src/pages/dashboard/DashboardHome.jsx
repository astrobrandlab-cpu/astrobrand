import React, { useState } from 'react';
import {
  Globe,
  Users,
  TrendingUp,
  Calendar,
  ArrowRight,
  Star,
  ExternalLink,
  CheckCircle,
  Clock,
  Zap,
  Eye,
  MessageSquare,
  Bell,
  ChevronRight,
  Sparkles,
  BarChart2,
  AlertCircle,
  Shield,
  PlayCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWebsite } from '../../context/WebsiteContext';

/* ─── Reusable: Stat Card ─── */
const StatCard = ({ title, value, subtitle, icon: Icon, colorBg, colorText, trend }) => (
  <div className="group bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default">
    <div className="flex justify-between items-start mb-5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorBg}`}>
        <Icon className={`w-6 h-6 ${colorText}`} />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h3 className="text-3xl font-bold text-[#1A1A1A] tracking-tight leading-none mb-1">{value}</h3>
    <p className="text-xs font-semibold text-[#967C5A] uppercase tracking-wider mt-1">{title}</p>
    <p className="text-sm text-[#888] mt-1">{subtitle}</p>
  </div>
);

/* ─── Reusable: Quick Action Card ─── */
const QuickAction = ({ icon: Icon, label, desc, to, color }) => (
  <Link
    to={to}
    className="flex items-center gap-4 p-4 rounded-xl border border-[#E8E2D9] bg-white hover:border-[#A48255] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#A48255] transition-colors">{label}</p>
      <p className="text-xs text-[#888] truncate">{desc}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-[#C4B89A] ml-auto shrink-0 group-hover:text-[#A48255] transition-colors" />
  </Link>
);

/* ─── Status Badge ─── */
const StatusBadge = ({ status }) => {
  const map = {
    New:       'bg-blue-50 text-blue-600 border border-blue-100',
    Contacted: 'bg-amber-50 text-amber-600 border border-amber-100',
    Converted: 'bg-green-50 text-green-600 border border-green-100',
    Closed:    'bg-gray-100 text-gray-500 border border-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${map[status] || map.Closed}`}>
      {status}
    </span>
  );
};

/* ─── Main Component ─── */
const DashboardHome = () => {
  const { user } = useAuth();
  const { website } = useWebsite();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Total Views',  value: '3,842', subtitle: 'Last 30 days',    icon: Eye,       colorBg: 'bg-amber-50',  colorText: 'text-amber-600',  trend: 12 },
    { title: 'Leads',        value: '128',   subtitle: '14 new this week', icon: Users,     colorBg: 'bg-violet-50', colorText: 'text-violet-600', trend: 8  },
    { title: 'Conversion',   value: '4.2%',  subtitle: '+0.6% vs last mo.',icon: TrendingUp,colorBg: 'bg-emerald-50',colorText: 'text-emerald-600',trend: 3  },
    { title: 'Plan Expires', value: 'Dec 26',subtitle: 'Professional Plan', icon: Calendar,  colorBg: 'bg-rose-50',   colorText: 'text-rose-500',   trend: null },
  ];

  const recentLeads = [
    { name: 'Rahul Sharma',  service: 'Marriage Compatibility', status: 'New',       time: 'Today, 10:30 AM', avatar: 'R' },
    { name: 'Priya Patel',   service: 'Career Reading',         status: 'Contacted', time: 'Yesterday',        avatar: 'P' },
    { name: 'Amit Kumar',    service: 'Full Birth Chart',       status: 'Converted', time: 'Oct 3, 2026',      avatar: 'A' },
    { name: 'Neha Singh',    service: 'Tarot Session',          status: 'New',       time: 'Oct 2, 2026',      avatar: 'N' },
    { name: 'Ravi Verma',    service: 'Vastu Consultation',     status: 'Contacted', time: 'Oct 1, 2026',      avatar: 'R' },
  ];

  const quickActions = [
    { icon: Globe,          label: 'Edit Website',      desc: 'Customise your live page',     to: '/dashboard/builder',      color: 'bg-amber-50 text-amber-600' },
    { icon: Sparkles,       label: 'Add Service',       desc: 'List a new offering',           to: '/dashboard/services',     color: 'bg-violet-50 text-violet-600' },
    { icon: MessageSquare,  label: 'Add Testimonial',   desc: 'Showcase client reviews',       to: '/dashboard/testimonials', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Globe,          label: 'Connect Domain',    desc: 'Go live with your own domain',  to: '/dashboard/domain',       color: 'bg-sky-50 text-sky-600' },
    { icon: BarChart2,      label: 'View Leads',        desc: 'Manage enquiries & follow-ups', to: '/dashboard/leads',        color: 'bg-rose-50 text-rose-500' },
    { icon: Shield,         label: 'Upgrade Plan',      desc: 'Unlock premium features',       to: '/dashboard/subscription', color: 'bg-orange-50 text-orange-600' },
  ];

  const todayTasks = [
    { text: 'Reply to 3 new enquiries',    done: false },
    { text: 'Upload 2 new service photos', done: false },
    { text: 'Complete your profile (80%)', done: false },
    { text: 'Website published',           done: true  },
    { text: 'Plan renewed',                done: true  },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">

      {/* ── Top Banner: Welcome ── */}
      <div className="relative bg-gradient-to-br from-[#2C2417] via-[#3D3020] to-[#1A1208] rounded-2xl p-8 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#A48255] rounded-full opacity-10 blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-[#D4AF37] rounded-full opacity-5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Live & Active</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Good evening, <span className="text-[#D4AF37]">{user?.name || 'Astrologer'}!</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/dashboard/preview"
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold border border-white/20 transition-all duration-200 hover:border-white/40"
            >
              <Eye className="w-4 h-4" /> Preview Site
            </Link>
            <Link
              to="/dashboard/builder"
              className="flex items-center gap-2 px-5 py-3 bg-[#A48255] hover:bg-[#8e6e44] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#A48255]/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              <ExternalLink className="w-4 h-4" /> Publish Changes
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* ── Alert: Profile Incomplete ── */}
      <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
        <p className="text-sm text-amber-800 font-medium flex-1">
          Your profile is <strong>80% complete</strong>. Add your social media links to unlock better discoverability.
        </p>
        <Link to="/dashboard/profile" className="text-sm font-bold text-amber-700 hover:underline shrink-0 flex items-center gap-1">
          Complete Now <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Recent Leads (takes 2 cols) ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E2D9] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#E8E2D9] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#1A1A1A] text-lg">Recent Enquiries</h3>
              <p className="text-xs text-[#888] mt-0.5">Your latest incoming leads</p>
            </div>
            <Link to="/dashboard/leads" className="text-sm font-bold text-[#A48255] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-[#F0EBE3]">
            {recentLeads.map((lead, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-[#FDFBF7] transition-colors group">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A48255] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {lead.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1A1A1A] text-sm truncate">{lead.name}</p>
                  <p className="text-xs text-[#888] truncate">{lead.service}</p>
                </div>
                <StatusBadge status={lead.status} />
                <div className="hidden md:flex items-center gap-1 text-xs text-[#AAA] shrink-0">
                  <Clock className="w-3 h-3" />
                  {lead.time}
                </div>
                <ChevronRight className="w-4 h-4 text-[#DDD] group-hover:text-[#A48255] transition-colors shrink-0" />
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-[#FDFBF7] border-t border-[#E8E2D9]">
            <Link to="/dashboard/leads" className="text-sm font-bold text-[#A48255] hover:underline">
              See all 128 leads →
            </Link>
          </div>
        </div>

        {/* ── Right: Tasks + Website Status ── */}
        <div className="flex flex-col gap-6">

          {/* Website Status */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-[#A48255]" />
              <h3 className="font-bold text-[#1A1A1A]">Website Status</h3>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Published & Live
              </span>
            </div>
            <div className="bg-[#FAF7F2] rounded-xl p-3 mb-4 text-xs text-[#666] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#A48255]" />
              <span>Connected to <span className="font-bold text-[#1A1A1A]">{website?.customDomain || (user?.name ? `${user.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.astrobrand.in` : 'your-site.com')}</span></span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/dashboard/builder" className="flex items-center justify-center gap-1.5 py-2.5 bg-[#A48255] text-white rounded-xl text-xs font-bold hover:bg-[#8e6e44] transition-colors">
                <Zap className="w-3.5 h-3.5" /> Edit
              </Link>
              <Link to="/dashboard/preview" className="flex items-center justify-center gap-1.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] text-[#1A1A1A] rounded-xl text-xs font-bold hover:bg-[#F2EFEA] transition-colors">
                <PlayCircle className="w-3.5 h-3.5" /> Preview
              </Link>
            </div>
          </div>

          {/* Today's Checklist */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-6 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-[#A48255]" />
              <h3 className="font-bold text-[#1A1A1A]">Today's Checklist</h3>
            </div>
            <ul className="space-y-3">
              {todayTasks.map((task, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${task.done ? 'bg-[#A48255] border-[#A48255]' : 'border-[#D4C8B0]'}`}>
                    {task.done && <CheckCircle className="w-3 h-3 text-white" />}
                  </span>
                  <span className={`text-sm ${task.done ? 'line-through text-[#BBB]' : 'text-[#333] font-medium'}`}>{task.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-[#F0EBE3]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#888]">Overall Progress</span>
                <span className="text-xs font-bold text-[#A48255]">40%</span>
              </div>
              <div className="w-full bg-[#F0EBE3] rounded-full h-2">
                <div className="bg-gradient-to-r from-[#A48255] to-[#D4AF37] h-2 rounded-full transition-all duration-700" style={{ width: '40%' }} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Quick Actions Grid ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-[#1A1A1A] text-lg">Quick Actions</h3>
            <p className="text-xs text-[#888] mt-0.5">Jump right to what you need</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <QuickAction key={i} {...action} />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA: Upgrade ── */}
      <div className="relative bg-gradient-to-r from-[#1A1208] to-[#2C2417] rounded-2xl p-8 overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #D4AF37 0%, transparent 60%)' }} />
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Celestial Plan</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Unlock Priority Features</h3>
          <p className="text-white/60 text-sm max-w-md">
            Advanced analytics, priority support, custom email templates, and unlimited leads — all in the Celestial Plan.
          </p>
        </div>
        <div className="relative z-10 flex gap-3 shrink-0">
          <Link
            to="/dashboard/subscription"
            className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#c09c2e] text-[#1A1208] rounded-xl font-bold text-sm shadow-lg shadow-[#D4AF37]/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" /> View Plans
          </Link>
          <Link
            to="/dashboard/billing"
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm border border-white/20 transition-all duration-200"
          >
            Learn More
          </Link>
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;
