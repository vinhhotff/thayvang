"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { login as apiLogin, logout as apiLogout } from "@/lib/api/auth";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    user: {
      _id: string;
      name: string;
      email: string;
    };
  };
  timestamp: string;
}

interface RefreshResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken?: string;
  };
  timestamp: string;
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResponse | null>;
  logout: () => Promise<void>;
  refresh: () => Promise<RefreshResponse | null>;
  isAuthenticated: () => boolean; // <-- thêm dòng này
}

const AuthContext = createContext<AuthContextType | null>(null);

const getCookie = (name: string) => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Load user từ localStorage khi mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse | null> => {
    try {
      const res = await apiLogin(email, password);

      if (res.statusCode === 201 && res.data?.user) {
        const userData = res.data.user;
        const accessToken = res.data.accessToken;

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        document.cookie = `accessToken=${accessToken}; path=/;`;

        toast.success(res.message || "Login successful!");
        router.push("/products");
        return res;
      } else {
        toast.error(res.message || "Login failed");
        return null;
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
      return null;
    }
  };

  const logout = async () => {
    try {
      await apiLogout(); // Đảm bảo apiLogout gửi withCredentials: true
      // Gọi lại API logout để server xóa cookie httpOnly
    } catch {}
    setUser(null);
    localStorage.removeItem("user");
    // Xóa cookie phía client (nếu còn)
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Thử reload lại trang để đảm bảo cookie bị xóa hoàn toàn
    toast.info("Logged out");
    router.push("/");
    window.location.reload(); // Thêm reload để xóa cookie hoàn toàn
  };

  const refresh = async (): Promise<RefreshResponse | null> => {
    try {
      const refreshToken = getCookie("refreshToken");
      if (!refreshToken) {
        toast.error("No refresh token available.");
        return null;
      }

      const res = await axios.get<RefreshResponse>(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        headers: { Cookie: `refreshToken=${refreshToken}` },
        withCredentials: true,
      });

      if (res.data.statusCode === 200 || res.data.statusCode === 201) {
        if (res.data.data.accessToken)
          document.cookie = `accessToken=${res.data.data.accessToken}; path=/;`;

        if (res.data.data.refreshToken)
          document.cookie = `refreshToken=${res.data.data.refreshToken}; path=/;`;

        toast.success(res.data.message || "Token refreshed successfully!");
        return res.data;
      } else {
        toast.error(res.data.message || "Token refresh failed");
        setUser(null);
        localStorage.removeItem("user");
        router.push("/");
        return null;
      }
    } catch {
      toast.error("Failed to refresh token. Please login again.");
      setUser(null);
      localStorage.removeItem("user");
      router.push("/");
      return null;
    }
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, refresh, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
