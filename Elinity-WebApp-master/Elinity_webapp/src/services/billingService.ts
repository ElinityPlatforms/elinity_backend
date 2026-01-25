
import { useApiClient } from "./apiClient";

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

const API_BASE = import.meta.env.VITE_API_BASE || "";

export const useBillingService = () => {
    const fetchWithAuth = useApiClient();

    const getPlans = async (): Promise<Plan[]> => {
        const res = await fetchWithAuth(`${API_BASE}/billing/plans`);
        if (!res.ok) throw new Error("Failed to fetch plans");
        return res.json();
    };

    const getSubscription = async (): Promise<Subscription> => {
        const res = await fetchWithAuth(`${API_BASE}/billing/subscription`);
        if (!res.ok) throw new Error("Failed to fetch subscription");
        return res.json();
    };

    const upgradeSubscription = async (tier: string): Promise<{ message: string }> => {
        const res = await fetchWithAuth(`${API_BASE}/billing/subscription/upgrade?tier=${tier}`, {
            method: "POST"
        });
        if (!res.ok) throw new Error("Failed to upgrade subscription");
        return res.json();
    };

    const getReferrals = async (): Promise<ReferralInfo> => {
        const res = await fetchWithAuth(`${API_BASE}/billing/referrals`);
        if (!res.ok) throw new Error("Failed to fetch referral info");
        return res.json();
    };

    return { getPlans, getSubscription, upgradeSubscription, getReferrals };
};
