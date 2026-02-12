import apiClient from '../api/client';

export interface Plan {
    id: string;
    name: string;
    price: number;
    features: string[];
}

export interface Subscription {
    id: string;
    tier: string;
    status: string;
    tenant: string;
    created_at?: string;
}

export interface ReferralInfo {
    code: string;
    points_earned: number;
    count: number;
}

export const billingService = {
    async getPlans(): Promise<Plan[]> {
        const response = await apiClient.get<Plan[]>('/billing/plans');
        return response.data;
    },

    async getSubscription(): Promise<Subscription> {
        const response = await apiClient.get<Subscription>('/billing/subscription');
        return response.data;
    },

    async upgradeSubscription(tier: string): Promise<{ message: string }> {
        const response = await apiClient.post<{ message: string }>(`/billing/subscription/upgrade?tier=${tier}`);
        return response.data;
    },

    async getReferrals(): Promise<ReferralInfo> {
        const response = await apiClient.get<ReferralInfo>('/billing/referrals');
        return response.data;
    },
};

export const useBillingService = () => {
    return billingService;
};
