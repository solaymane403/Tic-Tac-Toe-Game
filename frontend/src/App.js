import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, isAuthenticated } = useAuth();

  // Handle page restrictions for guest users
  useEffect(() => {
    if (!user) {
      // No user at all - stay on current page (dashboard allows guest play)
      return;
    }
    
    if (user.isGuest && (currentPage === 'profile' || currentPage === 'leaderboard')) {
      // Guest trying to access protected pages - redirect to dashboard
      setCurrentPage('dashboard');
    }
  }, [user, currentPage]);

  const renderPage = () => {
    // Login/Register pages
    if (currentPage === 'login') {
      return <LoginPage setCurrentPage={setCurrentPage} />;
    }
    if (currentPage === 'register') {
      return <RegisterPage setCurrentPage={setCurrentPage} />;
    }

    // Main app pages (accessible by guests and authenticated users)
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        
        {currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} />}
        {currentPage === 'game' && <GamePage setCurrentPage={setCurrentPage} />}
        {currentPage === 'leaderboard' && isAuthenticated() && <LeaderboardPage />}
        {currentPage === 'profile' && isAuthenticated() && <ProfilePage />}
      </div>
    );
  };

  return renderPage();
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;