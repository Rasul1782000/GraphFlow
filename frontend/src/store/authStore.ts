import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth';

interface User {
    id: string;
    email: string;
    username: string;
    role: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, full_name: string, password: string) => Promise<void>;
    logout: () => void;
    setTokens: (access: string, refresh: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,

            login: async (email, password) => {
                set({ isLoading: true });
                const res = await authApi.login({ email, password });
                set({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken, isLoading: false });
            },

            register: async (email, username, full_name, password) => {
                set({ isLoading: true });
                const res = await authApi.register({ email, username, full_name, password });
                set({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken, isLoading: false });
            },

            logout: () => {
                set({ user: null, accessToken: null, refreshToken: null });
                authApi.logout().catch(() => { });
            },

            setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
        }),
        {
            name: 'graphflow-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken }),
        }
    )
);
