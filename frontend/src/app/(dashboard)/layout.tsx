'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const router = useRouter();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="dashboard-main">
                <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />
                <main className="dashboard-content">
                    <div className="content-inner dashboard-glass">
                        {children}
                    </div>
                </main>
            </div>

            <MobileNav open={mobileNavOpen} setOpen={setMobileNavOpen} />

            <style jsx>{`
                .dashboard-container {
                    display: flex;
                    height: 100vh;
                    background: #05070a;
                    overflow: hidden;
                    position: relative;
                }
                .dashboard-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    overflow: hidden;
                    position: relative;
                    z-index: 10;
                }
                .dashboard-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2.5rem;
                    background: radial-gradient(circle at 50% 0%, #0d1117 0%, #05070a 100%);
                }
                .content-inner {
                    padding: 2.5rem;
                    min-height: 100%;
                }
                
                @media (max-width: 1024px) {
                    .dashboard-content { padding: 1rem; }
                    .content-inner { padding: 1.5rem; border: none; border-radius: 0; background: transparent; }
                    .dashboard-container :global(.sidebar-container) { display: none; }
                }
            `}</style>
        </div>
    );
}
