'use client';
import { useState, useEffect } from 'react';
import { portfolioApi } from '@/lib/api/portfolio';
import { formatCurrency } from '@/lib/utils/formatters';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';

export function PortfolioSummaryCard() {
    const [metrics, setMetrics] = useState<any>({
        total_value: 0, total_pnl: 0, total_pnl_percent: 0,
        realized_pnl: 0, open_positions: 0, cash_balance: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const portfolios = await portfolioApi.getPortfolios();
                const portfolioId = portfolios?.[0]?.id;
                if (portfolioId) {
                    const res = await portfolioApi.getMetrics(portfolioId);
                    setMetrics(res.metrics);
                }
            } catch (err) {
                console.error('Portfolio metrics error', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const chartData = {
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        datasets: [{ data: [65, 59, 80, 81, 56, 55, 100], fill: true, borderColor: '#007bff', backgroundColor: 'rgba(0, 123, 255, 0.05)', tension: 0.4 }],
    };

    const chartOptions = {
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
        maintainAspectRatio: false,
        elements: { point: { radius: 0 } },
    };

    return (
        <div className="card-container">
            <div className="card-content">
                <div className="balance-header">
                    <span className="label">Available Liquidity</span>
                    <div className="balance-row">
                        <span className="amount">{formatCurrency(metrics.total_value)}</span>
                        <div className={`pnl-badge ${metrics.total_pnl >= 0 ? 'up' : 'down'}`}>
                            {metrics.total_pnl >= 0 ? '+' : ''}{metrics.total_pnl_percent.toFixed(2)}%
                        </div>
                    </div>
                </div>
                <div className="chart-box">
                    <Chart type="line" data={chartData} options={chartOptions} style={{ height: '80px', width: '100%' }} />
                </div>
                <div className="metrics-grid">
                    <div className="metric-item">
                        <span className="m-label">Realized P/L</span>
                        <span className={`m-value ${metrics.realized_pnl >= 0 ? 'up-text' : 'down-text'}`}>{formatCurrency(metrics.realized_pnl)}</span>
                    </div>
                    <div className="metric-item">
                        <span className="m-label">Active Assets</span>
                        <span className="m-value">{metrics.open_positions} Positions</span>
                    </div>
                </div>
                <Button label="Terminal Swap" icon="pi pi-refresh" className="p-button-primary swap-btn" />
            </div>
            <style jsx>{`
                .card-container { padding: 1.5rem; background: #111; border-radius: 12px; height: 100%; }
                .card-content { display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
                .balance-header { margin-bottom: 1rem; }
                .label { font-size: 0.7rem; text-transform: uppercase; color: #555; font-weight: 800; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem; }
                .balance-row { display: flex; align-items: flex-end; gap: 0.75rem; }
                .amount { font-size: 2.25rem; font-weight: 800; color: #fff; line-height: 1; letter-spacing: -1px; }
                .pnl-badge { font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.5rem; border-radius: 6px; }
                .up { background: rgba(40,167,69,0.1); color: #28a745; }
                .down { background: rgba(220,53,69,0.1); color: #dc3545; }
                .chart-box { height: 80px; margin: 1.5rem 0; width: 100%; }
                .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
                .metric-item { background: #1a1a1a; padding: 1rem; border-radius: 10px; border: 1px solid #222; }
                .m-label { font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.25rem; }
                .m-value { font-size: 0.9rem; font-weight: 700; color: #fff; }
                .up-text { color: #28a745; }
                .down-text { color: #dc3545; }
                :global(.swap-btn) { width: 100% !important; padding: 0.75rem !important; border-radius: 10px !important; font-weight: 700 !important; }
            `}</style>
        </div>
    );
}
