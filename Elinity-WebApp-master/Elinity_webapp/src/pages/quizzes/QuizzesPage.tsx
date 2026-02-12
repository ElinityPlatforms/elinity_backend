import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MdQuiz, MdPlayArrow, MdTimer, MdEmojiEvents } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toolsApi } from '../../api/tools';
import './QuizzesPage.css';

const QuizzesPage: React.FC = () => {
    const navigate = useNavigate();

    const { data: quizzes, isLoading } = useQuery({
        queryKey: ['quizzes'],
        queryFn: toolsApi.getQuizzes,
    });

    return (
        <div className="quizzes-page-content">
            <div className="quizzes-header">
                <div>
                    <h1 className="quizzes-title">🧠 Quizzes & Assessments</h1>
                    <p className="quizzes-subtitle">
                        Discover insights about yourself through interactive quizzes
                    </p>
                </div>
            </div>

            <div className="quizzes-grid">
                {isLoading ? (
                    <div className="quizzes-loading">Loading quizzes...</div>
                ) : quizzes && quizzes.length > 0 ? (
                    quizzes.map((quiz: any) => (
                        <Card key={quiz.id} variant="glass" hoverable className="quiz-card">
                            <div className="quiz-icon">
                                <MdQuiz />
                            </div>

                            <h3 className="quiz-title">{quiz.title}</h3>
                            {quiz.description && (
                                <p className="quiz-description">{quiz.description}</p>
                            )}

                            <div className="quiz-meta">
                                <div className="quiz-meta-item">
                                    <MdTimer />
                                    <span>{quiz.estimated_time || '10'} min</span>
                                </div>
                                <div className="quiz-meta-item">
                                    <MdEmojiEvents />
                                    <span>{quiz.category || 'Personality'}</span>
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                fullWidth
                                leftIcon={<MdPlayArrow />}
                                onClick={() => navigate(`/quizzes/${quiz.id}`)}
                            >
                                Start Quiz
                            </Button>
                        </Card>
                    ))
                ) : (
                    <Card variant="glass" className="quizzes-empty">
                        <div className="empty-icon">📝</div>
                        <h3>No Quizzes Available</h3>
                        <p>Check back soon for new quizzes and assessments!</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default QuizzesPage;
