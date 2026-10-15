import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShieldCheck, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { API_URL, useAuth } from '../../context/AuthContext';

const StrategyCallModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, token: existingToken } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Ensure Razorpay SDK is loaded
      const rzpLoaded = await loadRazorpayScript();
      if (!rzpLoaded && !window.Razorpay) {
        throw new Error('Razorpay SDK could not be loaded. Please check your internet connection.');
      }

      // 2. Register, Login or use existing token
      let token = existingToken || localStorage.getItem('astrobrand_token');

      if (!token) {
        const regRes = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone || ''
          })
        });
        const regData = await regRes.json();

        if (regData.success) {
          token = regData.token;
          localStorage.setItem('astrobrand_token', token);
          if (regData.user) {
            localStorage.setItem('astrobrand_user', JSON.stringify(regData.user));
          }
        } else if (regData.message === 'An account with this email already exists') {
          // Try login
          const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            })
          });
          const loginData = await loginRes.json();
          if (loginData.success) {
            token = loginData.token;
            localStorage.setItem('astrobrand_token', token);
            if (loginData.user) {
              localStorage.setItem('astrobrand_user', JSON.stringify(loginData.user));
            }
          } else {
            throw new Error('An account exists with this email. Please enter your correct password.');
          }
        } else {
          const errorMsg = regData.errors
            ? regData.errors.map((err) => err.message).join('\n')
            : regData.message || 'Registration failed';
          throw new Error(errorMsg);
        }
      }

      // 3. Create Razorpay Payment Order
      const orderRes = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          planName: 'Strategy Call',
          planPrice: '99'
        })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Error creating payment order');
      }

      const { orderId, amount, currency, razorpayKeyId, testMode } = orderData.data;

      // 4. Open Razorpay Checkout modal
      const options = {
        key: razorpayKeyId || 'rzp_live_TkbB2WtliNwLDG',
        amount: amount,
        currency: currency || 'INR',
        name: 'Astro Brand Lab',
        description: '1-on-1 Strategy Call Booking (₹99)',
        order_id: orderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#1A1A1A'
        },
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await fetch(`${API_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                testMode: testMode
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setIsSuccess(true);
            } else {
              setError(verifyData.message || 'Payment verification failed');
            }
          } catch (err) {
            console.error('Verify error:', err);
            setError('Error verifying payment.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setError('Payment failed: ' + (response.error?.description || 'Declined'));
          setLoading(false);
        });
        rzp.open();
      } else {
        throw new Error('Razorpay SDK not loaded. Please check your internet connection.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-[#E8E2D9] max-h-[92vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-[#E8E2D9] text-gray-500 hover:text-black flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="mb-6 pr-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 text-[#967C5A] text-[11px] font-bold uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Special Offer · ₹99 Only
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A1A1A] tracking-tight">
                Book Your Strategy Call
              </h3>
              <p className="text-xs sm:text-sm text-[#666] mt-1.5 leading-relaxed">
                Fill your details below. We'll open Razorpay to complete your booking.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A4A4A] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Pandit Rajesh Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#967C5A] focus:ring-1 focus:ring-[#967C5A] bg-[#FAF7F2] font-medium text-sm text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A4A4A] uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="astrologer@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#967C5A] focus:ring-1 focus:ring-[#967C5A] bg-[#FAF7F2] font-medium text-sm text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A4A4A] uppercase tracking-wider mb-1.5">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#967C5A] focus:ring-1 focus:ring-[#967C5A] bg-[#FAF7F2] font-medium text-sm text-[#1A1A1A]"
                />
              </div>

              {!user && (
                <div>
                  <label className="block text-xs font-bold text-[#4A4A4A] uppercase tracking-wider mb-1.5">
                    Create Password * (for dashboard access)
                  </label>
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#967C5A] focus:ring-1 focus:ring-[#967C5A] bg-[#FAF7F2] font-medium text-sm text-[#1A1A1A]"
                  />
                </div>
              )}

              {/* Order Pill */}
              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E8E2D9] flex items-center justify-between mt-3">
                <div>
                  <h5 className="font-bold text-[#1A1A1A] text-sm">20-Min 1-on-1 Strategy Call</h5>
                  <p className="text-xs text-[#666]">Brand audit & 90-day growth roadmap</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#1A1A1A]">₹99</span>
                  <span className="block text-[11px] text-[#967C5A] font-bold uppercase tracking-wider">
                    Total
                  </span>
                </div>
              </div>

              {/* Submit / Razorpay Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-4 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Opening Razorpay...
                  </span>
                ) : (
                  <>
                    Proceed to Pay ₹99 on Razorpay <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 pt-2 text-center text-xs text-[#666]">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                <span>100% Secure Payment powered by Razorpay</span>
              </div>
            </form>
          </>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-serif font-medium text-[#1A1A1A] mb-2">
              Booking Confirmed! 🎉
            </h3>
            <p className="text-sm text-[#4A4A4A] max-w-sm mx-auto mb-6 leading-relaxed">
              Thank you, <strong>{formData.fullName}</strong>! Your payment of ₹99 was successful. We have sent the confirmation to{' '}
              <strong>{formData.email}</strong> and will reach out on WhatsApp at{' '}
              <strong>{formData.phone}</strong>.
            </p>

            <button
              onClick={() => {
                onClose();
                navigate('/dashboard');
              }}
              className="w-full py-3.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm transition-all shadow-md"
            >
              Go to Your Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyCallModal;
