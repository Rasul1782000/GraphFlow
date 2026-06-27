import { apiClient } from './client';

export interface WatchlistDTO {
    _id: string;
    name: string;
    description?: string;
    user_id: string;
    symbols: Array<{
        _id: string;
        ticker: string;
        name: string;
        asset_class: string;
        exchange?: string;
        market_cap?: number;
        logo_url?: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export const watchlistApi = {
    getWatchlists: (): Promise<WatchlistDTO[]> =>
        apiClient.get('/watchlist'),

    getById: (id: string): Promise<WatchlistDTO> =>
        apiClient.get(`/watchlist/${id}`),

    create: (data: {
        name: string;
        description?: string;
        symbols?: string[];
    }): Promise<WatchlistDTO> =>
        apiClient.post('/watchlist', data),

    update: (id: string, data: {
        name?: string;
        description?: string;
        symbols?: string[];
    }): Promise<WatchlistDTO> =>
        apiClient.patch(`/watchlist/${id}`, data),

    addSymbol: (id: string, symbolId: string): Promise<WatchlistDTO> =>
        apiClient.post(`/watchlist/${id}/symbols`, { symbol_id: symbolId }),

    removeSymbol: (id: string, symbolId: string): Promise<WatchlistDTO> =>
        apiClient.delete(`/watchlist/${id}/symbols/${symbolId}`),

    remove: (id: string): Promise<{ deleted: boolean }> =>
        apiClient.delete(`/watchlist/${id}`),
};
