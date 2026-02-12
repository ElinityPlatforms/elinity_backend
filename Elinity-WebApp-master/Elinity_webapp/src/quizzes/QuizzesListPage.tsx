import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuizzes } from "./quizService";
import type { QuizActivity } from "./types";
import "./Quizzes.css";

export default function QuizzesListPage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetchQuizzes();
      setQuizzes(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="quizzes-list-page">
      <header className="quizzes-header">
        <h2>Quizzes & Activities</h2>
        <p>Test your knowledge and improve your skills</p>
      </header>

      {loading ? (
        <div className="ds-loading">Loading quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div className="empty-state">No quizzes available at the moment.</div>
      ) : (
        <div className="quizzes-grid">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <div className="quiz-card-content">
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                <div className="quiz-meta">
                  <span>📝 {quiz.questions.length} questions</span>
                  {quiz.timeLimit && <span>⏱️ {Math.floor(quiz.timeLimit / 60)} min</span>}
                </div>
              </div>
              <button
                className="btn-start"
                onClick={() => navigate(`/quizzes/${quiz.id}`)}
              >
                Start Quiz →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
