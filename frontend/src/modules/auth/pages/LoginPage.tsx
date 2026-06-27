'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import Link from 'next/link';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h1>Welcome Back</h1>
            <p className="auth-subtitle">Access your trading terminal</p>

            <div className="form-group">
                <label>Identity Email</label>
                <InputText
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="form-input"
                    type="email"
                    required
                />
            </div>

            <div className="form-group">
                <label>Access Key</label>
                <Password
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="form-input"
                    feedback={false}
                    toggleMask
                    required
                />
            </div>

            <div className="form-footer">
                <Link href="/forgot" className="forgot-link">Forgot?</Link>
            </div>

            <Button
                type="submit"
                label="Establish Connection"
                className="submit-btn"
                loading={isLoading}
            />

            <p className="auth-switch">
                New to the terminal?{' '}
                <Link href="/register">Create Identity</Link>
            </p>

            <style jsx>{`
                .auth-form { display: flex; flex-direction: column; gap: 1.25rem; width: 100%; max-width: 380px; }
                h1 { font-size: 1.5rem; color: #0f172a; font-weight: 800; margin: 0; text-align: center; }
                .auth-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; text-align: center; }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group label { font-size: 0.75rem; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.05em; }
                :global(.form-input) { width: 100%; border-radius: 8px !important; }
                .form-footer { display: flex; justify-content: flex-end; }
                .forgot-link { font-size: 0.8rem; color: #3b82f6; text-decoration: none; font-weight: 600; }
                .forgot-link:hover { text-decoration: underline; }
                :global(.submit-btn) { width: 100%; padding: 0.85rem !important; border-radius: 10px !important; font-weight: 700 !important; background: #0f172a !important; border: none !important; }
                .auth-switch { font-size: 0.85rem; color: #64748b; text-align: center; margin: 0; }
                .auth-switch a { color: #3b82f6; text-decoration: none; font-weight: 600; }
                .auth-switch a:hover { text-decoration: underline; }
            `}</style>
        </form>
    );
}
