import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById } from "./quizService";
import type { UserAnswer, QuizResult } from "./types";
import QuizScreen from "./QuizScreen";
import FinalResults from "./FinalResults";
import "./Quizzes.css";

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const quiz = quizId ? getQuizById(quizId) : null;

  const [result, setResult] = useState<QuizResult | null>(null);

  if (!quiz) {
    return (
      <div className="quiz-page">
        <div className="error-box">
          <h2>Quiz not found</h2>
          <button onClick={() => navigate("/quizzes")}>Back to Quizzes</button>
        </div>
      </div>
    );
  }

  const handleQuizComplete = (answers: UserAnswer[], timeSpent: number) => {
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    setResult({
      activityId: quiz.id,
      activityTitle: quiz.title,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      score,
      timeSpent,
      answers,
      completedAt: new Date(),
    });
  };

  if (result) {
    return (
      <FinalResults
        result={result}
        onRetry={() => {
          setResult(null);
          window.location.reload();
        }}
        onHome={() => navigate("/quizzes")}
      />
    );
  }

  return (
    <div className="quiz-page">
      <QuizScreen
        quiz={quiz}
        onComplete={handleQuizComplete}
        onCancel={() => navigate("/quizzes")}
      />
    </div>
  );
}
