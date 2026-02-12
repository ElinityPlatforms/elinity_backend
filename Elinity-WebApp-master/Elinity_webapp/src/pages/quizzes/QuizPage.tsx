import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCheck, MdClose } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toolsApi } from '../../api/tools';
import './QuizPage.css';

const QuizPage: React.FC = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [isComplete, setIsComplete] = useState(false);

    const { data: quiz, isLoading } = useQuery({
        queryKey: ['quiz', quizId],
        queryFn: () => toolsApi.getQuizzes(),
        select: (data) => data.find((q: any) => q.id === quizId),
    });

    const submitMutation = useMutation({
        mutationFn: (data: any) => toolsApi.createQuiz(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
            setIsComplete(true);
        },
    });

    const handleAnswer = (answer: any) => {
        setAnswers({ ...answers, [currentQuestion]: answer });
    };

    const handleNext = () => {
        if (currentQuestion < (quiz?.questions?.length || 0) - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = () => {
        const results = {
            quiz_id: quizId,
            answers: Object.values(answers),
            completed_at: new Date().toISOString(),
        };
        submitMutation.mutate(results);
    };

    const progress = quiz?.questions?.length
        ? ((currentQuestion + 1) / quiz.questions.length) * 100
        : 0;

    if (isLoading) {
        return (
            <div className="quiz-loading">Loading quiz...</div>
        );
    }

    if (!quiz) {
        return (
            <div className="quiz-error">
                <h2>Quiz not found</h2>
                <Button onClick={() => navigate('/quizzes')}>Back to Quizzes</Button>
            </div>
        );
    }

    if (isComplete) {
        return (
            <div className="quiz-content">
                <Card variant="glass" className="quiz-complete-card">
                    <div className="complete-icon">🎉</div>
                    <h1>Quiz Complete!</h1>
                    <p>Thank you for completing "{quiz.title}"</p>
                    <p className="complete-message">
                        Your responses have been saved. Check your dashboard for insights and results.
                    </p>
                    <div className="complete-actions">
                        <Button variant="primary" onClick={() => navigate('/quizzes')}>
                            Back to Quizzes
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/dashboard')}>
                            View Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const question = quiz.questions?.[currentQuestion];

    return (
        <div className="quiz-content">
            {/* Header */}
            <div className="quiz-header">
                <Button
                    variant="ghost"
                    leftIcon={<MdArrowBack />}
                    onClick={() => navigate('/quizzes')}
                >
                    Exit Quiz
                </Button>
                <div className="quiz-info">
                    <h1 className="quiz-title">{quiz.title}</h1>
                    <p className="quiz-description">{quiz.description}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-section">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="progress-text">
                    Question {currentQuestion + 1} of {quiz.questions?.length || 0}
                </div>
            </div>

            {/* Question Card */}
            <Card variant="glass" className="question-card">
                <div className="question-number">Question {currentQuestion + 1}</div>
                <h2 className="question-text">{question?.question || question?.text}</h2>

                <div className="answers-section">
                    {question?.type === 'multiple_choice' && question?.options?.map((option: any, index: number) => (
                        <button
                            key={index}
                            className={`answer-option ${answers[currentQuestion] === option ? 'selected' : ''}`}
                            onClick={() => handleAnswer(option)}
                        >
                            <div className="option-indicator">
                                {answers[currentQuestion] === option && <MdCheck />}
                            </div>
                            <span>{option}</span>
                        </button>
                    ))}

                    {question?.type === 'scale' && (
                        <div className="scale-input">
                            <div className="scale-labels">
                                <span>{question.min_label || 'Strongly Disagree'}</span>
                                <span>{question.max_label || 'Strongly Agree'}</span>
                            </div>
                            <input
                                type="range"
                                min={question.min || 1}
                                max={question.max || 5}
                                value={answers[currentQuestion] || Math.floor((question.max || 5) / 2)}
                                onChange={(e) => handleAnswer(parseInt(e.target.value))}
                                className="scale-slider"
                            />
                            <div className="scale-value">{answers[currentQuestion] || Math.floor((question.max || 5) / 2)}</div>
                        </div>
                    )}

                    {question?.type === 'text' && (
                        <textarea
                            className="text-answer"
                            value={answers[currentQuestion] || ''}
                            onChange={(e) => handleAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            rows={5}
                        />
                    )}
                </div>

                {/* Navigation */}
                <div className="question-navigation">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleNext}
                        disabled={answers[currentQuestion] === undefined}
                        loading={submitMutation.isPending}
                    >
                        {currentQuestion === (quiz.questions?.length || 0) - 1 ? 'Submit' : 'Next'}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default QuizPage;
