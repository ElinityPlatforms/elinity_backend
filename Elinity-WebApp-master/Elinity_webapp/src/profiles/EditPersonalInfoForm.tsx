import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { getUserProfile, updatePersonalInfo, type PersonalInfo } from "../services/userService";
import { useProfile } from "./ProfileContext";

export function EditPersonalInfoForm({ onSaveSuccess }: { onSaveSuccess?: () => void }) {
  const { state } = useAuth();
  const { refreshProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<PersonalInfo>({
    first_name: "",
    middle_name: "",
    last_name: "",
    age: 0,
    gender: "",
    sexual_orientation: "",
    location: "",
    relationship_status: "",
    education: "",
    occupation: "",
  });

  const loadProfile = async () => {
    if (!state.isAuthenticated) return;

    setLoadingProfile(true);
    try {
      const profile = await getUserProfile();
      setFormData(profile.personal_info || {});
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (state.isAuthenticated) {
      loadProfile();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updatePersonalInfo(formData);
      console.log("Personal info updated:", result);
      setSuccess(true);

      // Reload profile from server after successful save
      await new Promise(resolve => setTimeout(resolve, 500));
      await loadProfile();
      // Refresh the profile context so changes appear everywhere
      await refreshProfile();
      onSaveSuccess?.();
    } catch (err: any) {
      // Handle validation errors (422) with detailed messages
      const errorMessage = err.message || err.statusText || "Failed to update profile";
      setError(errorMessage);
      console.error("Update error:", err);
    } finally {
      setLoading(false);
      setSuccess(false);
    }
  };

  return (
    <div className="edit-profile-container" style={{
      maxWidth: "800px",
      margin: "40px auto",
      padding: "32px",
      background: "rgba(24, 25, 54, 0.6)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(162, 89, 230, 0.2)",
      borderRadius: "24px",
      color: "#fff",
      boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", margin: 0, fontWeight: 700, background: "linear-gradient(90deg, #fff, #a259e6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Edit Personal Identity
        </h2>
        <div style={{ padding: "8px 16px", background: "rgba(162, 89, 230, 0.1)", borderRadius: "12px", fontSize: "14px", border: "1px solid rgba(162, 89, 230, 0.3)" }}>
          Radical Awareness Profile
        </div>
      </div>

      {loadingProfile ? (
        <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
          <div className="spinner" style={{ marginBottom: "16px" }}></div>
          Decoding your persona...
        </div>
      ) : (
        <>
          {error && (
            <div style={{
              color: "#ff8b8b",
              marginBottom: "24px",
              padding: "16px",
              background: "rgba(255, 139, 139, 0.1)",
              border: "1px solid rgba(255, 139, 139, 0.2)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="e.g. Sara"
                value={formData.first_name || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Last Name</label>
              <input
                type="text"
                name="last_name"
                placeholder="e.g. Johnson"
                value={formData.last_name || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Gender</label>
              <select name="gender" value={formData.gender || ""} onChange={handleChange} style={inputStyle}>
                <option value="" style={{ background: "#23235b" }}>Select gender</option>
                <option value="Male" style={{ background: "#23235b" }}>Male</option>
                <option value="Female" style={{ background: "#23235b" }}>Female</option>
                <option value="Non-binary" style={{ background: "#23235b" }}>Non-binary</option>
                <option value="Other" style={{ background: "#23235b" }}>Other</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. London, United Kingdom"
                value={formData.location || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Relationship Status</label>
              <select name="relationship_status" value={formData.relationship_status || ""} onChange={handleChange} style={inputStyle}>
                <option value="" style={{ background: "#23235b" }}>Select status</option>
                <option value="Single" style={{ background: "#23235b" }}>Single</option>
                <option value="In a relationship" style={{ background: "#23235b" }}>In a relationship</option>
                <option value="Married" style={{ background: "#23235b" }}>Married</option>
                <option value="Searching" style={{ background: "#23235b" }}>Searching</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Occupation</label>
              <input
                type="text"
                name="occupation"
                placeholder="e.g. Software Engineer"
                value={formData.occupation || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "span 2", marginTop: "12px", display: "flex", gap: "16px", alignItems: "center" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "14px 32px",
                  background: "linear-gradient(135deg, #6366f1 0%, #a259e6 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "16px",
                  boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)",
                  transition: "all 0.2s ease"
                }}
              >
                {loading ? "Syncing Identity..." : "Commit Changes"}
              </button>

              {success && (
                <span style={{ color: "#4ade80", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>✓</span> Profile Synced with Radical Awareness
                </span>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(162, 89, 230, 0.2)",
  background: "rgba(255, 255, 255, 0.05)",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
  transition: "border-color 0.2s ease, background 0.2s ease"
};


