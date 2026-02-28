'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, createContext, useContext, useEffect, useRef } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { io, Socket } from 'socket.io-client';
import { PrimeReactProvider } from 'primereact/api';

// PrimeReact Styles
import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


const SocketContext = createContext<Socket | null>(null);

export function useSocket() {
    return useContext(SocketContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: { staleTime: 30_000, retry: 2, refetchOnWindowFocus: false },
            mutations: { retry: 0 },
        },
    }));

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
        <QueryClientProvider client={queryClient}>
            <PrimeReactProvider value={{ ripple: true }}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                    <SocketContext.Provider value={socketRef.current}>
                        {children}
                        <Toaster
                            richColors
                            position="top-right"
                            toastOptions={{ className: 'bg-neutral-900 border border-neutral-800 text-white' }}
                        />
                    </SocketContext.Provider>
                </ThemeProvider>
            </PrimeReactProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>

    );
}
