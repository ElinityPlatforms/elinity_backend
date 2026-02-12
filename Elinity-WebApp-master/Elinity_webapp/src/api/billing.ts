import apiClient from './client';
import type { Subscription, SubscriptionPlan } from '../types/api';

export const billingApi = {
    getPlans: async (): Promise<SubscriptionPlan[]> => {
        const response = await apiClient.get<SubscriptionPlan[]>('/billing/plans');
        return response.data;
    },

    getSubscription: async (): Promise<Subscription> => {
        const response = await apiClient.get<Subscription>('/billing/subscription');
        return response.data;
    },

    upgradeTier: async (tier: string): Promise<Subscription> => {
        const response = await apiClient.post<Subscription>('/billing/subscription/upgrade', null, {
            params: { tier },
        });
        return response.data;
    },

    getReferrals: async (): Promise<any> => {
        const response = await apiClient.get('/billing/referrals');
        return response.data;
    },
};

export default billingApi;
