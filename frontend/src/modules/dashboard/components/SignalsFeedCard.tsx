'use client';
import { useState, useEffect } from 'react';
import { signalsApi, SignalDTO } from '@/lib/api/signals';
import { Timeline } from 'primereact/timeline';

export function SignalsFeedCard() {
    const [signals, setSignals] = useState<SignalDTO[]>([]);

    useEffect(() => {
        const fetchSignals = async () => {
            try {
                const res = await signalsApi.getRecent(5);
                setSignals(res);
            } catch (err) {
                console.error('Failed to fetch signals', err);
            }
        };
        fetchSignals();
        const interval = setInterval(fetchSignals, 30000);
        return () => clearInterval(interval);
    }, []);

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    const marker = (item: SignalDTO) => (
        <span className={`marker ${item.type}`}>
            <i className="pi pi-bolt" />
        </span>
    );

    const content = (item: SignalDTO) => (
        <div className="signal-item">
            <div className="signal-header">
                <span className="symbol">{item.symbol_id?.ticker || 'N/A'}</span>
                <span className="time">{timeAgo(item.created_at)}</span>
            </div>
            <div className="signal-body">
                <div className={`type-badge ${item.type}`}>{item.type.toUpperCase()}</div>
                <div className="target-info">
                    <i className="pi pi-target icon-accent" />
                    Strength: <span className="val">{item.strength}%</span>
                </div>
            </div>
            <style jsx>{`
                .signal-item { background: #1a1a1a; padding: 1rem; border-radius: 12px; border: 1px solid #222; margin-bottom: 1rem; }
                .signal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
                .symbol { color: #fff; font-weight: 700; font-size: 0.85rem; }
                .time { font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 800; }
                .signal-body { display: flex; align-items: center; gap: 1rem; }
                .type-badge { font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 4px; }
                .type-badge.buy { background: #28a745; color: #000; }
                .type-badge.sell { background: #dc3545; color: #fff; }
                .type-badge.neutral { background: #555; color: #fff; }
                .target-info { font-size: 0.7rem; color: #555; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; }
                .val { color: #fff; }
                .icon-accent { color: #007bff; font-size: 0.7rem; opacity: 0.6; }
            `}</style>
        </div>
    );

    return (
        <div className="card-container">
            <div className="card-header"><h3>Alpha Feed</h3></div>
            <Timeline value={signals} marker={marker} content={content} className="signal-timeline" style={{ padding: '0 0 1.5rem 0' }} />
            <style jsx>{`
                .card-container { padding: 1.5rem; background: #111; border-radius: 12px; height: 100%; }
                .card-header { margin-bottom: 1.5rem; }
                h3 { font-size: 1.1rem; color: #fff; margin: 0; }
                :global(.signal-timeline .p-timeline-event-marker) { background: transparent; border: none; padding: 0; }
                .marker { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
                .marker.buy { background: rgba(40,167,69,0.1); color: #28a745; }
                .marker.sell { background: rgba(220,53,69,0.1); color: #dc3545; }
                .marker.neutral { background: rgba(255,255,255,0.05); color: #555; }
            `}</style>
        </div>
    );
}
