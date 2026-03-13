/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";
import { useCallback, useMemo } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Simple JWT payload decoder (no verification)
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = decodeJwt(token);
    if (!decoded) return null;

    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }

    return {
      email: decoded.sub,
      role: decoded.role || "ROLE_USER",
      userId: decoded.userId,
    };
  });
  const [loading] = useState(false);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, role } = response.data;

      localStorage.setItem("token", token);

      const decoded = decodeJwt(token);
      const userData = {
        email,
        role: role || decoded?.role || "ROLE_USER",
        userId: decoded?.userId,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error || "Invalid credentials";
      toast.error(message);
      return false;
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      toast.success(
        response.data?.message || "Registration successful! Please login.",
      );
      return true;
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.error || "Registration failed. Please try again.";
      toast.error(message);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Logged out");
  }, []);

  const contextValue = useMemo(
    () => ({ user, login, register, logout, loading }),
    [user, login, register, logout, loading],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
