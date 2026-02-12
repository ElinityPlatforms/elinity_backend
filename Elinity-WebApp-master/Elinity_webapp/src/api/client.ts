import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://136.113.118.172';

// Create axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config: any) => {
        const token = sessionStorage.getItem('auth_access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
    (response: any) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = sessionStorage.getItem('auth_refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                        refresh_token: refreshToken,
                    });

                    const { access_token, refresh_token: newRefreshToken } = response.data;

                    sessionStorage.setItem('auth_access_token', access_token);
                    if (newRefreshToken) {
                        sessionStorage.setItem('auth_refresh_token', newRefreshToken);
                    }

                    // Retry original request
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - logout user
                sessionStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
export { BASE_URL };
