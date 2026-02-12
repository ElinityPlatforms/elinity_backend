import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VibeCheck from "./VibeCheck";
import InputDataViewer from "./InputDataViewer";
import "./Admin.css";

type TabType = "vibe" | "data";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabType>("vibe");
    const navigate = useNavigate();

    return (
        <div className="admin-dashboard">
            <div className="admin-navigation">
                <div className="admin-nav-header">
                    <h2>Search & Analytics</h2>
                </div>

                <div className="admin-tabs">
                    <button
                        className={`admin-tab ${activeTab === "vibe" ? "active" : ""}`}
                        onClick={() => setActiveTab("vibe")}
                    >
                        ⚡ Vibe Check
                    </button>
                    <button
                        className={`admin-tab ${activeTab === "data" ? "active" : ""}`}
                        onClick={() => setActiveTab("data")}
                    >
                        📁 Input Data
                    </button>

                    <button
                        className="btn-close"
                        onClick={() => navigate("/")}
                        title="Close dashboard"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {activeTab === "vibe" && <VibeCheck />}
                {activeTab === "data" && <InputDataViewer />}
            </div>
        </div>
    );
}
