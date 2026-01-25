const API_BASE = import.meta.env.VITE_API_BASE || "";

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface TokenRequest {
  grant_type?: string;
  username: string;
  password: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface CreateServiceKeyRequest {
  name: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

async function handleErrorResponse(res: Response) {
  let payload: any = null;
  try {
    payload = await res.json();
  } catch (e) {
    try {
      payload = await res.text();
    } catch (e) {
      payload = null;
    }
  }
  const message = payload?.detail?.[0]?.msg || payload?.message || (typeof payload === 'string' ? payload : null) || res.statusText || `HTTP ${res.status}`;
  const err: any = { status: res.status, statusText: res.statusText, error: payload, message };
  throw err;
}

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) await handleErrorResponse(res);
  return res.json();
}

/**
 * Login an existing user
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) await handleErrorResponse(res);
  return res.json();
}

/**
 * Refresh access token using refresh token (OAuth2 token endpoint)
 */
export async function refreshToken(data: TokenRequest): Promise<AuthResponse> {
  const params = new URLSearchParams();
  params.append("grant_type", data.grant_type || "password");
  params.append("username", data.username);
  params.append("password", data.password);
  if (data.scope) params.append("scope", data.scope);
  if (data.client_id) params.append("client_id", data.client_id);
  if (data.client_secret) params.append("client_secret", data.client_secret);

  const res = await fetch(`${API_BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) await handleErrorResponse(res);
  return res.json();
}

/**
 * Refresh access token using refresh token endpoint
 */
export async function refreshAccessToken(data: RefreshTokenRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) await handleErrorResponse(res);
  return res.json();
}

/**
 * Create a service key
 */
export async function createServiceKey(name: string): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/create_service_key?name=${encodeURIComponent(name)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) await handleErrorResponse(res);
  return res.json();
}

export default {
  register,
  login,
  refreshToken,
  refreshAccessToken,
  createServiceKey,
};
