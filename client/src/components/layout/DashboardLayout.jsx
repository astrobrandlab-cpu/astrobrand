import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Globe, 
  MonitorSmartphone, 
  Eye, 
  Link2, 
  Sparkles, 
  MessageSquare, 
  Inbox, 
  Image as ImageIcon, 
  Share2, 
  CreditCard, 
  Receipt, 
  Settings, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    end={to === '/dashboard'}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
        isActive
          ? 'bg-[#A48255] text-white shadow-md'
          : 'text-[#4A4A4A] hover:bg-[#F2EFEA] hover:text-[#1A1A1A]'
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span className="text-[15px]">{label}</span>
  </NavLink>
);

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F6F4F0] flex font-sans">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-[280px] h-screen bg-[#FAF7F2] border-r border-[#E8E2D9] shrink-0
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-[#E8E2D9] justify-between shrink-0">
          <span className="text-2xl font-serif font-medium text-[#1A1A1A] tracking-tight">Astro Brand.</span>
          <button 
            className="lg:hidden text-[#4A4A4A] hover:text-[#1A1A1A]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="mb-4 px-4 text-[11px] font-bold text-[#967C5A] uppercase tracking-[0.2em]">Main</div>
          <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/dashboard/profile" icon={User} label="My Profile" />
          
          <div className="mt-8 mb-4 px-4 text-[11px] font-bold text-[#967C5A] uppercase tracking-[0.2em]">Website</div>
          <SidebarItem to="/dashboard/website" icon={Globe} label="My Website" />
          <SidebarItem to="/dashboard/builder" icon={MonitorSmartphone} label="Website Builder" />
          <SidebarItem to="/dashboard/preview" icon={Eye} label="Preview Website" />
          <SidebarItem to="/dashboard/domain" icon={Link2} label="Domain" />
          
          <div className="mt-8 mb-4 px-4 text-[11px] font-bold text-[#967C5A] uppercase tracking-[0.2em]">Business</div>
          <SidebarItem to="/dashboard/services" icon={Sparkles} label="Services" />
          <SidebarItem to="/dashboard/testimonials" icon={MessageSquare} label="Testimonials" />
          <SidebarItem to="/dashboard/leads" icon={Inbox} label="Leads / Enquiries" />
          
          <div className="mt-8 mb-4 px-4 text-[11px] font-bold text-[#967C5A] uppercase tracking-[0.2em]">Assets</div>
          <SidebarItem to="/dashboard/media" icon={ImageIcon} label="Media" />
          <SidebarItem to="/dashboard/social" icon={Share2} label="Social Links" />
          
          <div className="mt-8 mb-4 px-4 text-[11px] font-bold text-[#967C5A] uppercase tracking-[0.2em]">Account</div>
          <SidebarItem to="/dashboard/subscription" icon={CreditCard} label="Subscription" />
          <SidebarItem to="/dashboard/billing" icon={Receipt} label="Billing & Payments" />
          <SidebarItem to="/dashboard/settings" icon={Settings} label="Settings" />
          <SidebarItem to="/dashboard/support" icon={HelpCircle} label="Support" />
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-[#E8E2D9] shrink-0 bg-[#FAF7F2]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[#D9534F] hover:bg-[#FDFBF7] border border-transparent hover:border-[#F2EFEA] rounded-xl transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#F6F4F0]">
        
        {/* Top Header */}
        <header className="h-20 bg-[#FAF7F2] border-b border-[#E8E2D9] flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-[#4A4A4A] hover:text-[#1A1A1A] rounded-lg hover:bg-[#F2EFEA] transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-medium text-[#1A1A1A] hidden sm:block">Welcome back, {user?.name || 'Astrologer'}</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 text-[#4A4A4A] hover:text-[#A48255] hover:bg-[#FDFBF7] border border-transparent hover:border-[#E8E2D9] rounded-full transition-all relative shadow-sm bg-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-[#E8E2D9]">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[14px] font-bold text-[#1A1A1A]">{user?.name || 'Dr. Mehak S.'}</span>
                <span className="text-[11px] font-medium text-[#967C5A] uppercase tracking-wider">{user?.plan || 'Professional Plan'}</span>
              </div>
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user?.name || "Profile"} 
                  className="w-10 h-10 rounded-full border-2 border-[#E8E2D9] object-cover cursor-pointer hover:border-[#A48255] transition-colors"
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-full border-2 border-[#E8E2D9] bg-gradient-to-br from-[#A48255] to-[#7A5E38] text-white font-bold flex items-center justify-center text-sm shadow-sm cursor-pointer hover:border-[#A48255] transition-colors"
                  title={user?.name || "Profile"}
                >
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1200px] mx-auto pb-16">
            <Outlet />
          </div>
        </div>

      </main>

    </div>
  );
};

export default DashboardLayout;
