'use client';
import { useLayoutEffect, useRef } from 'react';
import { MarketOverviewCard } from '@/components/dashboard/MarketOverviewCard';
import { PortfolioSummaryCard } from '@/components/dashboard/PortfolioSummaryCard';
import { TopMoversTable } from '@/components/dashboard/TopMoversTable';
import { SignalsFeedCard } from '@/components/dashboard/SignalsFeedCard';
import { RecentTradesCard } from '@/components/dashboard/RecentTradesCard';
import { ActivePositionsTable } from '@/components/dashboard/ActivePositionsTable';
import { PriceTickerBanner } from '@/components/ui/PriceTickerBanner';
import gsap from 'gsap';

export default function DashboardRootPage() {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.dash-card', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="space-y-8 animate-fade-in">
            <div className="dash-card">
                <PriceTickerBanner />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    <div className="dash-card">
                        <ActivePositionsTable />
                    </div>
                    <div className="dash-card">
                        <MarketOverviewCard />
                    </div>
                    <div className="dash-card">
                        <TopMoversTable />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="dash-card">
                        <PortfolioSummaryCard />
                    </div>
                    <div className="dash-card">
                        <SignalsFeedCard />
                    </div>
                    <div className="dash-card">
                        <RecentTradesCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
