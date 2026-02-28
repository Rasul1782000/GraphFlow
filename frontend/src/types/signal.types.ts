export interface Signal {
    id: string;
    symbol_id: number;
    symbol?: {
        ticker: string;
        name: string;
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
