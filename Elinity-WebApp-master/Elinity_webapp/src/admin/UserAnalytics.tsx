import React from "react";
import { getAnalyticsMetrics, getUserActivityData } from "./adminService";
import "./Admin.css";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

export default function UserAnalytics() {
  const metrics = getAnalyticsMetrics();
  const activityData = getUserActivityData();

  return (
    <div className="analytics-container">
      <h1>User Analytics & Insights</h1>
      <p className="section-subtitle">Comprehensive platform usage and engagement metrics</p>

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div key={metric.id} className="metric-card">
            <div className="metric-header">
              <h3>{metric.label}</h3>
              <div className={`trend-badge ${metric.trend}`}>
                {metric.trend === "up" && <MdTrendingUp size={16} />}
                {metric.trend === "down" && <MdTrendingDown size={16} />}
                {metric.trend === "stable" && <span>→</span>}
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>
            <div className="metric-value">{metric.value.toLocaleString()}</div>
            <p className="metric-change">
              {metric.change > 0 ? "↑" : "↓"} {Math.abs(metric.change)}% from last period
            </p>
          </div>
        ))}
      </div>

      <div className="chart-section">
        <h2>User Activity Trend</h2>
        <div className="activity-chart">
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-color active-users"></span>
              Active Users
            </span>
            <span className="legend-item">
              <span className="legend-color new-matches"></span>
              New Matches
            </span>
            <span className="legend-item">
              <span className="legend-color messages"></span>
              Messages
            </span>
          </div>

          <div className="activity-data">
            {activityData.map((data, idx) => (
              <div key={idx} className="activity-row">
                <span className="activity-date">{data.date}</span>
                <div className="activity-bars">
                  <div
                    className="bar active-users"
                    style={{ height: `${(data.activeUsers / 12450) * 100}%` }}
                    title={`${data.activeUsers} active users`}
                  ></div>
                  <div
                    className="bar new-matches"
                    style={{ height: `${(data.newMatches / 820) * 100}%` }}
                    title={`${data.newMatches} new matches`}
                  ></div>
                  <div
                    className="bar messages"
                    style={{ height: `${(data.messagesCount / 21300) * 100}%` }}
                    title={`${data.messagesCount} messages`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-summary">
        <div className="summary-card">
          <h3>Total Users</h3>
          <p className="big-number">45,230</p>
          <span className="summary-detail">+12% this month</span>
        </div>
        <div className="summary-card">
          <h3>Successful Matches</h3>
          <p className="big-number">8,450</p>
          <span className="summary-detail">18.7% of total users</span>
        </div>
        <div className="summary-card">
          <h3>Avg Engagement</h3>
          <p className="big-number">68%</p>
          <span className="summary-detail">↓ 2.1% from last month</span>
        </div>
        <div className="summary-card">
          <h3>Session Duration</h3>
          <p className="big-number">24 min</p>
          <span className="summary-detail">↑ 5.8% improvement</span>
        </div>
      </div>
    </div>
  );
}
