import React from "react";
import type { QuizResult } from "./types";
import "./Quizzes.css";

interface FinalResultsProps {
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
}

export default function FinalResults({ result, onRetry, onHome }: FinalResultsProps) {
  const scoreColor = result.score >= 80 ? "--score-high" : result.score >= 60 ? "--score-medium" : "--score-low";
  const scoreEmoji = result.score >= 80 ? "🎉" : result.score >= 60 ? "👍" : "📚";

  return (
    <div className="final-results">
      <div className="results-container">
        <h2>{scoreEmoji} Quiz Complete!</h2>
        <h3>{result.activityTitle}</h3>

        <div className="score-display">
          <div className={`score-circle ${scoreColor}`}>{result.score}%</div>
          <p className="score-text">
            You got {result.correctAnswers} out of {result.totalQuestions} correct
          </p>
        </div>

        <div className="results-stats">
          <div className="stat">
            <span className="stat-label">Correct Answers</span>
            <span className="stat-value">{result.correctAnswers}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time Spent</span>
            <span className="stat-value">{Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, "0")}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{result.score}%</span>
          </div>
        </div>

        <div className="results-breakdown">
          <h4>Answer Review</h4>
          <div className="answer-list">
            {result.answers.map((answer, idx) => (
              <div key={idx} className={`answer-item ${answer.isCorrect ? "correct" : "incorrect"}`}>
                <span className="answer-icon">{answer.isCorrect ? "✓" : "✗"}</span>
                <span>Question {idx + 1}: {answer.isCorrect ? "Correct" : "Incorrect"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="results-actions">
          <button onClick={onRetry} className="btn-primary">
            Retry Quiz
          </button>
          <button onClick={onHome} className="btn-secondary">
            Back to Quizzes
          </button>
        </div>
      </div>
    </div>
  );
}
