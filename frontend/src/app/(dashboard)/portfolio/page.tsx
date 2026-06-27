'use client';
import { PortfolioPage } from '@/modules/portfolio/pages/PortfolioPage';
import { AuthGuard } from '@/modules/shared/guards/AuthGuard';

export default function PortfolioRoute() {
    return (
        <AuthGuard>
            <PortfolioPage />
        </AuthGuard>
    );
}
