import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MdCheckCircle, MdShowChart, MdLightbulb, MdArrowBack } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { evaluationApi } from '../../api/evaluation';
import './SkillEvaluationPage.css';

const SkillEvaluationPage: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();

    const { data: report, isLoading, error } = useQuery({
        queryKey: ['evaluation-report', sessionId],
        queryFn: () => evaluationApi.getReport(sessionId!),
        enabled: !!sessionId,
    });

    if (isLoading) {
        return (
            <div className="evaluation-loading">
                <div className="spinner" />
                <h2>Analyzing your session...</h2>
                <p>Lumi AI is evaluating your communication patterns and skill level.</p>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="evaluation-error">
                <h2>Evaluation Failed</h2>
                <p>We couldn't generate a report for this session. Please try again later.</p>
                <Button onClick={() => navigate('/skills')}>Back to Skills</Button>
            </div>
        );
    }

    return (
        <div className="evaluation-content" style={{ padding: '24px' }}>
            <div className="evaluation-header">
                <Button
                    variant="ghost"
                    leftIcon={<MdArrowBack />}
                    onClick={() => navigate('/skills')}
                >
                    Back to Skills
                </Button>
                <h1 className="evaluation-title">📊 Skill Evaluation Report</h1>
            </div>

            <div className="report-grid">
                <Card variant="glass" className="report-main-card">
                    <div className="report-scores">
                        <div className="score-item">
                            <span className="score-label">Emotional Intelligence</span>
                            <div className="score-bar-bg">
                                <div className="score-bar-fill" style={{ width: `${report.scores?.eq || 70}%` }} />
                            </div>
                            <span className="score-value">{report.scores?.eq || 70}/100</span>
                        </div>
                        <div className="score-item">
                            <span className="score-label">Communication Clarity</span>
                            <div className="score-bar-bg">
                                <div className="score-bar-fill" style={{ width: `${report.scores?.clarity || 85}%`, background: '#00e5ff' }} />
                            </div>
                            <span className="score-value">{report.scores?.clarity || 85}/100</span>
                        </div>
                    </div>

                    <div className="report-summary">
                        <h3><MdCheckCircle /> AI Insights</h3>
                        <p>{report.summary || "Your overall performance shows strong potential for growth. You demonstrated clear empathy and active listening skills."}</p>
                    </div>
                </Card>

                <div className="report-side-cards">
                    <Card variant="glass" className="insight-card">
                        <h3><MdShowChart /> Key Strengths</h3>
                        <ul>
                            {report.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>) || (
                                <>
                                    <li>Empathetic framing</li>
                                    <li>Clear objective setting</li>
                                    <li>Consistent engagement</li>
                                </>
                            )}
                        </ul>
                    </Card>

                    <Card variant="glass" className="insight-card improvement">
                        <h3><MdLightbulb /> Areas for Growth</h3>
                        <ul>
                            {report.improvements?.map((s: string, i: number) => <li key={i}>{s}</li>) || (
                                <>
                                    <li>Provide more specific examples</li>
                                    <li>Reduce passive language</li>
                                    <li>Deepen self-reflection</li>
                                </>
                            )}
                        </ul>
                    </Card>
                </div>
            </div>

            <div className="evaluation-actions">
                <Button variant="primary" onClick={() => navigate('/skills')} size="lg">
                    Level Up Again
                </Button>
            </div>
        </div>
    );
};

export default SkillEvaluationPage;
