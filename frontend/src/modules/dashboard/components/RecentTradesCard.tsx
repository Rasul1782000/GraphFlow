'use client';
import { portfolioApi } from '@/lib/api/portfolio';
import { Button } from 'primereact/button';

export function RecentTradesCard() {
    const trades = [
        { symbol: 'BTC/USDT', type: 'LONG', price: '64,250.00', amount: '0.045', time: '12:45:02', total: '$2,891.25', status: 'filled' },
        { symbol: 'AAPL', type: 'SHORT', price: '182.40', amount: '12.000', time: '10:20:15', total: '$2,188.80', status: 'filled' },
    ];

    return (
        <div className="card-container">
            <div className="card-header">
                <h3>Terminal Ledger</h3>
                <Button label="History" icon="pi pi-history" className="p-button-text p-button-sm history-btn" />
            </div>
            <div className="ledger-items">
                {trades.map((trade, i) => (
                    <div key={i} className="ledger-item">
                        <div className="item-left">
                            <div className={`type-icon ${trade.type}`}>
                                <i className={`pi pi-arrow-${trade.type === 'LONG' ? 'up-right' : 'down-left'}`} />
                            </div>
                            <div className="item-info">
                                <span className="symbol">{trade.symbol}</span>
                                <span className="time">{trade.time}</span>
                            </div>
                        </div>
                        <div className="item-right">
                            <span className="total">{trade.total}</span>
                            <span className={`detail ${trade.type}`}>{trade.amount} @ {trade.price}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="ledger-footer">Audited Terminal Logs</div>
            <style jsx>{`
                .card-container { padding: 1.5rem; background: #111; border-radius: 12px; }
                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                h3 { font-size: 1.1rem; color: #fff; margin: 0; }
                :global(.history-btn) { font-size: 0.65rem !important; font-weight: 800 !important; text-transform: uppercase !important; color: #007bff !important; }
                .ledger-items { display: flex; flex-direction: column; gap: 1rem; }
                .ledger-item { background: #1a1a1a; border: 1px solid #222; border-radius: 12px; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
                .item-left { display: flex; align-items: center; gap: 1rem; }
                .type-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
                .type-icon.LONG { background: rgba(40,167,69,0.1); color: #28a745; }
                .type-icon.SHORT { background: rgba(220,53,69,0.1); color: #dc3545; }
                .item-info { display: flex; flex-direction: column; }
                .symbol { color: #fff; font-weight: 700; font-size: 0.9rem; }
                .time { font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 800; margin-top: 2px; }
                .item-right { text-align: right; display: flex; flex-direction: column; }
                .total { color: #fff; font-weight: 800; font-size: 0.95rem; font-family: 'var(--font-mono)', monospace; }
                .detail { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; margin-top: 2px; }
                .detail.LONG { color: #28a745; opacity: 0.6; }
                .detail.SHORT { color: #dc3545; opacity: 0.6; }
                .ledger-footer { margin-top: 1.5rem; text-align: center; color: #444; font-size: 0.6rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.2em; }
            `}</style>
        </div>
    );
}
