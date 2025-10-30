import React from 'react';
import { Gamepad2, Home, Trophy, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gamepad2 className="w-8 h-8" />
          <h1 className="text-2xl font-bold">GameHub</h1>
        </div>
        
        {user && (
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`flex items-center space-x-1 hover:text-purple-300 transition ${
                currentPage === 'dashboard' ? 'text-purple-300' : ''
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => isAuthenticated() ? setCurrentPage('leaderboard') : setCurrentPage('login')}
              className={`flex items-center space-x-1 hover:text-purple-300 transition ${
                currentPage === 'leaderboard' ? 'text-purple-300' : ''
              } ${!isAuthenticated() && 'opacity-60'}`}
            >
              <Trophy className="w-5 h-5" />
              <span>Leaderboard</span>
              {!isAuthenticated() && <span className="text-xs">🔒</span>}
            </button>
            
            <button
              onClick={() => isAuthenticated() ? setCurrentPage('profile') : setCurrentPage('login')}
              className={`flex items-center space-x-1 hover:text-purple-300 transition ${
                currentPage === 'profile' ? 'text-purple-300' : ''
              } ${!isAuthenticated() && 'opacity-60'}`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
              {!isAuthenticated() && <span className="text-xs">🔒</span>}
            </button>
            
            <div className="border-l border-purple-600 pl-6 flex items-center space-x-3">
              <span className="text-sm">
                {user.isGuest ? (
                  <span className="flex items-center gap-1">
                    👤 <span className="text-yellow-300">Guest</span>
                  </span>
                ) : (
                  `@${user.username}`
                )}
              </span>
              {user.isGuest ? (
                <button
                  onClick={() => setCurrentPage('login')}
                  className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              ) : (
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;