'use client';

import React, { useState, useEffect } from 'react';
import { useRole } from '../../lib/roleContext';
import { mockDataService } from '../../lib/mockDataService';
import { Book, Merchant, Organization, BookOffer, Offer } from '../../lib/types';

export default function AdminConsole() {
  const { currentRole, isAuthenticated, availableRoles, switchRole } = useRole();
  const [activeTab, setActiveTab] = useState<'books' | 'merchants' | 'organizations' | 'analytics' | 'blasts' | 'invites'>('books');
  const [books, setBooks] = useState<Book[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [bookOffers, setBookOffers] = useState<BookOffer[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentRole === 'admin') {
      fetchData();
    }
  }, [currentRole]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBooks(mockDataService.getBooks());
      setMerchants(mockDataService.getMerchants());
      setOrganizations(mockDataService.getOrganizations());
      setBookOffers(mockDataService.getBookOffers());
      setOffers(mockDataService.getOffers());
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not admin
  if (!isAuthenticated || currentRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/30">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
            <p className="text-gray-600 mb-6">You need admin privileges to access this console. Please switch to the admin role to continue.</p>
            {availableRoles.includes('admin') ? (
              <button
                onClick={() => switchRole('admin')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
              >
                Switch to Admin Role
              </button>
            ) : (
              <p className="text-red-600 text-sm mb-4">You don't have admin privileges.</p>
            )}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Available roles:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {availableRoles.map(role => (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <a href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                ← Back to Marketplace
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Console</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:inline text-sm text-gray-500">Admin Dashboard</span>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="hidden sm:inline text-sm text-gray-500">Role:</span>
                <select
                  value={currentRole || ''}
                  onChange={(e) => switchRole(e.target.value as any)}
                  className="text-xs sm:text-sm border border-gray-300 rounded px-1 sm:px-2 py-1 bg-white"
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('books')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'books'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Books
            </button>
            <button
              onClick={() => setActiveTab('merchants')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'merchants'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Merchants
            </button>
            <button
              onClick={() => setActiveTab('organizations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'organizations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Organizations
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('blasts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'blasts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Free Coupons
            </button>
            <button
              onClick={() => setActiveTab('invites')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'invites'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Seller Invites
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'books' && <BooksTab books={books} bookOffers={bookOffers} />}
        {activeTab === 'merchants' && <MerchantsTab merchants={merchants} offers={offers} />}
        {activeTab === 'organizations' && <OrganizationsTab organizations={organizations} />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'blasts' && <BlastsTab />}
        {activeTab === 'invites' && <InvitesTab />}
      </div>
    </div>
  );
}

// Books Tab Component
function BooksTab({ books, bookOffers }: { books: Book[], bookOffers: BookOffer[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Coupon Books</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create Book
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{book.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                book.status === 'published' ? 'bg-green-100 text-green-800' :
                book.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {book.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{book.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">{book.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price:</span>
                <span className="font-medium">${book.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Discoverable:</span>
                <span className="font-medium">{book.discoverable ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                View Offers
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Merchants Tab Component
function MerchantsTab({ merchants, offers }: { merchants: Merchant[], offers: Offer[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Merchants</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Invite Merchant
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {merchants.map((merchant) => (
          <div key={merchant.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{merchant.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{merchant.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Locations:</span>
                <span className="font-medium">{merchant.locations.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Offers:</span>
                <span className="font-medium">{offers.filter(o => o.merchantId === merchant.id).length}</span>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                View Details
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Organizations Tab Component
function OrganizationsTab({ organizations }: { organizations: Organization[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Organizations</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add Organization
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <div key={org.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{org.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{org.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{org.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ZIP Codes:</span>
                <span className="font-medium">{org.zipCodes?.length || 0}</span>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                View Books
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Books Sold</h3>
          <p className="text-3xl font-bold text-gray-900">1,247</p>
          <p className="text-sm text-green-600">+12% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">$31,175</p>
          <p className="text-sm text-green-600">+8% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Merchants</h3>
          <p className="text-3xl font-bold text-gray-900">89</p>
          <p className="text-sm text-blue-600">+3 this week</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Coupons Redeemed</h3>
          <p className="text-3xl font-bold text-gray-900">5,432</p>
          <p className="text-sm text-green-600">+15% from last month</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Sales Report
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Export Redemption Report
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Export Merchant Report
          </button>
        </div>
      </div>
    </div>
  );
}

// Blasts Tab Component
function BlastsTab() {
  const [zipCodes, setZipCodes] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('');

  const handleBlast = () => {
    // Mock implementation
    alert('Free coupons sent successfully!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Send Free Coupons</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target ZIP Codes (comma-separated)
            </label>
            <input
              type="text"
              value={zipCodes}
              onChange={(e) => setZipCodes(e.target.value)}
              placeholder="90210, 90211, 90212"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Book Buyers
            </label>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a book</option>
              <option value="book-1">Lincoln High School Coupon Book 2024</option>
              <option value="book-2">Downtown Deals 2024</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Segment
            </label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a segment</option>
              <option value="segment-1">Beverly Hills Residents</option>
            </select>
          </div>
          
          <button
            onClick={handleBlast}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send Free Coupons
          </button>
        </div>
      </div>
    </div>
  );
}

// Invites Tab Component
function InvitesTab() {
  const [invites, setInvites] = useState<any[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [generatedInvite, setGeneratedInvite] = useState<any>(null);

  // Mock data for testing
  useEffect(() => {
    setInvites([
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        inviteToken: 'ABC123XYZ',
        status: 'pending',
        sentAt: '2024-01-15',
        acceptedAt: null
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        inviteToken: 'DEF456UVW',
        status: 'accepted',
        sentAt: '2024-01-10',
        acceptedAt: '2024-01-12'
      }
    ]);
  }, []);

  const generateInviteToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateInvite = () => {
    if (!inviteForm.firstName || !inviteForm.lastName || !inviteForm.email) {
      alert('Please fill in all fields');
      return;
    }

    const inviteToken = generateInviteToken();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}/invite/${inviteToken}`;

    const newInvite = {
      id: Date.now().toString(),
      firstName: inviteForm.firstName,
      lastName: inviteForm.lastName,
      email: inviteForm.email,
      inviteToken: inviteToken,
      status: 'pending',
      sentAt: new Date().toISOString().split('T')[0],
      acceptedAt: null
    };

    setInvites([newInvite, ...invites]);
    setGeneratedInvite({
      ...newInvite,
      inviteLink: inviteLink
    });
    setShowInviteForm(false);
    setInviteForm({ firstName: '', lastName: '', email: '' });

    // Log to console for testing
    console.log('Invite created:', newInvite);
    console.log('Invite link:', inviteLink);
  };

  const copyEmailTemplate = () => {
    if (!generatedInvite) return;

    const emailTemplate = `Subject: Welcome to YourCity Deals!

Hi ${generatedInvite.firstName},

You've been invited to join YourCity Deals as a seller!

Join our platform and start earning by sharing great deals with your community.

Click here to set up your account:
${generatedInvite.inviteLink}

This invite expires in 7 days.

Best regards,
YourCity Deals Team`;

    navigator.clipboard.writeText(emailTemplate).then(() => {
      alert('Email template copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = emailTemplate;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Email template copied to clipboard!');
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Seller Invites</h2>
        <button 
          onClick={() => setShowInviteForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Invite Seller
        </button>
      </div>

      {/* Invite Form Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite New Seller</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={inviteForm.firstName}
                  onChange={(e) => setInviteForm({...inviteForm, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter first name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={inviteForm.lastName}
                  onChange={(e) => setInviteForm({...inviteForm, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter last name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateInvite}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Generate Invite
              </button>
              <button
                onClick={() => setShowInviteForm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Invite Display */}
      {generatedInvite && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Invite Generated Successfully!</h3>
          <div className="space-y-2 text-sm">
            <div><strong>Name:</strong> {generatedInvite.firstName} {generatedInvite.lastName}</div>
            <div><strong>Email:</strong> {generatedInvite.email}</div>
            <div><strong>Invite Link:</strong> {generatedInvite.inviteLink}</div>
            <div><strong>Status:</strong> <span className="text-yellow-600">Pending</span></div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={copyEmailTemplate}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Copy Email Template
            </button>
            <button
              onClick={() => setGeneratedInvite(null)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Invites List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Invite History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invite Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invites.map((invite) => (
                <tr key={invite.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invite.firstName} {invite.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invite.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {invite.inviteToken}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invite.status === 'accepted' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invite.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invite.sentAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
