import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SSOButtons from '../components/SSOButtons';
import { useAuth } from '../utils/AuthContext'; // Đảm bảo đường dẫn chính xác
import axiosInstance from '../utils/axiosInstance'; // Đảm bảo đường dẫn chính xác

const UserLoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = "Địa chỉ email không hợp lệ";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (value.length < 8) {
          newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xem có lỗi trong form không
    if (Object.keys(errors).length > 0) {
      alert("Vui lòng kiểm tra lại thông tin đăng nhập.");
      return;
    }

    try {
      const response = await axiosInstance.post('/api/accounts/token/obtain/', formData);

      // Giả sử backend trả về các trường: user, access, refresh
      const data = response.data;

      // Đăng nhập thành công
      login(data.user, data.access, data.refresh);

      // Chuyển hướng đến trang chủ
      navigate('/');
    } catch (error) {
      if (error.response) {
        // Lỗi từ server
        setErrors({ general: error.response.data.detail || 'Đăng nhập thất bại. Vui lòng thử lại.' });
      } else {
        // Lỗi mạng hoặc khác
        setErrors({ general: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' });
      }
      console.error('Error during login:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập
        </h2>
        {errors.general && (
          <div className="text-red-600 text-center mb-4">
            {errors.general}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Địa chỉ email */}
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Địa chỉ email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Địa chỉ email"
                value={formData.email}
                onChange={handleChange}
                aria-label="Địa chỉ email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="mb-4">
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  aria-label="Mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Nút đăng nhập */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        {/* Đăng nhập bằng mạng xã hội */}
        <SSOButtons />

        {/* Chuyển hướng đến trang đăng ký */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLoginForm;
