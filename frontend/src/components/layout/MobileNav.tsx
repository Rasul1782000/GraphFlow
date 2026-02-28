'use client';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, TrendingUp, Briefcase, Radio, Search, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function MobileNav({ open, setOpen }: { open: boolean, setOpen: (o: boolean) => void }) {
    const pathname = usePathname();
    const navRef = useRef(null);

    useEffect(() => {
        if (navRef.current) {
            if (open) {
                gsap.to(navRef.current, { x: 0, duration: 0.5, ease: 'power4.out' });
            } else {
                gsap.to(navRef.current, { x: '-100%', duration: 0.5, ease: 'power4.in' });
            }
        }
    }, [open]);

    const items = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/markets', label: 'Markets', icon: TrendingUp },
        { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
        { href: '/signals', label: 'Signals', icon: Radio },
        { href: '/screener', label: 'Screener', icon: Search },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div
            className={cn(
                "fixed inset-0 z-[200] lg:hidden transition-opacity duration-300",
                open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />

            <nav
                ref={navRef}
                className="absolute top-0 left-0 bottom-0 w-80 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col transform -translate-x-full"
            >
                <div className="flex items-center justify-between mb-8">
                    <span className="text-2xl font-black text-white">Graph<span className="text-brand">Flow</span></span>
                    <button onClick={() => setOpen(false)} className="p-2 bg-neutral-800 rounded-lg text-neutral-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-2">
                    {items.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all",
                                    active ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-neutral-400 hover:bg-neutral-800"
                                )}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
