import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdCheck, MdStar, MdTrendingUp } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { billingApi } from '../../api/billing';
import './SubscriptionPage.css';

const SubscriptionPage: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: plans, isLoading: plansLoading } = useQuery({
        queryKey: ['subscription-plans'],
        queryFn: billingApi.getPlans,
    });

    const { data: currentSubscription } = useQuery({
        queryKey: ['current-subscription'],
        queryFn: billingApi.getSubscription,
    });

    const { data: referrals } = useQuery({
        queryKey: ['referrals'],
        queryFn: billingApi.getReferrals,
    });

    const upgradeMutation = useMutation({
        mutationFn: billingApi.upgradeTier,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
        },
    });

    const handleUpgrade = (tierId: string) => {
        upgradeMutation.mutate({ tier_id: tierId });
    };

    const tierFeatures = {
        free: [
            'Basic personality matching',
            'Limited daily matches',
            '5 games per day',
            'Basic journal features',
            'Community access',
        ],
        premium: [
            'Advanced AI matching',
            'Unlimited matches',
            'All games unlimited',
            'Smart journal with AI insights',
            'Priority support',
            'Advanced analytics',
            'Lumi AI companion',
        ],
        elite: [
            'Everything in Premium',
            'Personalized coaching',
            'Exclusive events',
            'Early feature access',
            'VIP support',
            'Custom matching algorithms',
            'Unlimited AI interactions',
        ],
    };

    return (
        <div className="subscription-content">
            {/* Header */}
            <div className="subscription-header">
                <h1 className="subscription-title">💎 Subscription Plans</h1>
                <p className="subscription-subtitle">
                    Unlock the full potential of Elinity with premium features
                </p>
            </div>

            {/* Current Plan */}
            {currentSubscription && (
                <Card variant="glass" className="current-plan-card">
                    <div className="current-plan-badge">Current Plan</div>
                    <h3>
                        {currentSubscription.tier_name || 'Free'} Plan
                    </h3>
                    {currentSubscription.expires_at && (
                        <p className="plan-expiry">
                            Renews on {new Date(currentSubscription.expires_at).toLocaleDateString()}
                        </p>
                    )}
                </Card>
            )}

            {/* Plans Grid */}
            <div className="plans-grid">
                {plansLoading ? (
                    <div className="plans-loading">Loading plans...</div>
                ) : plans && plans.length > 0 ? (
                    plans.map((plan: any) => {
                        const isCurrentPlan = currentSubscription?.tier_name?.toLowerCase() === plan.name?.toLowerCase();
                        const features = tierFeatures[plan.name?.toLowerCase() as keyof typeof tierFeatures] || [];

                        return (
                            <Card
                                key={plan.id}
                                variant="glass"
                                className={`plan-card ${plan.name?.toLowerCase() === 'premium' ? 'featured' : ''}`}
                            >
                                {plan.name?.toLowerCase() === 'premium' && (
                                    <div className="featured-badge">
                                        <MdStar /> Most Popular
                                    </div>
                                )}

                                <div className="plan-header">
                                    <h3 className="plan-name">{plan.name}</h3>
                                    <div className="plan-price">
                                        <span className="price-amount">
                                            ${plan.price || 0}
                                        </span>
                                        <span className="price-period">/month</span>
                                    </div>
                                </div>

                                <div className="plan-features">
                                    {features.map((feature, index) => (
                                        <div key={index} className="feature-item">
                                            <MdCheck className="feature-icon" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant={plan.name?.toLowerCase() === 'premium' ? 'primary' : 'outline'}
                                    fullWidth
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={isCurrentPlan || upgradeMutation.isPending}
                                    loading={upgradeMutation.isPending}
                                >
                                    {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                                </Button>
                            </Card>
                        );
                    })
                ) : (
                    <div className="plans-empty">
                        <p>No plans available at the moment.</p>
                    </div>
                )}
            </div>

            {/* Referral Program */}
            <Card variant="glass" className="referral-card">
                <div className="referral-header">
                    <div className="referral-icon">
                        <MdTrendingUp />
                    </div>
                    <div>
                        <h3>Referral Program</h3>
                        <p>Invite friends and earn premium benefits</p>
                    </div>
                </div>

                <div className="referral-stats">
                    <div className="referral-stat">
                        <div className="stat-value">{referrals?.total_referrals || 0}</div>
                        <div className="stat-label">Total Referrals</div>
                    </div>
                    <div className="referral-stat">
                        <div className="stat-value">{referrals?.active_referrals || 0}</div>
                        <div className="stat-label">Active</div>
                    </div>
                    <div className="referral-stat">
                        <div className="stat-value">{referrals?.rewards_earned || 0}</div>
                        <div className="stat-label">Rewards Earned</div>
                    </div>
                </div>

                {referrals?.referral_code && (
                    <div className="referral-code-section">
                        <label>Your Referral Code</label>
                        <div className="referral-code-display">
                            <code>{referrals.referral_code}</code>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigator.clipboard.writeText(referrals.referral_code)}
                            >
                                Copy
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default SubscriptionPage;
