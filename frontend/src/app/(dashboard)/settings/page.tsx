'use client';
import { SettingsPage } from '@/modules/settings/pages/SettingsPage';
import { AuthGuard } from '@/modules/shared/guards/AuthGuard';

export default function SettingsRoute() {
    return (
        <AuthGuard>
            <SettingsPage />
        </AuthGuard>
    );
}
