import apiClient from '../api/client';

export interface RegisterRequest {
  email?: string;
  phone?: string;
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

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
}

/**
 * Login an existing user
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
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

  const response = await apiClient.post<AuthResponse>('/auth/token', params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
}

/**
 * Refresh access token using refresh token endpoint
 */
export async function refreshAccessToken(data: RefreshTokenRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/refresh', data);
  return response.data;
}

/**
 * Create a service key
 */
export async function createServiceKey(name: string): Promise<string> {
  const response = await apiClient.post<string>(`/auth/create_service_key?name=${encodeURIComponent(name)}`);
  return response.data;
}

export default {
  register,
  login,
  refreshToken,
  refreshAccessToken,
  createServiceKey,
};
