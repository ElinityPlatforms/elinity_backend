import type { AnalyticsMetric, UserActivityData, VibeCheckEntry, InputDataItem, AdminUser } from "./types";

export const analyticsMetrics: AnalyticsMetric[] = [
  { id: "1", label: "Active Users", value: 12450, change: 8.5, trend: "up" },
  { id: "2", label: "New Matches", value: 3200, change: 12.3, trend: "up" },
  { id: "3", label: "Engagement Rate", value: 68, change: -2.1, trend: "down" },
  { id: "4", label: "Avg Session Time", value: 24, change: 5.8, trend: "up" },
];

export const userActivityData: UserActivityData[] = [
  { date: "Jan 1", activeUsers: 8200, newMatches: 420, messagesCount: 15600 },
  { date: "Jan 2", activeUsers: 8800, newMatches: 480, messagesCount: 16200 },
  { date: "Jan 3", activeUsers: 9100, newMatches: 510, messagesCount: 17100 },
  { date: "Jan 4", activeUsers: 9800, newMatches: 650, messagesCount: 18900 },
  { date: "Jan 5", activeUsers: 12450, newMatches: 820, messagesCount: 21300 },
];

export const vibeCheckData: VibeCheckEntry[] = [
  {
    id: "vibe-1",
    userId: "user-123",
    mood: "energetic",
    intensity: 8,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    description: "Feeling great about connecting with new matches today!",
  },
  {
    id: "vibe-2",
    userId: "user-456",
    mood: "romantic",
    intensity: 7,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    description: "Had a wonderful conversation, feeling hopeful",
  },
  {
    id: "vibe-3",
    userId: "user-789",
    mood: "calm",
    intensity: 6,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    description: "Taking time to reflect on my dating goals",
  },
  {
    id: "vibe-4",
    userId: "user-321",
    mood: "social",
    intensity: 9,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    description: "Excited to meet someone new this weekend!",
  },
];

export const inputDataItems: InputDataItem[] = [
  {
    id: "data-1",
    userId: "user-123",
    type: "image",
    content: "https://randomuser.me/api/portraits/women/1.jpg",
    uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "data-2",
    userId: "user-456",
    type: "text",
    content: "Looking for someone genuine who enjoys hiking and coffee conversations",
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "data-3",
    userId: "user-789",
    type: "audio",
    content: "https://example.com/audio-sample.mp3",
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "data-4",
    userId: "user-321",
    type: "video",
    content: "https://example.com/video-sample.mp4",
    uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: "admin-1",
    email: "admin@elinity.com",
    name: "Alex Admin",
    role: "admin",
    status: "active",
    lastActive: new Date(),
    joinedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
  },
  {
    id: "mod-1",
    email: "moderator@elinity.com",
    name: "Sam Moderator",
    role: "moderator",
    status: "active",
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
  },
  {
    id: "user-sample",
    email: "user@example.com",
    name: "John User",
    role: "user",
    status: "active",
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
];

export function getAnalyticsMetrics(): AnalyticsMetric[] {
  return analyticsMetrics;
}

export function getUserActivityData(): UserActivityData[] {
  return userActivityData;
}

export function getVibeCheckData(): VibeCheckEntry[] {
  return vibeCheckData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function getInputData(): InputDataItem[] {
  return inputDataItems.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
}

export function getAdminUsers(): AdminUser[] {
  return adminUsers;
}

export function suspendUser(userId: string): void {
  const user = adminUsers.find((u) => u.id === userId);
  if (user) {
    user.status = "suspended";
  }
}

export function activateUser(userId: string): void {
  const user = adminUsers.find((u) => u.id === userId);
  if (user) {
    user.status = "active";
  }
}
