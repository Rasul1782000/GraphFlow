'use client';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';
import { Menu as MenuIcon } from 'lucide-react';

export function Navbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
    const { user, logout } = useAuthStore();
    const menu = useRef<any>(null);

    const menuItems = [
        { label: 'Profile', icon: 'pi pi-user' },
        { label: 'Settings', icon: 'pi pi-cog' },
        { separator: true },
        {
            label: 'Sign Out',
            icon: 'pi pi-power-off',
            className: 'text-red-400',
            command: () => logout()
        }
    ];

    return (
        <nav className="h-16 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md px-4 lg:px-10 flex items-center justify-between sticky top-0 z-50">
            {/* Mobile Menu Toggle (hidden on desktop) */}
            <div className="flex items-center gap-4">
                <Button
                    icon={() => <MenuIcon size={20} />}
                    className="lg:hidden p-button-rounded p-button-text text-neutral-400 hover:text-white"
                    onClick={onOpenMobileNav}
                />

                {/* Global Search */}
                <div className="hidden md:flex flex-1 max-w-sm">
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-search text-neutral-500" />
                        <InputText
                            placeholder="Terminal Command (⌘K)"
                            className="w-full bg-neutral-950/50 border-neutral-800 rounded-lg text-sm transition-all focus:border-brand/50 focus:bg-neutral-950 p-2 pl-10"
                        />
                    </span>
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
                <Button
                    icon="pi pi-bell"
                    className="p-button-rounded p-button-text text-neutral-400 p-overlay-badge hidden sm:flex"
                    aria-label="Notifications"
                >
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand rounded-full ring-2 ring-neutral-900"></span>
                </Button>

                <div className="h-8 w-[1px] bg-neutral-800 mx-2 hidden sm:block"></div>

                {/* User Profile */}
                <div
                    className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-neutral-800/50 p-1.5 rounded-xl transition-all"
                    onClick={(e) => menu.current?.toggle(e)}
                >
                    <div className="hidden sm:flex flex-col items-end text-right">
                        <span className="text-sm font-bold text-white leading-none capitalize">{user?.username || 'Trader'}</span>
                        <span className="text-[10px] font-bold text-brand uppercase tracking-widest mt-1.5 opacity-80">{user?.role || 'User'}</span>
                    </div>
                    <Avatar
                        label={user?.username?.[0]?.toUpperCase() || 'U'}
                        shape="circle"
                        size="normal"
                        className="bg-brand text-white font-bold border border-white/10"
                    />
                    <Menu model={menuItems} popup ref={menu} className="bg-neutral-900 border-neutral-800 text-sm shadow-2xl" />
                </div>
            </div>
        </nav>
    );
}
