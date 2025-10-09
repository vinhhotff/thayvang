import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Helper to get a cookie value by name
const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

// 🧩 Request interceptor — add token to header from cookie
apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor — handle data unwrapping and token refresh
apiClient.interceptors.response.use(
  (response) => {
    // The existing logic for unwrapping successful responses
    const res = response.data;
    if (res?.data?.data) {
      return res.data;
    }
    if (res?.data) {
      return res.data;
    }
    return res;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request to prevent infinite loops

      try {
        // Attempt to refresh the token
        const refreshResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            withCredentials: true, // Ensures the refreshToken cookie is sent
          }
        );

        const { accessToken } = refreshResponse.data.data;

        // Update the accessToken cookie
        document.cookie = `accessToken=${accessToken}; path=/`;

        // Update the Authorization header for the original request
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        // Retry the original request with the new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear all auth data and redirect to login
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('user');
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }

        return Promise.reject(refreshError);
      }
    }

    // For all other errors, extract a meaningful message and reject
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;