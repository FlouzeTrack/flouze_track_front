import axios from "axios";

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
    setToken: (token: string) => localStorage.setItem("token", token),
    removeToken: () => localStorage.removeItem("token"),
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
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
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
          const { data } = await axios.post(
            `${instance.defaults.baseURL}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const { accessToken } = data;
          TokenService.setToken(accessToken);

          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          onRefreshed(accessToken);

          isRefreshing = false;

          return instance(originalRequest);
        } catch (err: any) {
          console.error("Token refresh failed:", err.message);

          TokenService.removeToken();
          isRefreshing = false;

          await new Promise((resolve) => setTimeout(resolve, 25000));
          window.location.href = "/login";
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
