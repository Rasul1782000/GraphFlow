'use client';
import { useState, useEffect } from 'react';
import { portfolioApi } from '@/lib/api/portfolio';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabView, TabPanel } from 'primereact/tabview';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { Chart } from 'primereact/chart';

export function PortfolioPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [positions, setPositions] = useState<any[]>([]);
    const [trades, setTrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await portfolioApi.getPortfolios();
                const list = Array.isArray(res) ? res : [];
                if (list[0]) {
                    const metricsRes = await portfolioApi.getMetrics(list[0].id);
                    setMetrics(metricsRes.metrics);
                    setPositions(metricsRes.portfolio?.positions || []);
                }
            } catch (err) { console.error('Portfolio fetch error', err); }
            finally { setLoading(false); }
        };
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    const positionSymbolBody = (rowData: any) => (
        <div className="flex-row gap-normal align-center">
            <div className="ticker-icon">{rowData.symbol?.ticker?.[0] || 'A'}</div>
            <div className="flex-col">
                <span className="ticker-main">{rowData.symbol?.ticker || 'N/A'}</span>
                <span className="ticker-sub">{rowData.side?.toUpperCase()}</span>
            </div>
        </div>
    );

    const pnlBody = (rowData: any) => {
        const current = rowData.current_price || rowData.avg_entry_price;
        const diff = rowData.side === 'long' ? (current - rowData.avg_entry_price) * rowData.quantity : (rowData.avg_entry_price - current) * rowData.quantity;
        const pct = ((current - rowData.avg_entry_price) / rowData.avg_entry_price) * 100;
        const isUp = diff >= 0;
        return (
            <div className="flex-col align-end">
                <span className={`mono bold ${isUp ? 'text-green' : 'text-red'}`}>{isUp ? '+' : ''}{formatCurrency(diff)}</span>
                <span className={`tiny-meta ${isUp ? 'text-green' : 'text-red'}`}>{isUp ? '+' : ''}{formatPercent(pct)}</span>
            </div>
        );
    };

    const chartData = { labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], datasets: [{ data: [65, 59, 80, 81, 56, 55, 100], fill: true, borderColor: '#007bff', backgroundColor: 'rgba(0, 123, 255, 0.05)', tension: 0.4 }] };
    const chartOptions = { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } }, maintainAspectRatio: false, elements: { point: { radius: 0 } } };

    return (
        <div className="portfolio-page">
            <div className="page-header"><div><h1>Assets</h1><p className="subtitle">Portfolio overview and position management</p></div></div>
            <div className="metrics-row">
                <div className="metric-card"><span className="metric-label">Total Value</span><span className="metric-value">{formatCurrency(metrics?.total_value || 0)}</span></div>
                <div className="metric-card"><span className="metric-label">Cash Balance</span><span className="metric-value">{formatCurrency(metrics?.cash_balance || 0)}</span></div>
                <div className="metric-card"><span className="metric-label">Total P/L</span><span className={`metric-value ${(metrics?.total_pnl || 0) >= 0 ? 'text-green' : 'text-red'}`}>{(metrics?.total_pnl || 0) >= 0 ? '+' : ''}{formatCurrency(metrics?.total_pnl || 0)}</span></div>
                <div className="metric-card"><span className="metric-label">Open Positions</span><span className="metric-value">{metrics?.open_positions || 0}</span></div>
            </div>
            <div className="chart-section"><div className="chart-card"><h3>Portfolio Performance</h3><div className="chart-wrapper"><Chart type="line" data={chartData} options={chartOptions} style={{ height: '200px', width: '100%' }} /></div></div></div>
            <TabView className="portfolio-tabs">
                <TabPanel header="Open Positions">
                    <DataTable value={positions.filter((p: any) => p.status === 'open')} loading={loading} className="portfolio-table" responsiveLayout="scroll" emptyMessage="No open positions.">
                        <Column header="Instrument" body={positionSymbolBody} />
                        <Column field="quantity" header="Size" style={{ textAlign: 'center' }} />
                        <Column header="Entry" body={(row: any) => <span className="mono">{formatCurrency(row.avg_entry_price)}</span>} />
                        <Column header="Current" body={(row: any) => <span className="mono blue-text">{formatCurrency(row.current_price || row.avg_entry_price)}</span>} />
                        <Column header="P/L" body={pnlBody} />
                    </DataTable>
                </TabPanel>
                <TabPanel header="Trade History">
                    <DataTable value={trades} loading={loading} className="portfolio-table" responsiveLayout="scroll" emptyMessage="No trade history.">
                        <Column field="type" header="Type" body={(row: any) => <span className={`type-badge ${row.type}`}>{row.type}</span>} />
                        <Column header="Symbol" body={(row: any) => row.symbol?.ticker || 'N/A'} />
                        <Column field="quantity" header="Qty" />
                        <Column header="Price" body={(row: any) => <span className="mono">{formatCurrency(row.price)}</span>} />
                        <Column header="Total" body={(row: any) => <span className="mono bold">{formatCurrency(row.total)}</span>} />
                    </DataTable>
                </TabPanel>
            </TabView>
            <style jsx>{`
                .portfolio-page { display: flex; flex-direction: column; gap: 2rem; }
                .page-header { display: flex; justify-content: space-between; }
                h1 { font-size: 1.75rem; color: #fff; font-weight: 800; margin: 0; }
                .subtitle { color: #555; font-size: 0.85rem; margin: 0.25rem 0 0; }
                .metrics-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
                .metric-card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
                .metric-label { font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 800; }
                .metric-value { font-size: 1.5rem; font-weight: 800; color: #fff; }
                .chart-card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 1.5rem; }
                .chart-card h3 { font-size: 1rem; color: #fff; margin: 0 0 1rem; }
                .flex-row { display: flex; flex-direction: row; }
                .flex-col { display: flex; flex-direction: column; }
                .gap-normal { gap: 1rem; }
                .align-center { align-items: center; }
                .align-end { align-items: flex-end; }
                .ticker-icon { width: 36px; height: 36px; background: #1a1a1a; border: 1px solid #222; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; }
                .ticker-main { font-weight: 700; color: #fff; }
                .ticker-sub { font-size: 0.6rem; color: #555; text-transform: uppercase; font-weight: 800; }
                .mono { font-family: 'var(--font-mono)', monospace; }
                .bold { font-weight: 700; }
                .text-green { color: #28a745; }
                .text-red { color: #dc3545; }
                .blue-text { color: var(--brand); }
                .tiny-meta { font-size: 0.65rem; font-weight: 700; }
                .type-badge { font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 4px; text-transform: uppercase; }
                .type-badge.buy { background: rgba(40,167,69,0.1); color: #28a745; }
                .type-badge.sell { background: rgba(220,53,69,0.1); color: #dc3545; }
                :global(.portfolio-tabs .p-tabview-nav) { background: transparent; border: none; }
                :global(.portfolio-tabs .p-tabview-panels) { background: transparent; padding: 1rem 0; }
                :global(.portfolio-table .p-datatable-thead > tr > th) { background: transparent; border-bottom: 1px solid #222; color: #555; font-size: 0.7rem; text-transform: uppercase; padding: 1.25rem 0.75rem; }
                :global(.portfolio-table .p-datatable-tbody > tr) { background: transparent; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.03); }
            `}</style>
        </div>
    );
}
