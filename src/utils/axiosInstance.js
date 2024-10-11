import axios from 'axios';

// Console log để kiểm tra biến môi trường
console.log("process.env.REACT_APP_BASE_URL", process.env.REACT_APP_BASE_URL);

// Định nghĩa giá trị mặc định
const DEFAULT_API_URL = 'https://tooladsmanagerbe-production-api.up.railway.app';

// Tạo một instance của Axios với baseURL được thiết lập
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || DEFAULT_API_URL, // Sử dụng REACT_APP_BASE_URL nếu có, nếu không thì sử dụng DEFAULT_API_URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
