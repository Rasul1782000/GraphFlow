'use client';
import { useState, useEffect } from 'react';
import { watchlistApi, WatchlistDTO } from '@/lib/api/watchlist';
import { marketApi, SymbolDTO, MarketMoversDTO } from '@/lib/api/market';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export function WatchlistPage() {
    const [watchlists, setWatchlists] = useState<WatchlistDTO[]>([]);
    const [activeWatchlist, setActiveWatchlist] = useState<WatchlistDTO | null>(null);
    const [quotes, setQuotes] = useState<Record<string, MarketMoversDTO>>({});
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        watchlistApi.getWatchlists().then(res => { setWatchlists(res); if (res.length > 0) setActiveWatchlist(res[0]); }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!activeWatchlist?.symbols?.length) return;
        const fetchQuotes = async () => {
            const results: Record<string, MarketMoversDTO> = {};
            await Promise.allSettled(activeWatchlist.symbols.map(async (sym) => { try { results[sym.ticker] = await marketApi.getQuote(sym.ticker); } catch {} }));
            setQuotes(results);
        };
        fetchQuotes();
        const interval = setInterval(fetchQuotes, 20000);
        return () => clearInterval(interval);
    }, [activeWatchlist]);

    const handleCreate = async () => {
        if (!newName.trim()) return;
        try {
            const wl = await watchlistApi.create({ name: newName });
            setWatchlists(prev => [...prev, wl]);
            setActiveWatchlist(wl);
            setShowCreate(false);
            setNewName('');
        } catch {}
    };

    const handleDelete = async (id: string) => {
        try { await watchlistApi.remove(id); setWatchlists(prev => prev.filter(w => w._id !== id)); if (activeWatchlist?._id === id) setActiveWatchlist(watchlists.find(w => w._id !== id) || null); } catch {}
    };

    const handleRemoveSymbol = async (symbolId: string) => {
        if (!activeWatchlist) return;
        try { const updated = await watchlistApi.removeSymbol(activeWatchlist._id, symbolId); setActiveWatchlist(updated); setWatchlists(prev => prev.map(w => w._id === updated._id ? updated : w)); } catch {}
    };

    return (
        <div className="watchlist-page">
            <div className="page-header"><div><h1>Focus List</h1><p className="subtitle">Your curated symbol watchlists</p></div><Button label="New Watchlist" icon="pi pi-plus" className="create-btn" onClick={() => setShowCreate(true)} /></div>
            <div className="watchlist-tabs">
                {watchlists.map(wl => <Button key={wl._id} label={wl.name} className={`wl-tab ${activeWatchlist?._id === wl._id ? 'active' : ''}`} onClick={() => setActiveWatchlist(wl)} />)}
            </div>
            {activeWatchlist ? (
                <div className="watchlist-content">
                    <div className="wl-header"><div><h2>{activeWatchlist.name}</h2></div><Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => handleDelete(activeWatchlist._id)} /></div>
                    <DataTable value={activeWatchlist.symbols} loading={loading} className="watchlist-table" responsiveLayout="scroll" emptyMessage="No symbols in this watchlist.">
                        <Column header="Symbol" body={(rowData: SymbolDTO) => <div className="flex-row gap-normal align-center"><div className="ticker-icon">{rowData.ticker[0]}</div><div className="flex-col"><span className="ticker-main">{rowData.ticker}</span><span className="ticker-sub">{rowData.name}</span></div></div>} />
                        <Column header="Price" body={(rowData: SymbolDTO) => quotes[rowData.ticker] ? <AnimatedCounter value={quotes[rowData.ticker].price} format={v => formatCurrency(v)} className="mono bold white-text" /> : <span className="mono">--</span>} />
                        <Column header="24h Change" body={(rowData: SymbolDTO) => { const q = quotes[rowData.ticker]; if (!q) return <span>--</span>; const isUp = q.changePercent >= 0; return <span className={`mono bold ${isUp ? 'text-green' : 'text-red'}`}>{isUp ? '+' : ''}{formatPercent(q.changePercent)}</span>; }} />
                        <Column body={(rowData: SymbolDTO) => <Button icon="pi pi-times" className="p-button-rounded p-button-text p-button-sm remove-btn" onClick={() => handleRemoveSymbol(rowData._id)} />} style={{ width: '50px' }} />
                    </DataTable>
                </div>
            ) : <div className="empty-state"><i className="pi pi-bookmark" /><p>No watchlists yet.</p></div>}
            <Dialog header="Create Watchlist" visible={showCreate} onHide={() => setShowCreate(false)} className="create-dialog" modal>
                <div className="dialog-form">
                    <div className="form-group"><label>Name</label><InputText value={newName} onChange={e => setNewName(e.target.value)} placeholder="My Watchlist" className="form-input" /></div>
                    <Button label="Create" className="submit-btn" onClick={handleCreate} disabled={!newName.trim()} />
                </div>
            </Dialog>
            <style jsx>{`
                .watchlist-page { display: flex; flex-direction: column; gap: 1.5rem; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; }
                h1 { font-size: 1.75rem; color: #fff; font-weight: 800; margin: 0; }
                .subtitle { color: #555; font-size: 0.85rem; margin: 0.25rem 0 0; }
                :global(.create-btn) { background: #007bff !important; border: none !important; border-radius: 8px !important; font-weight: 700 !important; }
                .watchlist-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
                :global(.wl-tab) { background: #111 !important; border: 1px solid #222 !important; color: #94a3b8 !important; border-radius: 8px !important; font-weight: 700 !important; }
                :global(.wl-tab.active) { background: rgba(0,123,255,0.1) !important; border-color: #007bff !important; color: #007bff !important; }
                .wl-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
                .wl-header h2 { font-size: 1.25rem; color: #fff; margin: 0; }
                .flex-row { display: flex; flex-direction: row; }
                .flex-col { display: flex; flex-direction: column; }
                .gap-normal { gap: 1rem; }
                .align-center { align-items: center; }
                .ticker-icon { width: 36px; height: 36px; background: #1a1a1a; border: 1px solid #222; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; }
                .ticker-main { font-weight: 700; color: #fff; }
                .ticker-sub { font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 800; }
                .mono { font-family: 'var(--font-mono)', monospace; }
                .bold { font-weight: 700; }
                .white-text { color: #fff; }
                .text-green { color: #28a745; }
                .text-red { color: #dc3545; }
                :global(.remove-btn) { color: #dc3545 !important; }
                .empty-state { text-align: center; padding: 4rem 2rem; color: #555; }
                .empty-state i { font-size: 2rem; margin-bottom: 1rem; display: block; }
                :global(.create-dialog) { background: #111; border: 1px solid #222; }
                .dialog-form { display: flex; flex-direction: column; gap: 1rem; }
                .form-group label { font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.5rem; }
                :global(.form-input) { width: 100%; background: #0d1117 !important; border: 1px solid #222 !important; color: #fff !important; border-radius: 8px !important; }
                :global(.submit-btn) { background: #007bff !important; border: none !important; border-radius: 8px !important; font-weight: 700 !important; }
                :global(.watchlist-table .p-datatable-thead > tr > th) { background: transparent; border-bottom: 1px solid #222; color: #555; font-size: 0.7rem; text-transform: uppercase; padding: 1.25rem 0.75rem; }
                :global(.watchlist-table .p-datatable-tbody > tr) { background: transparent; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.03); }
            `}</style>
        </div>
    );
}
