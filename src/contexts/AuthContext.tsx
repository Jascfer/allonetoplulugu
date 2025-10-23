import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde token kontrolü
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      apiService.setToken(savedToken);
      // Kullanıcı bilgilerini al
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await apiService.request('/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Token geçersizse temizle
      localStorage.removeItem('token');
      setToken(null);
      apiService.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      apiService.setToken(newToken);
      
      localStorage.setItem('token', newToken);
    } catch (error: any) {
      console.error('Login failed:', error);
      // Kullanıcı dostu hata mesajları
      if (error.message.includes('Invalid credentials')) {
        throw new Error('E-posta veya şifre hatalı');
      } else if (error.message.includes('Bağlantı hatası')) {
        throw new Error('İnternet bağlantınızı kontrol edin');
      } else if (error.message.includes('Sunucu hatası')) {
        throw new Error('Sunucu geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin');
      } else {
        throw new Error(error.message || 'Giriş yapılırken bir hata oluştu');
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await apiService.register(name, email, password);
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      apiService.setToken(newToken);
      
      localStorage.setItem('token', newToken);
    } catch (error: any) {
      console.error('Registration failed:', error);
      // Kullanıcı dostu hata mesajları
      if (error.message.includes('User already exists')) {
        throw new Error('Bu e-posta adresi zaten kayıtlı');
      } else if (error.message.includes('Validation failed')) {
        throw new Error('Lütfen tüm alanları doğru şekilde doldurun');
      } else if (error.message.includes('Bağlantı hatası')) {
        throw new Error('İnternet bağlantınızı kontrol edin');
      } else if (error.message.includes('Sunucu hatası')) {
        throw new Error('Sunucu geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin');
      } else {
        throw new Error(error.message || 'Kayıt olurken bir hata oluştu');
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiService.removeToken();
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
