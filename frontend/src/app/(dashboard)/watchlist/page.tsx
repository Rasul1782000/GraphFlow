'use client';
import { WatchlistPage } from '@/modules/watchlist/pages/WatchlistPage';
import { AuthGuard } from '@/modules/shared/guards/AuthGuard';

export default function WatchlistRoute() {
    return (
        <AuthGuard>
            <WatchlistPage />
        </AuthGuard>
    );
}
