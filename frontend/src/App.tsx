import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import LiveFeeds from './pages/LiveFeeds'
import Analytics from './pages/Analytics'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Alerts from './pages/Alerts'
import ResolvedIncidents from './pages/ResolvedIncidents'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useAlertToasts } from './hooks/useAlertToasts'

/**
 * Main App Content Component
 * 
 * Handles routing, page transitions, and conditional header rendering.
 * Implements smooth page transitions with fade animations.
 * Also manages global alert toast notifications.
 */
function AppContent() {
  const location = useLocation();
  const showHeader = location.pathname !== '/login' && location.pathname !== '/signup';
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  // Enable global alert toast notifications across all pages
  // This hook monitors alerts and shows toasts for new ones
  useAlertToasts();

  /**
   * Page Transition Effect
   * 
   * Implements smooth page transitions by:
   * 1. Fading out the current page
   * 2. Updating the location after a short delay
   * 3. Fading in the new page
   * 
   * This creates a polished user experience when navigating between pages.
   */
  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <div className="min-h-screen bg-background-dark text-gray-100 relative">
      <div className="animated-background"></div>
      {showHeader && <Header />}
      <div className={`animate-${transitionStage} page-content`}>
        <Routes location={displayLocation}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/live-feeds" element={<LiveFeeds />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/resolved-incidents" element={<ResolvedIncidents />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App


