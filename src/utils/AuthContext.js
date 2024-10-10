import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from './axiosInstance';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Khởi tạo trạng thái từ localStorage
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('accessToken') || null;
  });

  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem('refreshToken') || null;
  });

  // Hàm đăng nhập
  const login = (userData, accessTokenData, refreshTokenData) => {
    setUser(userData);
    setAccessToken(accessTokenData);
    setRefreshToken(refreshTokenData);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', accessTokenData);
    localStorage.setItem('refreshToken', refreshTokenData);
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  // Hàm làm mới token
  const refreshAccessToken = async () => {
    if (!refreshToken) return;
  
    try {
      const response = await axiosInstance.post('/api/accounts/token/refresh/', {
        refresh: refreshToken,
      });
  
      if (response.status === 200) {
        const data = response.data;
        const newAccessToken = data.access;
  
        // Cập nhật accessToken mới
        setAccessToken(newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);
      } else {
        // Nếu refresh token không hợp lệ (có thể hết hạn), đăng xuất
        logout();
      }
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      logout();
    }
  };

  // useEffect để refresh token mỗi 5 phút
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshAccessToken();
    }, 300000); // 5 phút

    return () => clearInterval(intervalId); // Xóa interval khi component unmount
  }, [refreshToken, refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tiện ích để sử dụng AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
