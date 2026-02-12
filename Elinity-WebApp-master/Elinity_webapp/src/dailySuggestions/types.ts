export type SuggestionProfile = {
  id: string;
  name: string;
  age: number;
  bio: string;
  image?: string;
  aiScore: number; // 0-100
  aiInsight: string;
};
