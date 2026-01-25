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
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", background: "#fff", borderRadius: "8px" }}>
      <h2>Edit Personal Info</h2>

      {loadingProfile ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>Loading your profile...</div>
      ) : (
        <>
          {error && <div style={{ color: "#ef4444", marginBottom: "12px", padding: "8px", background: "#fee2e2", borderRadius: "4px" }}>{error}</div>}
          {success && <div style={{ color: "#16a34a", marginBottom: "12px", padding: "8px", background: "#dcfce7", borderRadius: "4px" }}>✓ Profile updated successfully!</div>}

          <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>First Name</label>
          <input type="text" name="first_name" value={formData.first_name || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Middle Name</label>
          <input type="text" name="middle_name" value={formData.middle_name || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Last Name</label>
          <input type="text" name="last_name" value={formData.last_name || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Age</label>
          <input type="number" name="age" value={formData.age || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Gender</label>
          <select name="gender" value={formData.gender || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Sexual Orientation</label>
          <input type="text" name="sexual_orientation" value={formData.sexual_orientation || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Location</label>
          <input type="text" name="location" value={formData.location || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Relationship Status</label>
          <select name="relationship_status" value={formData.relationship_status || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
            <option value="">Select status</option>
            <option value="Single">Single</option>
            <option value="In a relationship">In a relationship</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Education</label>
          <input type="text" name="education" value={formData.education || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Occupation</label>
          <input type="text" name="occupation" value={formData.occupation || ""} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: "10px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
        </>
      )}
    </div>
  );
}
