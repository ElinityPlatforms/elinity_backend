export interface BlogComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Blog {
  id: string;
  title: string;
  author: string;
  avatar: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  readTime: number;
  publishedDate: string;
  likes: number;
  comments: BlogComment[];
  commentCount: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
  icon: string;
  tags: string[];
}
