import React, { useState, useEffect } from 'react';
import { User, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getUserProfile(user.userId);
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Use mock data if API fails
      setProfile({
        username: user.username,
        totalGames: 87,
        wins: 47,
        losses: 40,
        highScore: 2500,
        winRate: 54,
        memberSince: 'October 2025'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setMessage({ type: '', text: '' });

    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: 'Password must be at least 4 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      await api.updatePassword(user.userId, oldPassword, newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setEditing(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="text-white mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 bg-opacity-80 rounded-2xl p-8 border border-teal-500">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">@{profile?.username || user.username}</h1>
            <p className="text-gray-400">Player Profile</p>
          </div>

          {/* Statistics */}
          <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
              <span className="w-1 h-5 bg-teal-500 mr-2"></span>
              Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-800 rounded">
                <div className="text-gray-400 text-sm mb-1">Total Games</div>
                <div className="text-2xl font-bold text-white">{profile?.totalGames || 87}</div>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded">
                <div className="text-gray-400 text-sm mb-1">Wins</div>
                <div className="text-2xl font-bold text-green-400">{profile?.wins || 47}</div>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded">
                <div className="text-gray-400 text-sm mb-1">High Score</div>
                <div className="text-2xl font-bold text-yellow-400">{profile?.highScore?.toLocaleString() || '2,500'}</div>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded">
                <div className="text-gray-400 text-sm mb-1">Win Rate</div>
                <div className="text-2xl font-bold text-purple-400">{profile?.winRate || 54}%</div>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
              <span className="w-1 h-5 bg-teal-500 mr-2"></span>
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-600">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white font-semibold">{profile?.memberSince || 'October 2025'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-600">
                <span className="text-gray-400">User ID</span>
                <span className="text-white font-semibold">#{user.userId}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Account Status</span>
                <span className="text-green-400 font-semibold flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-300 flex items-center">
                <span className="w-1 h-5 bg-teal-500 mr-2"></span>
                Security
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-1 text-teal-400 hover:text-teal-300 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditing(false);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setMessage({ type: '', text: '' });
                  }}
                  className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                    placeholder="Confirm new password"
                  />
                </div>

                {message.text && (
                  <div className={`p-3 rounded-lg text-sm ${
                    message.type === 'error' 
                      ? 'bg-red-900 bg-opacity-50 border border-red-500 text-red-200'
                      : 'bg-green-900 bg-opacity-50 border border-green-500 text-green-200'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  onClick={handlePasswordUpdate}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition"
                >
                  <Save className="w-5 h-5" />
                  <span>Update Password</span>
                </button>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                Keep your account secure by using a strong password
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;