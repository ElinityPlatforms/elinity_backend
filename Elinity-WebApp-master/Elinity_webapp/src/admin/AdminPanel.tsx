import React, { useState } from "react";
import { getAdminUsers, suspendUser, activateUser } from "./adminService";
import type { AdminUser } from "./types";
import "./Admin.css";
import { MdBlock, MdCheckCircle, MdWarning } from "react-icons/md";

export default function AdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>(getAdminUsers());
  const [filter, setFilter] = useState<"all" | "active" | "suspended">("all");

  const filteredUsers =
    filter === "all"
      ? users
      : users.filter((u) => u.status === filter);

  const handleSuspend = (userId: string) => {
    suspendUser(userId);
    setUsers([...users]);
  };

  const handleActivate = (userId: string) => {
    activateUser(userId);
    setUsers([...users]);
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="admin-panel-container">
      <h1>Admin Panel</h1>
      <p className="section-subtitle">Manage users, content, and platform security</p>

      <div className="admin-stats">
        <div className="stat-box">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-box active">
          <span className="stat-number">{stats.active}</span>
          <span className="stat-label">Active Users</span>
        </div>
        <div className="stat-box suspended">
          <span className="stat-number">{stats.suspended}</span>
          <span className="stat-label">Suspended</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{stats.admins}</span>
          <span className="stat-label">Administrators</span>
        </div>
      </div>

      <div className="admin-controls">
        <h2>User Management</h2>
        <div className="filter-buttons-admin">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Users
          </button>
          <button
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === "suspended" ? "active" : ""}`}
            onClick={() => setFilter("suspended")}
          >
            Suspended
          </button>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className={`user-row ${user.status}`}>
                <td className="user-name">{user.name}</td>
                <td className="user-email">{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status === "active" && <MdCheckCircle size={16} />}
                    {user.status === "suspended" && <MdBlock size={16} />}
                    {user.status === "inactive" && <MdWarning size={16} />}
                    {user.status}
                  </span>
                </td>
                <td className="time-cell">
                  {user.lastActive.toLocaleDateString()}
                </td>
                <td className="time-cell">
                  {user.joinedAt.toLocaleDateString()}
                </td>
                <td className="actions-cell">
                  {user.status === "suspended" ? (
                    <button
                      className="btn-action activate"
                      onClick={() => handleActivate(user.id)}
                      title="Activate user"
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      className="btn-action suspend"
                      onClick={() => handleSuspend(user.id)}
                      title="Suspend user"
                    >
                      Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="security-alerts">
        <h2>Security & Compliance</h2>
        <div className="alerts-grid">
          <div className="alert-card info">
            <h4>Account Security</h4>
            <p>All user accounts are encrypted with AES-256</p>
          </div>
          <div className="alert-card success">
            <h4>Data Privacy</h4>
            <p>GDPR and CCPA compliant data handling</p>
          </div>
          <div className="alert-card warning">
            <h4>Content Moderation</h4>
            <p>3 reports pending review</p>
          </div>
          <div className="alert-card info">
            <h4>Last Security Audit</h4>
            <p>Completed on Jan 3, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
