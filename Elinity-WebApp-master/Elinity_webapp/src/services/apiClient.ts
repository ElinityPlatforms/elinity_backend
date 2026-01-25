import { useAuth } from "../auth/AuthContext";

/**
 * Custom fetch wrapper that automatically refreshes tokens on 401
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}, onRefreshToken?: () => Promise<void>): Promise<Response> {
  const accessToken = sessionStorage.getItem("auth_access_token");
  const headers = new Headers(options.headers || {});

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let res = await fetch(url, { ...options, headers });

  // If 401, try to refresh token
  if (res.status === 401 && onRefreshToken) {
    try {
      await onRefreshToken();
      const newAccessToken = sessionStorage.getItem("auth_access_token");
      if (newAccessToken) {
        headers.set("Authorization", `Bearer ${newAccessToken}`);
        res = await fetch(url, { ...options, headers });
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
    }
  }

  return res;
}

/**
 * Hook to use fetchWithAuth in components
 */
export function useApiClient() {
  const { refreshAccessToken, state } = useAuth();

  const handleRefresh = async () => {
    if (state.refreshToken) {
      await refreshAccessToken({ refresh_token: state.refreshToken });
    }
  };

  return (url: string, options?: RequestInit) =>
    fetchWithAuth(url, options, handleRefresh);
}
