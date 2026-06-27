'use client';
import { TradePage } from '@/modules/trade/pages/TradePage';
import { AuthGuard } from '@/modules/shared/guards/AuthGuard';

export default function TradeRoute() {
    return (
        <AuthGuard>
            <TradePage />
        </AuthGuard>
    );
}
