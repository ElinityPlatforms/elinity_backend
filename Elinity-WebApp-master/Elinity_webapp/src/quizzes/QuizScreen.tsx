import React, { useState, useEffect } from "react";
import type { QuizActivity, UserAnswer } from "./types";
import "./Quizzes.css";

interface QuizScreenProps {
  quiz: QuizActivity;
  onComplete: (answers: UserAnswer[], timeSpent: number) => void;
  onCancel: () => void;
}

export default function QuizScreen({ quiz, onComplete, onCancel }: QuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit || 0);
  const [started, setStarted] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  useEffect(() => {
    if (!started || !quiz.timeLimit) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, started, quiz.timeLimit]);

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex: optionIndex,
      isCorrect,
    };

    const existing = answers.findIndex((a) => a.questionId === currentQuestion.id);
    if (existing >= 0) {
      answers[existing] = newAnswer;
    } else {
      answers.push(newAnswer);
    }
    setAnswers([...answers]);
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onComplete(answers, timeSpent);
  };

  if (!started) {
    return (
      <div className="quiz-screen">
        <div className="quiz-intro">
          <h2>{quiz.title}</h2>
          <p>{quiz.description}</p>
          <div className="quiz-info">
            <p>📝 {quiz.questions.length} questions</p>
            {quiz.timeLimit && <p>⏱️ {Math.floor(quiz.timeLimit / 60)} minutes</p>}
          </div>
          <div className="quiz-actions">
            <button onClick={handleStart} className="btn-primary">
              Start Quiz
            </button>
            <button onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <h3>{quiz.title}</h3>
        <div className="quiz-progress">
          <span>
            {currentIndex + 1} / {quiz.questions.length}
          </span>
          {quiz.timeLimit && <span className="time-left">⏱️ {timeLeft}s</span>}
        </div>
      </div>

      <div className="quiz-content">
        <div className="question-box">
          <h4>{currentQuestion.question}</h4>
          <div className="options">
            {currentQuestion.options.map((option, idx) => {
              const userAnswer = answers.find((a) => a.questionId === currentQuestion.id);
              const isSelected = userAnswer?.selectedOptionIndex === idx;
              return (
                <button
                  key={idx}
                  className={`option ${isSelected ? "selected" : ""}`}
                  onClick={() => handleAnswerSelect(idx)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="quiz-controls">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="btn-secondary">
            ← Previous
          </button>
          {isLastQuestion ? (
            <button onClick={handleSubmit} className="btn-primary">
              Submit Quiz
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary">
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
