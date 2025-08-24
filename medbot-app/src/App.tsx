import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import IntegrationPage from './pages/IntegrationPage';
import SettingsPage from './pages/SettingsPage';
import CalendarPage from './pages/CalendarPage';
import ProfilePage from './pages/ProfilePage';
import { ReloadProvider } from './hooks/useReload';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// App Content Component (handles navigation logic)
const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const handlePageChange = (page: string) => {
    navigate(`/${page}`);
  };

  const getCurrentPage = (): string => {
    const path = location.pathname.substring(1) || 'landing';
    return path === '' ? 'landing' : path;
  };

  // Routes that don't need layout
  if (location.pathname === '/' || location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
    );
  }

  // Protected routes with layout
  return (
    <ReloadProvider>
      <Layout 
        currentPage={getCurrentPage()} 
        onPageChange={handlePageChange}
        onLogout={handleLogout}
      >
        <Routes>
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/integration" element={<ProtectedRoute><IntegrationPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </ReloadProvider>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

