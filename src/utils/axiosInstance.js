import axios from 'axios';

// Load environment variables from .env file
// require('dotenv').config();
console.log("process.env.REACT_APP_BASE_URL", process.env.REACT_APP_BASE_URL);
const axiosInstance = axios.create({
  
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;