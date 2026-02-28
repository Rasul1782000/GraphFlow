export const marketApi = {
    getOhlcv: async (symbol: string, timeframe: string, limit?: number): Promise<any[]> => [],
    getQuote: async (symbol: string): Promise<any> => ({}),
    getTopMovers: async (limit?: number): Promise<any[]> => [],
};
