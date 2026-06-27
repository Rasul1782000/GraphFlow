'use client';
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';
import { AuthGuard } from '@/modules/shared/guards/AuthGuard';

export default function DashboardRoute() {
    return (
        <AuthGuard>
            <DashboardPage />
        </AuthGuard>
    );
}
