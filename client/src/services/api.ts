import axios from "axios";
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
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh-token"];
const refreshState = {
  isRedirecting: false,
  refreshPromise: null as Promise<string> | null,
};
async function performTokenRefresh(refreshToken: string): Promise<string> {
  const res = await api.post("/auth/refresh-token", null, {
    headers: { "refresh-token": refreshToken },
  });
  const newAccess = res.headers["access-token"];
  const newRefresh = res.headers["refresh-token"] ?? refreshToken;
  if (!newAccess) throw new Error("No access token in response");
  tokenService.setTokens(newAccess, newRefresh);
  return newAccess;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) =>
      originalRequest.url?.includes(ep),
    );

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      const refreshToken = tokenService.getRefreshToken();

      if (!refreshToken && !refreshState.isRedirecting) {
        refreshState.isRedirecting = true;
        tokenService.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      try {
        if (!refreshState.refreshPromise) {
          refreshState.refreshPromise = performTokenRefresh(
            refreshToken!,
          ).finally(() => {
            refreshState.refreshPromise = null;
          });
        }
        const newAccess = await refreshState.refreshPromise;
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        console.log(err);
        if (!refreshState.isRedirecting) {
          refreshState.isRedirecting = true;
          tokenService.clear();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);
export default api;
