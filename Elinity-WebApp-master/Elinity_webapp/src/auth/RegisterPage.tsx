import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { state, register, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await register({
        email,
        phone,
        password,
      });
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>Register</h1>
      {state.error && <div style={{ color: "red", marginBottom: "10px" }}>{state.error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Email *
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Phone
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="1234567890"
              style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Password *
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Confirm Password *
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={state.isLoading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: state.isLoading ? "not-allowed" : "pointer",
          }}
        >
          {state.isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}
