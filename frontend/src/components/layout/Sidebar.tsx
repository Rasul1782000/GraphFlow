'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
    LayoutDashboard, TrendingUp, Briefcase, Radio,
    Search, BookMarked, Bell, Settings, LogOut, Zap, ArrowRightLeft
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Divider } from 'primereact/divider';

const navItems = [
    {
        group: 'Main', items: [
            { href: '/', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/markets', label: 'Markets', icon: TrendingUp },
            { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
        ]
    },
    {
        group: 'Tools', items: [
            { href: '/signals', label: 'Signals', icon: Radio },
            { href: '/screener', label: 'Screener', icon: Search },
            { href: '/trade', label: 'Exchange', icon: ArrowRightLeft },
        ]
    },
    {
        group: 'Account', items: [
            { href: '/watchlist', label: 'Watchlist', icon: BookMarked },
            { href: '/alerts', label: 'Alerts', icon: Bell },
            { href: '/settings', label: 'Settings', icon: Settings },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuthStore();
    const sidebarRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.nav-group', {
                x: -30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out'
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <aside
            ref={sidebarRef}
            className="hidden lg:flex flex-col w-72 bg-neutral-900 border-r border-neutral-800 h-full relative z-[100]"
        >
            {/* Logo Section */}
            <div className="flex items-center gap-3 px-8 py-8">
                <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
                    <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-black text-white leading-tight tracking-tight">Graph<span className="text-brand">Flow</span></span>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-neutral-500 -mt-1">Pro Terminal</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 overflow-y-auto space-y-8 py-4 scrollbar-hide">
                {navItems.map((group, gIdx) => (
                    <div key={group.group} className="nav-group space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 px-4">
                            {group.group}
                        </label>
                        <div className="space-y-1">
                            {group.items.map(({ href, label, icon: Icon }) => {
                                const active = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={cn(
                                            'group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative overflow-hidden',
                                            active
                                                ? 'bg-brand/5 text-brand border border-brand/20 shadow-[0_0_20px_rgba(99,102,241,0.05)]'
                                                : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white border border-transparent'
                                        )}
                                    >
                                        <div className={cn(
                                            'p-1.5 rounded-lg transition-colors',
                                            active ? 'bg-brand/10' : 'bg-neutral-800/50 group-hover:bg-neutral-700'
                                        )}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        {label}
                                        {active && (
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand rounded-l-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Logout/User Info */}
            <div className="p-6 bg-neutral-950/30 border-t border-neutral-800 m-2 rounded-2xl">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-neutral-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-all group"
                >
                    <div className="p-1.5 bg-neutral-800/50 rounded-lg group-hover:bg-red-500/10 transition-colors">
                        <LogOut className="w-4 h-4" />
                    </div>
                    Sign Out Terminal
                </button>
            </div>
        </aside>
    );
}
