'use client';
import { useQuery } from '@tanstack/react-query';
import { marketApi } from '@/lib/api/market';
import { GlowCard } from '../ui/GlowCard';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export function TopMoversTable() {
    const { data: movers, isLoading } = useQuery({
        queryKey: ['market', 'top-movers-table'],
        queryFn: () => marketApi.getTopMovers(10),
        refetchInterval: 60_000,
    });

    const symbolBody = (rowData: any) => (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-xs text-white">
                {rowData.symbol?.[0] || 'A'}
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-white group-hover:text-brand transition-colors tracking-tight">{rowData.symbol}</span>
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-none mt-1">NASDAQ Exchange</span>
            </div>
        </div>
    );

    const priceBody = (rowData: any) => (
        <span className="font-mono font-bold text-white">{formatCurrency(rowData.price)}</span>
    );

    const changeBody = (rowData: any) => {
        const isUp = rowData.changePercent >= 0;
        return (
            <div className={`flex items-center gap-1.5 font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{formatPercent(rowData.changePercent)}</span>
            </div>
        );
    };

    const actionBody = () => (
        <button className="w-8 h-8 rounded-lg bg-neutral-800/50 hover:bg-brand/20 hover:text-brand flex items-center justify-center transition-all group/btn border border-white/5">
            <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
    );

    const hClass = "bg-transparent text-neutral-500 font-black uppercase text-[10px] tracking-[0.2em] border-none py-4";

    return (
        <GlowCard title="Global Market Movers" className="overflow-hidden">
            <DataTable
                value={movers}
                loading={isLoading}
                dataKey="symbol"
                className="premium-table"
                scrollable
                scrollHeight="400px"
                emptyMessage={<div className="p-8 text-center text-neutral-500 font-bold uppercase tracking-widest text-xs">Awaiting Market Metrics...</div>}
                pt={{
                    header: { className: 'bg-transparent border-none' },
                    thead: { className: 'border-b border-neutral-800' },
                    bodyRow: { className: 'bg-transparent group cursor-pointer hover:bg-neutral-800/20 transition-all border-b border-neutral-800/20' }
                }}
            >
                <Column field="symbol" header="Asset/Ticker" body={symbolBody} sortable style={{ minWidth: '150px' }} headerClassName={hClass} />
                <Column field="price" header="Market Price" body={priceBody} sortable headerClassName={hClass} />
                <Column field="changePercent" header="24H Velocity" body={changeBody} sortable headerClassName={hClass} />
                <Column header="Volume" body={() => <span className="text-neutral-500 font-bold text-xs">$1.24B</span>} headerClassName={hClass} />
                <Column body={actionBody} style={{ width: '50px' }} headerClassName={hClass} />
            </DataTable>
        </GlowCard>
    );
}
