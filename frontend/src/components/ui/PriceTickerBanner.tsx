'use client';
import { useEffect, useState } from 'react';
import { useSocket } from '@/app/providers';
import { formatCurrency } from '@/lib/utils/formatters';

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
        <div className="banner-container">
            <div className="banner-scroller">
                {DEFAULT_TICKERS.map(ticker => {
                    const data = prices[ticker];
                    return (
                        <div key={ticker} className="ticker-item">
                            <span className="ticker-name">{ticker}</span>
                            {data ? (
                                <div className="ticker-values">
                                    <span className="ticker-price">{formatCurrency(data.price)}</span>
                                    <span className={`ticker-change ${data.changePercent >= 0 ? 'up' : 'down'}`}>
                                        {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                                    </span>
                                </div>
                            ) : (
                                <span className="ticker-price loading">—</span>
                            )}
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                .banner-container { 
                    width: 100%; 
                    overflow: hidden; 
                    background: #111; 
                    border: 1px solid #222; 
                    border-radius: 12px; 
                    padding: 0.75rem 1.5rem; 
                }
                .banner-scroller { 
                    display: flex; 
                    align-items: center; 
                    gap: 3rem; 
                }
                .ticker-item { 
                    display: flex; 
                    align-items: center; 
                    gap: 0.75rem; 
                    flex-shrink: 0; 
                }
                .ticker-name { font-size: 0.75rem; color: #555; font-weight: 800; text-transform: uppercase; }
                .ticker-values { display: flex; align-items: center; gap: 0.5rem; }
                .ticker-price { font-size: 0.8rem; color: #fff; font-family: 'var(--font-mono)', monospace; font-weight: 700; }
                .ticker-price.loading { color: #222; }
                .ticker-change { font-size: 0.75rem; font-weight: 700; font-family: 'var(--font-mono)', monospace; }
                .ticker-change.up { color: #28a745; }
                .ticker-change.down { color: #dc3545; }
            `}</style>
        </div>
    );
}
