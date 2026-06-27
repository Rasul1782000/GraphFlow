'use client';
import { useState, useEffect } from 'react';
import { portfolioApi } from '@/lib/api/portfolio';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export function ActivePositionsTable() {
    const [activePositions, setActivePositions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const res = await portfolioApi.getPortfolios();
                const portfolios = Array.isArray(res) ? res : [];
                const positions = portfolios[0]?.positions?.filter((p: any) => p.status === 'open') || [];
                setActivePositions(positions);
            } catch (err) {
                console.error('Failed to fetch positions', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolios();
        const interval = setInterval(fetchPortfolios, 10000);
        return () => clearInterval(interval);
    }, []);

    const symbolBody = (rowData: any) => (
        <div className="flex-row gap-normal align-center">
            <div className="identity-monogram">{rowData.symbol?.ticker?.[0] || 'A'}</div>
            <div className="flex-col">
                <span className="ticker-label">{rowData.symbol?.ticker || 'BTC/USDT'}</span>
                <span className="source-label">{rowData.symbol?.name || 'Asset Position'}</span>
            </div>
        </div>
    );

    const priceBody = (rowData: any) => (
        <div className="flex-col text-right">
            <span className="mono bold white-text-bright">{formatCurrency(rowData.avg_entry_price)}</span>
            <span className="tiny-meta uppercase">Execution Price</span>
        </div>
    );

    const currentPriceBody = (rowData: any) => (
        <div className="flex-col text-right">
            <span className="mono bold blue-text-brand">{formatCurrency(rowData.current_price || rowData.avg_entry_price)}</span>
            <span className="tiny-meta uppercase">Mark Price</span>
        </div>
    );

    const pnlBody = (rowData: any) => {
        const current = rowData.current_price || rowData.avg_entry_price;
        const diff = (current - rowData.avg_entry_price) * rowData.quantity;
        const pct = ((current - rowData.avg_entry_price) / rowData.avg_entry_price) * 100;
        const isUp = diff >= 0;

        return (
            <div className="flex-col align-end">
                <div className={`pnl-pill ${isUp ? 'positive' : 'negative'}`}>
                    <i className={`pi pi-arrow-${isUp ? 'up' : 'down'} icon`} />
                    <span className="bold">{isUp ? '+' : ''}{formatPercent(pct)}</span>
                </div>
                <span className={`mono bold detail-val ${isUp ? 'text-green' : 'text-red'}`}>
                    {isUp ? '+' : ''}{formatCurrency(diff)}
                </span>
            </div>
        );
    };

    return (
        <div className="table-container-premium">
            <div className="section-head">
                <div className="head-left">
                    <div className="status-orb" />
                    <h3>Live Operational Desk</h3>
                    <div className="positions-count">{activePositions.length} ACTIVE</div>
                </div>
            </div>

            <DataTable
                value={activePositions}
                loading={loading}
                className="minimalistic-table-v2"
                responsiveLayout="scroll"
                emptyMessage="Operational desk is currently clear."
            >
                <Column header="Instrument" body={symbolBody} />
                <Column field="quantity" header="Size" style={{ textAlign: 'center' }} />
                <Column header="Entry" body={priceBody} style={{ textAlign: 'right' }} />
                <Column header="Mark Value" body={currentPriceBody} style={{ textAlign: 'right' }} />
                <Column header="Performance" body={pnlBody} style={{ textAlign: 'right' }} />
            </DataTable>

            <style jsx>{`
                .table-container-premium { padding: 0.5rem; }
                .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 0 0.5rem; }
                .head-left { display: flex; align-items: center; gap: 1rem; }
                .status-orb { width: 10px; height: 10px; background: #28a745; border-radius: 50%; box-shadow: 0 0 10px #28a745; }
                h3 { font-size: 1.25rem; color: #fff; font-weight: 800; letter-spacing: -0.02em; }
                .positions-count { font-size: 0.65rem; font-weight: 900; background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 6px; color: #475569; letter-spacing: 0.05em; }
                .flex-row { display: flex; flex-direction: row; }
                .flex-col { display: flex; flex-direction: column; }
                .gap-normal { gap: 1.25rem; }
                .align-center { align-items: center; }
                .align-end { align-items: flex-end; }
                .identity-monogram { width: 40px; height: 40px; background: #0d1117; border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; font-size: 1.1rem; }
                .ticker-label { font-size: 1rem; font-weight: 800; color: #fff; }
                .source-label { font-size: 0.7rem; color: #475569; text-transform: uppercase; font-weight: 800; margin-top: 1px; }
                .mono { font-family: 'var(--font-mono)', monospace; }
                .white-text-bright { color: #f8fafc; }
                .blue-text-brand { color: var(--brand); }
                .text-green { color: #10b981; }
                .text-red { color: #ef4444; }
                .tiny-meta { font-size: 0.6rem; color: #475569; font-weight: 800; letter-spacing: 0.05em; margin-top: 2px; }
                .uppercase { text-transform: uppercase; }
                .pnl-pill { display: flex; align-items: center; gap: 0.4rem; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; margin-bottom: 2px; }
                .pnl-pill.positive { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .pnl-pill.negative { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
                .detail-val { font-size: 0.85rem; }
                .icon { font-size: 0.7rem; }
                :global(.minimalistic-table-v2 .p-datatable-thead > tr > th) { background: transparent; border-bottom: 1.5px solid rgba(255,255,255,0.03); color: #475569; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; padding: 1.5rem 1rem; font-weight: 900; }
                :global(.minimalistic-table-v2 .p-datatable-tbody > tr) { background: transparent; color: #fff; border-bottom: 1.5px solid rgba(255,255,255,0.03); transition: 0.2s; }
                :global(.minimalistic-table-v2 .p-datatable-tbody > tr:hover) { background: rgba(255,255,255,0.015); }
            `}</style>
        </div>
    );
}
