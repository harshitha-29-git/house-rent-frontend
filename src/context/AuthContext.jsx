import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Load user data on startup if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await API.get('/users/profile');
          if (res.data.success) {
            setUser(res.data.data);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Failed to load user profile on startup:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: userToken, ...userData } = res.data.data;
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.',
      };
    }
  };

  // Register handler
  const register = async (name, email, phone, password, confirmPassword) => {
    try {
      const res = await API.post('/auth/register', {
        name,
        email,
        phone,
        password,
        confirmPassword,
      });
      if (res.data.success) {
        const { token: userToken, ...userData } = res.data.data;
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    try {
      const res = await API.put('/users/profile', profileData);
      if (res.data.success) {
        setUser((prevUser) => ({
          ...prevUser,
          ...res.data.data,
        }));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile.',
      };
    }
  };

  // Toggle favorite listing handler
  const toggleFavorite = async (propertyId) => {
    if (!user) return { success: false, message: 'Please log in to save favorites' };
    try {
      const res = await API.post(`/users/favorite/${propertyId}`);
      if (res.data.success) {
        const updatedFavorites = res.data.data;
        setUser((prevUser) => ({
          ...prevUser,
          favorites: updatedFavorites,
        }));
        return { success: true, message: res.data.message, favorites: updatedFavorites };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to toggle favorite.',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout: handleLogout,
        updateProfile,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
