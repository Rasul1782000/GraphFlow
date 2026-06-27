'use client';
import { MarketsPage } from '@/modules/markets/pages/MarketsPage';
import { AuthGuard } from '@/modules/shared/guards/AuthGuard';

export default function MarketsRoute() {
    return (
        <AuthGuard>
            <MarketsPage />
        </AuthGuard>
    );
}
