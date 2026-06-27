'use client';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { useRef, useState, useEffect } from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function Navbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
    const { user, logout } = useAuthStore();
    const menuRef = useRef<any>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { label: 'Profile Settings', icon: 'pi pi-user-edit' },
        { label: 'API Configurations', icon: 'pi pi-key' },
        { label: 'System Preferences', icon: 'pi pi-sliders-h' },
        { separator: true },
        {
            label: 'Terminate Session',
            icon: 'pi pi-power-off',
            command: () => logout(),
            className: 'logout-menu-item'
        }
    ];

    return (
        <nav className={`navbar-container ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-left">
                <Button
                    icon="pi pi-bars"
                    className="p-button-text p-button-rounded mobile-menu-btn"
                    onClick={onOpenMobileNav}
                />
                <div className="mobile-logo-wrap">
                    <BrandLogo size={28} showText={false} />
                </div>
                <div className="search-terminal">
                    <div className="terminal-icon">⌘K</div>
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-search" />
                        <InputText
                            placeholder="Terminal Execution Search..."
                            className="search-input"
                        />
                    </span>
                </div>
            </div>

            <div className="navbar-right">
                <div className="system-status">
                    <span className="status-dot green"></span>
                    <span className="status-label">Network Stable</span>
                </div>

                <Button
                    icon="pi pi-bell"
                    className="p-button-rounded p-button-text notify-action"
                    badge="12"
                    badgeClassName="p-badge-danger"
                />

                <div className="vertical-divider"></div>

                <div
                    className="identity-orb"
                    onClick={(e) => menuRef.current?.toggle(e)}
                >
                    <div className="identity-text">
                        <span className="identity-name">{user?.username || 'Trader_01'}</span>
                        <span className="identity-role">Level 3 Authorized</span>
                    </div>
                    <div className="avatar-shield">
                        <Avatar
                            label={user?.username?.[0]?.toUpperCase() || 'U'}
                            shape="circle"
                            className="terminal-avatar"
                        />
                    </div>
                    <Menu model={menuItems} popup ref={menuRef} className="premium-menu" />
                </div>
            </div>

            <style jsx>{`
                .navbar-container {
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2.5rem;
                    background: #05070a;
                    border-bottom: 1px solid rgba(255,255,255,0.03);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .navbar-container.scrolled {
                    height: 64px;
                    background: rgba(5, 7, 10, 0.95);
                    backdrop-filter: blur(16px);
                    border-bottom-color: rgba(255,255,255,0.08);
                }
                
                .navbar-left, .navbar-right {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }
                
                .mobile-menu-btn { display: none; color: #94a3b8 !important; }
                .mobile-logo-wrap { display: none; }

                @media (max-width: 1024px) { 
                    .mobile-menu-btn { display: block; } 
                    .mobile-logo-wrap { display: block; margin-left: -0.5rem; }
                    .search-terminal { display: none; } 
                }
                
                .search-terminal {
                    display: flex;
                    align-items: center;
                    background: #0d1117;
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    padding-right: 0.5rem;
                    width: 380px;
                    position: relative;
                }
                .terminal-icon {
                    position: absolute;
                    right: 12px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: #475569;
                    background: #1e293b;
                    padding: 2px 6px;
                    border-radius: 4px;
                }
                
                :global(.search-input) {
                    background: transparent !important;
                    border: none !important;
                    color: #fff !important;
                    font-size: 0.85rem !important;
                    padding: 0.625rem 1rem 0.625rem 2.5rem !important;
                    font-weight: 600 !important;
                    width: 100% !important;
                }
                
                .system-status { display: flex; align-items: center; gap: 0.5rem; background: rgba(16, 185, 129, 0.05); padding: 0.4rem 0.75rem; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.1); }
                .status-dot { width: 6px; height: 6px; border-radius: 50%; }
                .status-dot.green { background: #10b981; box-shadow: 0 0 10px #10b981; }
                .status-label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: #10b981; letter-spacing: 0.05em; }
                
                .notify-action { color: #94a3b8 !important; font-size: 1.25rem !important; }
                .vertical-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.05); }
                
                .identity-orb {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 16px;
                    transition: 0.2s;
                    border: 1px solid transparent;
                }
                .identity-orb:hover { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.05); }
                
                .identity-text { display: flex; flex-direction: column; align-items: flex-end; }
                .identity-name { font-size: 0.95rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
                .identity-role { font-size: 0.6rem; color: var(--brand); font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 1px; }
                
                .avatar-shield { padding: 4px; background: rgba(166, 243, 225, 0.1); border-radius: 50%; }
                .terminal-avatar { width: 36px; height: 36px; background-color: var(--brand) !important; color: #000 !important; font-weight: 900 !important; font-size: 1rem !important; }
            `}</style>
        </nav>
    );
}
