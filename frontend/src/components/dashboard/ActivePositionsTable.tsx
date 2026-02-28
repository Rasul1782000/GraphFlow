'use client';
import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from '@/lib/api/portfolio';
import { GlowCard } from '../ui/GlowCard';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { TrendingUp, TrendingDown, XCircle } from 'lucide-react';

export function ActivePositionsTable() {
    const { data: portfolios, isLoading } = useQuery({
        queryKey: ['portfolio', 'active-positions'],
        queryFn: async () => {
            const res = await portfolioApi.getPortfolios();
            return (res as any);
        },
        refetchInterval: 10_000,
    });

    const activePositions = Array.isArray(portfolios) ? portfolios[0]?.positions?.filter((p: any) => p.status === 'open') || [] : [];

    const symbolBody = (rowData: any) => (
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center font-bold text-xs text-white border border-white/5">
                {rowData.symbol?.ticker?.[0] || 'A'}
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-white tracking-tight">{rowData.symbol?.ticker || 'BTC/USDT'}</span>
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-none mt-1">{rowData.symbol?.name || 'Position'}</span>
            </div>
        </div>
    );

    const priceBody = (rowData: any) => (
        <div className="flex flex-col">
            <span className="font-mono font-bold text-white">{formatCurrency(rowData.avg_entry_price)}</span>
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-none mt-1">Entry</span>
        </div>
    );

    const currentPriceBody = (rowData: any) => (
        <div className="flex flex-col">
            <span className="font-mono font-bold text-brand">{formatCurrency(rowData.current_price || rowData.avg_entry_price)}</span>
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-none mt-1">Mark</span>
        </div>
    );

    const quantityBody = (rowData: any) => (
        <span className="font-mono font-bold text-neutral-300">{rowData.quantity}</span>
    );

    const pnlBody = (rowData: any) => {
        const current = rowData.current_price || rowData.avg_entry_price;
        const diff = (current - rowData.avg_entry_price) * rowData.quantity;
        const pct = ((current - rowData.avg_entry_price) / rowData.avg_entry_price) * 100;
        const isUp = diff >= 0;

        return (
            <div className="flex flex-col items-end">
                <span className={`font-mono font-black ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                    {isUp ? '+' : ''}{formatCurrency(diff)}
                </span>
                <div className={`flex items-center gap-1 text-[10px] font-bold ${isUp ? 'text-green-500/80' : 'text-red-500/80'}`}>
                    {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {formatPercent(pct)}
                </div>
            </div>
        );
    };

    const actionBody = () => (
        <div className="flex items-center gap-2 justify-end">
            <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text p-button-sm text-red-500 hover:bg-red-500/10"
            />
            <Button
                icon="pi pi-ellipsis-h"
                className="p-button-rounded p-button-text p-button-sm text-neutral-500 hover:bg-neutral-800"
            />
        </div>
    );

    const hClass = "bg-transparent text-neutral-500 font-black uppercase text-[10px] tracking-[0.2em] border-none py-4";

    return (
        <GlowCard
            title="Strategic Active Holdings"
            headerRight={
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Live Terminal</span>
                </div>
            }
        >
            <DataTable
                value={activePositions}
                loading={isLoading}
                dataKey="id"
                className="premium-table"
                responsiveLayout="scroll"
                emptyMessage={
                    <div className="p-12 text-center flex flex-col items-center gap-3">
                        <XCircle size={40} className="text-neutral-800" />
                        <p className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-xs">No Active Strategic Positions</p>
                    </div>
                }
                pt={{
                    header: { className: 'bg-transparent border-none' },
                    thead: { className: 'border-b border-neutral-800' },
                    bodyRow: { className: 'bg-transparent group cursor-pointer hover:bg-neutral-800/10 transition-all border-b border-neutral-800/30' }
                }}
            >
                <Column field="symbol.ticker" header="Instrument" body={symbolBody} sortable style={{ width: '25%' }} headerClassName={hClass} />
                <Column field="quantity" header="Size" body={quantityBody} sortable style={{ width: '15%' }} headerClassName={hClass} />
                <Column field="avg_entry_price" header="Avg Entry" body={priceBody} sortable style={{ width: '15%' }} headerClassName={hClass} />
                <Column field="current_price" header="Market Price" body={currentPriceBody} sortable style={{ width: '15%' }} headerClassName={hClass} />
                <Column header="Unrealized P/L" body={pnlBody} style={{ width: '20%', textAlign: 'right' }} headerClassName={hClass + " text-right"} />
                <Column body={actionBody} style={{ width: '10%' }} headerClassName={hClass} />
            </DataTable>
        </GlowCard>
    );
}
