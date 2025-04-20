import axios from 'axios';

// Tạo instance Axios với cấu hình cơ bản
const api = axios.create({
  // Sử dụng URL tương đối để tận dụng proxy Vite
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Log cấu hình API cho mục đích debugging
console.log('API baseURL:', api.defaults.baseURL);

// Thêm interceptor cho request
api.interceptors.request.use(
  (config) => {
    console.log('Sending request to:', config.url, 'with data:', config.data);
    
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    // Thêm token vào header nếu có
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Thêm interceptor cho response
api.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url, 'status:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Status code:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    return Promise.reject(error);
  }
);

// API Authentication
export const authAPI = {
  // Đăng ký tài khoản
  register: (userData: { full_name: string; email: string; password: string; password_confirm: string }) => {
    return api.post('/auth/register', userData);
  },
  
  // Đăng nhập
  login: (credentials: { email: string; password: string }) => {
    return api.post('/auth/login', credentials);
  },
  
  // Lấy thông tin người dùng hiện tại
  getCurrentUser: () => {
    return api.get('/auth/me');
  },
  
  // Kiểm tra trạng thái database
  checkDatabaseStatus: () => {
    return api.get('/auth/db-status');
  }
};

export default api;
