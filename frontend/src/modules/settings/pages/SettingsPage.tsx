'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { TabView, TabPanel } from 'primereact/tabview';

export function SettingsPage() {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState({ username: user?.username || '', email: user?.email || '', full_name: '' });
    const [preferences, setPreferences] = useState({ darkMode: true, notifications: true, emailAlerts: false, soundEnabled: true });
    const [saving, setSaving] = useState(false);

    const handleSaveProfile = async () => { setSaving(true); await new Promise(r => setTimeout(r, 1000)); setSaving(false); };
    const handleSavePreferences = async () => { setSaving(true); await new Promise(r => setTimeout(r, 1000)); setSaving(false); };

    return (
        <div className="settings-page">
            <div className="page-header"><div><h1>Terminal Setup</h1><p className="subtitle">Profile, preferences, and security settings</p></div></div>
            <TabView className="settings-tabs">
                <TabPanel header="Profile">
                    <div className="settings-section">
                        <div className="section-header"><h3>Account Information</h3><p>Manage your account details.</p></div>
                        <div className="form-grid">
                            <div className="form-group"><label>Username</label><InputText value={profile.username} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} className="form-input" /></div>
                            <div className="form-group"><label>Email</label><InputText value={profile.email} className="form-input" disabled /></div>
                            <div className="form-group full-width"><label>Full Name</label><InputText value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} placeholder="Enter your full name" className="form-input" /></div>
                        </div>
                        <Button label="Save Profile" icon="pi pi-check" className="save-btn" loading={saving} onClick={handleSaveProfile} />
                    </div>
                </TabPanel>
                <TabPanel header="Preferences">
                    <div className="settings-section">
                        <div className="section-header"><h3>Display & Notifications</h3><p>Customize your terminal experience.</p></div>
                        <div className="pref-list">
                            {[['Dark Mode', 'darkMode', 'Use dark theme across the terminal'], ['Push Notifications', 'notifications', 'Receive in-app notifications for alerts'], ['Email Alerts', 'emailAlerts', 'Send alert notifications to your email'], ['Sound Effects', 'soundEnabled', 'Play sounds for trade executions']].map(([label, key, desc]) => (
                                <div key={key} className="pref-item"><div className="pref-info"><span className="pref-label">{label}</span><span className="pref-desc">{desc}</span></div><InputSwitch checked={(preferences as any)[key]} onChange={e => setPreferences(p => ({ ...p, [key]: e.value }))} /></div>
                            ))}
                        </div>
                        <Button label="Save Preferences" icon="pi pi-check" className="save-btn" onClick={handleSavePreferences} />
                    </div>
                </TabPanel>
                <TabPanel header="Security">
                    <div className="settings-section">
                        <div className="section-header"><h3>Security Settings</h3><p>Manage your password and security options.</p></div>
                        <div className="form-grid">
                            <div className="form-group"><label>Current Password</label><InputText type="password" placeholder="Enter current password" className="form-input" /></div>
                            <div className="form-group"><label>New Password</label><InputText type="password" placeholder="Enter new password" className="form-input" /></div>
                        </div>
                        <Button label="Update Password" icon="pi pi-lock" className="save-btn" />
                        <div className="danger-zone"><h4>Danger Zone</h4><p>Permanently delete your account and all associated data.</p><Button label="Delete Account" icon="pi pi-trash" className="p-button-danger delete-btn" /></div>
                    </div>
                </TabPanel>
            </TabView>
            <style jsx>{`
                .settings-page { display: flex; flex-direction: column; gap: 1.5rem; }
                .page-header { display: flex; justify-content: space-between; }
                h1 { font-size: 1.75rem; color: #fff; font-weight: 800; margin: 0; }
                .subtitle { color: #555; font-size: 0.85rem; margin: 0.25rem 0 0; }
                :global(.settings-tabs .p-tabview-nav) { background: transparent; border: none; }
                :global(.settings-tabs .p-tabview-panels) { background: transparent; padding: 1.5rem 0; }
                .settings-section { background: #111; border: 1px solid #222; border-radius: 12px; padding: 1.5rem; }
                .section-header { margin-bottom: 1.5rem; }
                .section-header h3 { font-size: 1.1rem; color: #fff; margin: 0 0 0.25rem; }
                .section-header p { font-size: 0.8rem; color: #555; margin: 0; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
                .form-group.full-width { grid-column: 1 / -1; }
                .form-group label { font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.5rem; }
                :global(.form-input) { width: 100%; background: #0d1117 !important; border: 1px solid #222 !important; color: #fff !important; border-radius: 8px !important; padding: 0.75rem !important; }
                .pref-list { display: flex; flex-direction: column; margin-bottom: 1.5rem; }
                .pref-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #222; }
                .pref-item:last-child { border-bottom: none; }
                .pref-label { font-size: 0.9rem; color: #fff; font-weight: 700; }
                .pref-desc { font-size: 0.75rem; color: #555; }
                :global(.save-btn) { background: #007bff !important; border: none !important; border-radius: 8px !important; font-weight: 700 !important; padding: 0.75rem 1.5rem !important; }
                .danger-zone { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #333; }
                .danger-zone h4 { font-size: 0.9rem; color: #dc3545; margin: 0 0 0.5rem; }
                .danger-zone p { font-size: 0.8rem; color: #555; margin: 0 0 1rem; }
                :global(.delete-btn) { border-radius: 8px !important; font-weight: 700 !important; }
            `}</style>
        </div>
    );
}
