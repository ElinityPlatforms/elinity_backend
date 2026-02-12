import { fetchWithAuth } from "../services/apiClient";
import type { SuggestionProfile } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function getDailySuggestions(count = 5): Promise<SuggestionProfile[]> {
  try {
    const response = await fetchWithAuth(`${API_BASE}/recommendations/?limit=${count}`);
    if (!response.ok) {
      throw new Error(`Error fetching recommendations: ${response.statusText}`);
    }
    const data = await response.json();

    // Transform backend response to frontend model if necessary
    // Assuming backend returns a list of objects compatible with SuggestionProfile or close to it.
    // We might need to map fields if they differ.
    return data.map((item: any) => ({
      id: item.tenant?.id || item.user_id || "unknown",
      name: item.tenant?.personal_info?.first_name
        ? `${item.tenant.personal_info.first_name} ${item.tenant.personal_info.last_name || ''}`
        : (item.user_name || "Unknown"),
      age: item.tenant?.personal_info?.age || 0,
      bio: item.tenant?.bio || item.ai_insight || "No bio available.",
      image: item.tenant?.profile_image_url || undefined,
      aiScore: Math.round((item.score || 0) * 100), // Assuming score is 0-1 float
      aiInsight: item.ai_insight || "No insight available."
    }));
  } catch (error) {
    console.error("Failed to fetch daily suggestions:", error);
    return [];
  }
}
