'use client';

import Link from 'next/link';

export default function MarketingLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                YourCity Deals
              </h1>
            </div>
            <nav className="flex space-x-6">
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Admin
              </Link>
              <Link href="/student" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Seller
              </Link>
              <Link href="/org" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Organization
              </Link>
              <Link href="/merchant" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Merchant
              </Link>
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                Buy Coupons
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <span className="text-sm font-medium text-blue-200">Trusted by 50+ Organizations Nationwide</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
            YourCity Deals
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            The enterprise-grade digital coupon platform revolutionizing community fundraising. 
            Where technology meets local impact for schools, neighborhoods, events, and cities.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/"
              className="group bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl px-8 py-4 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-white font-semibold text-lg"
            >
              <span className="mr-3">
                <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                </svg>
              </span>
              Browse the Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Trusted by Community Leaders</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Join hundreds of organizations already transforming their fundraising with enterprise-grade technology</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="text-5xl font-bold text-blue-600 mb-3">2,500+</div>
                <div className="text-slate-600 font-medium">Active Sellers</div>
                <div className="text-sm text-slate-500 mt-1">Community Ambassadors</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="text-5xl font-bold text-indigo-600 mb-3">200+</div>
                <div className="text-slate-600 font-medium">Local Businesses</div>
                <div className="text-sm text-slate-500 mt-1">Community Partners</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="text-5xl font-bold text-emerald-600 mb-3">$150K+</div>
                <div className="text-slate-600 font-medium">Funds Raised</div>
                <div className="text-sm text-slate-500 mt-1">Impact Generated</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="text-5xl font-bold text-orange-600">50</div>
                <div className="text-slate-600 font-medium">Organizations</div>
                <div className="text-sm text-slate-500 mt-1">Growing Network</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Enterprise-Grade Features</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Built for scale, designed for impact. Every feature engineered to maximize fundraising success.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-3xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Digital Coupon Books</h3>
                <p className="text-slate-600 leading-relaxed">Enterprise-grade digital coupon management with real-time analytics, instant redemption tracking, and seamless customer experience across all devices.</p>
              </div>
            </div>
            <div className="group bg-gradient-to-br from-slate-50 to-emerald-50 p-8 rounded-3xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Community Rewards System</h3>
                <p className="text-slate-600 leading-relaxed">Comprehensive gamification platform where community members earn points, unlock achievements, and build valuable business skills while supporting their organizations.</p>
              </div>
            </div>
            <div className="group bg-gradient-to-br from-slate-50 to-purple-50 p-8 rounded-3xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h3a2 2 0 012 2v14a2 2 0 01-2 2h-3a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Advanced Analytics</h3>
                <p className="text-slate-600 leading-relaxed">Comprehensive business intelligence dashboard with predictive analytics, performance insights, and data-driven optimization strategies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Organizations Sign Up</h3>
              <p className="text-gray-600">Register your organization and set fundraising goals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sellers Join</h3>
              <p className="text-gray-600">Community members create accounts and start earning points</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sell Coupons</h3>
              <p className="text-gray-600">Sellers share digital coupons with friends and family</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn Rewards</h3>
              <p className="text-gray-600">Organizations receive funding, sellers earn rewards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose YourCity Deals?</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">For Organizations</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-600">Increased fundraising efficiency and reach</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-600">Real-time tracking and reporting</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-600">Reduced administrative overhead</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-600">Better community engagement and motivation</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-600">Professional digital presence</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">For Sellers</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-600">Earn points and recognition for your community</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-600">Build valuable business and sales skills</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-600">Easy-to-use digital tools</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-600">Track progress and achievements</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-600">Professional referral system</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Install as App</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">YourCity Deals works as a Progressive Web App! Install it on your phone or desktop for quick access and offline functionality. Follow the step-by-step instructions below.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">iOS (iPhone/iPad)</h3>
              </div>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Open Safari browser (not Chrome)</li>
                <li>2. Tap the Share button (square with arrow up) at bottom</li>
                <li>3. Scroll down and tap 'Add to Home Screen'</li>
                <li>4. Tap 'Add' to confirm</li>
              </ol>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Android</h3>
              </div>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Open Chrome browser</li>
                <li>2. Tap the three dots menu (:) at top right</li>
                <li>3. Tap 'Add to Home screen'</li>
                <li>4. Tap 'Add' to confirm</li>
              </ol>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Desktop (Chrome/Edge)</h3>
              </div>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Look for the install icon (+) in address bar</li>
                <li>2. Click the install icon when it appears</li>
                <li>3. Click 'Install' in the popup</li>
                <li>4. App will install and appear on desktop</li>
              </ol>
            </div>
          </div>
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-blue-800 text-sm"><strong>Pro Tip:</strong> After installation, the app will work just like a native app with its own icon, full-screen experience, and offline functionality!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Join the digital fundraising revolution and see how YourCity Deals can transform your organization's fundraising efforts.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/admin-login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Start Admin Console
            </Link>
            <Link href="/" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold border border-blue-200 transition-colors">
              Buy Coupons Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">YourCity Deals</h3>
          <p className="text-gray-400 mb-6">Digital coupon book platform for communities and organizations</p>
          <div className="flex justify-center space-x-6">
            <Link href="/admin" className="text-gray-400 hover:text-white">Admin Portal</Link>
            <Link href="/student" className="text-gray-400 hover:text-white">Seller Portal</Link>
            <Link href="/org" className="text-gray-400 hover:text-white">Organization Hub</Link>
            <Link href="/merchant" className="text-gray-400 hover:text-white">Merchant Console</Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400">© 2025 YourCity Deals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
