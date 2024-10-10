// Sidebar.js
import React, { useState } from 'react';
import {
  FaCog,
  FaCreditCard,
  FaFacebookF,
  FaEnvelope,
  FaEllipsisH,
  FaChevronDown,
  FaChevronUp,
  FaPlug,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaSearch,
} from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleConfig = () => {
    setIsConfigOpen(!isConfigOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // Chuyển hướng đến trang đăng nhập sau khi đăng xuất
  };

  return (
    <div className="w-64 bg-white shadow-md flex flex-col justify-between">
      <div>
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        </div>
        <nav className="mt-6">
          <div
            className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            onClick={toggleConfig}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaCog className="mr-3 text-gray-600" />
                <span className="text-gray-700">Cấu hình</span>
              </div>
              {isConfigOpen ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </div>
          </div>
          {isConfigOpen && (
            <div className="pl-8 py-2">
              <div className="py-1 hover:bg-gray-200 cursor-pointer">
                <FaFacebookF className="inline-block mr-2 text-blue-600" />
                <span className="text-gray-700">FB Ads Report</span>
              </div>
              <div className="py-1 hover:bg-gray-200 cursor-pointer">
                <span className="inline-block mr-2 text-green-600 font-bold">
                  Z
                </span>
                <span className="text-gray-700">Chiến dịch ZNS</span>
              </div>
              <div className="py-1 hover:bg-gray-200 cursor-pointer">
                <FaEnvelope className="inline-block mr-2 text-red-600" />
                <span className="text-gray-700">Email Marketing</span>
              </div>
              <div className="py-1 hover:bg-gray-200 cursor-pointer">
                <FaEllipsisH className="inline-block mr-2 text-gray-600" />
                <span className="text-gray-700">Other</span>
              </div>
            </div>
          )}
          <div className="px-4 py-2 cursor-pointer hover:bg-gray-200">
            <div className="flex items-center">
              <FaPlug className="mr-3 text-gray-600" />
              <span className="text-gray-700">Tích hợp</span>
            </div>
          </div>
          <div className="px-4 py-2 cursor-pointer hover:bg-gray-200">
            <div className="flex items-center">
              <FaCreditCard className="mr-3 text-gray-600" />
              <span className="text-gray-700">Thanh toán</span>
            </div>
          </div>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="flex items-center mb-4">
          <FaUser className="mr-2 text-gray-600" />
          <span className="text-sm text-gray-700">{user?.email || 'Guest'}</span>
        </div>
        <div
          className="flex items-center mb-4 cursor-pointer hover:text-gray-900"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-2 text-gray-600" />
          <span className="text-sm text-gray-700">Đăng xuất</span>
        </div>
        <div className="flex items-center mb-4 cursor-pointer hover:text-gray-900">
          <FaBell className="mr-2 text-gray-600" />
          <span className="text-sm text-gray-700">Thông báo</span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
