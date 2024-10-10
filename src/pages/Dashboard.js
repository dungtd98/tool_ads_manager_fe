import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import axiosInstance from "../utils/axiosInstance"; // Import axiosInstance

const Dashboard = () => {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true); // Biến để theo dõi trạng thái loading
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateRange, setFilterDateRange] = useState({
    start: "",
    end: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { accessToken } = useAuth();

  // Hàm để gọi API và lấy danh sách cấu hình sử dụng axios
  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/ads_management/facebook_ads_config/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setConfigurations(response.data); // Cập nhật danh sách cấu hình từ API
        setLoading(false); // Sau khi lấy dữ liệu xong, đặt loading thành false
      } catch (error) {
        console.error("Failed to fetch configurations:", error);
        setLoading(false); // Nếu có lỗi thì cũng ngừng loading
      }
    };

    fetchConfigurations();
  }, []); // eslint-disable-next-line

  const handleCreateConfig = () => {
    navigate("/create-fb-ads-config");
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      // Gửi PATCH request để cập nhật trạng thái activate_status
      const response = await axiosInstance.patch(
        `/api/ads_management/facebook_ads_config/${id}/`,
        { activate_status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Cập nhật lại cấu hình trong giao diện sau khi thành công
        setConfigurations(
          configurations.map((config) =>
            config.id === id ? { ...config, activate_status: newStatus } : config
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Hàm để gửi yêu cầu DELETE tới API khi xóa một cấu hình
  const handleDeleteConfig = async (id) => {
    try {
      // Gửi DELETE request đến API
      const response = await axiosInstance.delete(
        `/api/ads_management/facebook_ads_config/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 204) {
        // Xóa cấu hình khỏi danh sách sau khi xóa thành công
        setConfigurations(configurations.filter((config) => config.id !== id));
      }
    } catch (error) {
      console.error("Error deleting configuration:", error);
    }
  };

  const filteredConfigurations = configurations.filter((config) => {
    return (
      (filterStatus === "" ||
        (filterStatus === "true" ? config.activate_status : !config.activate_status)) &&
      (filterDateRange.start === "" ||
        new Date(config.created_at) >= new Date(filterDateRange.start)) &&
      (filterDateRange.end === "" ||
        new Date(config.created_at) <= new Date(filterDateRange.end)) &&
      config.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const pageCount = Math.ceil(filteredConfigurations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredConfigurations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
            <h1 className="text-lg font-semibold text-gray-900">
              Cấu hình Facebook Ads Report
            </h1>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-700 text-2xl font-medium">
                Danh sách cấu hình
              </h3>
              <button
                onClick={handleCreateConfig}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <FaPlus className="mr-2" />
                Tạo cấu hình mới
              </button>
            </div>

            {/* Filter section */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h4 className="text-lg font-semibold mb-4">Bộ lọc</h4>
              <div className="flex flex-wrap items-end space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Không hoạt động</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={filterDateRange.start}
                    onChange={(e) =>
                      setFilterDateRange({
                        ...filterDateRange,
                        start: e.target.value,
                      })
                    }
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={filterDateRange.end}
                    onChange={(e) =>
                      setFilterDateRange({
                        ...filterDateRange,
                        end: e.target.value,
                      })
                    }
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tìm kiếm tên cấu hình
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nhập tên cấu hình..."
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Configuration list */}
            {loading ? (
              <div>Đang tải dữ liệu...</div> // Hiển thị loading khi dữ liệu đang được lấy
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên cấu hình
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kích hoạt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((config) => (
                      <tr key={config.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {config.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <label className="flex items-center cursor-pointer">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={config.activate_status}
                                onChange={() =>
                                  handleToggleStatus(config.id, config.activate_status)
                                }
                              />
                              <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                              <div
                                className={`absolute w-6 h-6 rounded-full shadow -left-1 -top-1 transition ${
                                  config.activate_status
                                    ? "transform translate-x-full bg-green-500"
                                    : "bg-white"
                                }`}
                              ></div>
                            </div>
                          </label>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {config.created_at}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteConfig(config.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                          >
                            <FaTrash className="mr-2" />
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-4 flex justify-end">
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(pageCount)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === index + 1
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pageCount}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
