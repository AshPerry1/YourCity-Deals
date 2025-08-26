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
      icon: 'facebook',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank')
    },
    {
      name: 'Twitter',
      icon: 'twitter',
      action: () => window.open(`https://twitter.com/intent/tweet?text=Check out these amazing deals!&url=${encodeURIComponent(referralLink)}`, '_blank')
    },
    {
      name: 'WhatsApp',
      icon: 'whatsapp',
      action: () => window.open(`https://wa.me/?text=Check out these amazing deals! ${encodeURIComponent(referralLink)}`, '_blank')
    },
    {
      name: 'Email',
      icon: 'email',
      action: () => window.open(`mailto:?subject=Amazing Deals Available&body=Check out these amazing deals! ${referralLink}`, '_blank')
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Referral Link</h3>
      
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
                  <span className="text-lg">
                    {option.icon === 'facebook' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )}
                    {option.icon === 'twitter' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.665 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    )}
                    {option.icon === 'whatsapp' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    )}
                    {option.icon === 'email' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </span>
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
                  <h4 className="text-sm font-medium text-yellow-900 mb-2">Pro Tips</h4>
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
