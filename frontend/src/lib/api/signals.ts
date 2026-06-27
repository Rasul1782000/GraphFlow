import { apiClient } from './client';

export interface SignalDTO {
    _id: string;
    symbol_id: {
        _id: string;
        ticker: string;
        name: string;
        asset_class: string;
    };
    source: string;
    type: 'buy' | 'sell' | 'neutral';
    strength: number;
    timeframe: string;
    entry_price?: number;
    stop_loss?: number;
    take_profit?: number;
    risk_reward?: number;
    description?: string;
    metadata?: Record<string, any>;
    expires_at?: string;
    created_at: string;
}

export interface SignalStats {
    total: number;
    last_24h: number;
    last_7d: number;
    by_type: Record<string, number>;
}

export const signalsApi = {
    getSignals: (params?: {
        symbol_id?: string;
        type?: string;
        source?: string;
        timeframe?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ items: SignalDTO[]; total: number; page: number }> =>
        apiClient.get('/signals', { params }),

    getRecent: (limit?: number): Promise<SignalDTO[]> =>
        apiClient.get('/signals/recent', { params: { limit } }),

    getStats: (): Promise<SignalStats> =>
        apiClient.get('/signals/stats'),

    getById: (id: string): Promise<SignalDTO> =>
        apiClient.get(`/signals/${id}`),
};
