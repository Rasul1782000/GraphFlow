import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
    timeout: 15_000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach Bearer token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken;
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    err => Promise.reject(err)
);

// Response interceptor — auto-refresh on 401
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

apiClient.interceptors.response.use(
    (res: AxiosResponse) => res.data?.data ?? res.data,
    async (error: AxiosError) => {
        const original = error.config as any;
        if (error.response?.status !== 401 || original._retry) {
            return Promise.reject(error);
        }
        original._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }));
        }

        isRefreshing = true;
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
            useAuthStore.getState().logout();
            return Promise.reject(error);
        }

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                { refresh_token: refreshToken }
            );
            const { accessToken, refreshToken: newRefresh } = res.data.data;
            useAuthStore.getState().setTokens(accessToken, newRefresh);
            failedQueue.forEach(p => p.resolve(accessToken));
            failedQueue = [];
            original.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(original);
        } catch (err) {
            failedQueue.forEach(p => p.reject(err));
            failedQueue = [];
            useAuthStore.getState().logout();
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);
