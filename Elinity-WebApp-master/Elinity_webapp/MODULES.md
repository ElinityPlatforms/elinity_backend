# Elinity Frontend - Complete Module Overview

## ✅ All Available Modules & Routes

### 🏠 Core Features
1. **Home Dashboard** (`/`) - Main landing page with all module cards
2. **Login** (`/login`) - User authentication
3. **Register** (`/register`) - New user registration

### 👤 Profile & Settings
4. **Profile Page** (`/profile`) - View user profile
5. **Edit Profile** (`/edit-profile`) - Modify user settings
6. **Leisure Profile** (`/leisure-profile`) - Leisure interests
7. **Romantic Profile** (`/romantic-profile`) - Romantic preferences
8. **Collaborative Profile** (`/collaborative-profile`) - Collaboration preferences

### 💝 Matching & Connections
9. **Priorities/Prompt** (`/prompt`) - Set relationship priorities
10. **Results Page** (`/results`) - View matching results
11. **Your Matches** (`/your-matches`) - See all connections
12. **Connection Discovery Suite** (`/connection-discovery`) - Advanced matching
13. **Romantic Match Success** (`/romantic-match-success`)
14. **Leisure Match Success** (`/leisure-match-success`)
15. **Collaborative Match Success** (`/collaborative-match-success`)

### 💬 Communication
16. **Chat/Messages** (`/chat`) - Direct messaging
17. **Memories** (`/memories`) - Shared memories with connections

### 🎮 Games & Activities
18. **Games Hub** (`/games`) - Connection games suite
19. **Game Session** (`/games/:slug/play`) - Play specific games
20. **Flirt or Fact** (`/flirt-or-fact`) - Interactive game
21. **Game Info** (`/game-info`) - Game details

### 📝 Journaling & Growth
22. **Journal** (`/journal`) - AI-powered journaling
23. **Archive** (`/archive`) - Journal archive
24. **Smart Journals** (`/smart-journals`) - AI insights
25. **Journal Prompt** (`/journal-prompt`) - Writing prompts
26. **Describe Personality** (`/describe-elinity-personality`)

### 🧘 Personal Development
27. **Sanctuary** (`/sanctuary`) - Personal sanctuary room
28. **Daily Suggestions** (`/daily-suggestions`) - Personalized recommendations

### 🎯 Learning & Insights
29. **Quizzes List** (`/quizzes`) - Browse all quizzes
30. **Quiz Page** (`/quizzes/:quizId`) - Take specific quiz

### 👥 Community
31. **Forum Home** (`/community`) - Community discussions
32. **Post Question** (`/community/post`) - Create new post
33. **Forum Discussion** (`/community/discussion/:postId`) - View thread

### 📚 Resources
34. **Blogs Home** (`/blogs`) - Relationship articles
35. **Open Blog** (`/blogs/:blogId`) - Read specific blog
36. **Relationship Resources** (`/resources`) - Educational content

### 🌐 Network
37. **My Circle** (`/my-circle`) - Your network view
38. **Relationship Page** (`/network/:personId`) - Individual relationship

### 💳 Account
39. **Subscription** (`/subscription`) - Manage subscription
40. **Notifications** (`/notifications`) - View notifications

### 🔧 Admin
41. **Admin Dashboard** (`/admin`) - Admin panel

---

## 🔌 Backend Connection

**Base URL**: `http://136.113.118.172`

All API calls are automatically prefixed with this URL via `apiClient.ts`.

### Key API Endpoints Available:
- **Authentication**: `/auth/login`, `/auth/register`, `/auth/refresh`
- **User Profile**: `/users/me`, `/users/me/personal-info`, `/users/me/big-five-traits`
- **Dashboard**: `/dashboard/me`, `/dashboard/relationship`
- **Chats**: `/chats/`, `/chats/direct/{target_id}`
- **Journal**: `/journal/`, `/journal/{id}`
- **Recommendations**: `/recommendations/`, `/recommendations/search`
- **Games**: `/games/multiplayer/list`, `/games/multiplayer/create`
- **Tools**: `/tools/rituals`, `/tools/quizzes`, `/tools/moodboards`
- **Social Feed**: `/feed/`, `/feed/{post_id}/like`
- **Events**: `/events/`, `/events/{event_id}/invite`
- **Blogs**: `/blogs/`
- **Notifications**: `/notifications/`
- **Search**: `/search/global`

**Full API Documentation**: http://136.113.118.172/docs

---

## 🎨 UI Components

### Reusable Components:
- **Sidebar** - Navigation sidebar with all modules
- **Topbar** - Search bar and user menu
- **Card** - Glassmorphic card component

### Design System:
- **Colors**: Purple/blue gradient theme
- **Style**: Glassmorphism with backdrop blur
- **Typography**: Inter font family
- **Animations**: Smooth hover effects and transitions

---

## 🚀 Quick Start

1. **Login** at `/login` with your credentials
2. **Home Dashboard** shows all available modules
3. **Sidebar** provides quick navigation to any module
4. **Search** in topbar to find specific content
5. **Profile** settings accessible from avatar dropdown

---

## 📱 Navigation Tips

- **Sidebar Icons**: Hover to see tooltips
- **Active Route**: Highlighted with purple gradient
- **Quick Actions**: Buttons on home page for common tasks
- **Module Cards**: Click any card to navigate to that feature

---

## ✨ No Mock Data

All data is now fetched from the backend API. If you see "Loading..." or empty states, it means:
1. The backend endpoint hasn't returned data yet
2. You may need to create content first (e.g., journal entries, matches)
3. Check browser console for any API errors

---

Last Updated: 2026-01-26
