import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Simple JWT payload decoder (no verification)
function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded) {
        // Check if token is expired
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } else {
          setUser({
            email: decoded.sub,
            role: decoded.role || 'ROLE_USER',
            userId: decoded.userId,
          });
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, role } = response.data;
      
      localStorage.setItem('token', token);
      
      const decoded = decodeJwt(token);
      const userData = { 
        email, 
        role: role || decoded?.role || 'ROLE_USER', 
        userId: decoded?.userId 
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error || 'Invalid credentials';
      toast.error(message);
      return false;
    }
  };
  
  const register = async (userData) => {
      try {
          const response = await api.post('/auth/register', userData);
          toast.success(response.data?.message || 'Registration successful! Please login.');
          return true;
      } catch (error) {
          console.error(error);
          const message = error.response?.data?.error || 'Registration failed. Please try again.';
          toast.error(message);
          return false;
      }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
