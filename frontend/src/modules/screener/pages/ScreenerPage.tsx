'use client';
import { useState, useEffect } from 'react';
import { marketApi, SymbolDTO } from '@/lib/api/market';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { formatCurrency } from '@/lib/utils/formatters';
import { useRouter } from 'next/navigation';

export function ScreenerPage() {
    const router = useRouter();
    const [symbols, setSymbols] = useState<SymbolDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [assetFilter, setAssetFilter] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('market_cap');
    const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');

    const assetClasses = [{ label: 'Stocks', value: 'stock' }, { label: 'Crypto', value: 'crypto' }, { label: 'Forex', value: 'forex' }, { label: 'ETF', value: 'etf' }];
    const sortOptions = [{ label: 'Market Cap', value: 'market_cap' }, { label: 'Name', value: 'name' }, { label: 'Ticker', value: 'ticker' }];

    useEffect(() => {
        const fetchScreener = async () => {
            setLoading(true);
            try {
                let res = await marketApi.getSymbols();
                if (search) { const q = search.toLowerCase(); res = res.filter((s: any) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)); }
                if (assetFilter.length > 0) { res = res.filter((s: any) => assetFilter.includes(s.asset_class)); }
                res.sort((a: any, b: any) => { const aVal = a[sortBy] || 0; const bVal = b[sortBy] || 0; return sortDir === 'ASC' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1); });
                setSymbols(res);
            } catch (err) { console.error('Screener error', err); }
            finally { setLoading(false); }
        };
        fetchScreener();
    }, [search, assetFilter, sortBy, sortDir]);

    const tickerBody = (rowData: SymbolDTO) => (
        <div className="flex-row gap-normal align-center">
            <div className="ticker-icon">{rowData.ticker[0]}</div>
            <div className="flex-col"><span className="ticker-main">{rowData.ticker}</span><span className="ticker-sub">{rowData.name}</span></div>
        </div>
    );

    return (
        <div className="screener-page">
            <div className="page-header"><div><h1>Discovery</h1><p className="subtitle">Screen and discover market symbols</p></div></div>
            <div className="filters-panel">
                <InputText value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ticker..." className="search-input" />
                <Dropdown value={sortBy} options={sortOptions} onChange={e => setSortBy(e.target.value)} className="filter-dropdown" />
                <Button icon={`pi pi-sort-${sortDir === 'DESC' ? 'amount-down' : 'amount-up'}`} className="p-button-outlined p-button-secondary sort-btn" onClick={() => setSortDir(d => d === 'ASC' ? 'DESC' : 'ASC')} />
            </div>
            <div className="asset-filters">
                {assetClasses.map(ac => (
                    <Button key={ac.value} label={ac.label} className={`p-button-sm asset-btn ${assetFilter.includes(ac.value) ? 'active' : ''}`} onClick={() => setAssetFilter(prev => prev.includes(ac.value) ? prev.filter(v => v !== ac.value) : [...prev, ac.value])} />
                ))}
                {assetFilter.length > 0 && <Button label="Clear" className="p-button-sm p-button-text clear-btn" onClick={() => setAssetFilter([])} />}
            </div>
            <DataTable value={symbols} loading={loading} className="screener-table" paginator rows={20} responsiveLayout="scroll" emptyMessage="No symbols match your filters.">
                <Column header="Symbol" body={tickerBody} sortable sortField="ticker" />
                <Column header="Asset Class" body={(row: SymbolDTO) => <span className={`asset-badge ${row.asset_class}`}>{row.asset_class}</span>} sortable sortField="asset_class" />
                <Column header="Exchange" field="exchange" sortable />
                <Column header="Market Cap" body={(row: SymbolDTO) => row.market_cap ? formatCurrency(row.market_cap) : '--'} sortable sortField="market_cap" />
            </DataTable>
            <style jsx>{`
                .screener-page { display: flex; flex-direction: column; gap: 1.5rem; }
                .page-header { display: flex; justify-content: space-between; }
                h1 { font-size: 1.75rem; color: #fff; font-weight: 800; margin: 0; }
                .subtitle { color: #555; font-size: 0.85rem; margin: 0.25rem 0 0; }
                .filters-panel { display: flex; gap: 0.75rem; flex-wrap: wrap; }
                :global(.search-input) { background: #111; border: 1px solid #222; color: #fff; border-radius: 8px; padding: 0.6rem 1rem; flex: 1; min-width: 200px; }
                :global(.filter-dropdown) { background: #111; border: 1px solid #222; color: #fff; border-radius: 8px; min-width: 140px; }
                :global(.sort-btn) { border-color: #333 !important; color: #94a3b8 !important; }
                .asset-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }
                :global(.asset-btn) { background: #111 !important; border: 1px solid #222 !important; color: #94a3b8 !important; border-radius: 8px !important; font-weight: 700 !important; font-size: 0.75rem !important; }
                :global(.asset-btn.active) { background: #007bff !important; border-color: #007bff !important; color: #fff !important; }
                :global(.clear-btn) { color: #dc3545 !important; }
                .flex-row { display: flex; flex-direction: row; }
                .flex-col { display: flex; flex-direction: column; }
                .gap-normal { gap: 1rem; }
                .align-center { align-items: center; }
                .ticker-icon { width: 36px; height: 36px; background: #1a1a1a; border: 1px solid #222; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; }
                .ticker-main { font-weight: 700; color: #fff; }
                .ticker-sub { font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 800; }
                .asset-badge { font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 4px; text-transform: uppercase; }
                .asset-badge.stock { background: rgba(0,123,255,0.1); color: #007bff; }
                .asset-badge.crypto { background: rgba(255,165,0,0.1); color: #ffa500; }
                .asset-badge.forex { background: rgba(40,167,69,0.1); color: #28a745; }
                .asset-badge.etf { background: rgba(128,0,128,0.1); color: #800080; }
                :global(.screener-table .p-datatable-thead > tr > th) { background: transparent; border-bottom: 1px solid #222; color: #555; font-size: 0.7rem; text-transform: uppercase; padding: 1.25rem 0.75rem; }
                :global(.screener-table .p-datatable-tbody > tr) { background: transparent; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.03); }
            `}</style>
        </div>
    );
}
