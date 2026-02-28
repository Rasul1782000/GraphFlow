'use client';
import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from '@/lib/api/portfolio';
import { GlowCard } from '../ui/GlowCard';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { Wallet, TrendingUp, ArrowUpRight, Activity } from 'lucide-react';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';

export function PortfolioSummaryCard() {
    const { data: portfolios } = useQuery({
        queryKey: ['portfolio', 'list'],
        queryFn: async () => {
            const res = await portfolioApi.getPortfolios();
            return res as any;
        },
    });

    const portfolioId = portfolios?.[0]?.id;

    const { data: metricsData, isLoading } = useQuery({
        queryKey: ['portfolio', 'metrics', portfolioId],
        queryFn: async () => {
            const res = await portfolioApi.getMetrics(portfolioId);
            return res as any;
        },
        enabled: !!portfolioId,
        refetchInterval: 10_000,
    });

    const metrics = metricsData?.metrics || {
        total_value: 0,
        total_pnl: 0,
        total_pnl_percent: 0,
        realized_pnl: 0,
        open_positions: 0,
        cash_balance: 0
    };

    // Mock chart data for visual appeal (could be replaced with real history later)
    const chartData = {
        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        datasets: [{
            data: [65000, 59000, 80000, 81000, 56000, 55000, metrics.total_value || 100000],
            fill: true,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.05)',
            tension: 0.4
        }]
    };

    const chartOptions = {
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
        maintainAspectRatio: false,
        elements: { point: { radius: 0 } }
    };

    return (
        <GlowCard title="Terminal Balance" className="relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                <Wallet size={120} className="text-white" />
            </div>

            <div className="space-y-6 relative z-10 h-full flex flex-col justify-between">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Available Liquidity</span>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-extrabold text-white tracking-tighter">
                            {formatCurrency(metrics.total_value)}
                        </span>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${metrics.total_pnl >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'} text-xs font-bold border border-white/5 mb-2`}>
                            {metrics.total_pnl >= 0 ? <TrendingUp size={12} strokeWidth={3} /> : <Activity size={12} strokeWidth={3} />}
                            <span>{metrics.total_pnl_percent.toFixed(2)}%</span>
                        </div>
                    </div>
                </div>

                <div className="h-20 w-full mt-4">
                    <Chart type="line" data={chartData} options={chartOptions} className="w-full h-full" />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3 bg-neutral-950/40 border border-neutral-800/50 rounded-2xl group transition-all hover:bg-neutral-800/30">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 block mb-1">Realized P/L</span>
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-bold ${metrics.realized_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {formatCurrency(metrics.realized_pnl)}
                            </span>
                        </div>
                    </div>
                    <div className="p-3 bg-neutral-950/40 border border-neutral-800/50 rounded-2xl group transition-all hover:bg-neutral-800/30">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 block mb-1">Active Assets</span>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">{metrics.open_positions} Positions</span>
                        </div>
                    </div>
                </div>

                <Button
                    label="Terminal Swap"
                    icon="pi pi-arrow-right-arrow-left"
                    className="w-full h-11 bg-brand hover:bg-brand-600 border-none rounded-xl text-white font-bold p-button-sm shadow-lg shadow-brand/20 transition-all mt-4"
                />
            </div>
        </GlowCard>
    );
}
