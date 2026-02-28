'use client';
import { Signal } from '@/types/signal.types';
import { GlowCard } from '@/components/ui/GlowCard';
import { formatCurrency, formatRelativeTime } from '@/lib/utils/formatters';
import { TrendingUp, TrendingDown, Target, Shield, Award } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SignalCardProps {
    signal: Signal;
    onTrade?: (signal: Signal) => void;
}

export function SignalCard({ signal, onTrade }: SignalCardProps) {
    const isBuy = signal.type === 'buy';
    const glowColor = isBuy ? 'green' : 'red';
    const Icon = isBuy ? TrendingUp : TrendingDown;
    const colorCls = isBuy ? 'text-green-400' : 'text-red-400';
    const bgCls = isBuy ? 'bg-green-400/10 border-green-500/30' : 'bg-red-400/10 border-red-500/30';
    const strengthColor =
        signal.strength >= 80 ? 'bg-green-400' :
            signal.strength >= 60 ? 'bg-yellow-400' : 'bg-red-400';

    return (
        <GlowCard glowColor={glowColor} className="transition-transform hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`${bgCls} border rounded-lg p-2`}>
                        <Icon className={`w-4 h-4 ${colorCls}`} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">{signal.symbol?.ticker}</p>
                        <p className="text-neutral-400 text-xs">{signal.timeframe} · {signal.source}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-md ${bgCls} ${colorCls} border`}>
                        {signal.type}
                    </span>
                </div>
            </div>

            {/* Signal Strength */}
            <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-neutral-400 text-xs">Signal Strength</span>
                    <span className="text-white text-xs font-bold">{signal.strength}/100</span>
                </div>
                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${strengthColor} rounded-full transition-all duration-700`}
                        style={{ width: `${signal.strength}%` }}
                    />
                </div>
            </div>

            {/* Price Levels */}
            {(signal.entry_price || signal.stop_loss || signal.take_profit) && (
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    {signal.entry_price && (
                        <div className="bg-neutral-800 rounded-lg p-2">
                            <p className="text-neutral-500 text-xs">Entry</p>
                            <p className="text-white text-xs font-mono font-semibold">
                                {formatCurrency(signal.entry_price)}
                            </p>
                        </div>
                    )}
                    {signal.stop_loss && (
                        <div className="bg-red-950/30 rounded-lg p-2 border border-red-900/30">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Shield className="w-3 h-3 text-red-400" />
                                <p className="text-red-400 text-xs">Stop</p>
                            </div>
                            <p className="text-red-300 text-xs font-mono font-semibold">
                                {formatCurrency(signal.stop_loss)}
                            </p>
                        </div>
                    )}
                    {signal.take_profit && (
                        <div className="bg-green-950/30 rounded-lg p-2 border border-green-900/30">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Target className="w-3 h-3 text-green-400" />
                                <p className="text-green-400 text-xs">Target</p>
                            </div>
                            <p className="text-green-300 text-xs font-mono font-semibold">
                                {formatCurrency(signal.take_profit)}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {signal.risk_reward && (
                <div className="flex items-center gap-1 mb-3">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-neutral-400 text-xs">Risk/Reward: </span>
                    <span className="text-indigo-400 text-xs font-bold">1:{signal.risk_reward}</span>
                </div>
            )}

            <div className="flex items-center justify-between">
                <span className="text-neutral-500 text-xs">{formatRelativeTime(signal.created_at)}</span>
                {onTrade && (
                    <button
                        onClick={() => onTrade(signal)}
                        className={cn(
                            'text-xs font-semibold px-3 py-1.5 rounded-lg transition-all',
                            isBuy
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                        )}
                    >
                        Trade Signal
                    </button>
                )}
            </div>
        </GlowCard>
    );
}
