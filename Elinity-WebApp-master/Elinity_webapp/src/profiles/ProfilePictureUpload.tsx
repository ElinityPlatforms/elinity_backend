import React, { useState, useEffect, useRef } from "react";
import {
  MdCloudUpload, MdLink, MdCheckCircle, MdError,
  MdDelete, MdRefresh, MdPhotoCamera
} from "react-icons/md";
import { useAuth } from "../auth/AuthContext";
import {
  uploadProfilePicture,
  addProfilePictureUrl,
  getUserProfile
} from "../services/userService";
import { useProfile } from "./ProfileContext";

const glassStyle: React.CSSProperties = {
  background: "rgba(24, 25, 54, 0.6)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(162, 89, 230, 0.2)",
  borderRadius: "24px",
  padding: "32px",
  color: "#fff",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  maxWidth: "800px",
  margin: "40px auto",
};

const imageCardStyle: React.CSSProperties = {
  position: "relative",
  borderRadius: "16px",
  overflow: "hidden",
  border: "2px solid rgba(162, 89, 230, 0.2)",
  transition: "all 0.3s ease",
  aspectRatio: "1/1",
};

export function ProfilePictureUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const { state } = useAuth();
  const { profile, refreshProfile } = useProfile();
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.isAuthenticated) {
      loadHistory();
    }
  }, [state.isAuthenticated]);

  const loadHistory = async () => {
    try {
      const data = await getUserProfile();
      const sorted = (data.profile_pictures || []).sort((a, b) =>
        new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
      );
      setUploadedImages(sorted);
    } catch (err) {
      console.warn("Could not load history:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (uploadMethod === "file") {
        if (!file) throw new Error("Please select a file");
        await uploadProfilePicture(file);
      } else {
        if (!imageUrl) throw new Error("Please enter a URL");
        await addProfilePictureUrl(imageUrl);
      }

      setSuccess(true);
      setFile(null);
      setPreviewUrl(null);
      setImageUrl("");

      await refreshProfile();
      await loadHistory();

      if (onUploadSuccess) onUploadSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const resolveImageUrl = (url: string) => {
    if (!url) return "";
    // Only use pravatar if it's the legacy mock string without a real protocol/host
    if (url.includes("mock-storage.local") && !url.startsWith("http")) {
      return `https://i.pravatar.cc/300?u=${url.split('/').pop()}`;
    }
    return url;
  };

  return (
    <div style={glassStyle}>
      <header style={{ textAlign: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", margin: "0 0 8px 0", fontWeight: 700, background: "linear-gradient(90deg, #fff, #a259e6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Identity Visual
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Click your avatar to update your persona</p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
        {/* Instagram style circular avatar */}
        <div
          onClick={() => uploadMethod === "file" && fileInputRef.current?.click()}
          style={{
            width: "180px", height: "180px", borderRadius: "50%", padding: "4px",
            background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            cursor: "pointer", transition: "transform 0.2s", position: "relative"
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#181936", padding: "4px" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", position: "relative" }}>
              <img
                src={previewUrl || resolveImageUrl(profile.profileImg)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt="Profile"
              />
              <div style={{ position: "absolute", bottom: 0, width: "100%", height: "40px", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MdPhotoCamera size={20} color="#fff" />
              </div>
            </div>
          </div>
          {loading && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(24,25,54,0.7)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
              <div className="spinner"></div>
            </div>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

        <div style={{ width: "100%", maxWidth: "400px" }}>
          {/* Method Toggles */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "24px" }}>
            <button
              onClick={() => { setUploadMethod("file"); setPreviewUrl(null); }}
              style={{ padding: "8px 20px", borderRadius: "20px", border: "none", cursor: "pointer", background: uploadMethod === "file" ? "#a259e6" : "rgba(255,255,255,0.05)", color: "#fff" }}
            >
              Upload
            </button>
            <button
              onClick={() => { setUploadMethod("url"); setPreviewUrl(null); }}
              style={{ padding: "8px 20px", borderRadius: "20px", border: "none", cursor: "pointer", background: uploadMethod === "url" ? "#a259e6" : "rgba(255,255,255,0.05)", color: "#fff" }}
            >
              Link
            </button>
          </div>

          {uploadMethod === "url" && (
            <input
              type="url"
              placeholder="Paste image address..."
              value={imageUrl}
              onChange={(e) => { setImageUrl(e.target.value); setPreviewUrl(e.target.value); }}
              style={{ width: "100%", padding: "12px 18px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(162, 89, 230, 0.2)", color: "#fff", outline: "none", marginBottom: "16px" }}
            />
          )}

          {(file || imageUrl) && !loading && (
            <button
              onClick={handleSubmit}
              style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "none", background: "#a259e6", color: "#fff", fontWeight: 600, cursor: "pointer", boxShadow: "0 10px 20px rgba(162, 89, 230, 0.3)" }}
            >
              Update Identity
            </button>
          )}

          {error && <p style={{ color: "#ff8b8b", textAlign: "center", marginTop: "16px", fontSize: "14px" }}>{error}</p>}
          {success && <p style={{ color: "#4ade80", textAlign: "center", marginTop: "16px", fontSize: "14px" }}>✓ Profile updated</p>}
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <div style={{ marginTop: "48px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "20px", color: "rgba(255,255,255,0.7)" }}>Previous Avatars</h3>
          <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "16px" }}>
            {uploadedImages.map((img: any) => (
              <div
                key={img.id}
                onClick={() => { setPreviewUrl(resolveImageUrl(img.url)); setImageUrl(img.url); setUploadMethod("url"); }}
                style={{ width: "80px", height: "80px", borderRadius: "50%", flexShrink: 0, overflow: "hidden", border: "2px solid rgba(162, 89, 230, 0.3)", cursor: "pointer" }}
              >
                <img src={resolveImageUrl(img.url)} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="History" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
