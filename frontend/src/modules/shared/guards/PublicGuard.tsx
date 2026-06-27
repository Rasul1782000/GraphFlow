'use client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PublicGuardProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export function PublicGuard({ children, redirectTo = '/' }: PublicGuardProps) {
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push(redirectTo);
        }
    }, [user, router, redirectTo]);

    if (user) return null;

    return <>{children}</>;
}
