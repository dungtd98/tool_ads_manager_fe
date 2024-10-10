import React, { useState } from "react";
import { FaQuestionCircle, FaLink } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useAuth } from "../utils/AuthContext";
import { toast } from 'react-toastify';
import axiosInstance from "../utils/axiosInstance"; // Import axiosInstance

const FacebookAdsConfig = () => {
  const [configName, setConfigName] = useState("");
  const [baseId, setBaseId] = useState("");
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!configName) newErrors.configName = "Tên cấu hình là bắt buộc.";
    if (!baseId) newErrors.baseId = "Base ID là bắt buộc.";
    if (!appId) newErrors.appId = "App ID là bắt buộc.";
    if (!appSecret) newErrors.appSecret = "App Secret là bắt buộc.";
    return newErrors;
  };

  const handleConnect = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const requestBody = {
      name: configName,
      lark_base_app_token: baseId,
      lark_app_id: appId,
      lark_app_secret: appSecret,
    };

    try {
      const response = await axiosInstance.post(
        "/api/ads_management/facebook_ads_config/",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201) { // Nếu API trả về status 201 (Created)
        setIsConnected(true);

        toast.success("Cấu hình đã được kết nối thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        toast.error("Đã xảy ra lỗi khi kết nối cấu hình.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error during Facebook Ads config:", error);
      toast.error("Có lỗi xảy ra trong quá trình kết nối.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navigation bar */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-lg font-semibold text-gray-900">Cấu hình Reports</h1>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Cấu hình Reports</h2>

              {/* Configuration form */}
              <div className="space-y-6">
                {/* Tên cấu hình field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên cấu hình</label>
                  <input
                    type="text"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Nhập tên cấu hình"
                  />
                  {errors.configName && <p className="text-red-500 text-sm">{errors.configName}</p>}
                </div>

                {/* Base ID field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lark Base ID</label>
                  <input
                    type="text"
                    value={baseId}
                    onChange={(e) => setBaseId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Nhập Lark Base ID"
                  />
                  {errors.baseId && <p className="text-red-500 text-sm">{errors.baseId}</p>}
                  <div className="flex items-center mt-1">
                    <FaQuestionCircle className="text-gray-400 mr-1" />
                    <a
                      href="#"
                      className="text-sm text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Hướng dẫn lấy Lark Base ID
                    </a>
                  </div>
                </div>

                {/* App ID field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lark App ID</label>
                  <input
                    type="text"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Nhập Lark App ID"
                  />
                  {errors.appId && <p className="text-red-500 text-sm">{errors.appId}</p>}
                  <div className="flex items-center mt-1">
                    <FaQuestionCircle className="text-gray-400 mr-1" />
                    <a
                      href="#"
                      className="text-sm text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Hướng dẫn lấy Lark App ID
                    </a>
                  </div>
                </div>

                {/* App Secret field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lark App Secret</label>
                  <input
                    type="text"
                    value={appSecret}
                    onChange={(e) => setAppSecret(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Nhập Lark App Secret"
                  />
                  {errors.appSecret && <p className="text-red-500 text-sm">{errors.appSecret}</p>}
                  <div className="flex items-center mt-1">
                    <FaQuestionCircle className="text-gray-400 mr-1" />
                    <a
                      href="#"
                      className="text-sm text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Hướng dẫn lấy Lark App Secret
                    </a>
                  </div>
                </div>

                {/* Button Section */}
                <div className="flex justify-between mt-6">
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    onClick={() => navigate("/")}
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleConnect}
                    className={`${
                      isConnected
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white px-4 py-2 rounded-md flex items-center`}
                  >
                    <FaLink className="mr-2" />
                    {isConnected ? "Hủy kết nối" : "Kết nối"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacebookAdsConfig;
