import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { uploadProfilePicture, addProfilePictureUrl, getProfilePictures, getUserProfile } from "../services/userService";
import { useProfile } from "./ProfileContext";

export function ProfilePictureUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const { state } = useAuth();
  const { refreshProfile } = useProfile();
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  useEffect(() => {
    if (!state.isAuthenticated) return;
    // Try to load existing profile pictures
    loadProfileData();
  }, [state.isAuthenticated]);

  const loadProfileData = async () => {
    try {
      const profile = await getUserProfile();
      if (profile.profile_pictures && profile.profile_pictures.length > 0) {
        setUploadedImages(profile.profile_pictures);
        // Optionally also fetch using getProfilePictures if needed
        // This ensures we have the latest data from the dedicated endpoint
        try {
          const tenantId = profile.profile_pictures[0].tenant;
          if (tenantId) {
            const pictures = await getProfilePictures(tenantId);
            setUploadedImages(pictures);
          }
        } catch (err) {
          // If getProfilePictures fails, use the ones from profile
          console.log("Could not fetch profile pictures via endpoint, using profile data:", err);
        }
      }
    } catch (err) {
      console.log("Could not load profile pictures:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setError(null);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    console.log("Starting upload with file:", file.name);

    try {
      const result = await uploadProfilePicture(file);
      console.log("Upload successful:", result);
      setFile(null);
      
      // Add the newly uploaded image to the list
      setUploadedImages((prev) => [...prev, result]);
      
      // Reload profile to ensure sync
      setTimeout(async () => {
        await loadProfileData();
        // Refresh the profile context so the image appears everywhere
        await refreshProfile();
      }, 500);
      
      setSuccess(true);
      if (onUploadSuccess) onUploadSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to upload picture";
      console.error("Upload error caught:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await addProfilePictureUrl(imageUrl);
      console.log("Picture URL added successfully:", result);
      setImageUrl("");
      
      // Add the newly added image to the list
      setUploadedImages((prev) => [...prev, result]);
      
      // Reload profile to ensure sync
      setTimeout(async () => {
        await loadProfileData();
        // Refresh the profile context so the image appears everywhere
        await refreshProfile();
      }, 500);
      
      setSuccess(true);
      if (onUploadSuccess) onUploadSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to add picture";
      console.error("Add picture error:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", background: "#fff", borderRadius: "8px" }}>
      <h2>Upload Profile Picture</h2>

      {error && <div style={{ color: "#ef4444", marginBottom: "12px", padding: "8px", background: "#fee2e2", borderRadius: "4px" }}>{error}</div>}
      {success && <div style={{ color: "#16a34a", marginBottom: "12px", padding: "8px", background: "#dcfce7", borderRadius: "4px" }}>Picture uploaded successfully!</div>}

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "20px" }}>
          <input type="radio" value="file" checked={uploadMethod === "file"} onChange={(e) => setUploadMethod(e.target.value as "file")} /> Upload File
        </label>
        <label>
          <input type="radio" value="url" checked={uploadMethod === "url"} onChange={(e) => setUploadMethod(e.target.value as "url")} /> Add URL
        </label>
      </div>

      {uploadMethod === "file" ? (
        <form onSubmit={handleFileUpload}>
          <div style={{ marginBottom: "12px" }}>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: "100%", padding: "8px" }} />
          </div>
          <button type="submit" disabled={loading || !file} style={{ padding: "10px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Uploading..." : "Upload Picture"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleUrlSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <input type="url" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={handleUrlChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
          </div>
          <button type="submit" disabled={loading || !imageUrl} style={{ padding: "10px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Adding..." : "Add Picture"}
          </button>
        </form>
      )}

      {uploadedImages.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Uploaded Pictures</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px" }}>
            {uploadedImages.map((img: any) => (
              <div key={img.id} style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                <img src={img.url} alt="profile" style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                <p style={{ margin: "8px", fontSize: "12px", color: "#6b7280" }}>{new Date(img.uploaded_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
