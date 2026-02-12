import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdRefresh, MdCheckCircle, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toolsApi } from '../../api/tools';
import type { QuestionCard } from '../../types/api';
import './QuestionCardsPage.css';

const QuestionCardsPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);

    const { data: cards, isLoading, refetch } = useQuery({
        queryKey: ['question-cards'],
        queryFn: () => toolsApi.getQuestionCards(10),
    });

    const submitAnswerMutation = useMutation({
        mutationFn: (data: { questionId: string; answer: string }) =>
            toolsApi.saveAnswer(data.questionId, data.answer),
        onSuccess: () => {
            setAnswer('');
            setIsFlipped(false);
            if (cards && currentIndex < cards.length - 1) {
                setCurrentIndex(currentIndex + 1);
            }
        },
    });

    const handleNext = () => {
        if (cards && currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setAnswer('');
            setIsFlipped(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setAnswer('');
            setIsFlipped(false);
        }
    };

    const currentCard = cards?.[currentIndex];

    if (isLoading) {
        return <div className="loading">Loading deep persona cards...</div>;
    }

    return (
        <div className="question-cards-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">🎴 Deep Persona Cards</h1>
                    <p className="page-subtitle">Reflective prompts for deeper connection and self-discovery</p>
                    <p className="page-description">
                        Deep Persona Cards are evocative prompts designed to help you explore your values, growth, and inner world.
                        Your reflections help <strong>Lumi AI</strong> understand the deepest layers of your personality,
                        enabling more personalized insights and "Radical Awareness" in your journey.
                    </p>
                </div>

                <Button
                    variant="outline"
                    leftIcon={<MdRefresh />}
                    onClick={() => {
                        refetch();
                        setCurrentIndex(0);
                    }}
                >
                    Shuffle Deck
                </Button>
            </div>

            <div className="cards-container">
                {currentCard ? (
                    <div className="card-flipper-box">
                        <div className={`card-flipper ${isFlipped ? 'flipped' : ''}`}>
                            <Card
                                variant="glass"
                                className="question-card-inner front"
                                style={{ borderColor: currentCard.color }}
                            >
                                <div className="card-category" style={{ background: currentCard.color }}>
                                    {currentCard.category}
                                </div>
                                <div className="card-text">{currentCard.text}</div>
                                <div className="card-tags">
                                    {currentCard.tags?.map(tag => (
                                        <span key={tag} className="card-tag">#{tag}</span>
                                    ))}
                                </div>
                                <Button
                                    onClick={() => setIsFlipped(true)}
                                >
                                    Answer Card
                                </Button>
                            </Card>

                            <Card variant="glass" className="question-card-inner back">
                                <h3>Your Reflection</h3>
                                <p className="mini-question">{currentCard.text}</p>
                                <Input
                                    multiline
                                    rows={4}
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    className="answer-input"
                                />
                                <div className="back-actions">
                                    <Button variant="ghost" onClick={() => setIsFlipped(false)}>Cancel</Button>
                                    <Button
                                        variant="primary"
                                        leftIcon={<MdCheckCircle />}
                                        onClick={() => submitAnswerMutation.mutate({
                                            questionId: currentCard.text,
                                            answer
                                        })}
                                        disabled={!answer.trim() || submitAnswerMutation.isPending}
                                    >
                                        Save Reflection
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="navigation-controls">
                            <Button
                                variant="ghost"
                                leftIcon={<MdChevronLeft />}
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                            />
                            <span className="card-counter">
                                {currentIndex + 1} of {cards.length}
                            </span>
                            <Button
                                variant="ghost"
                                leftIcon={<MdChevronRight />}
                                onClick={handleNext}
                                disabled={currentIndex === cards.length - 1}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="no-cards">No cards found. Try refreshing!</div>
                )}
            </div>

            <div className="cards-footer">
                <p>Answers are saved to your profile to help Lumi AI understand you better.</p>
            </div>
        </div>
    );
};

export default QuestionCardsPage;
