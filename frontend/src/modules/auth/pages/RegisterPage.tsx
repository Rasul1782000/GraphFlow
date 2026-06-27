'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import Link from 'next/link';

export function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [full_name, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register, isLoading } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await register(email, username, full_name, password);
        } catch (err) {
            console.error('Registration failed', err);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h1>New Identity</h1>
            <p className="auth-subtitle">Initialize your trading terminal</p>

            {error && <div className="error-msg">{error}</div>}

            <div className="form-group">
                <label>Full Name</label>
                <InputText
                    value={full_name}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="form-input"
                    required
                />
            </div>

            <div className="form-group">
                <label>User Identity</label>
                <InputText
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="form-input"
                    required
                />
            </div>

            <div className="form-group">
                <label>Terminal Email</label>
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
                    placeholder="Create a password"
                    className="form-input"
                    toggleMask
                    required
                />
            </div>

            <div className="form-group">
                <label>Confirm Key</label>
                <Password
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="form-input"
                    feedback={false}
                    toggleMask
                    required
                />
            </div>

            <Button
                type="submit"
                label="Initialize Terminal"
                className="submit-btn"
                loading={isLoading}
            />

            <p className="auth-switch">
                Already have an identity?{' '}
                <Link href="/login">Connect Now</Link>
            </p>

            <style jsx>{`
                .auth-form { display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 380px; }
                h1 { font-size: 1.5rem; color: #0f172a; font-weight: 800; margin: 0; text-align: center; }
                .auth-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; text-align: center; }
                .error-msg { background: #fef2f2; color: #dc2626; padding: 0.75rem; border-radius: 8px; font-size: 0.85rem; text-align: center; }
                .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
                .form-group label { font-size: 0.7rem; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.05em; }
                :global(.form-input) { width: 100%; border-radius: 8px !important; }
                :global(.submit-btn) { width: 100%; padding: 0.85rem !important; border-radius: 10px !important; font-weight: 700 !important; background: #0f172a !important; border: none !important; }
                .auth-switch { font-size: 0.85rem; color: #64748b; text-align: center; margin: 0; }
                .auth-switch a { color: #3b82f6; text-decoration: none; font-weight: 600; }
                .auth-switch a:hover { text-decoration: underline; }
            `}</style>
        </form>
    );
}
