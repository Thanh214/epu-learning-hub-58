import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa khi tải trang
    const loadUserFromStorage = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Thiết lập token cho các request tiếp theo
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Set user từ localStorage
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error loading user from storage:', error);
          // Nếu có lỗi, xóa dữ liệu lưu trong localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setIsLoading(false);
    };
    
    loadUserFromStorage();
  }, []);
  
  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Thiết lập token cho các request tiếp theo
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Xóa token khỏi header
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
  };
  
  const updateUser = (userData: User) => {
    // Cập nhật user trong local storage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Cập nhật state
    setUser(userData);
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 