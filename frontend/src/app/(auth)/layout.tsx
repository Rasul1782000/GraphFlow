'use client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const router = useRouter();
    const bannerRef = useRef(null);
    const textRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (user) router.push('/');

        // Premium entrance for the banner
        const ctx = gsap.context(() => {
            gsap.fromTo(bannerRef.current,
                { scale: 1.1, filter: 'grayscale(1) contrast(1.2)' },
                { scale: 1, filter: 'grayscale(0.2) contrast(1.1)', duration: 2.5, ease: 'expo.out' }
            );

            gsap.from('.banner-element', {
                x: 30,
                opacity: 0,
                stagger: 0.15,
                duration: 1.2,
                ease: 'power4.out',
                delay: 0.5
            });

            // Subtle floating animation for the quote box
            gsap.to(overlayRef.current, {
                y: -10,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });
        return () => ctx.revert();
    }, [user, router]);

    if (user) return null;

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FBFCFE] overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Left Column: Focused interaction Area */}
            <div className="w-full lg:w-[48%] xl:w-[42%] flex flex-col p-8 lg:p-14 xl:p-20 relative z-20 bg-white">
                <Link href="/" className="mb-10 inline-flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
                    <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center shadow-xl shadow-black/10">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <span className="text-xl font-black tracking-tight text-black uppercase italic">GraphFlow</span>
                </Link>

                <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-10">
                    {children}
                </div>

                <div className="mt-auto pt-10 flex items-center justify-between border-t border-neutral-50">
                    <span className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.3em]">Institutional Grade Terminal v4.8</span>
                    <div className="flex gap-6 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        <span className="hover:text-black cursor-pointer transition-colors">Privacy</span>
                        <span className="hover:text-black cursor-pointer transition-colors">Legal</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Immersive Visual Experience */}
            <div className="hidden lg:flex lg:w-[52%] xl:w-[58%] relative overflow-hidden bg-neutral-900">
                <div ref={bannerRef} className="absolute inset-0">
                    <Image
                        src="/images/auth-banner.png"
                        alt="Digital Trading Lifestyle"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Multi-layer overlay for depth */}
                    <div className="absolute inset-0 bg-neutral-950/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent opacity-100 lg:w-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                </div>

                {/* Floating UI Elements on the Photo to make it "Proper" */}
                <div className="absolute top-12 right-12 flex gap-4 banner-element">
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Live: Tokyo Market</span>
                    </div>
                    <div className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-full flex items-center gap-2">
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Latency: 12ms</span>
                    </div>
                </div>

                {/* Immersive content overlay */}
                <div ref={overlayRef} className="relative z-10 mt-auto p-16 xl:p-24 w-full">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-4 mb-10 banner-element">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Invesbull.</span>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mt-2">Premium Partner</span>
                            </div>
                        </div>

                        <blockquote className="space-y-8 banner-element">
                            <p className="text-3xl xl:text-4xl font-bold leading-[1.15] tracking-tight text-white/95">
                                "The institutional-grade market terminal for a new period. I particularly use the Real-time updates and alerts, which keep me stay on top of any changes or opportunities."
                            </p>
                            <footer className="flex items-center gap-6">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-white">
                                            TR
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-black bg-brand flex items-center justify-center text-[10px] font-black text-white">+12k</div>
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 border-l border-white/10 pl-6">Active Terminal Holders</span>
                            </footer>
                        </blockquote>
                    </div>
                </div>

                {/* Glass Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-0 bg-[length:100%_2px,3px_100%] opacity-20" />
            </div>
        </div>
    );
}
