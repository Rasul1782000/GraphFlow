'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { toast } from 'sonner';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import gsap from 'gsap';

export default function RegisterPage() {
    const { register, isLoading } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        full_name: '',
        password: '',
        confirm: '',
    });

    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.register-item', {
                y: 15,
                opacity: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power3.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirm) {
            return toast.error('Passwords do not match');
        }
        try {
            await register(formData.email, formData.username, formData.full_name, formData.password);
            toast.success('Terminal account created. Verification sent.');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed. Check your data.');
        }
    };

    const inputClass = "w-full bg-neutral-50 border-neutral-100 rounded-xl px-4 py-3 text-neutral-900 focus:ring-2 focus:ring-neutral-200 transition-all text-sm font-medium";

    return (
        <div ref={containerRef} className="space-y-6 animate-fade-in py-4">
            <div className="space-y-2 register-item">
                <h1 className="text-3xl font-black text-neutral-900 tracking-tighter leading-none">
                    Create, <span className="text-neutral-900/60 font-bold block mt-1">Terminal Profile</span>
                </h1>
                <p className="text-sm text-neutral-500 font-medium leading-relaxed max-w-[280px]">
                    Join the most advanced market terminal platform today.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 register-item">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Full Name</label>
                        <InputText
                            required
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className={inputClass}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Username</label>
                        <InputText
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className={inputClass}
                            placeholder="johndoe"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Email</label>
                    <InputText
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={inputClass}
                        placeholder="john@example.com"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Password</label>
                    <Password
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full"
                        inputClassName={inputClass}
                        placeholder="Choose a strong password"
                        toggleMask
                        feedback={true}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Confirm Password</label>
                    <InputText
                        type="password"
                        required
                        value={formData.confirm}
                        onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                        className={inputClass}
                        placeholder="Must match password"
                    />
                </div>

                <Button
                    loading={isLoading}
                    label="CREATE TERMINAL ACCOUNT"
                    className="w-full h-14 bg-black border-none text-white font-black tracking-[0.2em] rounded-xl hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 mt-6"
                    type="submit"
                />
            </form>

            <div className="text-center register-item">
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">
                    By signing up, you agree to our <br />
                    <span className="text-neutral-900 border-b border-black font-black">Institutional Data Terms</span>
                </p>
                <p className="mt-4 text-xs text-neutral-500 font-bold uppercase tracking-widest">
                    Already an account? {' '}
                    <Link href="/login" className="text-neutral-900 border-b border-black font-black hover:text-neutral-600 transition-colors pb-0.5">Login Back</Link>
                </p>
            </div>
        </div>
    );
}
