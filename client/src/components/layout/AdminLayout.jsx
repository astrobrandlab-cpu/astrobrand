import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CreditCard, LayoutTemplate, Link2, 
  BarChart, HeadphonesIcon, Settings, LogOut, Menu, X, Globe, DollarSign
} from 'lucide-react';

const AdminSidebarItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    end={to === '/admin'}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
        isActive
          ? 'bg-[#1A1A1A] text-white shadow-md'
          : 'text-[#666] hover:bg-[#F2EFEA] hover:text-[#1A1A1A]'
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span className="text-[15px]">{label}</span>
  </NavLink>
);

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F6F4F0] flex font-sans">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-[#FAF7F2] border-r border-[#E8E2D9] 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-[#E8E2D9] justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-medium text-[#1A1A1A] tracking-tight">Astro Admin</span>
            <span className="text-[10px] font-bold text-[#A48255] uppercase tracking-widest">Super Control</span>
          </div>
          <button 
            className="lg:hidden text-[#4A4A4A] hover:text-[#1A1A1A]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <AdminSidebarItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
          
          <div className="mt-8 mb-4 px-4 text-[11px] font-bold text-[#967C5A] uppercase tracking-[0.2em]">Management</div>
          <AdminSidebarItem to="/admin/users" icon={Users} label="Users & Astrologers" />
          <AdminSidebarItem to="/admin/plans" icon={CreditCard} label="Plans & Pricing" />
          <AdminSidebarItem to="/admin/payments" icon={DollarSign} label="Payments" />
          <AdminSidebarItem to="/admin/websites" icon={Globe} label="Websites" />
          <AdminSidebarItem to="/admin/domains" icon={Link2} label="Domains" />
          <AdminSidebarItem to="/admin/templates" icon={LayoutTemplate} label="Templates" />
          
          <div className="mt-8 mb-4 px-4 text-[11px] font-bold text-[#967C5A] uppercase tracking-[0.2em]">System</div>
          <AdminSidebarItem to="/admin/analytics" icon={BarChart} label="Analytics" />
          <AdminSidebarItem to="/admin/support" icon={HeadphonesIcon} label="Support Tickets" />
          <AdminSidebarItem to="/admin/settings" icon={Settings} label="Platform Settings" />
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-[#E8E2D9]">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[#D9534F] hover:bg-[#FDFBF7] border border-transparent hover:border-[#F2EFEA] rounded-xl transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-[#E8E2D9] flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-[#4A4A4A] hover:text-[#1A1A1A] rounded-lg hover:bg-[#F2EFEA] transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-medium text-[#1A1A1A] hidden sm:block">Super Admin Portal</h1>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F6F4F0]">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </div>

      </main>

    </div>
  );
};

export default AdminLayout;
