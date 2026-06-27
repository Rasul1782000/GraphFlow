'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

import { BrandLogo } from '@/components/ui/BrandLogo';

export function MobileNav({ open, setOpen }: { open: boolean, setOpen: (o: boolean) => void }) {
    const pathname = usePathname();

    const items = [
        { href: '/', label: 'Dashboard', icon: 'pi pi-home' },
        { href: '/markets', label: 'Markets', icon: 'pi pi-chart-line' },
        { href: '/portfolio', label: 'Portfolio', icon: 'pi pi-briefcase' },
        { href: '/signals', label: 'Signals', icon: 'pi pi-bolt' },
        { href: '/screener', label: 'Screener', icon: 'pi pi-search' },
        { href: '/settings', label: 'Settings', icon: 'pi pi-cog' },
    ];

    if (!open) return null;

    return (
        <div className="mobile-nav-overlay" onClick={() => setOpen(false)}>
            <nav className="mobile-nav-menu" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-nav-header">
                    <BrandLogo size={32} />
                    <button className="close-btn" onClick={() => setOpen(false)}>
                        <i className="pi pi-times" />
                    </button>
                </div>

                <div className="mobile-nav-items">
                    {items.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn('mobile-nav-item', active && 'active')}
                            >
                                <i className={cn(item.icon, 'nav-icon')} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <style jsx>{`
                .mobile-nav-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 200;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(4px);
                    display: flex;
                    justify-content: flex-start;
                }
                .mobile-nav-menu {
                    width: 300px;
                    background: #111;
                    height: 100%;
                    border-right: 1px solid #222;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                }
                .mobile-nav-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 3rem;
                }
                .logo { font-size: 1.5rem; font-weight: 800; color: #fff; }
                .accent { color: #007bff; }
                .close-btn {
                    background: #1a1a1a;
                    border: none;
                    color: #fff;
                    padding: 0.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                }
                
                .mobile-nav-items { display: flex; flex-direction: column; gap: 0.5rem; }
                .mobile-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    border-radius: 12px;
                    color: #999;
                    text-decoration: none;
                    font-weight: 600;
                    transition: 0.2s;
                }
                .mobile-nav-item:hover { background: #1a1a1a; color: #fff; }
                .mobile-nav-item.active { background: rgba(0, 123, 255, 0.1); color: #007bff; }
                .nav-icon { font-size: 1.1rem; }
            `}</style>
        </div>
    );
}
