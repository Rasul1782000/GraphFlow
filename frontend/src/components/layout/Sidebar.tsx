'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/store/authStore';

const navItems = [
    {
        group: 'Strategic Terminal', items: [
            { href: '/', label: 'Overview', icon: 'pi pi-compass' },
            { href: '/markets', label: 'Market Pulse', icon: 'pi pi-chart-line' },
            { href: '/portfolio', label: 'Assets', icon: 'pi pi-briefcase' },
        ]
    },
    {
        group: 'Intelligence', items: [
            { href: '/signals', label: 'Live Alpha', icon: 'pi pi-bolt' },
            { href: '/screener', label: 'Discovery', icon: 'pi pi-search' },
            { href: '/trade', label: 'Execution', icon: 'pi pi-directions' },
        ]
    },
    {
        group: 'Operations', items: [
            { href: '/watchlist', label: 'Focus List', icon: 'pi pi-bookmark' },
            { href: '/alerts', label: 'Notifications', icon: 'pi pi-bell' },
            { href: '/settings', label: 'Terminal Setup', icon: 'pi pi-cog' },
        ]
    }
];

import { BrandLogo } from '@/components/ui/BrandLogo';

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuthStore();

    return (
        <aside className="sidebar-container">
            <div className="sidebar-brand">
                <BrandLogo size={36} />
            </div>

            <nav className="sidebar-nav">
                {navItems.map((group) => (
                    <div key={group.group} className="nav-group">
                        <label className="nav-group-label">{group.group}</label>
                        <div className="nav-menu">
                            {group.items.map(({ href, label, icon }) => {
                                const active = pathname === href;
                                return (
                                    <Link key={href} href={href} className={cn('nav-item', active && 'active')}>
                                        <div className="icon-box">
                                            <i className={cn(icon, 'nav-icon')} />
                                        </div>
                                        <span className="nav-label">{label}</span>
                                        {active && <div className="active-glow" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="logout-action">
                    <i className="pi pi-power-off" />
                    <span>Terminate Session</span>
                </button>
            </div>

            <style jsx>{`
                .sidebar-container {
                    width: 290px;
                    height: 100vh;
                    background: #0d1117;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid rgba(255,255,255,0.05);
                    position: relative;
                    z-index: 100;
                }
                .sidebar-brand {
                    padding: 2.5rem 2rem;
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }
                .brand-logo {
                    width: 44px;
                    height: 44px;
                    background: var(--brand);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    font-size: 1.5rem;
                    color: #fff;
                    box-shadow: 0 0 20px rgba(0, 123, 255, 0.4);
                }
                .brand-name {
                    display: flex;
                    flex-direction: column;
                }
                .name-main { font-weight: 900; font-size: 1.35rem; color: #fff; letter-spacing: -0.05em; }
                .name-accent { color: var(--brand); }
                .name-sub { font-size: 0.65rem; color: #475569; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; margin-top: -2px; }
                
                .sidebar-nav {
                    flex: 1;
                    padding: 1rem 1.5rem;
                    overflow-y: auto;
                }
                .nav-group { margin-bottom: 2.5rem; }
                .nav-group-label {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    color: #475569;
                    font-weight: 900;
                    letter-spacing: 0.15em;
                    padding-left: 1rem;
                    margin-bottom: 0.75rem;
                    display: block;
                }
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.875rem 1.25rem;
                    border-radius: 14px;
                    color: #94a3b8;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 0.95rem;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    margin-bottom: 0.25rem;
                }
                .nav-item:hover { background: rgba(255,255,255,0.03); color: #fff; }
                .nav-item.active { background: rgba(0, 123, 255, 0.08); color: var(--brand); }
                
                .icon-box {
                    width: 24px;
                    display: flex;
                    justify-content: center;
                    font-size: 1.1rem;
                }
                .active-glow {
                    position: absolute;
                    right: 0;
                    width: 4px;
                    height: 20px;
                    background: var(--brand);
                    border-radius: 4px 0 0 4px;
                    box-shadow: 0 0 15px var(--brand);
                }
                
                .sidebar-footer { padding: 1.5rem; border-top: 1px solid rgba(255,255,255,0.03); }
                .logout-action {
                    width: 100%;
                    background: rgba(239, 68, 68, 0.05);
                    border: 1px solid rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    padding: 1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    font-size: 0.9rem;
                    font-weight: 800;
                    border-radius: 14px;
                    transition: 0.2s;
                    text-transform: uppercase;
                    letter-spacing: 0.02em;
                }
                .logout-action:hover { background: #ef4444; color: #fff; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
            `}</style>
        </aside>
    );
}
