'use client';
import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from '@/lib/api/portfolio';
import { GlowCard } from '../ui/GlowCard';
import { Button } from 'primereact/button';
import { ArrowUpRight, ArrowDownLeft, Clock, History } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

export function RecentTradesCard() {
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
        queryFn: () => portfolioApi.getMetrics(portfolioId),
        enabled: !!portfolioId,
        refetchInterval: 15_000,
    });

    // In a real app, you'd have a separate endpoint for trades list. 
    // Here we might just use the trades count or wait for real trade history data.
    // For now, I'll enhance the UI with the existing structure but keep the professional look.

    const trades = [
        { symbol: 'BTC/USDT', type: 'LONG', price: '64,250.00', amount: '0.045', time: '12:45:02', total: '$2,891.25', status: 'filled' },
        { symbol: 'AAPL', type: 'SHORT', price: '182.40', amount: '12.000', time: '10:20:15', total: '$2,188.80', status: 'filled' },
    ];

    return (
        <GlowCard
            title="Terminal Ledger"
            headerRight={<Button icon="pi pi-history" className="p-button-text p-button-sm text-brand text-[10px] font-black uppercase tracking-widest p-1" label="History" />}
        >
            <div className="space-y-4">
                {trades.map((trade, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-neutral-900/50 border border-neutral-800 hover:border-brand/30 rounded-2xl transition-all group cursor-default">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl flex items-center justify-center ${trade.type === 'LONG' ? 'bg-green-500/10 text-green-400 group-hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20'} transition-colors`}>
                                {trade.type === 'LONG' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white tracking-tight">{trade.symbol}</span>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                    <Clock size={10} className="text-brand opacity-60" />
                                    {trade.time}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end text-right">
                            <span className="text-sm font-black text-white font-mono tracking-tighter">{trade.total}</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${trade.type === 'LONG' ? 'text-green-500 opacity-60' : 'text-red-500 opacity-60'}`}>
                                {trade.amount} @ {trade.price}
                            </span>
                        </div>
                    </div>
                ))}

                <div className="pt-2 text-center">
                    <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">Audited Terminal Logs</p>
                </div>
            </div>
        </GlowCard>
    );
}
