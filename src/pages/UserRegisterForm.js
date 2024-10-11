import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SSOButtons from "../components/SSOButtons"; // Import component SSOButtons
import axiosInstance from '../utils/axiosInstance'; // Đảm bảo đường dẫn chính xác

const UserRegisterForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate(); // Dùng để chuyển hướng sau khi đăng ký thành công

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "fullname":
        if (!value.trim()) {
          newErrors.fullname = "Vui lòng nhập họ và tên";
        } else {
          delete newErrors.fullname;
        }
        break;
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
        // Kiểm tra confirm_password khi password thay đổi
        if (formData.confirm_password && value !== formData.confirm_password) {
          newErrors.confirm_password = "Mật khẩu xác nhận không khớp";
        } else {
          delete newErrors.confirm_password;
        }
        break;
      case "confirm_password":
        if (value !== formData.password) {
          newErrors.confirm_password = "Mật khẩu xác nhận không khớp";
        } else {
          delete newErrors.confirm_password;
        }
        break;
      case "phone":
        const phoneRegex = /^\d{9,11}$/;
        if (!phoneRegex.test(value)) {
          newErrors.phone = "Số điện thoại không hợp lệ";
        } else {
          delete newErrors.phone;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra xem có lỗi không
    if (Object.keys(errors).length > 0) {
      alert("Vui lòng kiểm tra lại thông tin");
      return;
    }

    // Gửi dữ liệu đăng ký tới API
    try {
      const response = await axiosInstance.post("/api/accounts/register/", formData);

      // Đăng ký thành công
      alert("Đăng ký thành công!");
      // Chuyển hướng đến trang đăng nhập hoặc trang chủ
      navigate("/login");
    } catch (error) {
      if (error.response) {
        // Lỗi từ server
        setErrors(error.response.data);
      } else {
        // Lỗi mạng hoặc khác
        alert("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.");
      }
      console.error("Error during registration:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng ký người dùng
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Họ và tên */}
            <div className="mb-4">
              <label htmlFor="fullname" className="sr-only">
                Họ và tên
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.fullname ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Họ và tên"
                value={formData.fullname}
                onChange={handleChange}
                aria-label="Họ và tên"
              />
              {errors.fullname && (
                <p className="mt-2 text-sm text-red-600">{errors.fullname}</p>
              )}
            </div>

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
                  errors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
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
                    errors.password ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
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

            {/* Xác nhận mật khẩu */}
            <div className="mb-4">
              <div className="relative">
                <label htmlFor="confirm_password" className="sr-only">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    errors.confirm_password ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  aria-label="Xác nhận mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirm_password}
                </p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="mb-4">
              <label htmlFor="phone" className="sr-only">
                Số điện thoại
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                aria-label="Số điện thoại"
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Nút gửi */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ease-in-out transform hover:scale-105"
            >
              Đăng ký
            </button>
          </div>
        </form>

        {/* Đăng ký bằng mạng xã hội */}
        <SSOButtons />

        {/* Chuyển hướng đến trang đăng nhập */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegisterForm;
