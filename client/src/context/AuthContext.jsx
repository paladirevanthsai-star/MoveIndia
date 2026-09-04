import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const API = "/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const storedToken = localStorage.getItem("tp_token");
      const headers = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};
      const res = await axios.get(`${API}/auth/me`, {
        withCredentials: true,
        headers
      });
      if (res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (res.data?.token) {
        localStorage.setItem("tp_token", res.data.token);
      }
      setUser(res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}! (${res.data.user.role.toUpperCase()})`);
      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail || "Login failed";
      toast.error(typeof detail === "string" ? detail : "Login failed");
      return { success: false, error: detail };
    }
  };

  const demoLogin = async (role, pin = null) => {
    try {
      const res = await axios.post(
        `${API}/auth/demo-login`,
        { role, pin },
        { withCredentials: true }
      );
      if (res.data?.token) {
        localStorage.setItem("tp_token", res.data.token);
      }
      setUser(res.data.user);
      toast.success(`Switched to: ${role.toUpperCase()} (${res.data.user.name})`);
      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail || "Demo login failed";
      toast.error(typeof detail === "string" ? detail : "Demo login failed");
      return { success: false, error: detail, requiresPin: err.response?.data?.requiresPin };
    }
  };

  const verifyAdminPin = async (pin) => {
    try {
      const res = await axios.post(`${API}/auth/verify-admin-pin`, { pin }, { withCredentials: true });
      if (res.data?.token) {
        localStorage.setItem("tp_token", res.data.token);
      }
      setUser(res.data.user);
      toast.success("Admin Authority Priority Unlocked!");
      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail || "Invalid Admin Security PIN";
      toast.error(detail);
      return { success: false, error: detail };
    }
  };

  const verifyOperatorPin = async (pin) => {
    try {
      const res = await axios.post(`${API}/auth/verify-operator-pin`, { pin }, { withCredentials: true });
      if (res.data?.token) {
        localStorage.setItem("tp_token", res.data.token);
      }
      setUser(res.data.user);
      toast.success("Driver & Operator Command Deck Unlocked!");
      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail || "Invalid Operator Badge PIN";
      toast.error(detail);
      return { success: false, error: detail };
    }
  };

  const register = async (name, email, password, phone, role = "passenger") => {
    try {
      const res = await axios.post(
        `${API}/auth/register`,
        { name, email, password, phone, role },
        { withCredentials: true }
      );
      if (res.data?.token) {
        localStorage.setItem("tp_token", res.data.token);
      }
      setUser(res.data.user);
      toast.success(`Account created successfully as ${role.toUpperCase()}!`);
      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail || "Registration failed";
      toast.error(typeof detail === "string" ? detail : "Registration failed");
      return { success: false, error: detail };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem("tp_token");
      setUser(null);
      toast.info("Logged out successfully");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        demoLogin,
        verifyAdminPin,
        verifyOperatorPin,
        register,
        logout,
        fetchCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
