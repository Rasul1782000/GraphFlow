'use client';
import { ActivePositionsTable } from '../components/ActivePositionsTable';
import { MarketOverviewCard } from '../components/MarketOverviewCard';
import { PortfolioSummaryCard } from '../components/PortfolioSummaryCard';
import { TopMoversTable } from '../components/TopMoversTable';
import { SignalsFeedCard } from '../components/SignalsFeedCard';
import { RecentTradesCard } from '../components/RecentTradesCard';
import { PriceTickerBanner } from '@/components/ui/PriceTickerBanner';

export function DashboardPage() {
    return (
        <div className="dashboard-root">
            <PriceTickerBanner />
            <div className="dashboard-grid">
                <div className="grid-left">
                    <ActivePositionsTable />
                    <MarketOverviewCard />
                    <TopMoversTable />
                </div>
                <div className="grid-right">
                    <PortfolioSummaryCard />
                    <SignalsFeedCard />
                    <RecentTradesCard />
                </div>
            </div>

            <style jsx>{`
                .dashboard-root { display: flex; flex-direction: column; gap: 1.5rem; }
                .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
                .grid-left, .grid-right { display: flex; flex-direction: column; gap: 1.5rem; }
                @media (max-width: 1200px) { .dashboard-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
