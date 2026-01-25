export type AnalyticsMetric = {
  id: string;
  label: string;
  value: number;
  change: number; // Percentage change
  trend: "up" | "down" | "stable";
};

export type UserActivityData = {
  date: string;
  activeUsers: number;
  newMatches: number;
  messagesCount: number;
};

export type VibeCheckEntry = {
  id: string;
  userId: string;
  mood: "energetic" | "calm" | "romantic" | "social" | "introspective";
  intensity: number; // 1-10
  timestamp: Date;
  description: string;
};

export type InputDataItem = {
  id: string;
  userId: string;
  type: "image" | "audio" | "text" | "video";
  content: string; // URL or text content
  uploadedAt: Date;
  metadata?: Record<string, any>;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "moderator" | "user";
  status: "active" | "inactive" | "suspended";
  lastActive: Date;
  joinedAt: Date;
};

export type AdminAction = {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  details: string;
};
