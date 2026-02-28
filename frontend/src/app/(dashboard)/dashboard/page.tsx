import type { Metadata } from 'next';
import { MarketOverviewCard } from '@/components/dashboard/MarketOverviewCard';
import { PortfolioSummaryCard } from '@/components/dashboard/PortfolioSummaryCard';
import { TopMoversTable } from '@/components/dashboard/TopMoversTable';
import { SignalsFeedCard } from '@/components/dashboard/SignalsFeedCard';
import { RecentTradesCard } from '@/components/dashboard/RecentTradesCard';
import { PriceTickerBanner } from '@/components/ui/PriceTickerBanner';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <PriceTickerBanner />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <MarketOverviewCard />
                    <TopMoversTable />
                    <RecentTradesCard />
                </div>
                <div className="space-y-6">
                    <PortfolioSummaryCard />
                    <SignalsFeedCard />
                </div>
            </div>
        </div>
    );
}
