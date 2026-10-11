import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight,
  Sparkles, AlertCircle, CheckCircle2, ShieldCheck, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { register, loading, error, setError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 3) {
      setError('Password must be at least 3 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }

    const res = await register(
      formData.name.trim(),
      formData.email.trim().toLowerCase(),
      formData.password,
      formData.phone.trim()
    );

    if (res.success) {
      setSuccessMessage('Account created successfully! Initializing your website...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#A48255] selection:text-white">
      
      {/* Background celestial glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 right-1/4 w-96 h-96 bg-[#A48255]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-12 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
          Create Your Astrologer Account
        </h2>
        <p className="mt-2 text-sm text-[#666]">
          Get your customized landing page, domain connector & booking engine ready in seconds.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-[#E8E2D9]">
          
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-xs font-medium text-red-800 leading-relaxed">
                {error}
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <div className="text-xs font-bold text-green-800">
                {successMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4A4A] mb-1.5">
                Full Name / Title *
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Acharya Rajesh Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#E0D9CF] bg-[#FAF7F2] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 font-medium transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4A4A] mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. astrologer@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#E0D9CF] bg-[#FAF7F2] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 font-medium transition-all"
                />
              </div>
            </div>

            {/* WhatsApp / Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4A4A] mb-1.5">
                WhatsApp / Phone Number
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#E0D9CF] bg-[#FAF7F2] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 font-medium transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4A4A] mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-[#E0D9CF] bg-[#FAF7F2] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4A4A] mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#E0D9CF] bg-[#FAF7F2] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 font-medium transition-all"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-[#666]">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-[#E0D9CF] text-[#A48255] focus:ring-[#A48255] w-4 h-4"
                />
                <span>
                  I agree to the <span className="text-[#A48255] font-bold">Terms of Service</span> and <span className="text-[#A48255] font-bold">Privacy Policy</span>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl font-bold text-sm text-white bg-[#1A1A1A] hover:bg-black active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account & Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Included Features Checklist */}
          <div className="mt-6 pt-5 border-t border-[#E8E2D9] space-y-2 text-xs text-[#666]">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Free personalized website & subdomain included</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Full custom domain connection support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Direct WhatsApp & calendar booking system</span>
            </div>
          </div>

          {/* Sign In Redirect */}
          <div className="mt-6 pt-5 border-t border-[#E8E2D9] text-center">
            <p className="text-sm text-[#666]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-[#A48255] hover:text-[#8E6E44] hover:underline"
              >
                Sign In →
              </Link>
            </p>
          </div>

        </div>

        {/* Security badge */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>No credit card required to start • Free tier available</span>
        </div>
      </div>

    </div>
  );
};

export default Signup;
