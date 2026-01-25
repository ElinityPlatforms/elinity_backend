import React from "react";
import { useNavigate } from "react-router-dom";
import { getAllQuizzes } from "./quizService";
import "./Quizzes.css";

export default function QuizzesListPage() {
  const navigate = useNavigate();
  const quizzes = getAllQuizzes();

  return (
    <div className="quizzes-list-page">
      <header className="quizzes-header">
        <h2>Quizzes & Activities</h2>
        <p>Test your knowledge and improve your skills</p>
      </header>

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
    </div>
  );
}
