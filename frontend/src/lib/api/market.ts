import { apiClient } from './client';

export interface MarketMoversDTO {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    high24h: number;
    low24h: number;
}

export interface SymbolDTO {
    _id: string;
    ticker: string;
    name: string;
    asset_class: string;
    exchange?: string;
    currency: string;
    market_cap?: number;
    sector?: string;
    description?: string;
    logo_url?: string;
}

export const marketApi = {
    getSymbols: (assetClass?: string): Promise<SymbolDTO[]> =>
        apiClient.get('/market/symbols', { params: { assetClass } }),

    getOhlcv: (symbol: string, timeframe: string, limit?: number): Promise<any[]> =>
        apiClient.get(`/market/ohlcv/${symbol}`, { params: { timeframe, limit } }),

    getQuote: (symbol: string): Promise<MarketMoversDTO> =>
        apiClient.get(`/market/quote/${symbol}`),

    getTopMovers: (limit?: number): Promise<MarketMoversDTO[]> =>
        apiClient.get('/market/top-movers', { params: { limit } }),
};
