'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('rgpt_token'));
    const storedUser = localStorage.getItem('rgpt_user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setHydrated(true);
  }, []);

  const login = useCallback((newToken, userData) => {
    localStorage.setItem('rgpt_token', newToken);
    if (userData) localStorage.setItem('rgpt_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData || null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('rgpt_token');
    localStorage.removeItem('rgpt_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, hydrated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}