export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  category?: string;
};

export type QuizActivity = {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // In seconds
};

export type UserAnswer = {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
};

export type QuizResult = {
  activityId: string;
  activityTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // Percentage 0-100
  timeSpent: number; // In seconds
  answers: UserAnswer[];
  completedAt: Date;
};
