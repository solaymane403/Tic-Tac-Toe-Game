import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import websocketService from '../services/websocket';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to real-time leaderboard updates
    websocketService.connect(
      () => {
        websocketService.subscribeToLeaderboard(handleLeaderboardUpdate);
      },
      (err) => {
        console.error('WebSocket connection failed:', err);
      }
    );

    return () => {
      websocketService.disconnect();
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await api.getLeaderboard();
      setLeaderboard(data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaderboardUpdate = (update) => {
    // Handle real-time leaderboard updates
    console.log('Leaderboard update received:', update);
    if (Array.isArray(update)) {
      setLeaderboard(update);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        <p className="text-white mt-4">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-6 py-4 rounded-lg">
        <p>{error}</p>
        <button
          onClick={fetchLeaderboard}
          className="mt-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 bg-opacity-80 rounded-2xl overflow-hidden border border-purple-500">
      <div className="bg-purple-900 px-6 py-4">
        <h3 className="text-xl font-bold text-white">Top Players</h3>
      </div>
      
      <table className="w-full">
        <thead className="bg-purple-800 bg-opacity-50">
          <tr>
            <th className="px-6 py-4 text-left text-white font-bold">Rank</th>
            <th className="px-6 py-4 text-left text-white font-bold">Username</th>
            <th className="px-6 py-4 text-right text-white font-bold">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                No players yet. Be the first to play!
              </td>
            </tr>
          ) : (
            leaderboard.map((entry, index) => (
              <tr
                key={index}
                className={`border-b border-gray-700 hover:bg-gray-700 hover:bg-opacity-30 transition ${
                  entry.username === user?.username ? 'bg-purple-900 bg-opacity-30' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <span className={`font-bold ${
                    entry.rank === 1 ? 'text-yellow-400 text-2xl' :
                    entry.rank === 2 ? 'text-gray-300 text-xl' :
                    entry.rank === 3 ? 'text-orange-400 text-lg' :
                    'text-gray-400'
                  }`}>
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${
                    entry.username === user?.username ? 'text-purple-400' : 'text-white'
                  }`}>
                    {entry.username}
                    {entry.username === user?.username && (
                      <span className="ml-2 text-xs bg-purple-600 px-2 py-1 rounded">You</span>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-green-400 font-bold text-lg">
                    {entry.score?.toLocaleString() || 0}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;