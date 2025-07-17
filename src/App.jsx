import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./pages/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import Resume from "./pages/resume-analysis";
import Skillgap from "./pages/Skill-gap-analysis";
import Career from "./pages/CareerInsight";
import Jobs from "./pages/JobFinder";
import Course from"./pages/Cousepage";
import CoverLetterGenerator from "./pages/CoverLetterGenerator";
import ATSChecker from "./pages/ATSChecker";
import Chatbot from "./pages/ResumeChatbot";
import CareerRoadmapGenerator from "./pages/CareerRoadmapGenerator";
import CareerComparisons from "./pages/CareerComparisons";
import CareerQuiz from "./pages/CareerQuiz";
import Profile from "./pages/Profile";
import Admin from "./pages/AdminPanel";
import Manage from "./pages/Manage"; // Import Manage.jsx


function App() {
  const { user, isAdmin } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {!user ? (
          <>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : isAdmin ? (
          <>
            <Route path="/resume-analysis" element={<Resume />} />
            <Route path="/skill-gap" element={<Skillgap />} />
            <Route path="/career-insights" element={<Career />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/course" element={<Course />} />
            <Route path="/cover-letter" element={<CoverLetterGenerator />} />
            <Route path="/ats-checker" element={<ATSChecker />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/careerroadmap" element={<CareerRoadmapGenerator />} />
            <Route path="/careercomparisons" element={<CareerComparisons />} />
            <Route path="/careerquiz" element={<CareerQuiz />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/manage/:type" element={<Manage />} />
          </>
        ) : (
          <>
            <Route path="/resume-analysis" element={<Resume />} />
            <Route path="/skill-gap" element={<Skillgap />} />
            <Route path="/career-insights" element={<Career />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/course" element={<Course />} />
            <Route path="/cover-letter" element={<CoverLetterGenerator />} />
            <Route path="/ats-checker" element={<ATSChecker />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/careerroadmap" element={<CareerRoadmapGenerator />} />
            <Route path="/careercomparisons" element={<CareerComparisons />} />
            <Route path="/careerquiz" element={<CareerQuiz />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
