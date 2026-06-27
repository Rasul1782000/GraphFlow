'use client';
import { useState, useEffect } from 'react';
import { signalsApi, SignalDTO, SignalStats } from '@/lib/api/signals';
import { Timeline } from 'primereact/timeline';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { formatCurrency } from '@/lib/utils/formatters';

export function SignalsPage() {
    const [signals, setSignals] = useState<SignalDTO[]>([]);
    const [stats, setStats] = useState<SignalStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [timeframeFilter, setTimeframeFilter] = useState<string | null>(null);

    const typeOptions = [{ label: 'All Types', value: null }, { label: 'Buy', value: 'buy' }, { label: 'Sell', value: 'sell' }, { label: 'Neutral', value: 'neutral' }];
    const timeframeOptions = [{ label: 'All Timeframes', value: null }, { label: '1m', value: '1m' }, { label: '5m', value: '5m' }, { label: '1h', value: '1h' }, { label: '4h', value: '4h' }, { label: '1d', value: '1d' }];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sigRes, statsRes] = await Promise.all([
                    signalsApi.getSignals({ type: typeFilter || undefined, timeframe: timeframeFilter || undefined, limit: 50 }),
                    signalsApi.getStats(),
                ]);
                setSignals(sigRes.items);
                setStats(statsRes);
            } catch (err) { console.error('Failed to fetch signals', err); }
            finally { setLoading(false); }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [typeFilter, timeframeFilter]);

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        return `${Math.floor(mins / 60)}h ago`;
    };

    const marker = (item: SignalDTO) => (
        <span className={`signal-marker ${item.type}`}>
            <i className={`pi pi-${item.type === 'buy' ? 'arrow-up' : item.type === 'sell' ? 'arrow-down' : 'minus'}`} />
        </span>
    );

    const content = (item: SignalDTO) => (
        <div className="signal-card">
            <div className="signal-header">
                <div className="signal-symbol"><span className="ticker">{item.symbol_id?.ticker || 'N/A'}</span><span className="name">{item.symbol_id?.name || ''}</span></div>
                <span className="signal-time">{timeAgo(item.created_at)}</span>
            </div>
            <div className="signal-body">
                <div className={`type-badge ${item.type}`}>{item.type.toUpperCase()}</div>
                <div className="signal-meta">
                    <span className="meta-item"><i className="pi pi-bolt" /> Strength: {item.strength}%</span>
                    <span className="meta-item"><i className="pi pi-clock" /> {item.timeframe}</span>
                </div>
            </div>
            {(item.entry_price || item.stop_loss || item.take_profit) && (
                <div className="signal-levels">
                    {item.entry_price && <div className="level"><span className="level-label">Entry</span><span className="level-value blue-text">{formatCurrency(item.entry_price)}</span></div>}
                    {item.stop_loss && <div className="level"><span className="level-label">Stop Loss</span><span className="level-value text-red">{formatCurrency(item.stop_loss)}</span></div>}
                    {item.take_profit && <div className="level"><span className="level-label">Take Profit</span><span className="level-value text-green">{formatCurrency(item.take_profit)}</span></div>}
                </div>
            )}
            {item.description && <p className="signal-desc">{item.description}</p>}
            <div className="signal-footer"><Button label="Execute Trade" icon="pi pi-bolt" className="p-button-sm execute-btn" /></div>
            <style jsx>{`
                .signal-card { background: #1a1a1a; border: 1px solid #222; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; }
                .signal-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
                .ticker { color: #fff; font-weight: 800; font-size: 1rem; }
                .name { font-size: 0.7rem; color: #555; display: block; }
                .signal-time { font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 800; }
                .signal-body { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
                .type-badge { font-size: 0.65rem; font-weight: 900; padding: 0.25rem 0.7rem; border-radius: 4px; }
                .type-badge.buy { background: #28a745; color: #000; }
                .type-badge.sell { background: #dc3545; color: #fff; }
                .type-badge.neutral { background: #555; color: #fff; }
                .signal-meta { display: flex; gap: 1rem; }
                .meta-item { font-size: 0.7rem; color: #555; font-weight: 700; display: flex; align-items: center; gap: 0.3rem; }
                .signal-levels { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-bottom: 1rem; }
                .level { background: #111; border: 1px solid #222; border-radius: 8px; padding: 0.75rem; text-align: center; }
                .level-label { font-size: 0.6rem; color: #555; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.25rem; }
                .level-value { font-size: 0.9rem; font-weight: 800; color: #fff; font-family: 'var(--font-mono)', monospace; }
                .signal-desc { font-size: 0.75rem; color: #777; margin: 0 0 1rem; }
                .signal-footer { border-top: 1px solid #222; padding-top: 1rem; }
                :global(.execute-btn) { background: #007bff !important; border: none !important; border-radius: 8px !important; font-weight: 700 !important; }
                .signal-marker { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
                .signal-marker.buy { background: rgba(40,167,69,0.1); color: #28a745; }
                .signal-marker.sell { background: rgba(220,53,69,0.1); color: #dc3545; }
                .blue-text { color: var(--brand); }
                .text-green { color: #28a745; }
                .text-red { color: #dc3545; }
            `}</style>
        </div>
    );

    return (
        <div className="signals-page">
            <div className="page-header"><div><h1>Live Alpha</h1><p className="subtitle">Trading signals and market intelligence</p></div></div>
            {stats && (
                <div className="stats-row">
                    <div className="stat-card"><span className="stat-label">Total Signals</span><span className="stat-value">{stats.total}</span></div>
                    <div className="stat-card"><span className="stat-label">Last 24h</span><span className="stat-value text-blue">{stats.last_24h}</span></div>
                    <div className="stat-card"><span className="stat-label">Buy</span><span className="stat-value text-green">{stats.by_type?.buy || 0}</span></div>
                    <div className="stat-card"><span className="stat-label">Sell</span><span className="stat-value text-red">{stats.by_type?.sell || 0}</span></div>
                </div>
            )}
            <div className="filters-row">
                <Dropdown value={typeFilter} options={typeOptions} onChange={e => setTypeFilter(e.value)} className="filter-dropdown" />
                <Dropdown value={timeframeFilter} options={timeframeOptions} onChange={e => setTimeframeFilter(e.value)} className="filter-dropdown" />
            </div>
            <div className="signals-content">
                <Timeline value={signals} marker={marker} content={content} className="signals-timeline" />
                {!loading && signals.length === 0 && <div className="empty-state"><i className="pi pi-bolt" /><p>No signals generated yet</p></div>}
            </div>
            <style jsx>{`
                .signals-page { display: flex; flex-direction: column; gap: 2rem; }
                .page-header { display: flex; justify-content: space-between; }
                h1 { font-size: 1.75rem; color: #fff; font-weight: 800; margin: 0; }
                .subtitle { color: #555; font-size: 0.85rem; margin: 0.25rem 0 0; }
                .stats-row { display: flex; gap: 1rem; flex-wrap: wrap; }
                .stat-card { background: #111; border: 1px solid #222; border-radius: 10px; padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
                .stat-label { font-size: 0.6rem; color: #555; text-transform: uppercase; font-weight: 800; }
                .stat-value { font-size: 1.25rem; font-weight: 800; color: #fff; }
                .filters-row { display: flex; gap: 0.75rem; }
                :global(.filter-dropdown) { background: #111; border: 1px solid #222; color: #fff; border-radius: 8px; min-width: 160px; }
                :global(.signals-timeline .p-timeline-event-marker) { background: transparent; border: none; padding: 0; }
                .empty-state { text-align: center; padding: 4rem 2rem; color: #555; }
                .empty-state i { font-size: 2rem; margin-bottom: 1rem; display: block; }
                .text-blue { color: var(--brand); }
                .text-green { color: #28a745; }
                .text-red { color: #dc3545; }
            `}</style>
        </div>
    );
}
