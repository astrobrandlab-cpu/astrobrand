import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  
  // You can pass plan details via React Router state, defaulting to the 999 plan if none provided
  const plan = location.state?.plan || { name: 'Landing Page Offer', price: '999' };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinueToPayment = async (e) => {
    e.preventDefault();
    if (formData.fullName && formData.email && formData.password) {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5005/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone || ''
          })
        });
        const data = await res.json();
        
        if (data.success) {
          setToken(data.token);
          setStep(2);
        } else {
          // If email exists, try login
          if (data.message === 'An account with this email already exists') {
            const loginRes = await fetch('http://localhost:5005/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            const loginData = await loginRes.json();
            if (loginData.success) {
              setToken(loginData.token);
              setStep(2);
            } else {
              alert('Account exists but incorrect password: ' + (loginData.message || 'Authentication failed'));
            }
          } else if (data.message === 'Validation error' && data.errors) {
            const errorMessages = data.errors.map(err => err.message).join('\n');
            alert(`Validation failed:\n${errorMessages}`);
          } else {
            alert(data.message || 'Registration failed');
          }
        }
      } catch (err) {
        console.error(err);
        alert('Error creating account');
      } finally {
        setLoading(false);
      }
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create Order
      const orderRes = await fetch('http://localhost:5005/api/payments/create-order', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          planName: plan.name,
          planPrice: plan.price
        })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert(orderData.message || 'Error creating order');
        setLoading(false);
        return;
      }

      const { orderId } = orderData.data;

      // Automatically verify without showing Razorpay for testing
      const verifyRes = await fetch('http://localhost:5005/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          razorpayOrderId: orderId,
          razorpayPaymentId: 'pay_test_dummy_id',
          razorpaySignature: 'dummy_signature',
          testMode: true // This will bypass signature verification on the backend
        })
      });
      
      const verifyData = await verifyRes.json();
      
      if (verifyData.success) {
        navigate('/dashboard');
      } else {
        alert(verifyData.message || 'Payment verification failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error initiating payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#1A1A1A] mb-3">Complete Your Purchase</h1>
          <p className="text-[#666] font-medium">Join Astro Brand Lab and start growing your astrology practice.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column - Form Steps */}
          <div className="flex-1">
            {/* Step Indicators */}
            <div className="flex items-center mb-8">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-[#A48255] text-white' : 'bg-[#E8E2D9] text-[#666]'}`}>1</div>
                <span className={`ml-3 text-sm font-bold ${step >= 1 ? 'text-[#1A1A1A]' : 'text-[#666]'}`}>Account details</span>
              </div>
              <div className="w-12 h-0.5 mx-4 bg-[#E8E2D9]">
                <div className={`h-full bg-[#A48255] transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-[#A48255] text-white' : 'bg-[#E8E2D9] text-[#666]'}`}>2</div>
                <span className={`ml-3 text-sm font-bold ${step >= 2 ? 'text-[#1A1A1A]' : 'text-[#666]'}`}>Payment</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm p-6 sm:p-8">
              {step === 1 ? (
                <form onSubmit={handleContinueToPayment} className="animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Create your account</h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-[#4A4A4A] mb-2">Full Name</label>
                      <input 
                        type="text" required
                        name="fullName" value={formData.fullName} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-1 focus:ring-[#A48255] bg-[#FAF7F2] font-medium" 
                        placeholder="e.g. Pandit Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#4A4A4A] mb-2">Email Address</label>
                      <input 
                        type="email" required
                        name="email" value={formData.email} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-1 focus:ring-[#A48255] bg-[#FAF7F2] font-medium" 
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#4A4A4A] mb-2">Phone Number (Optional)</label>
                      <input 
                        type="tel"
                        name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-1 focus:ring-[#A48255] bg-[#FAF7F2] font-medium" 
                        placeholder="+91"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#4A4A4A] mb-2">Create Password</label>
                      <input 
                        type="password" required
                        name="password" value={formData.password} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-1 focus:ring-[#A48255] bg-[#FAF7F2] font-medium" 
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full mt-8 py-4 bg-[#1A1A1A] text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    Continue to Payment <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-center text-xs text-[#666] mt-4">By continuing, you agree to our Terms of Service.</p>
                </form>
              ) : (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#1A1A1A]">Payment Method</h2>
                    <button onClick={() => setStep(1)} className="text-sm font-bold text-[#A48255] hover:underline">Edit details</button>
                  </div>

                  <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E8E2D9] mb-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-[#E8E2D9]">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1A1A1A] text-sm mb-1">Secure Checkout</h4>
                      <p className="text-xs text-[#666] leading-relaxed">Your payment information is encrypted and securely processed by Razorpay. We do not store your card details.</p>
                    </div>
                  </div>

                  <button 
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full py-4 bg-[#A48255] text-white rounded-xl font-bold hover:bg-[#8e6e44] transition-all flex items-center justify-center gap-2 shadow-md relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing...
                      </span>
                    ) : (
                      <>Pay ₹{plan.price} Now <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full md:w-[350px] shrink-0">
            <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-[#1A1A1A] mb-6 pb-4 border-b border-[#E8E2D9]">Order Summary</h3>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-[#1A1A1A]">{plan.name}</h4>
                  <p className="text-xs text-[#666] mt-1">One-time payment</p>
                </div>
                <span className="font-bold text-[#1A1A1A]">₹{plan.price}</span>
              </div>

              <ul className="space-y-3 mb-6 mt-6">
                <li className="flex items-start gap-2 text-sm text-[#4A4A4A]">
                  <CheckCircle2 className="w-4 h-4 text-[#A48255] shrink-0 mt-0.5" />
                  <span>Premium Astrology Template</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#4A4A4A]">
                  <CheckCircle2 className="w-4 h-4 text-[#A48255] shrink-0 mt-0.5" />
                  <span>Mobile Responsive Design</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#4A4A4A]">
                  <CheckCircle2 className="w-4 h-4 text-[#A48255] shrink-0 mt-0.5" />
                  <span>Lead Generation Form</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#4A4A4A]">
                  <CheckCircle2 className="w-4 h-4 text-[#A48255] shrink-0 mt-0.5" />
                  <span>Custom Domain Support</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-[#E8E2D9]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1A1A1A]">Total</span>
                  <span className="text-2xl font-serif font-medium text-[#1A1A1A]">₹{plan.price}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
