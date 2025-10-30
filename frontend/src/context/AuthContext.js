import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('gamehub_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('gamehub_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gamehub_user');
  };

  const playAsGuest = () => {
    const guestUser = {
      isGuest: true,
      username: 'Guest',
      userId: `guest_${Date.now()}`,
    };
    setUser(guestUser);
    // Don't store guest in localStorage - it's temporary
  };

  const isAuthenticated = () => {
    return user && !user.isGuest;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, playAsGuest, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};