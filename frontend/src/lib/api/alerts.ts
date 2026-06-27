import { apiClient } from './client';

export interface AlertDTO {
    _id: string;
    user_id: string;
    symbol_id: {
        _id: string;
        ticker: string;
        name: string;
        asset_class: string;
    };
    name: string;
    condition_type: string;
    condition_value: number;
    notification_type: string;
    is_active: boolean;
    is_recurring: boolean;
    trigger_count: number;
    triggered_at?: string;
    created_at: string;
}

export interface AlertStats {
    total: number;
    active: number;
    triggered: number;
}

export const alertsApi = {
    getAlerts: (): Promise<AlertDTO[]> =>
        apiClient.get('/alerts'),

    getStats: (): Promise<AlertStats> =>
        apiClient.get('/alerts/stats'),

    getById: (id: string): Promise<AlertDTO> =>
        apiClient.get(`/alerts/${id}`),

    create: (data: {
        symbol_id: string;
        name: string;
        condition_type: string;
        condition_value: number;
        notification_type?: string;
        is_recurring?: boolean;
    }): Promise<AlertDTO> =>
        apiClient.post('/alerts', data),

    update: (id: string, data: {
        name?: string;
        is_active?: boolean;
        is_recurring?: boolean;
    }): Promise<AlertDTO> =>
        apiClient.patch(`/alerts/${id}`, data),

    remove: (id: string): Promise<{ deleted: boolean }> =>
        apiClient.delete(`/alerts/${id}`),
};
