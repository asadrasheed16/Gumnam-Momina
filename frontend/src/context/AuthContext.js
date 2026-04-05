'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, getMe } from '@/lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gm_token');
    if (token) {
      getMe()
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('gm_token');
          localStorage.removeItem('gm_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    localStorage.setItem('gm_token', res.data.token);
    localStorage.setItem('gm_user', JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const register = async (name, email, password, phone) => {
    const res = await registerApi({ name, email, password, phone });
    localStorage.setItem('gm_token', res.data.token);
    localStorage.setItem('gm_user', JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('gm_token');
    localStorage.removeItem('gm_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
