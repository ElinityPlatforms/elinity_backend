import { fetchWithAuth } from "../services/apiClient";
import type { QuizActivity } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function fetchQuizzes(): Promise<QuizActivity[]> {
  try {
    const res = await fetchWithAuth(`${API_BASE}/tools/quizzes`);
    if (res.ok) {
      const data = await res.json();
      // Ensure data structure matches types
      return data.map((q: any) => ({
        id: q.id,
        title: q.title,
        description: q.description || "",
        questions: q.questions || [],
        timeLimit: q.questions ? q.questions.length * 60 : 300, // naive estimate if not provided
      }));
    }
    return [];
  } catch (e) {
    console.error("Failed to fetch quizzes", e);
    return [];
  }
}

export async function fetchQuizById(id: string): Promise<QuizActivity | null> {
  // Since there isn't a specific get-by-id endpoint shown in the router, we filter from the list or assume we can fetch.
  // The backend router shows: GET /quizzes returns list. 
  // It doesn't explicitly show a GET /quizzes/{id} in the snippets I saw (Step 4702), only create and list.
  // So we will fetch all and find. 
  // Optimization: If list is large, backend should support ID fetch. For now, fetch all.
  const quizzes = await fetchQuizzes();
  return quizzes.find(q => q.id === id) || null;
}

