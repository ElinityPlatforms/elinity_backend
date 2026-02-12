import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './auth/AuthContext';
import { ProfileProvider } from './profiles/ProfileContext';
import { ProfileModeProvider } from './ProfileModeContext';
import { ProtectedRoute } from './auth/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Main Pages
import HomePage from './HomePage';
import ProfilePage from './profiles/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import { ProfilePictureUpload } from './profiles/ProfilePictureUpload';
import LeisureProfile from './profiles/LeisureProfile';
import RomanticProfile from './profiles/RomanticProfile';
import CollaborativeProfile from './profiles/CollaborativeProfile';

// Features
import PromptPage from './components/PromptPage';
import ResultsPage from './components/ResultsPage';
import RecommendationsPage from './pages/recommendations/RecommendationsPage';
import YourMatchesPage from './components/YourMatchesPage';
import MemoriesPage from './components/MemoriesPage';
import ChatPage from './pages/chat/ChatPage';

// Match Success Pages
import RomanticMatchSuccessPage from './components/RomanticMatchSuccessPage';
import LeisureMatchSuccessPage from './components/LeisureMatchSuccessPage';
import CollaborativeMatchSuccessPage from './components/CollaborativeMatchSuccessPage';

// Games
import GamesHub from './pages/games/GamesHub';

// Search
import SearchResultsPage from './pages/search/SearchResultsPage';

// Journal
import JournalPage from './components/JournalPage';
import ArchivePage from './components/ArchivePage';
import SmartJournalsPage from './components/SmartJournalsPage';
import JournalPromptPage from './JournalPromptPage';
import DescribeElinityPersonalityPage from './components/DescribeElinityPersonalityPage';

// Sanctuary & Tools
import SanctuaryPage from './pages/sanctuary/SanctuaryPage';
import DailySuggestionsPage from './dailySuggestions/DailySuggestionsPage';

// Quizzes
import QuizzesPage from './pages/quizzes/QuizzesPage';
import QuizPage from './pages/quizzes/QuizPage';
import QuestionCardsPage from './pages/questions/QuestionCardsPage';

// Community
import CommunityPage from './pages/community/CommunityPage';
import CreatePostPage from './pages/community/CreatePostPage';
import ForumDiscussion from './pages/community/ForumDiscussion';

// Events
import EventsPage from './pages/events/EventsPage';
import CreateEventPage from './pages/events/CreateEventPage';

// Blogs
import BlogsPage from './pages/blogs/BlogsPage';
import BlogDetailPage from './pages/blogs/BlogDetailPage';
import CreateBlogPage from './pages/blogs/CreateBlogPage';

// Lifebook
import LifebookPage from './pages/lifebook/LifebookPage';
import LifebookEntryPage from './pages/lifebook/LifebookEntryPage';

// Network
import MyCircleView from './network/MyCircleView';
import RelationshipPage from './network/RelationshipPage';

// Settings & Admin
import SubscriptionPage from './pages/subscription/SubscriptionPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import AdminDashboard from './pages/admin/AdminDashboard';

// Skills
import SkillsPage from './pages/skills/SkillsPage';
import SkillPracticePage from './pages/skills/SkillPracticePage';
import SkillEvaluationPage from './pages/skills/SkillEvaluationPage';

// Onboarding
import VoiceOnboardingPage from './pages/onboarding/VoiceOnboardingPage';

// AI Companion
import LumiChatPage from './pages/lumi/LumiChatPage';
import AIModesPage from './pages/ai-modes/AIModesPage';

// Styles
import './styles/globals.css';
import './App.css';

// Layouts
import MainLayout from './components/MainLayout';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ProfileModeProvider>
            <ProfileProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes Wrapper */}
                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/edit-profile" element={<EditProfilePage />} />
                  <Route path="/profile-picture-upload" element={<ProfilePictureUpload />} />
                  <Route path="/leisure-profile" element={<LeisureProfile />} />
                  <Route path="/romantic-profile" element={<RomanticProfile />} />
                  <Route path="/collaborative-profile" element={<CollaborativeProfile />} />
                  <Route path="/prompt" element={<PromptPage />} />
                  <Route path="/recommendations" element={<RecommendationsPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/your-matches" element={<YourMatchesPage />} />
                  <Route path="/romantic-match-success" element={<RomanticMatchSuccessPage />} />
                  <Route path="/leisure-match-success" element={<LeisureMatchSuccessPage />} />
                  <Route path="/collaborative-match-success" element={<CollaborativeMatchSuccessPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/memories" element={<MemoriesPage />} />
                  <Route path="/games" element={<GamesHub />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/journal" element={<JournalPage />} />
                  <Route path="/archive" element={<ArchivePage />} />
                  <Route path="/smart-journals" element={<SmartJournalsPage />} />
                  <Route path="/journal-prompt" element={<JournalPromptPage />} />
                  <Route path="/describe-elinity-personality" element={<DescribeElinityPersonalityPage />} />
                  <Route path="/sanctuary" element={<SanctuaryPage />} />
                  <Route path="/daily-suggestions" element={<DailySuggestionsPage />} />
                  <Route path="/quizzes" element={<QuizzesPage />} />
                  <Route path="/quizzes/:quizId" element={<QuizPage />} />
                  <Route path="/question-cards" element={<QuestionCardsPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/community/post" element={<CreatePostPage />} />
                  <Route path="/community/discussion/:postId" element={<ForumDiscussion />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/create" element={<CreateEventPage />} />
                  <Route path="/blogs" element={<BlogsPage />} />
                  <Route path="/blogs/:blogId" element={<BlogDetailPage />} />
                  <Route path="/blogs/create" element={<CreateBlogPage />} />
                  <Route path="/lifebook" element={<LifebookPage />} />
                  <Route path="/lifebook/category/:categoryId" element={<LifebookEntryPage />} />
                  <Route path="/my-circle" element={<MyCircleView />} />
                  <Route path="/network/:personId" element={<RelationshipPage />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/skills" element={<SkillsPage />} />
                  <Route path="/skills/:type/:skillId" element={<SkillPracticePage />} />
                  <Route path="/skills/evaluation/:sessionId" element={<SkillEvaluationPage />} />
                  <Route path="/onboarding/voice" element={<VoiceOnboardingPage />} />
                  <Route path="/lumi" element={<LumiChatPage />} />
                  <Route path="/ai-personas" element={<AIModesPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ProfileProvider>
          </ProfileModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
