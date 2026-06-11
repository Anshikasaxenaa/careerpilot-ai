import "./App.css";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPassword from "./pages/auth/ResetPassword";

import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

import InterviewSetupPage from "./pages/interview/InterviewSetupPage";
import InterviewSessionPage from "./pages/interview/InterviewSessionPage";
import InterviewResultPage from "./pages/interview/InterviewResultPage";

import ResumePage from "./pages/resume/ResumePage";
import CodingPage from "./pages/coding/CodingPage";
import CodingChallengePage from "./pages/coding/CodingChallengePage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import RoadmapPage from "./pages/analytics/RoadmapPage";
import AdminPage from "./pages/admin/AdminPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/interview" element={<InterviewSetupPage />} />
        <Route
          path="/interview/:id/session"
          element={<InterviewSessionPage />}
        />
        <Route path="/interview/:id/result" element={<InterviewResultPage />} />

        <Route path="/resume" element={<ResumePage />} />
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/coding/:id" element={<CodingChallengePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
