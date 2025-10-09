import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export interface AuthResponse {
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
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await axios.post<AuthResponse>(
      `${API_URL}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    console.log("Login Response:", res.data); // Log phản hồi thành công
    return res.data;
  } catch (error) {
    console.error("Login Error:", error); // Log lỗi chi tiết
    throw error; // Ném lỗi để `Login.tsx` xử lý
  }
};
export const register = async (name: string, email: string, password: string) => {
  const res = await axios.post(`${API_URL}/auth/register`, { name, email, password }, { withCredentials: true });
  return res.data;
};

export const logout = async () => {
  await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  return true;
};
