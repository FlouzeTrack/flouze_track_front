import axios from "axios";

interface ImportMetaEnv {
  VITE_API_AUTH_URL: string;
  VITE_API_BASE_URL: string;
}

const createAPI = (isAuthService = false) => {
  const instance = axios.create({
    baseURL:
      (import.meta as any).env[
        isAuthService ? "VITE_API_AUTH_URL" : "VITE_API_BASE_URL"
      ] || "http://localhost:4010/api/v1",
    withCredentials: true,
  });

  let isRefreshing = false;
  let refreshSubscribers: ((token: string) => void)[] = [];

  const TokenService = {
    getToken: () => localStorage.getItem("token"),
    getRefreshToken: () => localStorage.getItem("refreshToken"),
    setToken: (token: string) => localStorage.setItem("token", token),
    removeToken: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  };

  const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
  };

  const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
  };

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (originalRequest.url?.includes("/auth/signin")) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve) => {
            addRefreshSubscriber((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            });
          });
        }

        isRefreshing = true;

        try {
          const refreshToken = TokenService.getRefreshToken();
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const authUrl =
          (import.meta as any).env.VITE_API_AUTH_URL || "http://localhost:4010/api/v1";
          const { data } = await axios.post(
            `${authUrl}/auth/refresh`,
            {},
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const { accessToken } = data;
          TokenService.setToken(accessToken);

          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          onRefreshed(accessToken);

          isRefreshing = false;

          return instance(originalRequest);
        } catch (err) {
          console.error("Token refresh failed:", err);
          TokenService.removeToken();
          isRefreshing = false;
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const API = createAPI();
export const AuthAPI = createAPI(true);

export default API;
