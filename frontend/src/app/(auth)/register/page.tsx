'use client';
import { RegisterPage } from '@/modules/auth/pages/RegisterPage';
import { PublicGuard } from '@/modules/shared/guards/PublicGuard';

export default function RegisterRoute() {
    return (
        <PublicGuard>
            <RegisterPage />
        </PublicGuard>
    );
}
