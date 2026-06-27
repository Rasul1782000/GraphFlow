'use client';
import { useState, createContext, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { PrimeReactProvider } from 'primereact/api';

// PrimeReact Styles (using minimalistic theme)
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const SocketContext = createContext<Socket | null>(null);

export function useSocket() {
    return useContext(SocketContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io(
            (process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000') + '/market',
            { transports: ['websocket', 'polling'], autoConnect: true, reconnectionAttempts: 5 }
        );

        socket.on('connect', () => console.log('✅ Connected to Market WebSocket'));
        socket.on('connect_error', (error) => {
            console.error('❌ WebSocket Connection Error:', error.message);
        });

        socketRef.current = socket;
        return () => { socket.disconnect(); };
    }, []);

    return (
        <PrimeReactProvider value={{ ripple: true }}>
            <SocketContext.Provider value={socketRef.current}>
                {children}
            </SocketContext.Provider>
        </PrimeReactProvider>
    );
}
