import React, { createContext, useContext, useState, useEffect } from "react";
import { register, login, refreshToken, refreshAccessToken, type AuthResponse, type RegisterRequest, type LoginRequest, type TokenRequest, type RefreshTokenRequest } from "../services/authService";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  state: AuthState;
  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  refreshAccessToken: (data: RefreshTokenRequest) => Promise<void>;
  refreshTokenOAuth: (data: TokenRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_ACCESS = "auth_access_token";
const STORAGE_KEY_REFRESH = "auth_refresh_token";
const STORAGE_KEY_TYPE = "auth_token_type";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    accessToken: sessionStorage.getItem(STORAGE_KEY_ACCESS),
    refreshToken: sessionStorage.getItem(STORAGE_KEY_REFRESH),
    tokenType: sessionStorage.getItem(STORAGE_KEY_TYPE),
    isAuthenticated: !!sessionStorage.getItem(STORAGE_KEY_ACCESS),
    isLoading: false,
    error: null,
  }));

  const handleRegister = async (data: RegisterRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await register(data);
      setState((prev) => ({
        ...prev,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        tokenType: response.token_type,
        isAuthenticated: true,
        isLoading: false,
      }));
      sessionStorage.setItem(STORAGE_KEY_ACCESS, response.access_token);
      sessionStorage.setItem(STORAGE_KEY_REFRESH, response.refresh_token);
      sessionStorage.setItem(STORAGE_KEY_TYPE, response.token_type);
    } catch (err: any) {
      const errorMsg = err?.message || err.error?.detail?.[0]?.msg || err.statusText || "Registration failed";
      setState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
      throw err;
    }
  };

  const handleLogin = async (data: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await login(data);
      setState((prev) => ({
        ...prev,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        tokenType: response.token_type,
        isAuthenticated: true,
        isLoading: false,
      }));
      sessionStorage.setItem(STORAGE_KEY_ACCESS, response.access_token);
      sessionStorage.setItem(STORAGE_KEY_REFRESH, response.refresh_token);
      sessionStorage.setItem(STORAGE_KEY_TYPE, response.token_type);
    } catch (err: any) {
      const errorMsg = err?.message || err.error?.detail?.[0]?.msg || err.statusText || "Login failed";
      setState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
      throw err;
    }
  };

  const handleRefreshToken = async (data: TokenRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await refreshToken(data);
      setState((prev) => ({
        ...prev,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        tokenType: response.token_type,
        isLoading: false,
      }));
      sessionStorage.setItem(STORAGE_KEY_ACCESS, response.access_token);
      sessionStorage.setItem(STORAGE_KEY_REFRESH, response.refresh_token);
      sessionStorage.setItem(STORAGE_KEY_TYPE, response.token_type);
    } catch (err: any) {
      const errorMsg = err?.message || err.error?.detail?.[0]?.msg || err.statusText || "Token refresh failed";
      setState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
      throw err;
    }
  };

  const handleRefreshAccessToken = async (data: RefreshTokenRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await refreshAccessToken(data);
      setState((prev) => ({
        ...prev,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        tokenType: response.token_type,
        isLoading: false,
      }));
      sessionStorage.setItem(STORAGE_KEY_ACCESS, response.access_token);
      sessionStorage.setItem(STORAGE_KEY_REFRESH, response.refresh_token);
      sessionStorage.setItem(STORAGE_KEY_TYPE, response.token_type);
    } catch (err: any) {
      const errorMsg = err?.message || err.error?.detail?.[0]?.msg || err.statusText || "Token refresh failed";
      setState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
      throw err;
    }
  };

  const handleLogout = () => {
    setState({
      accessToken: null,
      refreshToken: null,
      tokenType: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    sessionStorage.removeItem(STORAGE_KEY_ACCESS);
    sessionStorage.removeItem(STORAGE_KEY_REFRESH);
    sessionStorage.removeItem(STORAGE_KEY_TYPE);
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        register: handleRegister,
        login: handleLogin,
        refreshAccessToken: handleRefreshAccessToken,
        refreshTokenOAuth: handleRefreshToken,
        logout: handleLogout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
