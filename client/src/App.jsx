import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';

// Public Pages
import Home from './pages/Home';
import Checkout from './pages/public/Checkout';
import PublicWebsite from './pages/public/PublicWebsite';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Context
import { AuthProvider } from './context/AuthContext';
import { WebsiteProvider } from './context/WebsiteContext';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import Profile from './pages/dashboard/Profile';
import Builder from './pages/dashboard/Builder';
import PreviewPage from './pages/dashboard/PreviewPage';
import MyWebsite from './pages/dashboard/MyWebsite';
import Services from './pages/dashboard/Services';
import Domain from './pages/dashboard/Domain';
import Leads from './pages/dashboard/Leads';
import Testimonials from './pages/dashboard/Testimonials';
import PlaceholderPage from './pages/dashboard/PlaceholderPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Public Layout wrapper
const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-[#FDFBF7]">
    <Header />
    <main>{children}</main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <WebsiteProvider>
        <Router>
          <Routes>
            {/* Public Platform Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
            
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Public Astrologer Landing Pages (Visitors & Custom Domains) */}
            <Route path="/site/:slug" element={<PublicWebsite />} />
            <Route path="/site" element={<PublicWebsite />} />
            <Route path="/preview-live" element={<PublicWebsite />} />

            {/* User Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="profile" element={<Profile />} />
              <Route path="website" element={<MyWebsite />} />
              <Route path="builder" element={<Builder />} />
              <Route path="preview" element={<PreviewPage />} />
              <Route path="domain" element={<Domain />} />
              <Route path="services" element={<Services />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="leads" element={<Leads />} />
              
              {/* Supporting Dashboard Pages */}
              <Route path="media" element={<PlaceholderPage title="Media Gallery" description="Upload and manage high-resolution images for your astrology website." />} />
              <Route path="social" element={<PlaceholderPage title="Social Links" description="Connect your Instagram, YouTube, and WhatsApp profiles." />} />
              <Route path="subscription" element={<PlaceholderPage title="Subscription" description="Manage your current plan and usage limits." />} />
              <Route path="billing" element={<PlaceholderPage title="Billing & Payments" description="View your invoices and payment history." />} />
              <Route path="settings" element={<PlaceholderPage title="Account Settings" description="Manage your password, notifications, and security." />} />
              <Route path="support" element={<PlaceholderPage title="Help & Support" description="Contact our team for 24/7 dedicated astrologer support." />} />
            </Route>

            {/* Super Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Router>
      </WebsiteProvider>
    </AuthProvider>
  );
}

export default App;
