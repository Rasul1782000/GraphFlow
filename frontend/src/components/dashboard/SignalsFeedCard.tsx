'use client';
import { GlowCard } from '../ui/GlowCard';
import { Timeline } from 'primereact/timeline';
import { Badge } from 'primereact/badge';
import { Radio, Zap, Target, ShieldCheck } from 'lucide-react';

export function SignalsFeedCard() {
    const signals = [
        {
            symbol: 'BTC/USDT',
            type: 'LONG',
            strength: 'High',
            target: '68,400',
            time: '2m ago',
            color: 'green'
        },
        {
            symbol: 'AAPL',
            type: 'SHORT',
            strength: 'Medium',
            target: '185.00',
            time: '15m ago',
            color: 'red'
        },
        {
            symbol: 'EUR/USD',
            type: 'LONG',
            strength: 'High',
            target: '1.0920',
            time: '42m ago',
            color: 'green'
        }
    ];

    const marker = (item: any) => (
        <span className={`flex items-center justify-center w-8 h-8 rounded-full shadow-lg ${item.color === 'green' ? 'bg-green-500/20 text-green-400 ring-4 ring-green-500/5' : 'bg-red-500/20 text-red-400 ring-4 ring-red-500/5'}`}>
            <Zap size={14} fill="currentColor" strokeWidth={0} />
        </span>
    );

    const content = (item: any) => (
        <div className="bg-neutral-800/10 border border-neutral-800 hover:border-brand/20 rounded-2xl p-4 mb-4 transition-all group cursor-pointer hover:shadow-2xl">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white tracking-tight">{item.symbol}</span>
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{item.time}</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
                <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${item.color === 'green' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                    {item.type}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-400">
                    <Target size={10} className="text-brand" />
                    Target: <span className="text-white">{item.target}</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800/50">
                <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-brand opacity-60" />
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Confidence: {item.strength}</span>
                </div>
                <div className="flex -space-x-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-5 h-5 rounded-full border border-neutral-900 bg-neutral-800 flex items-center justify-center text-[8px] font-black text-white">+</div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <GlowCard title="Algorithm Alpha Feed" className="h-full">
            <Timeline
                value={signals}
                marker={marker}
                content={content}
                align="left"
            />
        </GlowCard>
    );
}
