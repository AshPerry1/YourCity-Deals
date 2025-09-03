'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AboutUs() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                YourCity Deals
              </Link>
            </div>
            <nav className="hidden md:flex space-x-4 lg:space-x-6">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors text-sm">
                Marketplace
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">
                Admin
              </Link>
              <Link href="/student" className="text-gray-700 hover:text-green-600 font-medium transition-colors text-sm">
                Seller
              </Link>
              <Link href="/org" className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm">
                Org Hub
              </Link>
              <Link href="/merchant" className="text-gray-700 hover:text-purple-600 font-medium transition-colors text-sm">
                Merchant
              </Link>
            </nav>
            <button 
              className="md:hidden text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="px-4 py-4 space-y-3">
              <Link 
                href="/" 
                className="block text-gray-700 hover:text-indigo-600 font-medium transition-colors text-sm py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                href="/admin" 
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
              <Link 
                href="/student" 
                className="block text-gray-700 hover:text-green-600 font-medium transition-colors text-sm py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Seller
              </Link>
              <Link 
                href="/org" 
                className="block text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Org Hub
              </Link>
              <Link 
                href="/merchant" 
                className="block text-gray-700 hover:text-purple-600 font-medium transition-colors text-sm py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Merchant
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Our Story
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-4">
              From a simple idea to revolutionize fundraising, YourCity Deals was born from a passion to connect communities and empower organizations. Currently in development, launching Summer 2026.
            </p>
          </div>
        </div>
        
        {/* Decorative Elements - Tech Forward Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-15">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="tech-grid" width="12" height="12" patternUnits="userSpaceOnUse">
                <path d="M12 0L0 0 0 12" fill="none" stroke="currentColor" strokeWidth="0.3"/>
                <circle cx="6" cy="6" r="0.5" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#tech-grid)"/>
          </svg>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet the Founder</h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Hi, I'm Ash Perry, the founder of YourCity Deals. My journey began with a simple observation: 
                  traditional fundraising methods were becoming increasingly outdated and inefficient.
                </p>
                <p>
                  Having worked with various organizations and seen the challenges they face in raising funds, 
                  I recognized the need for a modern, digital solution that could bridge the gap between 
                  communities and local businesses.
                </p>
                <p>
                  What started as a passion project in June 2025 has grown into a comprehensive platform that's currently in development. 
                  We're building the MVP with plans to launch in Summer 2026, helping organizations transform their fundraising efforts 
                  and build stronger connections with their communities.
                </p>
              </div>
              
              <div className="mt-8 flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img 
                    src="/AshleyPerry90525.jpg" 
                    alt="Ash Perry - Founder of YourCity Deals" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-white text-xl font-bold">AP</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Ash Perry</h3>
                  <p className="text-gray-600">Founder & CEO, YourCity Deals</p>
                  <a href="mailto:adperry18@gmail.com" className="text-blue-600 hover:text-blue-700 text-sm">
                    adperry18@gmail.com
                  </a>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <p>Empower organizations with modern digital fundraising tools</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <p>Connect communities with local businesses in meaningful ways</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <p>Create sustainable revenue streams for organizations</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <p>Build stronger, more engaged communities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From concept to reality, here's how YourCity Deals evolved into the platform it is today.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>
            
            <div className="space-y-16">
              {/* 2025 - Concept */}
              <div className="relative">
                <div className="flex items-center">
                  <div className="w-1/2 pr-8">
                    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">The Beginning</h3>
                      <p className="text-gray-600">Identified the need for modern digital fundraising solutions</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10 relative"></div>
                  <div className="w-1/2 pl-8">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-2">June 2025</h4>
                      <p className="text-gray-600">Concept development and market research</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 2025-2026 - Development */}
              <div className="relative">
                <div className="flex items-center">
                  <div className="w-1/2 pr-8">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-2">June 2025 - Present</h4>
                      <p className="text-gray-600">MVP development and platform building</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg z-10 relative"></div>
                  <div className="w-1/2 pl-8">
                    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Building the Platform</h3>
                      <p className="text-gray-600">Developing the core technology and user experience</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 2026 - Launch */}
              <div className="relative">
                <div className="flex items-center">
                  <div className="w-1/2 pr-8">
                    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Going Live</h3>
                      <p className="text-gray-600">Launch the platform and begin serving organizations</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg z-10 relative"></div>
                  <div className="w-1/2 pl-8">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Summer 2026</h4>
                      <p className="text-gray-600">Platform launch and community expansion</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at YourCity Deals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community First</h3>
              <p className="text-gray-600">We believe in the power of local communities and work to strengthen the bonds between organizations, businesses, and residents.</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">We continuously push the boundaries of what's possible in digital fundraising, always looking for new ways to serve our users better.</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600">We believe in open communication and clear processes, ensuring our users always know what's happening with their fundraising efforts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about YourCity Deals and how it works.
            </p>
          </div>
          
          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => setActiveFAQ(activeFAQ === 1 ? null : 1)}
              >
                <h3 className="text-lg font-semibold text-gray-900">What exactly is YourCity Deals?</h3>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeFAQ === 1 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeFAQ === 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    YourCity Deals is a digital coupon book platform that connects local organizations (schools, nonprofits, community groups) with local businesses. Organizations create digital coupon books, community members purchase them, and everyone benefits - organizations raise funds, businesses get customers, and community members save money.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 2 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => setActiveFAQ(activeFAQ === 2 ? null : 2)}
              >
                <h3 className="text-lg font-semibold text-gray-900">How does the fundraising process work?</h3>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeFAQ === 2 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeFAQ === 2 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    Organizations create digital coupon books with offers from local businesses. Community members purchase these books for a set price (typically $25-50). The organization keeps a portion of the proceeds for their fundraising goals, while the rest goes to platform costs and business partnerships. Each book contains multiple offers that can be redeemed at participating businesses.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 3 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => setActiveFAQ(activeFAQ === 3 ? null : 3)}
              >
                <h3 className="text-lg font-semibold text-gray-900">When will the platform be available?</h3>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeFAQ === 3 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeFAQ === 3 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    We're currently in development and plan to launch in Summer 2026. We're building the MVP (Minimum Viable Product) to ensure we deliver the best possible experience for organizations, businesses, and community members. You can stay updated by following our progress or reaching out to discuss early partnership opportunities.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 4 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => setActiveFAQ(activeFAQ === 4 ? null : 4)}
              >
                <h3 className="text-lg font-semibold text-gray-900">How do I redeem the coupons?</h3>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeFAQ === 4 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeFAQ === 4 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    Once you purchase a coupon book, you'll receive unique redemption codes for each offer. Simply present the code to the participating business when making your purchase. The business will verify the code through our platform, and you'll receive your discount or special offer immediately.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 5 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => setActiveFAQ(activeFAQ === 5 ? null : 5)}
              >
                <h3 className="text-lg font-semibold text-gray-900">What types of organizations can use YourCity Deals?</h3>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeFAQ === 5 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeFAQ === 5 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    Any organization that needs to raise funds can use our platform! This includes schools (PTAs, sports teams, clubs), nonprofits, community groups, churches, youth organizations, and more. We're designed to be flexible and scalable to meet the needs of organizations of all sizes.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 6 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => setActiveFAQ(activeFAQ === 6 ? null : 6)}
              >
                <h3 className="text-lg font-semibold text-gray-900">How do businesses benefit from participating?</h3>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeFAQ === 6 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeFAQ === 6 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    Businesses get exposure to new customers in their community, increased foot traffic, and the opportunity to build relationships with local organizations. They can set their own offers and terms, and our platform handles all the technical aspects of coupon verification and redemption.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 7 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => setActiveFAQ(activeFAQ === 7 ? null : 7)}
              >
                <h3 className="text-lg font-semibold text-gray-900">Is my payment information secure?</h3>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeFAQ === 7 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeFAQ === 7 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    Absolutely! We use industry-standard encryption and security measures to protect all payment information. We partner with trusted payment processors to ensure your financial data is always secure and protected.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 8 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => setActiveFAQ(activeFAQ === 8 ? null : 8)}
              >
                <h3 className="text-lg font-semibold text-gray-900">Can I get a refund if I'm not satisfied?</h3>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeFAQ === 8 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeFAQ === 8 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    We want you to be completely satisfied with your purchase. If you're not happy with your coupon book for any reason, we offer a 30-day money-back guarantee. Simply contact our support team, and we'll process your refund.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 9 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => setActiveFAQ(activeFAQ === 9 ? null : 9)}
              >
                <h3 className="text-lg font-semibold text-gray-900">How do I know the offers are legitimate?</h3>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeFAQ === 9 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeFAQ === 9 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    All businesses on our platform are verified and vetted. We work directly with business owners to ensure all offers are legitimate and accurately represent their services. Our platform also includes a rating and review system so you can see feedback from other community members.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 10 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => setActiveFAQ(activeFAQ === 10 ? null : 10)}
              >
                <h3 className="text-lg font-semibold text-gray-900">How can I get involved as a business or organization?</h3>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeFAQ === 10 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeFAQ === 10 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    We'd love to have you on board! Organizations can start by reaching out to discuss their fundraising needs and timeline. Businesses can contact us to learn about partnership opportunities and how to create compelling offers for the community. Just send us an email, and we'll guide you through the process!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're an organization looking to modernize your fundraising or a business wanting to support your community, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              href="mailto:adperry18@gmail.com?subject=YourCity%20Deals%20-%20Partnership%20Inquiry&body=Hi%20Ash%2C%0A%0AI%20visited%20your%20About%20Us%20page%20and%20would%20like%20to%20discuss%20a%20potential%20partnership%20or%20learn%20more%20about%20YourCity%20Deals.%0A%0AOrganization%20Name%3A%0AOrganization%20Type%3A%0AHow%20we%20heard%20about%20you%3A%0A%0AI%20look%20forward%20to%20hearing%20from%20you%21%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Get in Touch
            </a>
            <Link 
              href="/" 
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Explore Platform
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">YourCity Deals</h3>
              <p className="text-gray-400">Digital coupon book platform for communities and organizations.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Console</Link></li>
                <li><Link href="/student" className="hover:text-white transition-colors">Seller Portal</Link></li>
                <li><Link href="/org" className="hover:text-white transition-colors">Organization Hub</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/about-us" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><a href="mailto:adperry18@gmail.com" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                <a href="mailto:adperry18@gmail.com" className="hover:text-white transition-colors">adperry18@gmail.com</a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 YourCity Deals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
