import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const TOKEN_KEY = 'astrobrand_token';
const USER_KEY = 'astrobrand_user';

// Default demo astrologer
export const DEMO_USER = {
  _id: 'demo_user_101',
  name: 'Dr. Mehak Sharma',
  email: 'mehak@astrobrand.com',
  role: 'astrologer',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  plan: 'Professional Plan',
  onboardingCompleted: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      const savedToken = localStorage.getItem(TOKEN_KEY);
      // Only keep user if valid session exists and is not stale default
      if (savedUser && savedToken && savedToken !== 'demo_token_mehak') {
        return JSON.parse(savedUser);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedToken && savedToken !== 'demo_token_mehak') {
        return savedToken;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verify token on mount if real token exists
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken || storedToken.startsWith('demo_')) return;

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        } else {
          // Token expired or invalid
          console.warn('Auth token expired');
        }
      } catch (err) {
        console.warn('Could not verify token with backend, keeping session:', err);
      }
    };

    checkAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password');
      }

      const authToken = data.token;
      const userData = data.user;

      setToken(authToken);
      setUser(userData);
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Register handler
  const register = async (name, email, password, phone = '') => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      const authToken = data.token;
      const userData = data.user;

      setToken(authToken);
      setUser(userData);
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Demo 1-Click Login (Useful for quick evaluations)
  const loginAsDemo = () => {
    setToken('demo_token_mehak');
    setUser(DEMO_USER);
    localStorage.setItem(TOKEN_KEY, 'demo_token_mehak');
    localStorage.setItem(USER_KEY, JSON.stringify(DEMO_USER));
    return { success: true, user: DEMO_USER };
  };

  // Logout handler
  const logout = async () => {
    try {
      if (token && !token.startsWith('demo_')) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (e) {
      console.warn('Logout API error:', e);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  };

  // Update profile in state
  const updateUser = (updated) => {
    setUser(prev => {
      const next = { ...prev, ...updated };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        error,
        setError,
        login,
        register,
        loginAsDemo,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
