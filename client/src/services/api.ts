import axios from "axios";
import { useNavigate } from "react-router-dom";
import { tokenService } from "./tokenService";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const navigate = useNavigate();
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        tokenService.clear();
        navigate("/login");
        return Promise.reject(error);
      }
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          null,
          { headers: { "refresh-token": refreshToken } }
        );
        const newAccess = res.headers["access-token"];
        const newRefresh = res.headers["refresh-token"] ?? refreshToken;
        if (newAccess) {
          tokenService.setTokens(newAccess, newRefresh);
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.log(err);
        tokenService.clear();
        navigate("/login");
      }
    }

    return Promise.reject(error);
  }
);
export default api;
