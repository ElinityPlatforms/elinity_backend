import type { ForumPost, Comment } from "./types";

const samplePosts: ForumPost[] = [
  {
    id: "post-1",
    title: "Tips for meaningful first conversations?",
    content: "I recently matched with someone I really like, but I'm not sure how to start a conversation that goes deeper than surface level. Any tips for breaking the ice in a meaningful way?",
    authorName: "Sarah M.",
    category: "dating-tips",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    views: 156,
    likes: 32,
    commentCount: 8,
    comments: [
      {
        id: "c1",
        authorName: "Alex K.",
        content: "Ask about their favorite experiences or what they're passionate about. People love talking about things they care about!",
        createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
        likes: 12,
      },
      {
        id: "c2",
        authorName: "Jordan P.",
        content: "I always ask 'What's something you've learned recently that surprised you?' It opens up interesting conversations.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        likes: 8,
      },
    ],
    tags: ["first-date", "conversation", "advice"],
  },
  {
    id: "post-2",
    title: "How do you balance dating with a busy career?",
    content: "Finding it difficult to prioritize dating when work is demanding. How do others manage to put themselves out there while maintaining professional commitments?",
    authorName: "Jamie T.",
    category: "lifestyle",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    views: 234,
    likes: 45,
    commentCount: 12,
    comments: [
      {
        id: "c3",
        authorName: "Morgan L.",
        content: "Set specific days for dating activities. Treat it like any other commitment.",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        likes: 18,
      },
    ],
    tags: ["work-life-balance", "career", "dating"],
  },
  {
    id: "post-3",
    title: "Red flags to watch out for early in dating?",
    content: "What are some early warning signs that someone might not be a good match? Looking for perspective on what should make me take a step back.",
    authorName: "Casey R.",
    category: "relationships",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    views: 342,
    likes: 67,
    commentCount: 15,
    comments: [],
    tags: ["red-flags", "safety", "advice"],
  },
  {
    id: "post-4",
    title: "How to build genuine connections?",
    content: "In today's dating culture, it seems like surface-level interactions are the norm. How do you build real, meaningful connections with potential partners?",
    authorName: "Riley M.",
    category: "connection",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    views: 98,
    likes: 28,
    commentCount: 6,
    comments: [],
    tags: ["connections", "authenticity", "relationships"],
  },
  {
    id: "post-5",
    title: "Best conversation starters?",
    content: "What are your go-to conversation starters that actually work? Tired of the usual 'How's your day been?'",
    authorName: "Taylor A.",
    category: "dating-tips",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    views: 201,
    likes: 56,
    commentCount: 22,
    comments: [],
    tags: ["conversation", "icebreakers", "chat"],
  },
];

export function getAllPosts(): ForumPost[] {
  return samplePosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getPostById(id: string): ForumPost | undefined {
  return samplePosts.find((p) => p.id === id);
}

export function getPostsByCategory(category: string): ForumPost[] {
  return samplePosts.filter((p) => p.category === category);
}

export function getPopularPosts(): ForumPost[] {
  return [...samplePosts].sort((a, b) => b.likes - a.likes);
}

export function getUnansweredPosts(): ForumPost[] {
  return samplePosts.filter((p) => p.commentCount === 0);
}

export function addComment(postId: string, comment: Comment): void {
  const post = samplePosts.find((p) => p.id === postId);
  if (post) {
    post.comments.push(comment);
    post.commentCount += 1;
  }
}

export function addPost(post: ForumPost): void {
  samplePosts.unshift(post);
}

export const categories = [
  { value: "all", label: "All Posts" },
  { value: "relationships", label: "Relationships" },
  { value: "dating-tips", label: "Dating Tips" },
  { value: "connection", label: "Connection" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "other", label: "Other" },
];
