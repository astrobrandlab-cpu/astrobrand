import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles,
  AlertCircle, CheckCircle2, ShieldCheck, Stars
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, setError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#A48255] selection:text-white">
      
      {/* Background celestial glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#A48255]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
          Welcome Back, Astrologer
        </h2>
        <p className="mt-2 text-sm text-[#666]">
          Sign in to manage your custom domain, bookings & website.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4A4A] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. astrologer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E0D9CF] bg-[#FAF7F2] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 font-medium transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4A4A]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-[#A48255] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-[#E0D9CF] bg-[#FAF7F2] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 font-medium transition-all"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#666] font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E0D9CF] text-[#A48255] focus:ring-[#A48255] w-4 h-4"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-[#1A1A1A] hover:bg-black active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>


          {/* Sign Up Redirect */}
          <div className="mt-8 pt-6 border-t border-[#E8E2D9] text-center">
            <p className="text-sm text-[#666]">
              New to Astro Brand?{' '}
              <Link
                to="/signup"
                className="font-bold text-[#A48255] hover:text-[#8E6E44] hover:underline"
              >
                Create an Account →
              </Link>
            </p>
          </div>

        </div>

        {/* Security badge */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-bit SSL encrypted & secure Vedic practitioner platform</span>
        </div>
      </div>

    </div>
  );
};

export default Login;
