import apiClient from './client';
import type { DashboardStats, RelationshipDashboard, DailyCard } from '../types/api';

export const dashboardApi = {
    getPersonalDashboard: async (): Promise<DashboardStats> => {
        const response = await apiClient.get<DashboardStats>('/dashboard/me');
        return response.data;
    },

    getRelationshipDashboard: async (): Promise<RelationshipDashboard> => {
        const response = await apiClient.get<RelationshipDashboard>('/dashboard/relationship');
        return response.data;
    },

    getDailyCard: async (): Promise<DailyCard> => {
        const response = await apiClient.get<DailyCard>('/dashboard/relationship/daily-card');
        return response.data;
    },
};

export default dashboardApi;
