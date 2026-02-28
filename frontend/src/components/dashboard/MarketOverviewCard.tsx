'use client';
import { useQuery } from '@tanstack/react-query';
import { marketApi } from '@/lib/api/market';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { GlowCard } from '@/components/ui/GlowCard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { Skeleton } from 'primereact/skeleton';

export function MarketOverviewCard() {
    const { data: movers, isLoading } = useQuery({
        queryKey: ['market', 'movers'],
        queryFn: () => marketApi.getTopMovers(6),
        refetchInterval: 30_000,
    });

    return (
        <GlowCard
            title="Real-Time Alpha"
            className="w-full"
            headerRight={<span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-neutral-800 px-2 py-1 rounded">Live Stream</span>}
        >
            {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4">
                            <Skeleton width="40%" height="12px" className="mb-2 bg-neutral-800" />
                            <Skeleton width="100%" height="24px" className="mb-2 bg-neutral-800" />
                            <Skeleton width="30%" height="10px" className="bg-neutral-800" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {movers?.map((item: any) => {
                        const isUp = item.changePercent >= 0;
                        const Icon = item.changePercent > 0 ? TrendingUp : item.changePercent < 0 ? TrendingDown : Minus;
                        const colorCls = isUp ? 'text-green-400' : 'text-red-400';
                        const bgCls = isUp ? 'bg-green-400/5 border-green-500/10' : 'bg-red-400/5 border-red-500/10';
                        const glowCls = isUp ? 'hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]';

                        return (
                            <div key={item.symbol} className={`${bgCls} border rounded-2xl p-4 transition-all duration-300 ${glowCls} group cursor-pointer hover:-translate-y-1`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white font-bold text-sm tracking-tight group-hover:text-brand transition-colors">{item.symbol}</span>
                                    <div className={`${isUp ? 'bg-green-500/20' : 'bg-red-500/20'} p-1 rounded-lg`}>
                                        <Icon className={`w-3.5 h-3.5 ${colorCls}`} />
                                    </div>
                                </div>
                                <AnimatedCounter
                                    value={item.price}
                                    format={v => formatCurrency(v)}
                                    className={`text-xl font-black ${colorCls} tracking-tighter`}
                                />
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`text-xs font-bold ${colorCls}`}>{formatPercent(item.changePercent)}</span>
                                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">24H</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </GlowCard>
    );
}
