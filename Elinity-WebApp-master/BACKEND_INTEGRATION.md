# Backend Integration Guide

## Setup

1. **Environment Configuration**
   - Added `.env.local` with your API base URL
   - All API calls will use: `https://elinity-backend-arg7ckh2fph8duea.centralus-01.azurewebsites.net`

## Authentication Endpoints Integrated

### 1. `/auth/register`
**File:** `src/auth/RegisterPage.tsx`
- Creates a new user account
- Returns access_token, refresh_token, token_type
- Auto-saves tokens to localStorage

**Usage:**
```tsx
const { register } = useAuth();
await register({ email, phone, password });
```

### 2. `/auth/login`
**File:** `src/auth/LoginPage.tsx`
- Authenticates existing user
- Returns access_token, refresh_token, token_type
- Auto-saves tokens to localStorage

**Usage:**
```tsx
const { login } = useAuth();
await login({ email, phone, password });
```

### 3. `/auth/token`
**File:** `src/services/authService.ts` - `refreshToken()`
- OAuth2-style token endpoint
- Form-urlencoded POST
- Used for refreshing via username/password

**Usage:**
```tsx
const { refreshTokenOAuth } = useAuth();
await refreshTokenOAuth({ username, password, grant_type: "password" });
```

### 4. `/auth/refresh`
**File:** `src/services/authService.ts` - `refreshAccessToken()`
- Refresh access token using refresh token
- Returns new access_token, refresh_token, token_type

**Usage:**
```tsx
const { refreshAccessToken } = useAuth();
await refreshAccessToken({ refresh_token });
```

### 5. `/auth/create_service_key`
**File:** `src/services/authService.ts` - `createServiceKey()`
- Creates a service key (query param: name)
- Returns string key

**Usage:**
```tsx
import { createServiceKey } from "../services/authService";
const key = await createServiceKey("my-service");
```

## Key Features

### Token Management
- Tokens stored in localStorage: `auth_access_token`, `auth_refresh_token`, `auth_token_type`
- Auto-refresh on 401 errors via `useApiClient()` hook
- Tokens persist across page reloads

### Global Auth State
**Access via `useAuth()` hook:**
```tsx
const { state, login, register, logout, refreshAccessToken } = useAuth();

// state properties:
// - isAuthenticated: boolean
// - accessToken: string | null
// - refreshToken: string | null
// - tokenType: string | null
// - isLoading: boolean
// - error: string | null
```

### Protected Routes
**File:** `src/auth/ProtectedRoute.tsx`
- Wraps components to require authentication
- Redirects to `/login` if not authenticated

**Usage:**
```tsx
<Route path="/profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
```

### API Client with Auto Token Refresh
**File:** `src/services/apiClient.ts`
- Hook: `useApiClient()` returns authenticated fetch
- Automatically refreshes token on 401

**Usage:**
```tsx
const apiFetch = useApiClient();
const res = await apiFetch("/api/users/me");
const data = await res.json();
```

## Routes

- `/login` - Login page
- `/register` - Register page
- `/profile` - User profile (protected)
- `/` - Home page

## Error Handling

All auth endpoints handle 422 validation errors:
```tsx
try {
  await login(data);
} catch (err) {
  // err.error.detail[0].msg contains error message
}
```

## Next Steps

1. Update other API endpoints to use `useApiClient()` hook
2. Add logout button to navbar/header (calls `logout()`)
3. Wrap protected routes with `<ProtectedRoute>`
4. Update user profile page to load user data from `/users/{user_id}`
5. Test login/register flow with your backend
