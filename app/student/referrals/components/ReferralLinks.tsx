'use client';

import { useState } from 'react';

export default function ReferralLinks() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('link');

  const referralCode = 'STU-AB12CD';
  const referralLink = `https://yourcitydeals.com/ref/${referralCode}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOptions = [
    {
      name: 'Facebook',
      icon: '📘',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank')
    },
    {
      name: 'Twitter',
      icon: '🐦',
      action: () => window.open(`https://twitter.com/intent/tweet?text=Check out these amazing deals!&url=${encodeURIComponent(referralLink)}`, '_blank')
    },
    {
      name: 'WhatsApp',
      icon: '📱',
      action: () => window.open(`https://wa.me/?text=Check out these amazing deals! ${encodeURIComponent(referralLink)}`, '_blank')
    },
    {
      name: 'Email',
      icon: '📧',
      action: () => window.open(`mailto:?subject=Amazing Deals Available&body=Check out these amazing deals! ${referralLink}`, '_blank')
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Referral Links</h3>
      
      {/* Referral Code Display */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 mb-6">
        <div className="text-center">
          <p className="text-sm text-blue-700 mb-2">Your Unique Code</p>
          <p className="text-2xl font-bold text-blue-900 font-mono">{referralCode}</p>
          <p className="text-xs text-blue-600 mt-1">Use this code to track your sales</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4">
        <button
          onClick={() => setActiveTab('link')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'link'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Link
        </button>
        <button
          onClick={() => setActiveTab('qr')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'qr'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          QR Code
        </button>
      </div>

      {/* Link Tab */}
      {activeTab === 'link' && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Your Referral Link</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 text-sm bg-white border border-gray-300 rounded px-3 py-2 font-mono"
              />
              <button
                onClick={() => copyToClipboard(referralLink)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Share Your Link</p>
            <div className="grid grid-cols-2 gap-2">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Tab */}
      {activeTab === 'qr' && (
        <div className="text-center">
          <div className="bg-gray-50 rounded-lg p-6 mb-4">
            <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-gray-300">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-xs">QR Code</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Scan to visit</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(referralLink)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {copied ? 'Link Copied!' : 'Copy Link'}
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">💡 Pro Tips</h4>
        <ul className="text-xs text-yellow-800 space-y-1">
          <li>• Share on social media for maximum reach</li>
          <li>• Send to family and friends via text/email</li>
          <li>• Post in community groups and forums</li>
          <li>• Use the QR code for in-person sharing</li>
        </ul>
      </div>
    </div>
  );
}
