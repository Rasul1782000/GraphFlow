'use client';
import { SignalsPage } from '@/modules/signals/pages/SignalsPage';
import { AuthGuard } from '@/modules/shared/guards/AuthGuard';

export default function SignalsRoute() {
    return (
        <AuthGuard>
            <SignalsPage />
        </AuthGuard>
    );
}
