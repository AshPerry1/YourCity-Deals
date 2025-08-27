'use client';

import { useState, useEffect } from 'react';

interface PWAStatus {
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  hasServiceWorker: boolean;
  hasManifest: boolean;
  canInstall: boolean;
}

export default function PWAStatusChecker() {
  const [status, setStatus] = useState<PWAStatus>({
    isInstalled: false,
    isStandalone: false,
    isIOS: false,
    isAndroid: false,
    hasServiceWorker: false,
    hasManifest: false,
    canInstall: false,
  });

  useEffect(() => {
    const checkPWAStatus = async () => {
      const newStatus: PWAStatus = {
        isInstalled: false,
        isStandalone: false,
        isIOS: false,
        isAndroid: false,
        hasServiceWorker: false,
        hasManifest: false,
        canInstall: false,
      };

      // Check if installed/standalone
      newStatus.isStandalone = 
        window.navigator.standalone || 
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
      
      newStatus.isInstalled = newStatus.isStandalone;

      // Check platform
      newStatus.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      newStatus.isAndroid = /Android/.test(navigator.userAgent);

      // Check service worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        newStatus.hasServiceWorker = registrations.length > 0;
      }

      // Check manifest
      try {
        const manifestResponse = await fetch('/manifest.json');
        newStatus.hasManifest = manifestResponse.ok;
      } catch (error) {
        newStatus.hasManifest = false;
      }

      // Check if can install (Chrome/Android)
      newStatus.canInstall = 'BeforeInstallPromptEvent' in window;

      setStatus(newStatus);
    };

    checkPWAStatus();
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">PWA Status</h3>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Installed:</span>
          <span className={status.isInstalled ? 'text-green-600' : 'text-red-600'}>
            {status.isInstalled ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Standalone:</span>
          <span className={status.isStandalone ? 'text-green-600' : 'text-red-600'}>
            {status.isStandalone ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Platform:</span>
          <span className="text-blue-600">
            {status.isIOS ? 'iOS' : status.isAndroid ? 'Android' : 'Desktop'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Service Worker:</span>
          <span className={status.hasServiceWorker ? 'text-green-600' : 'text-red-600'}>
            {status.hasServiceWorker ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Manifest:</span>
          <span className={status.hasManifest ? 'text-green-600' : 'text-red-600'}>
            {status.hasManifest ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Can Install:</span>
          <span className={status.canInstall ? 'text-green-600' : 'text-red-600'}>
            {status.canInstall ? '✅' : '❌'}
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <button
          onClick={() => window.location.reload()}
          className="w-full px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
        >
          Refresh Status
        </button>
      </div>
    </div>
  );
}
