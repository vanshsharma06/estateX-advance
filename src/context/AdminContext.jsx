import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminContext = createContext(null);

// Hardcoded admin credentials (in production, this would be server-side)
const ADMIN_CREDENTIALS = {
  email: 'admin@up16.com',
  password: 'admin123'
};

// Simple JWT-like token (in production, use real JWT)
const createToken = (user) => {
  const payload = {
    email: user.email,
    role: 'admin',
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  return btoa(JSON.stringify(payload));
};

const parseToken = (token) => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('adminToken');
    if (token) {
      const payload = parseToken(token);
      if (payload) {
        setAdmin(payload);
      } else {
        localStorage.removeItem('adminToken');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          const token = createToken({ email });
          localStorage.setItem('adminToken', token);
          setAdmin({ email, role: 'admin' });
          resolve({ success: true });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    navigate('/admin/login');
  };

  const isAuthenticated = !!admin;

  return (
    <AdminContext.Provider value={{ admin, login, logout, isAuthenticated, loading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}

// Protected Route wrapper
export function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black-rich flex items-center justify-center">
        <div className="gold-text text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}