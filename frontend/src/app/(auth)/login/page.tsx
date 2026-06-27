'use client';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { PublicGuard } from '@/modules/shared/guards/PublicGuard';

export default function LoginRoute() {
    return (
        <PublicGuard>
            <LoginPage />
        </PublicGuard>
    );
}
