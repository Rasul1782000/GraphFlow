import { useQuery } from '@tanstack/react-query';
import { marketApi } from '@/lib/api/market';

export function useMarketData(symbol: string, timeframe: string, limit = 500) {
    return useQuery({
        queryKey: ['ohlcv', symbol, timeframe, limit],
        queryFn: () => marketApi.getOhlcv(symbol, timeframe, limit),
        staleTime: 15_000,
        refetchInterval: 60_000,
        enabled: !!symbol && !!timeframe,
    });
}

export function useQuote(symbol: string) {
    return useQuery({
        queryKey: ['quote', symbol],
        queryFn: () => marketApi.getQuote(symbol),
        staleTime: 15_000,
        refetchInterval: 20_000,
        enabled: !!symbol,
    });
}

export function useTopMovers(limit = 10) {
    return useQuery({
        queryKey: ['movers', limit],
        queryFn: () => marketApi.getTopMovers(limit),
        staleTime: 30_000,
        refetchInterval: 60_000,
    });
}
