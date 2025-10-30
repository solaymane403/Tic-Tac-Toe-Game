import React from 'react';
import { Gamepad2, Trophy, User, Bot, Users, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = ({ setCurrentPage }) => {
  const { user, playAsGuest, isAuthenticated } = useAuth();

  // Welcome screen for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Sparkles className="w-20 h-20 mx-auto mb-6 text-purple-400 animate-pulse" />
            <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in">
              Welcome to GameHub 🎮
            </h1>
            <p className="text-2xl text-gray-300 mb-8">Choose your adventure!</p>
          </div>

          {/* Game Mode Selection */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Play as Guest */}
            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-500 hover:border-purple-400 transition group">
              <Bot className="w-16 h-16 mx-auto mb-4 text-purple-400 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-bold text-white mb-3 text-center">Play vs AI Bot</h3>
              <p className="text-gray-400 mb-6 text-center">Practice against our smart AI. No login required!</p>
              <ul className="space-y-2 text-gray-300 mb-6 text-sm">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>3 difficulty levels</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Instant play, no account needed</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Perfect for practice</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  playAsGuest();
                  setCurrentPage('game');
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
              >
                Play as Guest
              </button>
            </div>

            {/* Login for Multiplayer */}
            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl border-2 border-pink-500 hover:border-pink-400 transition group">
              <Users className="w-16 h-16 mx-auto mb-4 text-pink-400 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-bold text-white mb-3 text-center">Multiplayer Mode</h3>
              <p className="text-gray-400 mb-6 text-center">Login to play against real players and climb the ranks!</p>
              <ul className="space-y-2 text-gray-300 mb-6 text-sm">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">★</span>
                  <span>Real-time multiplayer</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">★</span>
                  <span>Global leaderboard</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">★</span>
                  <span>Ranks & achievements</span>
                </li>
              </ul>
              <button
                onClick={() => setCurrentPage('login')}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Login / Register
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500">
            <h3 className="text-xl font-bold text-white mb-4 text-center">🎯 Game Features</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl mb-2">🤖</div>
                <div className="text-white font-semibold">Smart AI</div>
                <div className="text-gray-400 text-sm">Multiple difficulty levels</div>
              </div>
              <div>
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-white font-semibold">Rankings</div>
                <div className="text-gray-400 text-sm">Compete globally</div>
              </div>
              <div>
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-white font-semibold">Real-time</div>
                <div className="text-gray-400 text-sm">Live multiplayer action</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard for authenticated/guest users
  const displayName = user.isGuest ? 'Guest Player' : user.username;
  const isAuth = isAuthenticated();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
            Welcome back, {displayName}! 🎮
          </h1>
          {user.isGuest && (
            <div className="inline-block bg-yellow-900 bg-opacity-50 border border-yellow-500 text-yellow-200 px-4 py-2 rounded-lg text-sm mb-4">
              Playing as guest. <button onClick={() => setCurrentPage('login')} className="underline font-semibold">Login</button> to save progress & play multiplayer!
            </div>
          )}
          <p className="text-xl text-gray-400">Ready to dominate the leaderboard?</p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => setCurrentPage('game')}
            className="bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 p-8 rounded-2xl shadow-2xl transition transform hover:scale-105 hover:shadow-purple-500/50"
          >
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-white" />
            <h3 className="text-2xl font-bold text-white mb-2">Play Game</h3>
            <p className="text-gray-200">{user.isGuest ? 'vs AI Bot' : 'Multiplayer & AI'}</p>
          </button>

          <button
            onClick={() => isAuth ? setCurrentPage('leaderboard') : setCurrentPage('login')}
            className={`bg-gradient-to-br from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 p-8 rounded-2xl shadow-2xl transition transform hover:scale-105 hover:shadow-yellow-500/50 ${!isAuth && 'opacity-75'}`}
          >
            <Trophy className="w-16 h-16 mx-auto mb-4 text-white" />
            <h3 className="text-2xl font-bold text-white mb-2">Leaderboard</h3>
            <p className="text-gray-200">{isAuth ? 'View top players' : '🔒 Login required'}</p>
          </button>

          <button
            onClick={() => isAuth ? setCurrentPage('profile') : setCurrentPage('login')}
            className={`bg-gradient-to-br from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 p-8 rounded-2xl shadow-2xl transition transform hover:scale-105 hover:shadow-green-500/50 ${!isAuth && 'opacity-75'}`}
          >
            <User className="w-16 h-16 mx-auto mb-4 text-white" />
            <h3 className="text-2xl font-bold text-white mb-2">Profile</h3>
            <p className="text-gray-200">{isAuth ? 'View your stats' : '🔒 Login required'}</p>
          </button>
        </div>

        {/* Recent Activity Section - Only for authenticated users */}
        {isAuth && (
          <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 border border-purple-500 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-2 h-8 bg-purple-500 mr-3 rounded"></span>
              Recent Activity
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-700 bg-opacity-50 p-5 rounded-lg hover:bg-opacity-70 transition">
                <div className="text-gray-400 text-sm mb-1">Last Game Played</div>
                <div className="text-purple-400 font-semibold text-lg">2 hours ago</div>
              </div>
              
              <div className="bg-gray-700 bg-opacity-50 p-5 rounded-lg hover:bg-opacity-70 transition">
                <div className="text-gray-400 text-sm mb-1">Total Wins</div>
                <div className="text-green-400 font-semibold text-lg">47</div>
              </div>
              
              <div className="bg-gray-700 bg-opacity-50 p-5 rounded-lg hover:bg-opacity-70 transition">
                <div className="text-gray-400 text-sm mb-1">Current Rank</div>
                <div className="text-yellow-400 font-semibold text-lg">#12</div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-6 border border-indigo-500">
          <h3 className="text-xl font-bold text-white mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2 text-gray-300">
            {user.isGuest ? (
              <>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Start with Easy difficulty to learn the game</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Challenge yourself with Hard mode for the ultimate test</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Login to unlock multiplayer and compete on the leaderboard!</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Play daily to climb the leaderboard faster</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Challenge top players to earn bonus points</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Complete your profile to unlock achievements</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;