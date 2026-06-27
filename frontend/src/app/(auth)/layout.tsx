'use client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (user) router.push('/');
    }, [user, router]);

    if (user) return null;

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                    <BrandLogo vertical size={80} color="#0f172a" />
                </div>
                {children}
            </div>
        </div>
    );
}
