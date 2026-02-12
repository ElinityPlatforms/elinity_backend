import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

// Test credentials for development/testing purposes only
const TEST_EMAIL = "test@example.com";
const TEST_PHONE = "1234567890";
const TEST_PASSWORD = "test123";

export default function LoginPage() {
  const [email, setEmail] = useState(TEST_EMAIL);
  const [phone, setPhone] = useState(TEST_PHONE);
  const [password, setPassword] = useState(TEST_PASSWORD);
  const { state, login, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({
        email: email || undefined,
        phone: phone || undefined,
        password,
      });
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-brand">
          <img src="/mainlogo.png" alt="logo" />
          <div>
            <div className="auth-title">Welcome back</div>
            <div className="auth-sub">Sign in to continue to Elinity</div>
          </div>
        </div>

        {state.error && <div style={{ color: "#ef4444", marginBottom: 12 }}>{state.error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
          </label>
          <label>
            Phone (optional)
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="1234567890" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
          </label>

          <button className="auth-submit" type="submit" disabled={state.isLoading}>
            {state.isLoading ? "Logging in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
