// ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    // Nếu chưa đăng nhập, chuyển hướng đến trang login
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị nội dung của route
  return <Outlet />;
};

export default ProtectedRoute;
