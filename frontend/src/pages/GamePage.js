import React, { useState } from 'react';
import { Bot, Users, ArrowLeft, Zap, Brain, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GameBoard from '../components/GameBoard';

const GamePage = ({ setCurrentPage }) => {
  const { user, isAuthenticated } = useAuth();
  const [gameMode, setGameMode] = useState(null); // null, 'bot', 'multiplayer'
  const [difficulty, setDifficulty] = useState('medium');

  // Mode selection screen
  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="mb-6 text-purple-400 hover:text-purple-300 transition flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Choose Game Mode</h1>
            <p className="text-xl text-gray-400">Select how you want to play</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* AI Bot Mode */}
            <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500 hover:border-purple-400 transition group">
              <Bot className="w-20 h-20 mx-auto mb-6 text-purple-400 group-hover:scale-110 transition" />
              <h2 className="text-3xl font-bold text-white mb-4 text-center">vs AI Bot</h2>
              <p className="text-gray-300 mb-6 text-center">Challenge our intelligent AI opponent</p>

              {/* Difficulty Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3 text-center">Select Difficulty:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setDifficulty('easy')}
                    className={`py-3 rounded-lg font-semibold transition ${
                      difficulty === 'easy'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Zap className="w-5 h-5 mx-auto mb-1" />
                    Easy
                  </button>
                  <button
                    onClick={() => setDifficulty('medium')}
                    className={`py-3 rounded-lg font-semibold transition ${
                      difficulty === 'medium'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Target className="w-5 h-5 mx-auto mb-1" />
                    Medium
                  </button>
                  <button
                    onClick={() => setDifficulty('hard')}
                    className={`py-3 rounded-lg font-semibold transition ${
                      difficulty === 'hard'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Brain className="w-5 h-5 mx-auto mb-1" />
                    Hard
                  </button>
                </div>
              </div>

              <ul className="space-y-2 text-gray-300 mb-6 text-sm">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Play offline anytime</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>No waiting for opponents</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Perfect your strategy</span>
                </li>
              </ul>

              <button
                onClick={() => setGameMode('bot')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-lg transition transform hover:scale-105"
              >
                Start Game vs AI
              </button>
            </div>

            {/* Multiplayer Mode */}
            <div className={`bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 border-2 border-pink-500 hover:border-pink-400 transition group ${
              !isAuthenticated() && 'opacity-75'
            }`}>
              <Users className="w-20 h-20 mx-auto mb-6 text-pink-400 group-hover:scale-110 transition" />
              <h2 className="text-3xl font-bold text-white mb-4 text-center">Multiplayer</h2>
              <p className="text-gray-300 mb-6 text-center">Play against real players worldwide</p>

              <ul className="space-y-2 text-gray-300 mb-6 text-sm">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">★</span>
                  <span>Real-time matchmaking</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">★</span>
                  <span>Earn ranking points</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">★</span>
                  <span>Climb the leaderboard</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">★</span>
                  <span>Unlock achievements</span>
                </li>
              </ul>

              {isAuthenticated() ? (
                <button
                  onClick={() => setGameMode('multiplayer')}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition transform hover:scale-105"
                >
                  Find Match
                </button>
              ) : (
                <div>
                  <div className="bg-yellow-900 bg-opacity-50 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg text-sm mb-4 text-center">
                    🔒 Login required for multiplayer
                  </div>
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition transform hover:scale-105"
                  >
                    Login to Play
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Game Tips */}
          <div className="mt-8 bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-purple-500">
            <h3 className="text-white font-semibold mb-3 text-center text-xl">🎮 Game Tips</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-gray-300">Control the center to maximize your winning chances</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🛡️</div>
                <div className="text-gray-300">Always watch for opponent's potential winning moves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-gray-300">Corner squares are more valuable than edges</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setGameMode(null)}
          className="mb-6 text-purple-400 hover:text-purple-300 transition flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Change Game Mode</span>
        </button>

        <GameBoard gameMode={gameMode} difficulty={difficulty} />

        {/* Game Info */}
        <div className="mt-6 bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-purple-500">
          <h3 className="text-white font-semibold mb-2">
            {gameMode === 'bot' ? `🤖 Playing vs AI (${difficulty.toUpperCase()})` : '🌐 Multiplayer Mode'}
          </h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Get three in a row (horizontally, vertically, or diagonally) to win</li>
            {gameMode === 'bot' ? (
              <>
                <li>• Practice your strategy against the AI</li>
                <li>• Try different difficulty levels to challenge yourself</li>
              </>
            ) : (
              <>
                <li>• Play against other players in real-time</li>
                <li>• Win games to earn points and climb the leaderboard</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GamePage;