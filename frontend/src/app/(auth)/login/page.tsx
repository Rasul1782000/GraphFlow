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

export default function LoginPage() {
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.login-item', {
                y: 15,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });

            gsap.from('.social-btn', {
                scale: 0.9,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: 'back.out(1.7)',
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Access Granted. Entering Terminal...');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Access Denied. Check your credentials.');
        }
    };

    const inputClass = "w-full bg-[#F3F4F6] border-none rounded-2xl px-5 py-4 text-neutral-900 focus:ring-2 focus:ring-black/5 transition-all text-sm font-semibold placeholder:text-neutral-400";

    return (
        <div ref={containerRef} className="space-y-10 selection:bg-black selection:text-white">
            <div className="space-y-4 login-item">
                <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tighter leading-none">
                    Hello, <span className="text-neutral-400 block mt-2 font-black">Welcome Back!</span>
                </h1>
                <p className="text-sm text-neutral-500 font-bold leading-relaxed max-w-[320px] uppercase tracking-wider opacity-60">
                    Authenticate to manage your assets and execute trades in the terminal.
                </p>
            </div>

            {/* Premium Social Logins */}
            <div className="grid grid-cols-2 gap-4">
                <button className="social-btn flex items-center justify-center gap-3 h-14 border border-neutral-100 rounded-2xl hover:bg-neutral-50 hover:shadow-xl hover:shadow-black/5 transition-all group">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.191 2.69 1.145 6.655L5.266 9.765z" />
                        <path fill="#34A853" d="M16.04 18.013c-1.09.513-2.31.813-3.64.813-2.454 0-4.636-1.418-5.694-3.5L2.51 18.423c2.046 3.965 6.128 6.655 10.855 6.655 3.055 0 5.89-1.09 8-2.909l-4.227-3.055c-.273.273-.59.545-.909.727z" />
                        <path fill="#4A90E2" d="M19.834 22.109c3.055-2.727 4.909-6.727 4.909-11.455 0-.727-.082-1.455-.273-2.182H12v4.818h7.273c-.364 2.182-1.636 4-3.454 5.273l4.015 3.546z" />
                        <path fill="#FBBC05" d="M1.145 17.345 5.266 14.235c-.273-.636-.454-1.364-.454-2.182 0-.818.181-1.546.454-2.182L1.145 6.655C0.454 8.273 0 10.091 0 12c0 1.909.454 3.727 1.145 5.345z" />
                    </svg>
                    <span className="text-xs font-black text-neutral-800 uppercase tracking-widest">Google</span>
                </button>
                <button className="social-btn flex items-center justify-center gap-3 h-14 bg-black rounded-2xl hover:bg-neutral-800 hover:shadow-2xl hover:shadow-black/20 transition-all group">
                    <svg className="w-5 h-5 text-white fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.96.95-2.26 1.72-3.83 1.72-2.12 0-3.66-1.18-4.71-2.9C7.45 17.3 6.9 14.6 6.9 12.3c0-2.36.56-4.66 1.6-6.38C9.53 4.2 11.08 3 13.2 3c1.57 0 2.87.77 3.83 1.72l-.1.1c-.8.8-1.55 1.73-2.15 2.88-.63 1.22-1.02 2.65-1.02 4.3 0 1.65.4 3.08 1.02 4.3.6 1.15 1.35 2.08 2.15 2.88l.05.05.07.05z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM12 21.6c-5.302 0-9.6-4.298-9.6-9.6s4.298-9.6 9.6-9.6 9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6z" />
                    </svg>
                    <span className="text-xs font-black text-white uppercase tracking-widest">Apple</span>
                </button>
            </div>

            <div className="login-item flex items-center gap-4">
                <div className="h-[1px] bg-neutral-100 flex-1" />
                <span className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.3em] bg-white px-2">OR ACCOUNT</span>
                <div className="h-[1px] bg-neutral-100 flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 login-item">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1">Email Terminal Address</label>
                    <InputText
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        placeholder="institutional@domain.com"
                    />
                </div>

                <div className="space-y-2 relative group">
                    <div className="flex justify-between items-center px-1 mb-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Security Key</label>
                        <Link href="/forgot" className="text-[10px] font-black text-black/40 hover:text-black transition-colors uppercase tracking-widest">Password Reset?</Link>
                    </div>
                    <Password
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                        inputClassName={inputClass}
                        placeholder="Enter secure password"
                        toggleMask
                        feedback={false}
                    />
                </div>

                <Button
                    loading={isLoading}
                    label="LOGIN TO TERMINAL"
                    className="w-full h-16 bg-black border-none text-white font-black tracking-[0.4em] rounded-2xl hover:bg-neutral-800 transition-all shadow-2xl shadow-black/20 mt-4 active:scale-95"
                    type="submit"
                />
            </form>

            <div className="text-center pt-8 login-item">
                <p className="text-[11px] text-neutral-400 font-black uppercase tracking-widest">
                    No Terminal Access? {' '}
                    <Link href="/register" className="text-black border-b-2 border-black/5 hover:border-black transition-all ml-1 pb-1">Register for Free</Link>
                </p>
            </div>
        </div>
    );
}
