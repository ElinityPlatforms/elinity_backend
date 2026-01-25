import type { QuizActivity, QuizQuestion } from "./types";

const sampleQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correctAnswer: 1,
    category: "Geography",
  },
  {
    id: "q2",
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correctAnswer: 1,
    category: "Science",
  },
  {
    id: "q3",
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: 3,
    category: "Geography",
  },
  {
    id: "q4",
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Jane Austen", "William Shakespeare", "Charles Dickens", "Mark Twain"],
    correctAnswer: 1,
    category: "Literature",
  },
  {
    id: "q5",
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    category: "Science",
  },
  {
    id: "q6",
    question: "In what year did the Titanic sink?",
    options: ["1912", "1915", "1920", "1905"],
    correctAnswer: 0,
    category: "History",
  },
  {
    id: "q7",
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: 2,
    category: "Math",
  },
  {
    id: "q8",
    question: "Which country is home to the kangaroo?",
    options: ["South Africa", "New Zealand", "Australia", "Brazil"],
    correctAnswer: 2,
    category: "Geography",
  },
];

export const quizActivities: QuizActivity[] = [
  {
    id: "quiz-1",
    title: "General Knowledge",
    description: "Test your knowledge across various topics",
    questions: sampleQuestions,
    timeLimit: 300, // 5 minutes
  },
  {
    id: "quiz-2",
    title: "Science Basics",
    description: "Quick science quiz",
    questions: sampleQuestions.filter((q) => q.category === "Science"),
    timeLimit: 180, // 3 minutes
  },
  {
    id: "quiz-3",
    title: "Geography Challenge",
    description: "Test your geography knowledge",
    questions: sampleQuestions.filter((q) => q.category === "Geography"),
    timeLimit: 180,
  },
];

export function getQuizById(id: string): QuizActivity | undefined {
  return quizActivities.find((q) => q.id === id);
}

export function getAllQuizzes(): QuizActivity[] {
  return quizActivities;
}
