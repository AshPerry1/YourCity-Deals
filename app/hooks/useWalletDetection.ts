import { useState, useEffect } from 'react';

export interface WalletSupport {
  apple: boolean;
  google: boolean;
  userAgent: string;
}

export function useWalletDetection(): WalletSupport {
  const [walletSupport, setWalletSupport] = useState<WalletSupport>({
    apple: false,
    google: false,
    userAgent: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent;
      
      // Check for Apple Wallet support (iOS Safari)
      const isAppleSupported = /iPhone|iPad|iPod/.test(userAgent) && 
                               /Safari/.test(userAgent) && 
                               !/Chrome/.test(userAgent);

      // Check for Google Wallet support (Android Chrome)
      const isGoogleSupported = /Android/.test(userAgent) && 
                               /Chrome/.test(userAgent);

      setWalletSupport({
        apple: isAppleSupported,
        google: isGoogleSupported,
        userAgent
      });
    }
  }, []);

  return walletSupport;
}

export function useWalletActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToAppleWallet = async (token: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/wallet/apple/pass', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate Apple Wallet pass');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'YourCityDeals.pkpass';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const addToGoogleWallet = async (token: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/wallet/google/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate Google Wallet pass');
      }

      const data = await response.json();
      
      // Open Google Wallet save URL
      window.open(data.url, '_blank');
      
      return { success: true, url: data.url };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addToAppleWallet,
    addToGoogleWallet,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}
