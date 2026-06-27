'use client';
import { useState, useEffect } from 'react';
import { MarketMoversDTO, marketApi } from '@/lib/api/market';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { Skeleton } from 'primereact/skeleton';

export function MarketOverviewCard() {
    const [movers, setMovers] = useState<MarketMoversDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovers = async () => {
            try {
                const res = await marketApi.getTopMovers(6);
                setMovers(res);
            } catch (err) {
                console.error('Failed to fetch movers', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovers();
        const interval = setInterval(fetchMovers, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card-container">
            <div className="card-header">
                <h3>Real-Time Movers</h3>
                <span className="live-stream-badge">LIVE STREAM</span>
            </div>

            {loading ? (
                <div className="grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="mover-skeleton">
                            <Skeleton width="40%" height="12px" className="skel" />
                            <Skeleton width="100%" height="24px" className="skel" />
                            <Skeleton width="30%" height="10px" className="skel" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid">
                    {movers?.map((item: MarketMoversDTO) => {
                        const isUp = item.changePercent >= 0;
                        return (
                            <div key={item.symbol} className={`mover-item ${isUp ? 'is-up' : 'is-down'}`}>
                                <div className="mover-header">
                                    <span className="ticker">{item.symbol}</span>
                                    <i className={`pi pi-trending-${isUp ? 'up' : 'down'} icon`} />
                                </div>
                                <AnimatedCounter
                                    value={item.price}
                                    format={v => formatCurrency(v)}
                                    className={`price ${isUp ? 'up-text' : 'down-text'}`}
                                />
                                <div className="mover-footer">
                                    <span className={`change ${isUp ? 'up-text' : 'down-text'}`}>{formatPercent(item.changePercent)}</span>
                                    <span className="label">24H</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <style jsx>{`
                .card-container { padding: 1.5rem; background: #111; border-radius: 12px; }
                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                h3 { font-size: 1.1rem; color: #fff; margin: 0; }
                .live-stream-badge { font-size: 0.65rem; font-weight: 800; background: #222; color: #777; padding: 0.3rem 0.6rem; border-radius: 6px; }
                .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
                @media (max-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); } }
                .mover-item { background: #1a1a1a; border: 1px solid #222; border-radius: 12px; padding: 1.25rem; transition: 0.3s; cursor: pointer; }
                .mover-item:hover { transform: translateY(-3px); border-color: #333; }
                .is-up { background: rgba(40,167,69,0.03); }
                .is-down { background: rgba(220,53,69,0.03); }
                .mover-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
                .ticker { color: #fff; font-weight: 700; font-size: 0.9rem; }
                .icon { font-size: 0.8rem; }
                .price { font-size: 1.25rem; font-weight: 800; }
                .up-text { color: #28a745; }
                .down-text { color: #dc3545; }
                .mover-footer { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem; }
                .change { font-size: 0.8rem; font-weight: 700; }
                .label { font-size: 0.6rem; color: #555; text-transform: uppercase; font-weight: 800; }
                .skel { background: #1a1a1a !important; margin-bottom: 0.5rem; }
            `}</style>
        </div>
    );
}
