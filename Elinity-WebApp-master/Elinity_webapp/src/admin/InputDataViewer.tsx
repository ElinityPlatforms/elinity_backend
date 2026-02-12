import React, { useState } from "react";
import { getInputData } from "./adminService";
import type { InputDataItem } from "./types";
import "./Admin.css";
import { MdImage, MdAudiotrack, MdDescription, MdMovie, MdDownload } from "react-icons/md";

const typeIcons = {
  image: <MdImage size={20} />,
  audio: <MdAudiotrack size={20} />,
  text: <MdDescription size={20} />,
  video: <MdMovie size={20} />,
};

export default function InputDataViewer() {
  const [filter, setFilter] = useState<"all" | "image" | "audio" | "text" | "video">("all");
  const allData = getInputData();

  const filteredData =
    filter === "all" ? allData : allData.filter((item) => item.type === filter);

  const dataCounts = {
    image: allData.filter((d) => d.type === "image").length,
    audio: allData.filter((d) => d.type === "audio").length,
    text: allData.filter((d) => d.type === "text").length,
    video: allData.filter((d) => d.type === "video").length,
  };

  return (
    <div className="input-data-container">
      <h1>Input Data Management</h1>
      <p className="section-subtitle">View and manage all user-submitted content</p>

      <div className="data-controls">
        <div className="filter-tabs">
          <button
            className={`tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({allData.length})
          </button>
          <button
            className={`tab ${filter === "image" ? "active" : ""}`}
            onClick={() => setFilter("image")}
          >
            Images ({dataCounts.image})
          </button>
          <button
            className={`tab ${filter === "audio" ? "active" : ""}`}
            onClick={() => setFilter("audio")}
          >
            Audio ({dataCounts.audio})
          </button>
          <button
            className={`tab ${filter === "text" ? "active" : ""}`}
            onClick={() => setFilter("text")}
          >
            Text ({dataCounts.text})
          </button>
          <button
            className={`tab ${filter === "video" ? "active" : ""}`}
            onClick={() => setFilter("video")}
          >
            Video ({dataCounts.video})
          </button>
        </div>
      </div>

      <div className="input-data-grid">
        {filteredData.map((item) => (
          <DataItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function DataItemCard({ item }: { item: InputDataItem }) {
  const isImage = item.type === "image";
  const isText = item.type === "text";
  const isAudio = item.type === "audio";
  const isVideo = item.type === "video";

  return (
    <div className="data-item-card">
      <div className="data-header">
        <div className="data-icon">{typeIcons[item.type]}</div>
        <div className="data-info">
          <span className="data-type">{item.type.toUpperCase()}</span>
          <span className="data-user">{item.userId}</span>
        </div>
      </div>

      <div className="data-content">
        {isImage && (
          <img src={item.content} alt="User content" className="content-image" />
        )}
        {isText && (
          <p className="content-text">{item.content.substring(0, 150)}...</p>
        )}
        {isAudio && (
          <div className="content-audio">
            <audio controls>
              <source src={item.content} type="audio/mpeg" />
            </audio>
          </div>
        )}
        {isVideo && (
          <div className="content-video">
            <video controls style={{ maxWidth: "100%" }}>
              <source src={item.content} type="video/mp4" />
            </video>
          </div>
        )}
      </div>

      <div className="data-footer">
        <span className="data-date">
          {item.uploadedAt.toLocaleDateString()}
        </span>
        <button className="btn-download">
          <MdDownload size={16} />
        </button>
      </div>
    </div>
  );
}
