export type Comment = {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
};

export type ForumPost = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  category: string;
  createdAt: Date;
  views: number;
  likes: number;
  commentCount: number;
  comments: Comment[];
  tags?: string[];
};

export type PostFilter = "all" | "recent" | "popular" | "unanswered";
export type PostCategory = "relationships" | "dating-tips" | "connection" | "lifestyle" | "other";
