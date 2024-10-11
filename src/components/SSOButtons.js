// SSOButtons.js
import React from 'react';
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext'; // Đảm bảo đường dẫn đúng
import axiosInstance from '../utils/axiosInstance'; // Import axiosInstance

const SSOButtons = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Lấy hàm login từ AuthContext

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axiosInstance.post('/api/accounts/google/', {
          access_token: tokenResponse.access_token,
        });

        const data = response.data;

        // Kiểm tra nếu đăng nhập thành công
        if (response.status === 200 || response.status === 201) {
          console.log('Google login successful:', data);
          // Sử dụng hàm login từ AuthContext
          login(data.user, data.access, data.refresh);
          // Chuyển hướng đến trang chủ
          navigate('/');
        } else {
          console.error('Google login failed:', data);
        }
      } catch (error) {
        if (error.response) {
          // Lỗi từ server
          console.error('Google login failed:', error.response.data);
        } else {
          // Lỗi mạng hoặc khác
          console.error('Error during Google login:', error.message);
        }
      }
    },
    onError: (error) => console.error('Google login failed:', error),
  });

  const responseFacebook = async (authResponse) => {
    console.log('Facebook response:', authResponse);
    if (authResponse.accessToken) {
      try {
        const response = await axiosInstance.post('/api/accounts/facebook/', {
          access_token: authResponse.accessToken,
        });

        const data = response.data;

        // Kiểm tra nếu đăng nhập thành công
        if (response.status === 200 || response.status === 201) {
          console.log('Facebook login successful:', data);
          // Sử dụng hàm login từ AuthContext
          login(data.user, data.access, data.refresh);
          // Chuyển hướng đến trang chủ
          navigate('/');
        } else {
          console.error('Facebook login failed:', data);
        }
      } catch (error) {
        if (error.response) {
          // Lỗi từ server
          console.error('Facebook login failed:', error.response.data);
        } else {
          // Lỗi mạng hoặc khác
          console.error('Error during Facebook login:', error.message);
        }
      }
    } else {
      console.error('Facebook login failed: No access token');
    }
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login clicked');
    window.FB.login(function(response) {
      if (response.authResponse) {
        responseFacebook(response.authResponse);
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'public_profile,email,ads_management,ads_read'});
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Hoặc tiếp tục với
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div>
          <button
            onClick={handleFacebookLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaFacebook className="w-5 h-5 text-blue-600" />
            <span className="ml-2">Facebook</span>
          </button>
        </div>
        <div>
          <button
            onClick={() => googleLogin()}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaGoogle className="w-5 h-5 text-red-600" />
            <span className="ml-2">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SSOButtons;
