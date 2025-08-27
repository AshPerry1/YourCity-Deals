'use client';

import { useState } from 'react';
import { useWalletDetection, useWalletActions } from '../hooks/useWalletDetection';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface WalletButtonsProps {
  className?: string;
  showBoth?: boolean;
}

export default function WalletButtons({ className = '', showBoth = false }: WalletButtonsProps) {
  const walletSupport = useWalletDetection();
  const { addToAppleWallet, addToGoogleWallet, isLoading, error, clearError } = useWalletActions();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleWalletAction = async (platform: 'apple' | 'google') => {
    try {
      // Get current session
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        // Redirect to login if not authenticated
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });
        return;
      }

      setIsAuthenticated(true);
      
      if (platform === 'apple') {
        await addToAppleWallet(session.access_token);
      } else {
        await addToGoogleWallet(session.access_token);
      }
    } catch (err) {
      console.error('Wallet action error:', err);
    }
  };

  // Don't show anything if no wallet support
  if (!walletSupport.apple && !walletSupport.google && !showBoth) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-3">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {walletSupport.apple && (
        <button
          onClick={() => handleWalletAction('apple')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          )}
          Add to Apple Wallet
        </button>
      )}

      {walletSupport.google && (
        <button
          onClick={() => handleWalletAction('google')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          Add to Google Wallet
        </button>
      )}

      {showBoth && !walletSupport.apple && !walletSupport.google && (
        <div className="text-center text-gray-600 py-4">
          <p className="mb-2">Wallet not supported on this device</p>
          <p className="text-sm">Use the PWA for the best experience</p>
        </div>
      )}

      {!isAuthenticated && (walletSupport.apple || walletSupport.google) && (
        <p className="text-sm text-gray-600 text-center mt-2">
          Sign in to add your deals to your wallet
        </p>
      )}
    </div>
  );
}
