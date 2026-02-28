import { apiClient } from './client';

export const portfolioApi = {
    getPortfolios: () => apiClient.get('/portfolio'),
    getMetrics: (id: string) => apiClient.get(`/portfolio/${id}/metrics`),
    openPosition: (id: string, data: any) => apiClient.post(`/portfolio/${id}/positions`, data),
    closePosition: (portfolioId: string, positionId: string, data: any) =>
        apiClient.post(`/portfolio/${portfolioId}/positions/${positionId}/close`, data),
};
