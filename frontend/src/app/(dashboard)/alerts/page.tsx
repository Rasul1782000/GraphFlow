'use client';
import { AlertsPage } from '@/modules/alerts/pages/AlertsPage';
import { AuthGuard } from '@/modules/shared/guards/AuthGuard';

export default function AlertsRoute() {
    return (
        <AuthGuard>
            <AlertsPage />
        </AuthGuard>
    );
}
