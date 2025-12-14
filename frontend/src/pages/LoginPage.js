import React, { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginPage = ({ setCurrentPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [useMock, setUseMock] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = useMock
        ? await api.mockLogin(username)
        : await api.login(username, password);
      login(userData);
      setCurrentPage('dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-purple-500">
        <div className="text-center mb-8">
          <Gamepad2 className="w-16 h-16 mx-auto text-purple-400 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-gray-400">Login to continue your gaming journey</p>
        </div>

        <div onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-300">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useMock}
                  onChange={(e) => setUseMock(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-purple-600 bg-gray-800 border-gray-700 rounded"
                />
                <span>Use mock login (no backend)</span>
              </label>
              <span className="text-xs text-gray-400">Mock is handy for testing</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition"
                placeholder="Enter your username"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition"
                placeholder={useMock ? 'Password not required for mock' : 'Enter your password'}
                required={!useMock}
                disabled={loading || useMock}
              />
            </div>

            {error && (
              <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              type="button"
              disabled={
                loading || !username || (!useMock && !password)
              }
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentPage('register')}
            className="text-purple-400 hover:text-purple-300 transition text-sm"
            disabled={loading}
          >
            Don't have an account? <span className="font-semibold">Register here</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;