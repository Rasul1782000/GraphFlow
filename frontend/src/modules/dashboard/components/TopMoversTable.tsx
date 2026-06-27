'use client';
import { useState, useEffect } from 'react';
import { marketApi } from '@/lib/api/market';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';

export function TopMoversTable() {
    const [movers, setMovers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovers = async () => {
            try {
                const res = await marketApi.getTopMovers(10);
                setMovers(res);
            } catch (err) {
                console.error('Movers table fetch error', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovers();
        const interval = setInterval(fetchMovers, 60000);
        return () => clearInterval(interval);
    }, []);

    const symbolBody = (rowData: any) => (
        <div className="flex-row gap-small align-center">
            <div className="ticker-icon">{rowData.symbol?.[0] || 'A'}</div>
            <div className="flex-col">
                <span className="ticker-main">{rowData.symbol}</span>
                <span className="ticker-sub">NASDAQ Exchange</span>
            </div>
        </div>
    );

    const priceBody = (rowData: any) => (
        <span className="mono bold text-white">{formatCurrency(rowData.price)}</span>
    );

    const changeBody = (rowData: any) => {
        const isUp = rowData.changePercent >= 0;
        return (
            <div className={`pnl-val ${isUp ? 'up' : 'down'}`}>
                <i className={`pi pi-arrow-${isUp ? 'up' : 'down'} icon`} />
                <span>{formatPercent(rowData.changePercent)}</span>
            </div>
        );
    };

    return (
        <div className="card-container">
            <div className="card-header"><h3>Global Market Movers</h3></div>
            <DataTable value={movers} loading={loading} className="p-datatable-sm minimalistic-table" scrollable scrollHeight="400px" emptyMessage="Awaiting market metrics...">
                <Column header="Asset/Ticker" body={symbolBody} sortable style={{ minWidth: '150px' }} />
                <Column header="Market Price" body={priceBody} sortable />
                <Column header="24H Velocity" body={changeBody} sortable />
            </DataTable>
            <style jsx>{`
                .card-container { padding: 1.5rem; background: #111; border-radius: 12px; }
                .card-header { margin-bottom: 1.5rem; }
                h3 { font-size: 1.1rem; color: #fff; margin: 0; }
                .flex-row { display: flex; flex-direction: row; }
                .flex-col { display: flex; flex-direction: column; }
                .gap-small { gap: 0.75rem; }
                .align-center { align-items: center; }
                .ticker-icon { width: 32px; height: 32px; background: #222; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800; color: #fff; }
                .ticker-main { font-weight: 700; color: #fff; font-size: 0.9rem; }
                .ticker-sub { font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 800; margin-top: 2px; }
                .mono { font-family: 'var(--font-mono)', monospace; }
                .bold { font-weight: 700; }
                .text-white { color: #fff; }
                .pnl-val { display: flex; align-items: center; gap: 0.4rem; font-weight: 700; font-size: 0.85rem; }
                .up { color: #28a745; }
                .down { color: #dc3545; }
                .icon { font-size: 0.75rem; }
                :global(.minimalistic-table .p-datatable-thead > tr > th) { background: transparent; border-bottom: 1px solid #222; color: #555; font-size: 0.7rem; text-transform: uppercase; padding: 1.25rem 0.75rem; }
                :global(.minimalistic-table .p-datatable-tbody > tr) { background: transparent; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.05); }
            `}</style>
        </div>
    );
}
