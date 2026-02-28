'use client';
import { useEffect, useState } from 'react';
import { useSocket } from '@/app/providers';
import { formatCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

const DEFAULT_TICKERS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'AAPL', 'MSFT', 'NVDA', 'TSLA'];

export function PriceTickerBanner() {
    const socket = useSocket();
    const [prices, setPrices] = useState<Record<string, { price: number; changePercent: number }>>({});

    useEffect(() => {
        if (!socket) return;
        socket.emit('subscribe_ticker', { symbols: DEFAULT_TICKERS });

        const onUpdate = (data: any) => {
            setPrices(prev => ({ ...prev, [data.symbol]: data }));
        };
        socket.on('ticker_update', onUpdate);
        return () => { socket.off('ticker_update', onUpdate); };
    }, [socket]);

    return (
        <div className="w-full overflow-hidden bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-4">
            <div className="flex items-center gap-6 animate-[scroll_30s_linear_infinite]">
                {DEFAULT_TICKERS.map(ticker => {
                    const data = prices[ticker];
                    return (
                        <div key={ticker} className="flex items-center gap-2 shrink-0">
                            <span className="text-neutral-400 text-xs font-medium">{ticker}</span>
                            {data ? (
                                <>
                                    <span className="text-white text-xs font-mono">{formatCurrency(data.price)}</span>
                                    <span className={cn('text-xs font-mono', data.changePercent >= 0 ? 'text-green-400' : 'text-red-400')}>
                                        {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                                    </span>
                                </>
                            ) : (
                                <span className="text-neutral-600 text-xs">—</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
