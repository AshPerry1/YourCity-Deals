'use client';

import React, { useState, useEffect } from 'react';
import { useRole } from '../../lib/roleContext';
import { mockDataService } from '../../lib/mockDataService';
import { Book, Merchant, Organization, BookOffer, Offer } from '../../lib/types';

export default function AdminConsole() {
  const { currentRole, isAuthenticated, availableRoles, switchRole } = useRole();
  const [activeTab, setActiveTab] = useState<'books' | 'merchants' | 'organizations' | 'analytics' | 'blasts' | 'invites' | 'approvals'>('books');
  const [books, setBooks] = useState<Book[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [bookOffers, setBookOffers] = useState<BookOffer[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('Admin Console Debug:', {
      isAuthenticated,
      currentRole,
      availableRoles,
      loading
    });
  }, [isAuthenticated, currentRole, availableRoles, loading]);

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

  // Redirect if not admin - but allow access for testing
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please authenticate to access the admin console.</p>
          <a href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Back to Marketplace
          </a>
        </div>
      </div>
    );
  }

  // Show role switcher if not admin but authenticated
  if (currentRole !== 'admin') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need admin privileges to access this console.</p>
          {availableRoles.includes('admin') ? (
            <button
              onClick={() => {
                switchRole('admin');
                setTimeout(() => window.location.reload(), 100);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Switch to Admin Role
            </button>
          ) : (
            <p className="text-red-600 text-sm mb-4">You don't have admin privileges.</p>
          )}
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
            <button
              onClick={() => setActiveTab('approvals')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'approvals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Seller Approvals
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
        {activeTab === 'approvals' && <ApprovalsTab />}
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
    email: '',
    organizationHub: '',
    couponBook: ''
  });
  const [generatedInvite, setGeneratedInvite] = useState<any>(null);
  const [selectedInvite, setSelectedInvite] = useState<any>(null);
  const [showInviteDetails, setShowInviteDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrganization, setFilterOrganization] = useState('');
  const [filterBook, setFilterBook] = useState('');

  // Mock organizational hubs and coupon books for assignment
  const organizationalHubs = [
    { id: 'hub-1', name: 'Downtown Business Association', city: 'Downtown' },
    { id: 'hub-2', name: 'Westside Chamber of Commerce', city: 'Westside' },
    { id: 'hub-3', name: 'Eastside Entrepreneurs', city: 'Eastside' },
    { id: 'hub-4', name: 'Northside Business Network', city: 'Northside' },
    { id: 'hub-5', name: 'Southside Commerce Group', city: 'Southside' }
  ];

  const couponBooks = [
    { id: 'book-1', name: 'Downtown Deals 2024', price: 25, type: 'Local Business' },
    { id: 'book-2', name: 'Westside Savings', price: 20, type: 'Restaurant' },
    { id: 'book-3', name: 'Eastside Essentials', price: 30, type: 'Mixed' },
    { id: 'book-4', name: 'Northside Neighborhood', price: 15, type: 'Retail' },
    { id: 'book-5', name: 'Southside Specials', price: 22, type: 'Entertainment' }
  ];

  // Mock data for testing
  useEffect(() => {
    // Load invites from localStorage
    const savedInvites = localStorage.getItem('yourcitydeals_invites');
    if (savedInvites) {
      setInvites(JSON.parse(savedInvites));
    } else {
      // Default test data
      const defaultInvites = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@example.com',
          inviteToken: 'TEST123',
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
      ];
      setInvites(defaultInvites);
      localStorage.setItem('yourcitydeals_invites', JSON.stringify(defaultInvites));
    }
  }, []);

  // Refresh invites every 3 seconds to catch new completions
  useEffect(() => {
    const interval = setInterval(() => {
      const savedInvites = localStorage.getItem('yourcitydeals_invites');
      if (savedInvites) {
        const currentInvites = JSON.parse(savedInvites);
        setInvites(currentInvites);
        console.log('Refreshed invites from localStorage');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const generateInviteToken = () => {
    // For testing, always use TEST123
    return 'TEST123';
  };

  const handleCreateInvite = () => {
    if (!inviteForm.firstName || !inviteForm.lastName || !inviteForm.email) {
      alert('Please fill in all fields');
      return;
    }

    // Check for duplicate email
    const existingInvite = invites.find(invite => 
      invite.email.toLowerCase() === inviteForm.email.toLowerCase()
    );
    
    if (existingInvite) {
      alert(`A seller with the email "${inviteForm.email}" has already been invited. Please use a different email address or check the invite history.`);
      return;
    }

    // Check for duplicate name combination
    const existingName = invites.find(invite => 
      invite.firstName.toLowerCase() === inviteForm.firstName.toLowerCase() &&
      invite.lastName.toLowerCase() === inviteForm.lastName.toLowerCase()
    );
    
    if (existingName) {
      alert(`A seller with the name "${inviteForm.firstName} ${inviteForm.lastName}" has already been invited. Please verify this is a different person or use a different name.`);
      return;
    }

    const inviteToken = generateInviteToken();
    const baseUrl = 'https://yourcitydeals.com';
    const inviteLink = `${baseUrl}/invite/${inviteToken}`;

    const newInvite = {
      id: Date.now().toString(),
      firstName: inviteForm.firstName,
      lastName: inviteForm.lastName,
      email: inviteForm.email,
      inviteToken: inviteToken,
      status: 'pending',
      sentAt: new Date().toISOString().split('T')[0],
      acceptedAt: null,
      organizationHub: inviteForm.organizationHub,
      couponBook: inviteForm.couponBook
    };

    setInvites([newInvite, ...invites]);
    setGeneratedInvite({
      ...newInvite,
      inviteLink: inviteLink
    });
    setShowInviteForm(false);
    setInviteForm({ firstName: '', lastName: '', email: '', organizationHub: '', couponBook: '' });

    // Save to localStorage
    const updatedInvites = [newInvite, ...invites];
    localStorage.setItem('yourcitydeals_invites', JSON.stringify(updatedInvites));

    // Log to console for testing
    console.log('Invite created:', newInvite);
    console.log('Invite link:', inviteLink);
  };

  const sendEmail = () => {
    if (!generatedInvite) return;

    const emailTemplate = `Hi ${generatedInvite.firstName},

We're thrilled to invite you to join YourCity Deals as a seller! 🎉

You're about to become part of an amazing community of sellers who are helping their local businesses grow while supporting great causes. We're excited to see what you'll accomplish!

Ready to get started? Click here to set up your account:
${generatedInvite.inviteLink}

This invite expires in 7 days, so don't wait too long!

We're here to support you every step of the way. If you have any questions or need help getting started, just reply to this email - we'd love to hear from you!

Welcome to the team!

Best regards,
The YourCity Deals Team`;

    // Create mailto link with pre-filled content
    const mailtoLink = `mailto:${generatedInvite.email}?subject=${encodeURIComponent('Welcome to YourCity Deals!')}&body=${encodeURIComponent(emailTemplate)}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
  };

  const copyEmailTemplate = () => {
    if (!generatedInvite) return;

    const emailTemplate = `Hi ${generatedInvite.firstName},

We're thrilled to invite you to join YourCity Deals as a seller! 🎉

You're about to become part of an amazing community of sellers who are helping their local businesses grow while supporting great causes. We're excited to see what you'll accomplish!

Ready to get started? Click here to set up your account:
${generatedInvite.inviteLink}

This invite expires in 7 days, so don't wait too long!

We're here to support you every step of the way. If you have any questions or need help getting started, just reply to this email - we'd love to hear from you!

Welcome to the team!

Best regards,
The YourCity Deals Team`;

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

  const handleViewDetails = (invite: any) => {
    setSelectedInvite(invite);
    setShowInviteDetails(true);
  };

  const handleResendInvite = (invite: any) => {
    const baseUrl = 'https://yourcitydeals.com';
    const inviteLink = `${baseUrl}/invite/${invite.inviteToken}`;
    
    const emailTemplate = `Hi ${invite.firstName},

We're thrilled to invite you to join YourCity Deals as a seller! 🎉

You're about to become part of an amazing community of sellers who are helping their local businesses grow while supporting great causes. We're excited to see what you'll accomplish!

Ready to get started? Click here to set up your account:
${inviteLink}

This invite expires in 7 days, so don't wait too long!

We're here to support you every step of the way. If you have any questions or need help getting started, just reply to this email - we'd love to hear from you!

Welcome to the team!

Best regards,
The YourCity Deals Team`;

    const mailtoLink = `mailto:${invite.email}?subject=${encodeURIComponent('Welcome to YourCity Deals!')}&body=${encodeURIComponent(emailTemplate)}`;
    window.open(mailtoLink, '_blank');
  };

  const handleApproveSeller = (invite: any) => {
    if (confirm(`Are you sure you want to approve ${invite.firstName} ${invite.lastName}?`)) {
      // Find the seller in localStorage
      const savedSellers = localStorage.getItem('yourcitydeals_sellers');
      const sellers = JSON.parse(savedSellers);
      const seller = sellers.find((s: any) => s.inviteId === invite.id);
      
      if (seller) {
        const updatedSellers = sellers.map((s: any) => 
          s.id === seller.id ? { ...s, status: 'approved' } : s
        );
        localStorage.setItem('yourcitydeals_sellers', JSON.stringify(updatedSellers));
        
        // Update invite status
        const updatedInvites = invites.map((inv: any) => 
          inv.id === invite.id ? { ...inv, status: 'approved', approvedAt: new Date().toISOString() } : inv
        );
        setInvites(updatedInvites);
        localStorage.setItem('yourcitydeals_invites', JSON.stringify(updatedInvites));
        
        // Send approval email
        const approvalLink = `https://yourcitydeals.com/activate/${invite.id}`;
        const emailTemplate = `Hi ${invite.firstName},

Great news! Your seller application has been approved! 🎉

We're excited to welcome you to the YourCity Deals team. You're now ready to start creating and selling deals to help local businesses grow while supporting great causes.

To get started, please create your account by clicking the link below:
${approvalLink}

This link will take you to a secure page where you can:
• Set up your password
• Access your seller dashboard
• Start creating your first deals

Your username will be: ${seller.phone || seller.email}

If you have any questions or need help getting started, please don't hesitate to reach out to us.

Welcome to the team!

Best regards,
The YourCity Deals Team`;

        const mailtoLink = `mailto:${invite.email}?subject=${encodeURIComponent('YourCity Deals - Application Approved!')}&body=${encodeURIComponent(emailTemplate)}`;
        window.open(mailtoLink, '_blank');

        setShowInviteDetails(false);
        alert('Seller approved! Approval email has been opened.');
      } else {
        alert('Seller not found. They may not have completed their profile yet.');
      }
    }
  };

  const handleRequestEdits = (invite: any) => {
    const editRequest = prompt('Please specify what changes are needed:');
    if (editRequest && confirm(`Send edit request to ${invite.firstName} ${invite.lastName}?`)) {
      // Update invite status
      const updatedInvites = invites.map((inv: any) => 
        inv.id === invite.id ? { 
          ...inv, 
          status: 'edit_requested', 
          editRequestedAt: new Date().toISOString(),
          editRequest: editRequest
        } : inv
      );
      setInvites(updatedInvites);
      localStorage.setItem('yourcitydeals_invites', JSON.stringify(updatedInvites));

      // Update seller status
      const savedSellers = localStorage.getItem('yourcitydeals_sellers');
      if (savedSellers) {
        const sellers = JSON.parse(savedSellers);
        const updatedSellers = sellers.map((seller: any) => 
          seller.inviteId === invite.id ? { 
            ...seller, 
            status: 'edit_requested',
            editRequest: editRequest
          } : seller
        );
        localStorage.setItem('yourcitydeals_sellers', JSON.stringify(updatedSellers));
      }

      // Send edit request email
      const emailTemplate = `Hi ${invite.firstName},

Thank you for your seller application with YourCity Deals.

We've reviewed your profile and would like to request some changes before we can approve your application:

${editRequest}

Please log back into your application and make the requested changes. Once you've updated your profile, we'll review it again.

You can access your application here: https://yourcitydeals.com/invite/TEST123

If you have any questions about the requested changes, please don't hesitate to contact us.

Thank you for your understanding.

Best regards,
The YourCity Deals Team`;

      const mailtoLink = `mailto:${invite.email}?subject=${encodeURIComponent('YourCity Deals - Profile Update Requested')}&body=${encodeURIComponent(emailTemplate)}`;
      window.open(mailtoLink, '_blank');

      setShowInviteDetails(false);
      alert('Edit request sent! Email has been opened.');
    }
  };

  const handleAssignToOrganization = (invite: any) => {
    const organizationOptions = organizationalHubs.map(org => `${org.id}: ${org.name}`).join('\n');
    const selectedOrg = prompt(`Select an organization (enter the ID):\n\n${organizationOptions}`);
    
    if (selectedOrg) {
      const orgId = selectedOrg.split(':')[0].trim();
      const organization = organizationalHubs.find(org => org.id === orgId);
      
      if (organization) {
        // Update invite
        const updatedInvites = invites.map((inv: any) => 
          inv.id === invite.id ? { ...inv, organizationHub: organization.name, organizationHubId: orgId } : inv
        );
        setInvites(updatedInvites);
        localStorage.setItem('yourcitydeals_invites', JSON.stringify(updatedInvites));

        // Update seller if exists
        const savedSellers = localStorage.getItem('yourcitydeals_sellers');
        if (savedSellers) {
          const sellers = JSON.parse(savedSellers);
          const updatedSellers = sellers.map((seller: any) => 
            seller.inviteId === invite.id ? { 
              ...seller, 
              organizationHub: organization.name, 
              organizationHubId: orgId 
            } : seller
          );
          localStorage.setItem('yourcitydeals_sellers', JSON.stringify(updatedSellers));
        }

        alert(`Successfully assigned ${invite.firstName} ${invite.lastName} to ${organization.name}`);
        setShowInviteDetails(false);
      } else {
        alert('Invalid organization ID selected.');
      }
    }
  };

  const handleAssignToBook = (invite: any) => {
    const bookOptions = couponBooks.map(book => `${book.id}: ${book.name}`).join('\n');
    const selectedBook = prompt(`Select a coupon book (enter the ID):\n\n${bookOptions}`);
    
    if (selectedBook) {
      const bookId = selectedBook.split(':')[0].trim();
      const book = couponBooks.find(b => b.id === bookId);
      
      if (book) {
        // Update invite
        const updatedInvites = invites.map((inv: any) => 
          inv.id === invite.id ? { ...inv, couponBook: book.name, couponBookId: bookId } : inv
        );
        setInvites(updatedInvites);
        localStorage.setItem('yourcitydeals_invites', JSON.stringify(updatedInvites));

        // Update seller if exists
        const savedSellers = localStorage.getItem('yourcitydeals_sellers');
        if (savedSellers) {
          const sellers = JSON.parse(savedSellers);
          const updatedSellers = sellers.map((seller: any) => 
            seller.inviteId === invite.id ? { 
              ...seller, 
              couponBook: book.name, 
              couponBookId: bookId 
            } : seller
          );
          localStorage.setItem('yourcitydeals_sellers', JSON.stringify(updatedSellers));
        }

        alert(`Successfully assigned ${invite.firstName} ${invite.lastName} to ${book.name}`);
        setShowInviteDetails(false);
      } else {
        alert('Invalid book ID selected.');
      }
    }
  };

  const handleRemoveAssignment = (invite: any, type: 'organization' | 'book') => {
    const confirmMessage = type === 'organization' 
      ? `Remove ${invite.firstName} ${invite.lastName} from ${invite.organizationHub}?`
      : `Remove ${invite.firstName} ${invite.lastName} from ${invite.couponBook}?`;
    
    if (confirm(confirmMessage)) {
      // Update invite
      const updatedInvites = invites.map((inv: any) => 
        inv.id === invite.id ? { 
          ...inv, 
          [type === 'organization' ? 'organizationHub' : 'couponBook']: null,
          [type === 'organization' ? 'organizationHubId' : 'couponBookId']: null
        } : inv
      );
      setInvites(updatedInvites);
      localStorage.setItem('yourcitydeals_invites', JSON.stringify(updatedInvites));

      // Update seller if exists
      const savedSellers = localStorage.getItem('yourcitydeals_sellers');
      if (savedSellers) {
        const sellers = JSON.parse(savedSellers);
        const updatedSellers = sellers.map((seller: any) => 
          seller.inviteId === invite.id ? { 
            ...seller, 
            [type === 'organization' ? 'organizationHub' : 'couponBook']: null,
            [type === 'organization' ? 'organizationHubId' : 'couponBookId']: null
          } : seller
        );
        localStorage.setItem('yourcitydeals_sellers', JSON.stringify(updatedSellers));
      }

        const handleManualEdit = (invite: any) => {
    const savedSellers = localStorage.getItem('yourcitydeals_sellers');
    const sellers = JSON.parse(savedSellers);
    const seller = sellers.find((s: any) => s.inviteId === invite.id);
    
    if (seller) {
      const newFirstName = prompt('First Name:', seller.firstName);
      const newLastName = prompt('Last Name:', seller.lastName);
      const newEmail = prompt('Email:', seller.email);
      const newPhone = prompt('Phone:', seller.phone);
      const newZipCode = prompt('ZIP Code:', seller.zipCode);
      
      if (newFirstName && newLastName && newEmail && newPhone && newZipCode) {
        const updatedSeller = {
          ...seller,
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
          phone: newPhone,
          zipCode: newZipCode,
          manuallyEdited: true,
          editedAt: new Date().toISOString()
        };
        
        const updatedSellers = sellers.map((s: any) => 
          s.id === seller.id ? updatedSeller : s
        );
        localStorage.setItem('yourcitydeals_sellers', JSON.stringify(updatedSellers));
        
        alert('Seller information updated successfully!');
        setShowInviteDetails(false);
      }
    } else {
      alert('Seller not found. They may not have completed their profile yet.');
    }
  };

  const handleRejectSeller = (invite: any) => {
    const seller = sellers.find((s: any) => s.inviteId === invite.id);
    
    if (seller) {
      const newFirstName = prompt('First Name:', seller.firstName);
      const newLastName = prompt('Last Name:', seller.lastName);
      const newEmail = prompt('Email:', seller.email);
      const newPhone = prompt('Phone:', seller.phone);
      const newZipCode = prompt('ZIP Code:', seller.zipCode);
      
      if (newFirstName && newLastName && newEmail && newPhone && newZipCode) {
        const updatedSeller = {
          ...seller,
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
          phone: newPhone,
          zipCode: newZipCode,
          manuallyEdited: true,
          editedAt: new Date().toISOString()
        };
        
        const updatedSellers = sellers.map((s: any) => 
          s.id === seller.id ? updatedSeller : s
        );
        localStorage.setItem('yourcitydeals_sellers', JSON.stringify(updatedSellers));
        
        alert('Seller information updated successfully!');
        setShowInviteDetails(false);
      }
    } else {
      alert('Seller not found. They may not have completed their profile yet.');
    }
  };
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (confirm(`Are you sure you want to reject ${invite.firstName} ${invite.lastName}?`)) {
      // Update invite status
      const updatedInvites = invites.map((inv: any) => 
        inv.id === invite.id ? { 
          ...inv, 
          status: 'rejected', 
          rejectedAt: new Date().toISOString(),
          rejectionReason: reason || 'Application did not meet our requirements'
        } : inv
      );
      setInvites(updatedInvites);
      localStorage.setItem('yourcitydeals_invites', JSON.stringify(updatedInvites));

      // Update seller status
      const savedSellers = localStorage.getItem('yourcitydeals_sellers');
      if (savedSellers) {
        const sellers = JSON.parse(savedSellers);
        const updatedSellers = sellers.map((seller: any) => 
          seller.inviteId === invite.id ? { 
            ...seller, 
            status: 'rejected',
            rejectionReason: reason || 'Application did not meet our requirements'
          } : seller
        );
        localStorage.setItem('yourcitydeals_sellers', JSON.stringify(updatedSellers));
      }

      // Send rejection email
      const emailTemplate = `Hi ${invite.firstName},

Thank you for your interest in becoming a seller with YourCity Deals.

After careful review of your application, we regret to inform you that we are unable to approve your seller application at this time.

${reason ? `Reason: ${reason}` : 'We appreciate your interest and encourage you to apply again in the future if your circumstances change.'}

If you have any questions about this decision or would like to discuss it further, please don't hesitate to contact us.

Thank you for your understanding.

Best regards,
The YourCity Deals Team`;

      const mailtoLink = `mailto:${invite.email}?subject=${encodeURIComponent('YourCity Deals - Application Status Update')}&body=${encodeURIComponent(emailTemplate)}`;
      window.open(mailtoLink, '_blank');

      setShowInviteDetails(false);
      alert('Seller rejected! Rejection email has been opened.');
    }
  };

  // Filter invites based on search and filters
  const filteredInvites = invites.filter((invite: any) => {
    const matchesSearch = searchTerm === '' || 
      invite.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOrganization = filterOrganization === '' || invite.organizationHub === filterOrganization;
    const matchesBook = filterBook === '' || invite.couponBook === filterBook;
    
    return matchesSearch && matchesOrganization && matchesBook;
  });

  const getOrganizationName = (hubId: string) => {
    const hub = organizationalHubs.find(h => h.id === hubId);
    return hub ? hub.name : 'Not assigned';
  };

  const getBookName = (bookId: string) => {
    const book = couponBooks.find(b => b.id === bookId);
    return book ? book.name : 'Not assigned';
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizational Hub</label>
                <select
                  value={inviteForm.organizationHub}
                  onChange={(e) => setInviteForm({...inviteForm, organizationHub: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an organizational hub (optional)</option>
                  {organizationalHubs.map((hub) => (
                    <option key={hub.id} value={hub.id}>
                      {hub.name} - {hub.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Book</label>
                <select
                  value={inviteForm.couponBook}
                  onChange={(e) => setInviteForm({...inviteForm, couponBook: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a coupon book (optional)</option>
                  {couponBooks.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.name} - ${book.price} ({book.type})
                    </option>
                  ))}
                </select>
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
              onClick={sendEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Send Email
            </button>
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

        {/* Search and Filter Controls */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              <select
                value={filterOrganization}
                onChange={(e) => setFilterOrganization(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Organizations</option>
                {organizationalHubs.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Book</label>
              <select
                value={filterBook}
                onChange={(e) => setFilterBook(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Books</option>
                {couponBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterOrganization('');
                  setFilterBook('');
                }}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invite Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Book</th>
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
                        : invite.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : invite.status === 'ready_for_review'
                        ? 'bg-blue-100 text-blue-800'
                        : invite.status === 'edit_requested'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invite.status === 'ready_for_review' ? 'Ready for Review' : 
                       invite.status === 'edit_requested' ? 'Edit Requested' : invite.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invite.organizationHub || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invite.couponBook || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invite.sentAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewDetails(invite)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seller Details Modal */}
      {showInviteDetails && selectedInvite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Seller Details</h3>
              <button
                onClick={() => setShowInviteDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedInvite.firstName} {selectedInvite.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedInvite.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Invite Token</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedInvite.inviteToken}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedInvite.status === 'accepted' || selectedInvite.status === 'approved'
                        ? 'bg-green-100 text-green-800' 
                        : selectedInvite.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedInvite.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller Profile Info */}
              {(() => {
                const savedSellers = localStorage.getItem('yourcitydeals_sellers');
                const sellers = savedSellers ? JSON.parse(savedSellers) : [];
                console.log('All sellers:', sellers);
                console.log('Looking for invite ID:', selectedInvite.id);
                const seller = sellers.find((s: any) => s.inviteId === selectedInvite.id);
                console.log('Found seller:', seller);
                return seller ? (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Profile Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{seller.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                        <p className="text-sm text-gray-900">{seller.zipCode}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Status</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          seller.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : seller.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : seller.status === 'ready_for_review'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {seller.status === 'ready_for_review' ? 'Ready for Review' : seller.status}
                        </span>
                      </div>
                      {seller.profilePicture && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                          <img 
                            src={seller.profilePicture} 
                            alt="Profile" 
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      This seller hasn't completed their profile yet. They may still be in the onboarding process.
                    </p>
                  </div>
                );
              })()}

              {/* Current Assignments */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Current Assignments</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-700">Organization Hub:</span>
                      <p className="text-gray-900">{selectedInvite.organizationHub || 'Not assigned'}</p>
                    </div>
                    <div className="flex space-x-2">
                      {selectedInvite.organizationHub ? (
                        <button
                          onClick={() => handleRemoveAssignment(selectedInvite, 'organization')}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAssignToOrganization(selectedInvite)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-700">Coupon Book:</span>
                      <p className="text-gray-900">{selectedInvite.couponBook || 'Not assigned'}</p>
                    </div>
                    <div className="flex space-x-2">
                      {selectedInvite.couponBook ? (
                        <button
                          onClick={() => handleRemoveAssignment(selectedInvite, 'book')}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAssignToBook(selectedInvite)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Actions</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleResendInvite(selectedInvite)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Resend Invite
                  </button>
                  {selectedInvite.status === 'ready_for_review' && (
                    <>
                      <button
                        onClick={() => handleRequestEdits(selectedInvite)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                      >
                        Request Edits
                      </button>
                      <button
                        onClick={() => handleManualEdit(selectedInvite)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                      >
                        Edit Manually
                      </button>
                      <button
                        onClick={() => handleApproveSeller(selectedInvite)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Approve Seller
                      </button>
                      <button
                        onClick={() => handleRejectSeller(selectedInvite)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Reject Seller
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowInviteDetails(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Approvals Tab Component
function ApprovalsTab() {
  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [showSellerDetails, setShowSellerDetails] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    // Load pending sellers
    const savedSellers = localStorage.getItem('yourcitydeals_sellers');
    if (savedSellers) {
      const sellers = JSON.parse(savedSellers);
      const pending = sellers.filter((seller: any) => seller.status === 'pending_review');
      setPendingSellers(pending);
    }

    // Load organizations and books for assignment
    const savedOrgs = localStorage.getItem('yourcitydeals_organizations');
    if (savedOrgs) {
      setOrganizations(JSON.parse(savedOrgs));
    }

    const savedBooks = localStorage.getItem('yourcitydeals_books');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  const handleApproveSeller = (seller: any) => {
    const savedSellers = localStorage.getItem('yourcitydeals_sellers');
    if (savedSellers) {
      const sellers = JSON.parse(savedSellers);
      const updatedSellers = sellers.map((s: any) => 
        s.id === seller.id ? { ...s, status: 'approved', approvedAt: new Date().toISOString() } : s
      );
      localStorage.setItem('yourcitydeals_sellers', JSON.stringify(updatedSellers));
      
      // Update invites status
      const savedInvites = localStorage.getItem('yourcitydeals_invites');
      if (savedInvites) {
        const invites = JSON.parse(savedInvites);
        const updatedInvites = invites.map((inv: any) => 
          inv.id === seller.inviteId ? { ...inv, status: 'approved', approvedAt: new Date().toISOString() } : inv
        );
        localStorage.setItem('yourcitydeals_invites', JSON.stringify(updatedInvites));
      }

      // Refresh pending sellers list
      const newPending = updatedSellers.filter((s: any) => s.status === 'pending_review');
      setPendingSellers(newPending);
      setShowSellerDetails(false);
    }
  };

  const handleRejectSeller = (seller: any) => {
    const savedSellers = localStorage.getItem('yourcitydeals_sellers');
    if (savedSellers) {
      const sellers = JSON.parse(savedSellers);
      const updatedSellers = sellers.map((s: any) => 
        s.id === seller.id ? { ...s, status: 'rejected', rejectedAt: new Date().toISOString() } : s
      );
      localStorage.setItem('yourcitydeals_sellers', JSON.stringify(updatedSellers));
      
      // Update invites status
      const savedInvites = localStorage.getItem('yourcitydeals_invites');
      if (savedInvites) {
        const invites = JSON.parse(savedInvites);
        const updatedInvites = invites.map((inv: any) => 
          inv.id === seller.inviteId ? { ...inv, status: 'rejected', rejectedAt: new Date().toISOString() } : inv
        );
        localStorage.setItem('yourcitydeals_invites', JSON.stringify(updatedInvites));
      }

      // Refresh pending sellers list
      const newPending = updatedSellers.filter((s: any) => s.status === 'pending_review');
      setPendingSellers(newPending);
      setShowSellerDetails(false);
    }
  };

  const handleAssignToOrganization = (seller: any, orgId: string) => {
    const savedSellers = localStorage.getItem('yourcitydeals_sellers');
    if (savedSellers) {
      const sellers = JSON.parse(savedSellers);
      const updatedSellers = sellers.map((s: any) => 
        s.id === seller.id ? { ...s, organizationId: orgId, assignedAt: new Date().toISOString() } : s
      );
      localStorage.setItem('yourcitydeals_sellers', JSON.stringify(updatedSellers));
      setShowSellerDetails(false);
    }
  };

  const handleAssignToBook = (seller: any, bookId: string) => {
    const savedSellers = localStorage.getItem('yourcitydeals_sellers');
    if (savedSellers) {
      const sellers = JSON.parse(savedSellers);
      const updatedSellers = sellers.map((s: any) => 
        s.id === seller.id ? { ...s, bookId: bookId, bookAssignedAt: new Date().toISOString() } : s
      );
      localStorage.setItem('yourcitydeals_sellers', JSON.stringify(updatedSellers));
      setShowSellerDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Seller Approvals</h2>
        <div className="text-sm text-gray-600">
          {pendingSellers.length} pending review
        </div>
      </div>

      {pendingSellers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
          <p className="text-gray-600">All seller applications have been reviewed.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendingSellers.map((seller) => (
            <div key={seller.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {seller.profilePicture ? (
                    <img 
                      src={seller.profilePicture} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {seller.firstName} {seller.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{seller.email}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  Pending Review
                </span>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium">{seller.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ZIP Code:</span>
                  <span className="font-medium">{seller.zipCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Applied:</span>
                  <span className="font-medium">{new Date(seller.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedSeller(seller);
                    setShowSellerDetails(true);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Review
                </button>
                <button
                  onClick={() => handleApproveSeller(seller)}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejectSeller(seller)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Seller Details Modal */}
      {showSellerDetails && selectedSeller && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Review Seller: {selectedSeller.firstName} {selectedSeller.lastName}
              </h3>
              
              <div className="space-y-4">
                {/* Profile Picture */}
                {selectedSeller.profilePicture && (
                  <div className="text-center">
                    <img 
                      src={selectedSeller.profilePicture} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 mx-auto"
                    />
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedSeller.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedSeller.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                    <p className="text-sm text-gray-900">{selectedSeller.zipCode}</p>
                  </div>
                </div>

                {/* Assignment Options */}
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-gray-900">Assignment Options</h4>
                  
                  {/* Organization Assignment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Organization</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleAssignToOrganization(selectedSeller, e.target.value)}
                    >
                      <option value="">Select Organization</option>
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Book Assignment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Book</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleAssignToBook(selectedSeller, e.target.value)}
                    >
                      <option value="">Select Book</option>
                      {books.map((book) => (
                        <option key={book.id} value={book.id}>{book.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleApproveSeller(selectedSeller)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectSeller(selectedSeller)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setShowSellerDetails(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
