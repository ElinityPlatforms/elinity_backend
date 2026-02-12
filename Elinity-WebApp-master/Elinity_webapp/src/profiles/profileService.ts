const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function getUserById(userId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch user ${userId}: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

export default {
  getUserById,
};
