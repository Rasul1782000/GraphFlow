'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const router = useRouter();
    const mainRef = useRef(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else {
            // Smooth reveal of main content area
            gsap.fromTo(mainRef.current,
                { opacity: 0, scale: 0.98, y: 10 },
                { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: 0.1 }
            );
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="flex h-screen bg-black overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-[-25%] right-[-10%] w-[50%] h-[50%] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/5 blur-[100px] rounded-full pointer-events-none" />

            <Sidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
                <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />
                <main ref={mainRef} className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-hide">
                    {children}
                </main>
            </div>

            <MobileNav open={mobileNavOpen} setOpen={setMobileNavOpen} />
        </div>
    );
}
