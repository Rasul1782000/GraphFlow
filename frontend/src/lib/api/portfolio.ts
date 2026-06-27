import { apiClient } from './client';

export interface PortfolioDTO {
    _id: string;
    id: string;
    name: string;
    user_id: string;
    initial_cash: number;
    current_cash: number;
    currency: string;
    positions?: PositionDTO[];
    created_at: string;
    updated_at: string;
}

export interface PositionDTO {
    _id: string;
    portfolio_id: string;
    symbol_id: {
        _id: string;
        ticker: string;
        name: string;
        asset_class: string;
    };
    side: 'long' | 'short';
    quantity: number;
    avg_entry_price: number;
    current_price?: number;
    stop_loss?: number;
    take_profit?: number;
    status: 'open' | 'closed';
    realized_pnl: number;
    unrealized_pnl: number;
    opened_at: string;
    closed_at?: string;
}

export interface TradeDTO {
    _id: string;
    position_id: string;
    portfolio_id: string;
    symbol_id: {
        _id: string;
        ticker: string;
        name: string;
        asset_class: string;
    };
    type: 'buy' | 'sell' | 'short' | 'cover';
    quantity: number;
    price: number;
    total: number;
    fee: number;
    notes?: string;
    executed_at: string;
}

export interface PortfolioMetricsDTO {
    total_value: number;
    cash_balance: number;
    position_value: number;
    total_pnl: number;
    total_pnl_percent: number;
    realized_pnl: number;
    open_positions: number;
    total_trades: number;
}

export interface PortfolioResponse {
    _id: string;
    name: string;
    user_id: string;
    initial_cash: number;
    current_cash: number;
    currency: string;
    created_at: string;
    updated_at: string;
}

export const portfolioApi = {
    getPortfolios: (): Promise<PortfolioDTO[]> => apiClient.get('/portfolio'),
    
    getPortfolio: (id: string): Promise<PortfolioDTO> => apiClient.get(`/portfolio/${id}`),
    
    getMetrics: (id: string): Promise<any> => apiClient.get(`/portfolio/${id}/metrics`),
    
    createPortfolio: (data: {
        name: string;
        initial_cash?: number;
        currency?: string;
    }): Promise<PortfolioDTO> => apiClient.post('/portfolio', data),
    
    openPosition: (id: string, data: {
        symbol_id: string;
        side?: 'long' | 'short';
        quantity: number;
        price: number;
        stop_loss?: number;
        take_profit?: number;
    }): Promise<PositionDTO> => apiClient.post(`/portfolio/${id}/positions`, data),
    
    closePosition: (portfolioId: string, positionId: string, data: {
        exit_price: number;
        notes?: string;
    }): Promise<{ position: PositionDTO; trade: TradeDTO; pnl: number; remaining_cash: number }> =>
        apiClient.post(`/portfolio/${portfolioId}/positions/${positionId}/close`, data),
        
    getUserPortfolios: (userId: string): Promise<PortfolioDTO[]> => apiClient.get(`/portfolio/user/${userId}`),
};