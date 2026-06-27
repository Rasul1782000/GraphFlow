'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { marketApi, SymbolDTO } from '@/lib/api/market';
import { portfolioApi } from '@/lib/api/portfolio';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { formatCurrency } from '@/lib/utils/formatters';
import { useSocket } from '@/app/providers';

export function TradePage() {
    const searchParams = useSearchParams();
    const initialSymbol = searchParams.get('symbol') || 'BTCUSDT';
    const [symbol, setSymbol] = useState(initialSymbol);
    const [symbols, setSymbols] = useState<SymbolDTO[]>([]);
    const [quote, setQuote] = useState<any>(null);
    const [side, setSide] = useState<'long' | 'short'>('long');
    const [quantity, setQuantity] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [stopLoss, setStopLoss] = useState<number | null>(null);
    const [takeProfit, setTakeProfit] = useState<number | null>(null);
    const [timeframe, setTimeframe] = useState('1h');
    const [orderLoading, setOrderLoading] = useState(false);
    const socket = useSocket();

    const timeframes = [{ label: '1m', value: '1m' }, { label: '5m', value: '5m' }, { label: '15m', value: '15m' }, { label: '1h', value: '1h' }, { label: '4h', value: '4h' }, { label: '1d', value: '1d' }];

    useEffect(() => {
        marketApi.getSymbols().then(res => setSymbols(res)).catch(() => {});
    }, []);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await marketApi.getQuote(symbol);
                setQuote(res);
                if (res.price && !price) setPrice(res.price);
            } catch {}
        };
        fetchQuote();
        const interval = setInterval(fetchQuote, 15000);
        return () => clearInterval(interval);
    }, [symbol]);

    useEffect(() => {
        if (!socket) return;
        const handleTicker = (data: { symbol: string; price: number }) => {
            if (data.symbol === symbol) setQuote((prev: any) => ({ ...prev, price: data.price }));
        };
        socket.on('ticker_update', handleTicker);
        socket.emit('subscribe_ticker', { symbols: [symbol] });
        return () => { socket.off('ticker_update', handleTicker); };
    }, [socket, symbol]);

    const handleOrder = async () => {
        if (!quantity || !price) return;
        setOrderLoading(true);
        try {
            const portfolios = await portfolioApi.getPortfolios();
            const portfolioId = portfolios?.[0]?.id;
            if (!portfolioId) return;
            const symbolData = symbols.find(s => s.ticker === symbol);
            await portfolioApi.openPosition(portfolioId, { symbol_id: symbolData?._id || '', side, quantity, price, stop_loss: stopLoss || undefined, take_profit: takeProfit || undefined });
            setQuantity(0);
        } catch (err) { console.error('Order failed', err); }
        finally { setOrderLoading(false); }
    };

    const total = quantity * price;
    const fee = total * 0.001;

    return (
        <div className="trade-page">
            <div className="page-header"><div><h1>Execution</h1><p className="subtitle">Trade execution and chart analysis</p></div></div>
            <div className="trade-layout">
                <div className="chart-section">
                    <div className="chart-header">
                        <div className="chart-symbol">
                            <span className="ticker">{symbol}</span>
                            {quote && <span className={`live-price ${quote.change >= 0 ? 'text-green' : 'text-red'}`}>{formatCurrency(quote.price)}</span>}
                        </div>
                        <div className="tf-selector">
                            {timeframes.map(tf => <Button key={tf.value} label={tf.label} className={`p-button-sm tf-btn ${timeframe === tf.value ? 'active' : ''}`} onClick={() => setTimeframe(tf.value)} />)}
                        </div>
                    </div>
                    <div className="chart-container"><CandlestickChart symbol={symbol} timeframe={timeframe as any} onTimeframeChange={setTimeframe as any} /></div>
                </div>
                <div className="order-section">
                    <div className="order-card">
                        <h3>Place Order</h3>
                        <div className="form-group"><label>Symbol</label><Dropdown value={symbol} options={symbols.map(s => ({ label: `${s.ticker} - ${s.name}`, value: s.ticker }))} onChange={e => setSymbol(e.value)} filter className="form-input" /></div>
                        <div className="side-toggle">
                            <Button label="LONG" className={`side-btn long ${side === 'long' ? 'active' : ''}`} onClick={() => setSide('long')} />
                            <Button label="SHORT" className={`side-btn short ${side === 'short' ? 'active' : ''}`} onClick={() => setSide('short')} />
                        </div>
                        <div className="form-group"><label>Price</label><InputNumber value={price} onValueChange={e => setPrice(e.value || 0)} mode="currency" currency="USD" className="form-input" /></div>
                        <div className="form-group"><label>Quantity</label><InputNumber value={quantity} onValueChange={e => setQuantity(e.value || 0)} min={0} className="form-input" /></div>
                        <div className="form-row">
                            <div className="form-group half"><label>Stop Loss</label><InputNumber value={stopLoss} onValueChange={e => setStopLoss(e.value ?? null)} mode="currency" currency="USD" className="form-input" /></div>
                            <div className="form-group half"><label>Take Profit</label><InputNumber value={takeProfit} onValueChange={e => setTakeProfit(e.value ?? null)} mode="currency" currency="USD" className="form-input" /></div>
                        </div>
                        <div className="order-summary">
                            <div className="summary-row"><span>Subtotal</span><span className="mono">{formatCurrency(total)}</span></div>
                            <div className="summary-row"><span>Fee (0.1%)</span><span className="mono">{formatCurrency(fee)}</span></div>
                            <div className="summary-row total"><span>Total</span><span className="mono bold">{formatCurrency(total + fee)}</span></div>
                        </div>
                        <Button label={side === 'long' ? 'Open Long' : 'Open Short'} icon="pi pi-bolt" className={`order-btn ${side}`} loading={orderLoading} onClick={handleOrder} disabled={!quantity || !price} />
                    </div>
                </div>
            </div>
            <style jsx>{`
                .trade-page { display: flex; flex-direction: column; gap: 1.5rem; }
                .page-header { display: flex; justify-content: space-between; }
                h1 { font-size: 1.75rem; color: #fff; font-weight: 800; margin: 0; }
                .subtitle { color: #555; font-size: 0.85rem; margin: 0.25rem 0 0; }
                .trade-layout { display: grid; grid-template-columns: 1fr 380px; gap: 1.5rem; }
                .chart-section { background: #111; border: 1px solid #222; border-radius: 12px; overflow: hidden; }
                .chart-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #222; }
                .chart-symbol { display: flex; align-items: center; gap: 1rem; }
                .ticker { color: #fff; font-weight: 800; font-size: 1.1rem; }
                .live-price { font-size: 1.1rem; font-weight: 800; font-family: 'var(--font-mono)', monospace; }
                .tf-selector { display: flex; gap: 0.25rem; }
                :global(.tf-btn) { background: transparent !important; border: none !important; color: #555 !important; font-size: 0.7rem !important; font-weight: 700 !important; padding: 0.4rem 0.6rem !important; border-radius: 6px !important; }
                :global(.tf-btn.active) { background: rgba(0,123,255,0.1) !important; color: #007bff !important; }
                .chart-container { height: 450px; }
                .order-card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 1.5rem; }
                .order-card h3 { font-size: 1rem; color: #fff; margin: 0 0 1.5rem; }
                .form-group { margin-bottom: 1rem; }
                .form-group label { font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.5rem; }
                .form-row { display: flex; gap: 0.75rem; }
                .form-group.half { flex: 1; }
                :global(.form-input) { width: 100%; background: #0d1117 !important; border: 1px solid #222 !important; color: #fff !important; border-radius: 8px !important; }
                .side-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem; }
                :global(.side-btn) { border-radius: 8px !important; font-weight: 800 !important; border: 2px solid transparent !important; }
                :global(.side-btn.long) { background: rgba(40,167,69,0.1) !important; color: #28a745 !important; border-color: rgba(40,167,69,0.3) !important; }
                :global(.side-btn.long.active) { background: #28a745 !important; color: #000 !important; }
                :global(.side-btn.short) { background: rgba(220,53,69,0.1) !important; color: #dc3545 !important; border-color: rgba(220,53,69,0.3) !important; }
                :global(.side-btn.short.active) { background: #dc3545 !important; color: #fff !important; }
                .order-summary { background: #0d1117; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
                .summary-row { display: flex; justify-content: space-between; font-size: 0.8rem; color: #555; margin-bottom: 0.5rem; }
                .summary-row.total { color: #fff; font-weight: 700; border-top: 1px solid #222; padding-top: 0.5rem; }
                .mono { font-family: 'var(--font-mono)', monospace; }
                .bold { font-weight: 700; }
                :global(.order-btn) { width: 100%; padding: 0.85rem !important; border-radius: 10px !important; font-weight: 800 !important; }
                :global(.order-btn.long) { background: #28a745 !important; border: none !important; }
                :global(.order-btn.short) { background: #dc3545 !important; border: none !important; }
                .text-green { color: #28a745; }
                .text-red { color: #dc3545; }
            `}</style>
        </div>
    );
}
