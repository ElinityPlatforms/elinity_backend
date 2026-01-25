
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBillingService, Plan, Subscription, ReferralInfo } from "../services/billingService";
import "./SubscriptionPage.css";

export default function SubscriptionPage() {
    const navigate = useNavigate();
    const { getPlans, getSubscription, upgradeSubscription, getReferrals } = useBillingService();

    const [plans, setPlans] = useState<Plan[]>([]);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [referral, setReferral] = useState<ReferralInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [plansData, subData, refData] = await Promise.all([
                    getPlans(),
                    getSubscription(),
                    getReferrals()
                ]);
                setPlans(plansData);
                setSubscription(subData);
                setReferral(refData);
            } catch (err) {
                console.error(err);
                setError("Failed to load subscription data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleUpgrade = async (tier: string) => {
        try {
            await upgradeSubscription(tier);
            // Refresh subscription
            const sub = await getSubscription();
            setSubscription(sub);
            alert(`Successfully upgraded to ${tier}!`);
        } catch (err) {
            alert("Upgrade failed. Please try again.");
        }
    };

    if (loading) return <div className="subscription-root">Loading...</div>;
    if (error) return <div className="subscription-root">{error}</div>;

    return (
        <div className="subscription-root">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

            <div className="subscription-header">
                <h1>Upgrade Your Journey</h1>
                <p>Unlock premium features to enhance your connection and growth.</p>
            </div>

            <div className="plans-container">
                {plans.map((plan) => {
                    const isCurrent = subscription?.tier === plan.id;
                    return (
                        <div key={plan.id} className={`plan-card ${isCurrent ? 'active-plan' : ''}`}>
                            <div className="plan-name">{plan.name}</div>
                            <div className="plan-price">
                                {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
                            </div>
                            <ul className="plan-features">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                ))}
                            </ul>
                            <button
                                className="plan-btn"
                                disabled={isCurrent}
                                onClick={() => handleUpgrade(plan.id)}
                            >
                                {isCurrent ? "Current Plan" : "Upgrade"}
                            </button>
                        </div>
                    );
                })}
            </div>

            {referral && (
                <div className="referral-section">
                    <h2>Refer & Earn Credits</h2>
                    <p>Share your unique code with friends to earn free credits.</p>
                    <div className="referral-code">{referral.code}</div>
                    <p>Total Points Earned: <strong>{referral.points_earned}</strong></p>
                </div>
            )}
        </div>
    );
}
