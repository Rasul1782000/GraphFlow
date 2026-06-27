'use client';
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';
import { AuthGuard } from '@/modules/shared/guards/AuthGuard';

export default function DashboardAltRoute() {
    return (
        <AuthGuard>
            <DashboardPage />
        </AuthGuard>
    );
}
