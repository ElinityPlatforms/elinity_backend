import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import ProfilePage from "./profiles/ProfilePage";
import EditProfile from "./profiles/EditProfile";
import { ProfileModeProvider } from "./ProfileModeContext";
import { ProfileProvider } from "./profiles/ProfileContext";
import { AuthProvider } from "./auth/AuthContext";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import LeisureProfile from "./profiles/LeisureProfile";
import RomanticProfile from "./profiles/RomanticProfile";
import CollaborativeProfile from "./profiles/CollaborativeProfile";
import PromptPage from "./components/PromptPage";
import ResultsPage from "./components/ResultsPage";
import RomanticMatchSuccessPage from "./components/RomanticMatchSuccessPage";
import LeisureMatchSuccessPage from "./components/LeisureMatchSuccessPage";
import CollaborativeMatchSuccessPage from "./components/CollaborativeMatchSuccessPage";
import YourMatchesPage from "./components/YourMatchesPage";
import MemoriesPage from "./components/MemoriesPage";
import ChatPage from "./components/ChatPage";
import ConnectionGameSuitPage from "./components/ConnectionGameSuitPage";
import FlirtOrFactPage from "./components/FlirtOrFactPage";
import GameInfoPage from "./components/GameInfoPage";
import JournalPage from "./components/JournalPage";
import ArchivePage from "./components/ArchivePage";
import SmartJournalsPage from "./components/SmartJournalsPage";
import JournalPromptPage from "./JournalPromptPage"; // Import the new page
import DescribeElinityPersonalityPage from "./components/DescribeElinityPersonalityPage";
import SanctuaryRoom from "./sanctuary/SanctuaryRoom";
import ConnectionDiscoverySuite from "./connection-discovery/ConnectionDiscoverySuite";
import DailySuggestionsPage from "./dailySuggestions/DailySuggestionsPage";
import QuizzesListPage from "./quizzes/QuizzesListPage";
import QuizPage from "./quizzes/QuizPage";
import ForumHome from "./community/ForumHome";
import PostQuestion from "./community/PostQuestion";
import ForumDiscussion from "./community/ForumDiscussion";
import AdminDashboard from "./admin/AdminDashboard";
import BlogHome from "./blogs/BlogHome";
import OpenBlog from "./blogs/OpenBlog";
import RelationshipResourcesPage from "./blogs/RelationshipResourcesPage";
import MyCircleView from "./network/MyCircleView";
import RelationshipPage from "./network/RelationshipPage";
import SubscriptionPage from "./components/SubscriptionPage";
import NotificationsPage from "./components/NotificationsPage";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ProfileModeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/leisure-profile" element={<LeisureProfile />} />
              <Route path="/romantic-profile" element={<RomanticProfile />} />
              <Route path="/collaborative-profile" element={<CollaborativeProfile />} />
              <Route path="/prompt" element={<PromptPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/romantic-match-success" element={<RomanticMatchSuccessPage />} />
              <Route path="/leisure-match-success" element={<LeisureMatchSuccessPage />} />
              <Route path="/collaborative-match-success" element={<CollaborativeMatchSuccessPage />} />
              <Route path="/your-matches" element={<YourMatchesPage />} />
              <Route path="/memories" element={<MemoriesPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/games" element={<ConnectionGameSuitPage />} />
              <Route path="/flirt-or-fact" element={<FlirtOrFactPage />} />
              <Route path="/game-info" element={<GameInfoPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/describe-elinity-personality" element={<DescribeElinityPersonalityPage />} />
              <Route path="/smart-journals" element={<SmartJournalsPage />} />
              <Route path="/journal-prompt" element={<JournalPromptPage />} />
              <Route path="/sanctuary" element={<SanctuaryRoom />} />
              <Route path="/connection-discovery" element={<ConnectionDiscoverySuite />} />
              <Route path="/daily-suggestions" element={<DailySuggestionsPage />} />
              <Route path="/quizzes" element={<QuizzesListPage />} />
              <Route path="/quizzes/:quizId" element={<QuizPage />} />
              <Route path="/community" element={<ForumHome />} />
              <Route path="/community/post" element={<PostQuestion />} />
              <Route path="/community/discussion/:postId" element={<ForumDiscussion />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/my-circle" element={<MyCircleView />} />
              <Route path="/network/:personId" element={<RelationshipPage />} />
              <Route path="/blogs" element={<BlogHome />} />
              <Route path="/blogs/:blogId" element={<OpenBlog />} />
              <Route path="/resources" element={<RelationshipResourcesPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Routes>
          </Router>
        </ProfileModeProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
