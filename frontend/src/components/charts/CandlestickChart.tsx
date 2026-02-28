'use client';
import { useEffect, useRef, useCallback } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';
import { useTheme } from 'next-themes';
import { useMarketData } from '@/hooks/useMarketData';
import { useSocket } from '@/app/providers';
import { ChartToolbar } from './ChartToolbar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'] as const;
type Timeframe = typeof TIMEFRAMES[number];

interface Props {
    symbol: string;
    timeframe: Timeframe;
    onTimeframeChange: (tf: Timeframe) => void;
}

export function CandlestickChart({ symbol, timeframe, onTimeframeChange }: Props) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<any>(null);
    const { resolvedTheme } = useTheme();
    const socket = useSocket();
    const { data: ohlcv, isLoading } = useMarketData(symbol, timeframe);

    const isDark = resolvedTheme === 'dark';

    const initChart = useCallback(() => {
        if (!chartContainerRef.current) return;
        if (chartRef.current) chartRef.current.remove();

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: isDark ? '#030712' : '#ffffff' },
                textColor: isDark ? '#9ca3af' : '#374151',
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
            },
            grid: {
                vertLines: { color: isDark ? '#111827' : '#f9fafb' },
                horzLines: { color: isDark ? '#111827' : '#f9fafb' },
            },
            crosshair: { mode: 1 },
            rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.1, bottom: 0.3 } },
            timeScale: {
                borderVisible: false,
                timeVisible: true,
                secondsVisible: timeframe === '1m' || timeframe === '5m',
            },
            handleScroll: true,
            handleScale: true,
        });

        const candleSeries = chart.addCandlestickSeries({
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        });

        const volumeSeries = chart.addHistogramSeries({
            color: '#6366f1',
            priceFormat: { type: 'volume' },
            priceScaleId: 'volume',
        });
        chart.priceScale('volume').applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
        });

        if (ohlcv?.length) {
            candleSeries.setData(ohlcv);
            volumeSeries.setData(ohlcv.map(c => ({
                time: c.time,
                value: c.volume,
                color: c.close >= c.open ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
            })));
            chart.timeScale().fitContent();
        }

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        chartRef.current = chart;
        candleSeriesRef.current = candleSeries;

        return () => { window.removeEventListener('resize', handleResize); };
    }, [ohlcv, isDark, timeframe]);

    useEffect(() => { const cleanup = initChart(); return () => cleanup?.(); }, [initChart]);

    // Live updates via WebSocket
    useEffect(() => {
        if (!socket || !candleSeriesRef.current) return;
        socket.emit('subscribe_ticker', { symbols: [symbol] });

        const handleUpdate = (data: any) => {
            if (data.symbol !== symbol) return;
            candleSeriesRef.current?.update({
                time: Math.floor(Date.now() / 1000),
                open: data.price,
                high: data.high24h,
                low: data.low24h,
                close: data.price,
            });
        };

        socket.on('ticker_update', handleUpdate);
        return () => {
            socket.off('ticker_update', handleUpdate);
            socket.emit('unsubscribe_ticker', { symbols: [symbol] });
        };
    }, [socket, symbol]);

    return (
        <div className="relative w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
            <ChartToolbar
                symbol={symbol}
                timeframe={timeframe}
                timeframes={TIMEFRAMES as unknown as string[]}
                onTimeframeChange={onTimeframeChange as any}
            />
            {isLoading ? (
                <div className="flex items-center justify-center h-[500px]">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <div ref={chartContainerRef} className="w-full h-[500px]" />
            )}
        </div>
    );
}
