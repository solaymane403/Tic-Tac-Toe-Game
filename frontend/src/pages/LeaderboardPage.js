import React from 'react';
import { Trophy } from 'lucide-react';
import Leaderboard from '../components/Leaderboard';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <Trophy className="w-20 h-20 mx-auto text-yellow-400 mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-400 text-lg">Top players in GameHub</p>
        </div>

        {/* Leaderboard Component */}
        <Leaderboard />

        {/* Additional Info */}
        <div className="mt-8 bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-purple-500">
          <h3 className="text-white font-semibold mb-3 text-lg">🏆 Ranking System</h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
            <div className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Win games to earn 100 points</span>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Rankings update in real-time</span>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Challenge top players for bonus points</span>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Leaderboard resets monthly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;