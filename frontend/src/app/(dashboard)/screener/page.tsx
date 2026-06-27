'use client';
import { ScreenerPage } from '@/modules/screener/pages/ScreenerPage';
import { AuthGuard } from '@/modules/shared/guards/AuthGuard';

export default function ScreenerRoute() {
    return (
        <AuthGuard>
            <ScreenerPage />
        </AuthGuard>
    );
}
