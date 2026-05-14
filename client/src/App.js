import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import ChatWidget from './components/chatbot/ChatWidget';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PredictionPage from './pages/PredictionPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import DietPlanPage from './pages/DietPlanPage';
import WorkoutPlanPage from './pages/WorkoutPlanPage';
import DoctorsPage from './pages/DoctorsPage';
import FeedbackPage from './pages/FeedbackPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/prediction" element={<PredictionPage />} />
                  <Route path="/result/:id" element={<ResultPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/diet-plan/:predictionId" element={<DietPlanPage />} />
                  <Route path="/workout-plan/:predictionId" element={<WorkoutPlanPage />} />
                  <Route path="/doctors" element={<DoctorsPage />} />
                  <Route path="/feedback" element={<FeedbackPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                  </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <ChatWidget />
          </div>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
