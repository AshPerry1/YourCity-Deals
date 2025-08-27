'use client';

import { useState } from 'react';
import WalletButtons from '../components/WalletButtons';
import { useWalletDetection } from '../hooks/useWalletDetection';

export default function WalletDemoPage() {
  const walletSupport = useWalletDetection();
  const [activeTab, setActiveTab] = useState('demo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              YourCity Deals Wallet Integration
            </h1>
            <p className="text-xl text-gray-600">
              Add your deals to Apple Wallet and Google Wallet
            </p>
          </div>

          {/* Device Detection Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Device Detection</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">
                  {walletSupport.apple ? '✅' : '❌'}
                </div>
                <div className="font-medium">Apple Wallet</div>
                <div className="text-sm text-gray-600">iOS Safari</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">
                  {walletSupport.google ? '✅' : '❌'}
                </div>
                <div className="font-medium">Google Wallet</div>
                <div className="text-sm text-gray-600">Android Chrome</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-medium">User Agent</div>
                <div className="text-xs text-gray-600 truncate">
                  {walletSupport.userAgent}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('demo')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'demo'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Demo
                </button>
                <button
                  onClick={() => setActiveTab('integration')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'integration'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Integration Guide
                </button>
                <button
                  onClick={() => setActiveTab('api')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'api'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  API Reference
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'demo' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Wallet Integration Demo</h3>
                  <p className="text-gray-600 mb-6">
                    This demo shows how the wallet buttons appear on different devices.
                    The buttons will only show for supported platforms.
                  </p>
                  
                  <div className="space-y-6">
                    {/* Standard Wallet Buttons */}
                    <div>
                      <h4 className="font-medium mb-3">Standard Wallet Buttons</h4>
                      <WalletButtons className="justify-center" />
                    </div>

                    {/* Show Both Buttons */}
                    <div>
                      <h4 className="font-medium mb-3">Show Both Platforms</h4>
                      <WalletButtons showBoth={true} className="justify-center" />
                    </div>

                    {/* Custom Styled Buttons */}
                    <div>
                      <h4 className="font-medium mb-3">Custom Styled Buttons</h4>
                      <WalletButtons className="justify-center [&>button]:bg-gradient-to-r [&>button]:from-purple-600 [&>button]:to-blue-600 [&>button]:border-0 [&>button]:shadow-lg" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'integration' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Integration Guide</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">1. Install Dependencies</h4>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`npm install passkit-generator googleapis jsonwebtoken @types/jsonwebtoken`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">2. Import Component</h4>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import WalletButtons from './components/WalletButtons';`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">3. Add to Your Page</h4>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// Show wallet buttons on books page
<WalletButtons className="mt-6" />

// Show both buttons in settings
<WalletButtons showBoth={true} />

// Custom styling
<WalletButtons className="justify-center [&>button]:bg-purple-600" />`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">4. Handle Redemptions</h4>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// When redeeming from wallet
const response = await fetch('/api/wallet/redeem', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    couponId: coupon.id,
    platform: 'apple', // or 'google'
    redemptionCode: coupon.redemption_code
  })
});`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">API Reference</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Apple Wallet</h4>
                      <div className="space-y-2">
                        <div>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">GET /api/wallet/apple/pass</code>
                          <p className="text-sm text-gray-600">Generate and download Apple Wallet pass</p>
                        </div>
                        <div>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">POST /api/wallet/apple/webservice/register</code>
                          <p className="text-sm text-gray-600">Register device for push notifications</p>
                        </div>
                        <div>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">GET /api/wallet/apple/webservice/updates</code>
                          <p className="text-sm text-gray-600">Get list of passes needing updates</p>
                        </div>
                        <div>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">GET /api/wallet/apple/webservice/pass/[serial]</code>
                          <p className="text-sm text-gray-600">Get updated pass data</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Google Wallet</h4>
                      <div className="space-y-2">
                        <div>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">POST /api/wallet/google/save</code>
                          <p className="text-sm text-gray-600">Create Save-to-Wallet JWT URL</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Unified Redemption</h4>
                      <div className="space-y-2">
                        <div>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">POST /api/wallet/redeem</code>
                          <p className="text-sm text-gray-600">Redeem coupon and sync with wallets</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  One dynamic wallet card per user
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Automatic updates when deals change
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Location-based lock screen prompts
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Synchronized redemption between wallet and PWA
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Secure certificate storage
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">ℹ</span>
                  Apple Developer Account ($99/year)
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">ℹ</span>
                  Google Cloud Project
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">ℹ</span>
                  Vercel deployment
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">ℹ</span>
                  Supabase database
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">ℹ</span>
                  SSL certificate
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
