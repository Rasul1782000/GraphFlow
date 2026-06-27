'use client';
import { useState, useEffect } from 'react';
import { marketApi, SymbolDTO, MarketMoversDTO } from '@/lib/api/market';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Skeleton } from 'primereact/skeleton';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { useSocket } from '@/app/providers';

export function MarketsPage() {
    const [symbols, setSymbols] = useState<SymbolDTO[]>([]);
    const [movers, setMovers] = useState<MarketMoversDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [assetFilter, setAssetFilter] = useState<string | null>(null);
    const [livePrices, setLivePrices] = useState<Record<string, number>>({});
    const socket = useSocket();

    const assetClasses = [
        { label: 'All Assets', value: null },
        { label: 'Stocks', value: 'stock' },
        { label: 'Crypto', value: 'crypto' },
        { label: 'Forex', value: 'forex' },
        { label: 'ETF', value: 'etf' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [syms, mvs] = await Promise.all([
                    marketApi.getSymbols(assetFilter || undefined),
                    marketApi.getTopMovers(10),
                ]);
                setSymbols(syms);
                setMovers(mvs);
            } catch (err) {
                console.error('Failed to fetch market data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [assetFilter]);

    useEffect(() => {
        if (!socket) return;
        const handleTicker = (data: { symbol: string; price: number }) => {
            setLivePrices(prev => ({ ...prev, [data.symbol]: data.price }));
        };
        socket.on('ticker_update', handleTicker);
        socket.emit('subscribe_ticker', { symbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'] });
        return () => { socket.off('ticker_update', handleTicker); };
    }, [socket]);

    const filteredSymbols = symbols.filter(s =>
        s.ticker.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const tickerBody = (rowData: SymbolDTO) => (
        <div className="flex-row gap-normal align-center">
            <div className="ticker-icon">{rowData.ticker[0]}</div>
            <div className="flex-col">
                <span className="ticker-main">{rowData.ticker}</span>
                <span className="ticker-sub">{rowData.name}</span>
            </div>
        </div>
    );

    const assetClassBody = (rowData: SymbolDTO) => (
        <span className={`asset-badge ${rowData.asset_class}`}>{rowData.asset_class}</span>
    );

    const priceBody = (rowData: SymbolDTO) => {
        const livePrice = livePrices[rowData.ticker];
        return <span className="mono bold white-text">{livePrice ? formatCurrency(livePrice) : '--'}</span>;
    };

    return (
        <div className="markets-page">
            <div className="page-header">
                <div>
                    <h1>Market Pulse</h1>
                    <p className="subtitle">Real-time market data and symbol overview</p>
                </div>
                <span className="live-badge">LIVE</span>
            </div>

            <div className="movers-section">
                <h2>Top Movers</h2>
                <div className="movers-grid">
                    {loading
                        ? [...Array(6)].map((_, i) => <div key={i} className="mover-skeleton"><Skeleton width="40%" height="12px" /><Skeleton width="100%" height="24px" /><Skeleton width="30%" height="10px" /></div>)
                        : movers.map(item => {
                            const isUp = item.changePercent >= 0;
                            return (
                                <div key={item.symbol} className={`mover-card ${isUp ? 'up' : 'down'}`}>
                                    <div className="mover-header"><span className="ticker">{item.symbol}</span><i className={`pi pi-trending-${isUp ? 'up' : 'down'}`} /></div>
                                    <AnimatedCounter value={item.price} format={v => formatCurrency(v)} className={`price ${isUp ? 'text-green' : 'text-red'}`} />
                                    <span className={`change ${isUp ? 'text-green' : 'text-red'}`}>{formatPercent(item.changePercent)}</span>
                                </div>
                            );
                        })}
                </div>
            </div>

            <div className="symbols-section">
                <div className="section-header">
                    <h2>All Symbols</h2>
                    <div className="filters">
                        <InputText value={search} onChange={e => setSearch(e.target.value)} placeholder="Search symbols..." className="search-input" />
                        <Dropdown value={assetFilter} options={assetClasses} onChange={e => setAssetFilter(e.value)} placeholder="Asset Class" className="filter-dropdown" />
                    </div>
                </div>
                <DataTable value={filteredSymbols} loading={loading} className="markets-table" paginator rows={15} responsiveLayout="scroll" emptyMessage="No symbols found.">
                    <Column header="Symbol" body={tickerBody} sortable sortField="ticker" />
                    <Column header="Asset Class" body={assetClassBody} sortable sortField="asset_class" />
                    <Column header="Exchange" field="exchange" sortable />
                    <Column header="Price" body={priceBody} />
                    <Column header="Market Cap" body={(row: SymbolDTO) => row.market_cap ? formatCurrency(row.market_cap) : '--'} sortable sortField="market_cap" />
                </DataTable>
            </div>

            <style jsx>{`
                .markets-page { display: flex; flex-direction: column; gap: 2rem; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; }
                h1 { font-size: 1.75rem; color: #fff; font-weight: 800; margin: 0; }
                .subtitle { color: #555; font-size: 0.85rem; margin: 0.25rem 0 0; }
                .live-badge { font-size: 0.65rem; font-weight: 900; background: rgba(40,167,69,0.1); color: #28a745; padding: 0.3rem 0.8rem; border-radius: 6px; }
                .movers-section h2, .symbols-section h2 { font-size: 1.1rem; color: #fff; margin: 0 0 1rem; }
                .movers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
                .mover-card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 1.25rem; transition: 0.3s; cursor: pointer; }
                .mover-card:hover { transform: translateY(-2px); border-color: #333; }
                .mover-card.up { background: rgba(40,167,69,0.03); }
                .mover-card.down { background: rgba(220,53,69,0.03); }
                .mover-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
                .mover-header .ticker { color: #fff; font-weight: 700; }
                .price { font-size: 1.25rem; font-weight: 800; display: block; margin-bottom: 0.25rem; }
                .change { font-size: 0.8rem; font-weight: 700; }
                .mover-skeleton { background: #111; border: 1px solid #222; border-radius: 12px; padding: 1.25rem; }
                .mover-skeleton :global(.p-skeleton) { background: #1a1a1a !important; margin-bottom: 0.5rem; }
                .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem; }
                .filters { display: flex; gap: 0.75rem; }
                :global(.search-input) { background: #111; border: 1px solid #222; color: #fff; border-radius: 8px; padding: 0.6rem 1rem; width: 220px; }
                :global(.filter-dropdown) { background: #111; border: 1px solid #222; color: #fff; border-radius: 8px; }
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
                .asset-badge { font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 4px; text-transform: uppercase; }
                .asset-badge.stock { background: rgba(0,123,255,0.1); color: #007bff; }
                .asset-badge.crypto { background: rgba(255,165,0,0.1); color: #ffa500; }
                .asset-badge.forex { background: rgba(40,167,69,0.1); color: #28a745; }
                .asset-badge.etf { background: rgba(128,0,128,0.1); color: #800080; }
                :global(.markets-table .p-datatable-thead > tr > th) { background: transparent; border-bottom: 1px solid #222; color: #555; font-size: 0.7rem; text-transform: uppercase; padding: 1.25rem 0.75rem; }
                :global(.markets-table .p-datatable-tbody > tr) { background: transparent; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.03); }
            `}</style>
        </div>
    );
}
