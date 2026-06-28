'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

interface TickerData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    high24h: number;
    low24h: number;
    ts: number;
}

interface SignalData {
    _id: string;
    ticker: string;
    type: 'buy' | 'sell' | 'neutral';
    strength: number;
    entry_price: number;
    stop_loss: number;
    take_profit: number;
    description: string;
    created_at: string;
}

interface AlertData {
    alertId: string;
    name: string;
    symbol: string;
    condition: string;
    value: number;
    price: number;
    triggeredAt: string;
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

let globalSocket: Socket | null = null;
let globalInitCount = 0;

function getSocket(): Socket | null {
    if (typeof window === 'undefined') return null;
    if (!globalSocket) {
        const url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
        globalSocket = io(`${url}/market`, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });
    }
    return globalSocket;
}

export function useWebSocket() {
    const [status, setStatus] = useState<ConnectionStatus>('connecting');
    const listenersRef = useRef<Map<string, Set<(...args: any[]) => void>>>(new Map());
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;
        socketRef.current = socket;
        globalInitCount++;

        const onConnect = () => setStatus('connected');
        const onDisconnect = () => setStatus('disconnected');
        const onError = () => setStatus('error');
        const onReconnect = () => setStatus('connected');

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onError);
        socket.io.on('reconnect', onReconnect);

        if (socket.connected) setStatus('connected');

        return () => {
            globalInitCount--;
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onError);
            socket.io.off('reconnect', onReconnect);
            if (globalInitCount <= 0 && globalSocket) {
                globalSocket.disconnect();
                globalSocket = null;
            }
        };
    }, []);

    const subscribe = useCallback((symbols: string[]) => {
        const socket = socketRef.current || getSocket();
        if (socket?.connected) {
            socket.emit('subscribe_ticker', { symbols });
        }
    }, []);

    const unsubscribe = useCallback((symbols: string[]) => {
        const socket = socketRef.current || getSocket();
        if (socket?.connected) {
            socket.emit('unsubscribe_ticker', { symbols });
        }
    }, []);

    const onTicker = useCallback((handler: (data: TickerData) => void) => {
        const socket = socketRef.current || getSocket();
        socket?.on('ticker_update', handler);
        return () => { socket?.off('ticker_update', handler); };
    }, []);

    const onSignal = useCallback((handler: (data: SignalData) => void) => {
        const socket = socketRef.current || getSocket();
        socket?.on('new_signal', handler);
        return () => { socket?.off('new_signal', handler); };
    }, []);

    const onAlert = useCallback((handler: (data: AlertData) => void) => {
        const socket = socketRef.current || getSocket();
        socket?.on('alert_triggered', handler);
        return () => { socket?.off('alert_triggered', handler); };
    }, []);

    return { status, subscribe, unsubscribe, onTicker, onSignal, onAlert, socket: socketRef.current };
}

export function useTickerSubscription(symbols: string[]) {
    const { subscribe, unsubscribe, onTicker } = useWebSocket();
    const [tickers, setTickers] = useState<Record<string, TickerData>>({});

    useEffect(() => {
        if (symbols.length === 0) return;
        subscribe(symbols);
        const cleanup = onTicker((data) => {
            setTickers(prev => ({ ...prev, [data.symbol]: data }));
        });
        return () => {
            cleanup();
            unsubscribe(symbols);
        };
    }, [symbols.join(',')]);

    return tickers;
}

export function useSignalSubscription() {
    const { onSignal } = useWebSocket();
    const [latestSignal, setLatestSignal] = useState<SignalData | null>(null);

    useEffect(() => {
        const cleanup = onSignal((data) => setLatestSignal(data));
        return cleanup;
    }, []);

    return latestSignal;
}

export function useAlertSubscription() {
    const { onAlert } = useWebSocket();
    const [latestAlert, setLatestAlert] = useState<AlertData | null>(null);

    useEffect(() => {
        const cleanup = onAlert((data) => setLatestAlert(data));
        return cleanup;
    }, []);

    return latestAlert;
}
