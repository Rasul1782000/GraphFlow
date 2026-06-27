'use client';
import { Signal } from '@/types/signal.types';
import { formatCurrency, formatRelativeTime } from '@/lib/utils/formatters';

interface SignalCardProps {
    signal: Signal;
    onTrade?: (signal: Signal) => void;
}

export function SignalCard({ signal, onTrade }: SignalCardProps) {
    const isBuy = signal.type === 'buy';
    const strengthColor =
        signal.strength >= 80 ? '#28a745' :
            signal.strength >= 60 ? '#ffc107' : '#dc3545';

    return (
        <div className="signal-card">
            <div className="card-header">
                <div className="header-left">
                    <div className={`indicator ${isBuy ? 'buy' : 'sell'}`}>
                        <i className={`pi pi-trending-${isBuy ? 'up' : 'down'}`} />
                    </div>
                    <div className="info">
                        <span className="ticker">{signal.symbol?.ticker}</span>
                        <span className="metadata">{signal.timeframe} · {signal.source}</span>
                    </div>
                </div>
                <div className={`type-badge ${isBuy ? 'buy' : 'sell'}`}>
                    {signal.type}
                </div>
            </div>

            <div className="strength-section">
                <div className="strength-header">
                    <span>Signal Strength</span>
                    <span className="val">{signal.strength}/100</span>
                </div>
                <div className="strength-bar-bg">
                    <div className="strength-bar-fill" style={{ width: `${signal.strength}%`, backgroundColor: strengthColor }} />
                </div>
            </div>

            <div className="levels-grid">
                {signal.entry_price && (
                    <div className="level-item">
                        <span className="lv-label">Entry</span>
                        <span className="lv-val mono">{formatCurrency(signal.entry_price)}</span>
                    </div>
                )}
                {signal.stop_loss && (
                    <div className="level-item stop">
                        <span className="lv-label">Stop</span>
                        <span className="lv-val mono">{formatCurrency(signal.stop_loss)}</span>
                    </div>
                )}
                {signal.take_profit && (
                    <div className="level-item target">
                        <span className="lv-label">Target</span>
                        <span className="lv-val mono">{formatCurrency(signal.take_profit)}</span>
                    </div>
                )}
            </div>

            <div className="card-footer">
                <span className="time">{formatRelativeTime(signal.created_at)}</span>
                {onTrade && (
                    <button className={`trade-btn ${isBuy ? 'buy' : 'sell'}`} onClick={() => onTrade(signal)}>
                        Trade Signal
                    </button>
                )}
            </div>

            <style jsx>{`
                .signal-card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 1.25rem; }
                .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }
                .header-left { display: flex; align-items: center; gap: 0.75rem; }
                
                .indicator { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
                .indicator.buy { background: rgba(40,167,69,0.1); color: #28a745; border: 1px solid rgba(40,167,69,0.2); }
                .indicator.sell { background: rgba(220,53,69,0.1); color: #dc3545; border: 1px solid rgba(220,53,69,0.2); }
                
                .info { display: flex; flex-direction: column; }
                .ticker { color: #fff; font-weight: 700; font-size: 0.95rem; }
                .metadata { color: #555; font-size: 0.7rem; font-weight: 700; margin-top: 2px; }
                
                .type-badge { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; padding: 0.25rem 0.6rem; border-radius: 6px; border: 1px solid transparent; }
                .type-badge.buy { background: rgba(40,167,69,0.1); color: #28a745; border-color: rgba(40,167,69,0.2); }
                .type-badge.sell { background: rgba(220,53,69,0.1); color: #dc3545; border-color: rgba(220,53,69,0.2); }
                
                .strength-section { margin-bottom: 1.25rem; }
                .strength-header { display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 800; color: #555; text-transform: uppercase; margin-bottom: 0.4rem; }
                .val { color: #fff; }
                .strength-bar-bg { height: 6px; background: #222; border-radius: 3px; overflow: hidden; }
                .strength-bar-fill { height: 100%; transition: 0.5s ease; }
                
                .levels-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
                .level-item { background: #1a1a1a; padding: 0.75rem; border-radius: 8px; display: flex; flex-direction: column; text-align: center; border: 1px solid #222; }
                .lv-label { font-size: 0.6rem; color: #555; text-transform: uppercase; font-weight: 800; margin-bottom: 0.2rem; }
                .lv-val { font-size: 0.8rem; font-weight: 700; color: #fff; }
                .level-item.stop { background: rgba(220,53,69,0.03); border-color: rgba(220,53,69,0.1); }
                .level-item.target { background: rgba(40,167,69,0.03); border-color: rgba(40,167,69,0.1); }
                .mono { font-family: 'var(--font-mono)', monospace; }
                
                .card-footer { border-top: 1px solid #222; padding-top: 1rem; display: flex; justify-content: space-between; align-items: center; }
                .time { font-size: 0.65rem; color: #444; font-weight: 800; text-transform: uppercase; }
                .trade-btn { border: none; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: 0.2s; }
                .trade-btn.buy { background: #28a745; color: #000; }
                .trade-btn.sell { background: #dc3545; color: #fff; }
                .trade-btn:hover { opacity: 0.9; transform: translateY(-1px); }
            `}</style>
        </div>
    );
}
