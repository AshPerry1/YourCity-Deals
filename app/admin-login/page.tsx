'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple password check - you can make this more sophisticated
    if (password === 'admin2025') {
      // Set a session flag or cookie to indicate admin access
      sessionStorage.setItem('adminAccess', 'true');
      router.push('/admin');
    } else {
      setError('Invalid password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-white/70">Enter password to access the full site</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Accessing...' : 'Access Site'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-white/60 hover:text-white/80 text-sm transition-colors"
          >
            ← Back to Coming Soon
          </Link>
        </div>
      </div>
    </div>
  );
}
