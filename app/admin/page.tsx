'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('invites');
  const [sellerInvites, setSellerInvites] = useState<any[]>([]);
  const [organizationalHubs, setOrganizationalHubs] = useState<any[]>([]);
  const [couponBooks, setCouponBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organizationHub: '',
    couponBook: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrganization, setFilterOrganization] = useState('');
  const [filterBook, setFilterBook] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInvite, setSelectedInvite] = useState<any>(null);
  const [showInviteDetails, setShowInviteDetails] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('Loading dashboard data from Supabase...');
        
        // Load seller invites from Supabase
        let { data: invites, error: invitesError } = await supabase
          .from('seller_invites')
          .select('*')
          .order('created_at', { ascending: false });

        if (invitesError) {
          console.error('Error loading invites from Supabase:', invitesError);
          // Fallback to localStorage
          const savedInvites = localStorage.getItem('yourcitydeals_seller_invites');
          invites = savedInvites ? JSON.parse(savedInvites) : [];
        } else {
          console.log('Loaded invites from Supabase:', invites);
          console.log('Total invites loaded:', invites?.length || 0);
          console.log('Invites with ready_for_review status:', invites?.filter((inv: any) => inv.status === 'ready_for_review'));
        }

        // Load organizational hubs from Supabase
        let { data: hubs, error: hubsError } = await supabase
          .from('organizational_hubs')
          .select('*')
          .order('name');

        if (hubsError) {
          console.error('Error loading hubs from Supabase:', hubsError);
          // Fallback to localStorage
          const savedHubs = localStorage.getItem('yourcitydeals_organizational_hubs');
          hubs = savedHubs ? JSON.parse(savedHubs) : [];
        }

        // Load admin coupon books from Supabase
        let { data: books, error: booksError } = await supabase
          .from('admin_coupon_books')
          .select('*')
          .order('title');

        if (booksError) {
          console.error('Error loading books from Supabase:', booksError);
          // Fallback to localStorage
          const savedBooks = localStorage.getItem('yourcitydeals_admin_coupon_books');
          books = savedBooks ? JSON.parse(savedBooks) : [];
        }
        
        setSellerInvites(invites || []);
        setOrganizationalHubs(hubs || []);
        setCouponBooks(books || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
    
    // Set up interval to refresh data every 3 seconds
    const interval = setInterval(loadDashboardData, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter invites based on search and filters
  const filteredInvites = sellerInvites.filter((invite: any) => {
    // Show all invites for now (pending, ready_for_review, etc.)
    console.log('Filtering invite:', invite.id, invite.status, invite.first_name, invite.email);
    return true; // Show all invites
  });

  // Get ready for review invites for the Approvals tab
  const readyForReviewInvites = sellerInvites.filter((invite: any) => {
    console.log('Checking invite:', invite.id, invite.status, invite.first_name);
    return invite.status === 'ready_for_review';
  });

  const handleClearAllTestData = async () => {
    if (confirm('Are you sure you want to delete ALL test data? This will remove all invites and cannot be undone.')) {
      try {
        // Delete all invites from Supabase
        const { error: supabaseError } = await supabase
          .from('seller_invites')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (supabaseError) {
          console.error('Error clearing test data from Supabase:', supabaseError);
          alert('Failed to clear test data from database. Please try again.');
          return;
        }

        // Clear localStorage
        localStorage.removeItem('yourcitydeals_seller_invites');
        setSellerInvites([]);
        
        alert('All test data cleared successfully. You can now create new invites.');
      } catch (error) {
        console.error('Error clearing test data:', error);
        alert('Failed to clear test data. Please try again.');
      }
    }
  };

  // Generate unique invite token
  const generateInviteToken = () => {
    // Generate a unique token for each invite
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    const token = `${timestamp}${random}`.toUpperCase();
    console.log('Generated unique token:', token);
    return token;
  };

  // Handle creating new invite
  const handleCreateInvite = async () => {
    if (!inviteForm.firstName || !inviteForm.lastName || !inviteForm.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Check for duplicate email in Supabase
    const { data: existingInvite, error: checkError } = await supabase
      .from('seller_invites')
      .select('*')
      .eq('email', inviteForm.email.toLowerCase())
      .single();

    if (existingInvite && !checkError) {
      alert('An invite with this email already exists');
      return;
    }

    const inviteToken = generateInviteToken();
    console.log('Creating invite with token:', inviteToken);
    const newInvite = {
      token: inviteToken,
      first_name: inviteForm.firstName,
      last_name: inviteForm.lastName,
      email: inviteForm.email,
      status: 'pending',
      organization_hub: inviteForm.organizationHub,
      coupon_book: inviteForm.couponBook,
      sent_at: new Date().toISOString(),
      email_sent: true,
      link_clicked: false,
      profile_completed: false
    };

    // Save to Supabase
    const { data: savedInvite, error: saveError } = await supabase
      .from('seller_invites')
      .insert(newInvite)
      .select()
      .single();

    if (saveError) {
      console.error('Error saving invite to Supabase:', saveError);
      alert('Failed to create invite. Please try again.');
      return;
    }

    console.log('Invite saved to Supabase:', savedInvite);

    // Also save to localStorage as fallback
    const updatedInvites = [...sellerInvites, savedInvite];
    localStorage.setItem('yourcitydeals_seller_invites', JSON.stringify(updatedInvites));
    setSellerInvites(updatedInvites);
    
    console.log('Updated sellerInvites state:', updatedInvites);

    // Send initial email
    const emailTemplate = `Hi ${inviteForm.firstName},

You've been invited to become a seller with YourCity Deals! 

We're excited to have you join our team of sellers who help local businesses grow while supporting great causes.

To get started, please click the link below to complete your profile:
https://yourcitydeals.com/invite/${inviteToken}

This link will take you through a simple process to:
• Complete your seller profile
• Set up your account
• Get started with your first deals

If you have any questions, please don't hesitate to reach out to us.

We look forward to working with you!

Best regards,
The YourCity Deals Team`;

    const mailtoLink = `mailto:${inviteForm.email}?subject=${encodeURIComponent('YourCity Deals - Seller Invitation')}&body=${encodeURIComponent(emailTemplate)}`;
    window.open(mailtoLink, '_blank');

    // Reset form
    setInviteForm({
      firstName: '',
      lastName: '',
      email: '',
      organizationHub: '',
      couponBook: ''
    });
    setShowInviteForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
              <p className="text-gray-600">Manage sellers, invites, and approvals</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('invites')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'invites'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>Seller Invites</span>
                {filteredInvites.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {filteredInvites.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'approvals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>Seller Approvals</span>
                {readyForReviewInvites.length > 0 && (
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full animate-pulse">
                    {readyForReviewInvites.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('merchants')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'merchants'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>Add Merchant</span>
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'books'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>Add Book</span>
            </button>
            <button
              onClick={() => setActiveTab('organizations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'organizations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>Add Organization</span>
            </button>
          </nav>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'invites' && <InvitesTab
          sellerInvites={sellerInvites}
          setSellerInvites={setSellerInvites}
          organizationalHubs={organizationalHubs}
          couponBooks={couponBooks}
          handleClearAllTestData={handleClearAllTestData}
        />}
        {activeTab === 'approvals' && <ApprovalsTab 
          sellerInvites={sellerInvites}
          setSellerInvites={setSellerInvites}
          organizationalHubs={organizationalHubs}
          couponBooks={couponBooks}
        />}
        {activeTab === 'merchants' && <MerchantsTab />}
        {activeTab === 'books' && <BooksTab />}
        {activeTab === 'organizations' && <OrganizationsTab />}
      </div>
    </div>
  );
}

// Invites Tab Component
function InvitesTab({
  sellerInvites,
  setSellerInvites,
  organizationalHubs,
  couponBooks,
  handleClearAllTestData
}: {
  sellerInvites: any[];
  setSellerInvites: (invites: any[]) => void;
  organizationalHubs: any[];
  couponBooks: any[];
  handleClearAllTestData: () => void;
}) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organizationHub: '',
    couponBook: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrganization, setFilterOrganization] = useState('');
  const [filterBook, setFilterBook] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInvite, setSelectedInvite] = useState<any>(null);
  const [showInviteDetails, setShowInviteDetails] = useState(false);

  // Filter invites based on search and filters
  const filteredInvites = sellerInvites.filter((invite: any) => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      (invite.first_name || invite.firstName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invite.last_name || invite.lastName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Organization filter
    const matchesOrganization = filterOrganization === '' || invite.organizationHub === filterOrganization;
    
    // Book filter
    const matchesBook = filterBook === '' || invite.couponBook === filterBook;
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || invite.status === filterStatus;
    
    return matchesSearch && matchesOrganization && matchesBook && matchesStatus;
  });

  const generateInviteToken = () => {
    // Generate a unique token for each invite
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}${random}`.toUpperCase();
  };

  const handleCreateInvite = () => {
    if (!inviteForm.firstName || !inviteForm.lastName || !inviteForm.email) {
      alert('Please fill in all fields');
      return;
    }

    // Check for duplicate email
    const existingInvite = sellerInvites.find(invite => 
      invite.email.toLowerCase() === inviteForm.email.toLowerCase()
    );
    
    if (existingInvite) {
      alert(`A seller with the email "${inviteForm.email}" has already been invited. Please use a different email address or check the invite history.`);
      return;
    }

    // Check for duplicate name combination
    const existingName = sellerInvites.find(invite => 
      (invite.first_name || invite.firstName)?.toLowerCase() === inviteForm.firstName.toLowerCase() &&
      (invite.last_name || invite.lastName)?.toLowerCase() === inviteForm.lastName.toLowerCase()
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
      token: inviteToken,
      first_name: inviteForm.firstName,
      last_name: inviteForm.lastName,
      email: inviteForm.email,
      status: 'pending',
      organizationHub: inviteForm.organizationHub,
      couponBook: inviteForm.couponBook,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sentAt: new Date().toLocaleString(),
      emailSent: true,
      linkClicked: false,
      profileCompleted: false
    };

    // Add to localStorage
    const updatedInvites = [newInvite, ...sellerInvites];
    localStorage.setItem('yourcitydeals_seller_invites', JSON.stringify(updatedInvites));
    setSellerInvites(updatedInvites);
    
    setShowInviteForm(false);
    setInviteForm({ firstName: '', lastName: '', email: '', organizationHub: '', couponBook: '' });

    // Log to console for testing
    console.log('Invite created:', newInvite);
    console.log('Invite link:', inviteLink);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-900">Seller Invites</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {filteredInvites.length} total
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleClearAllTestData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Clear All Test Data
          </button>
          <button 
            onClick={() => setShowInviteForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Invite Seller
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization Hub</label>
            <select
              value={filterOrganization}
              onChange={(e) => setFilterOrganization(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Organizations</option>
              {organizationalHubs.map((hub) => (
                <option key={hub.id} value={hub.name}>{hub.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Book</label>
            <select
              value={filterBook}
              onChange={(e) => setFilterBook(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Books</option>
              {couponBooks.map((book) => (
                <option key={book.id} value={book.title}>{book.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="ready_for_review">Ready for Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="edit_requested">Edit Requested</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rest of the InvitesTab content would go here */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Pending invites will appear here. Sellers who complete their profiles will move to the "Seller Approvals" tab.</p>
      </div>

      {/* Invite History Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Invite History</h3>
        </div>
        
        {filteredInvites.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invites found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterOrganization || filterBook || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by inviting a new seller.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization Hub</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Sent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invite.first_name || invite.firstName} {invite.last_name || invite.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invite.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invite.organizationHub || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invite.couponBook || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        invite.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        invite.status === 'ready_for_review' ? 'bg-blue-100 text-blue-800' :
                        invite.status === 'approved' ? 'bg-green-100 text-green-800' :
                        invite.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        invite.status === 'edit_requested' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invite.status === 'pending' ? 'Pending' :
                         invite.status === 'ready_for_review' ? 'Ready for Review' :
                         invite.status === 'approved' ? 'Approved' :
                         invite.status === 'rejected' ? 'Rejected' :
                         invite.status === 'edit_requested' ? 'Edit Requested' :
                         invite.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invite.sentAt || invite.created_at ? new Date(invite.sentAt || invite.created_at).toLocaleString() : 'Not sent'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => {
                          const emailTemplate = `Hi ${invite.first_name || invite.firstName},

I hope this email finds you well. I'm reaching out because we'd like to invite you to join our team of sellers at YourCity Deals!

YourCity Deals is a platform that helps local businesses grow while supporting great causes in our community. We're excited about the opportunity to work with you and believe you would be a valuable addition to our seller network.

Here's what we're offering:
• Flexible, commission-based earning opportunities
• Support for local businesses and community causes
• Comprehensive training and ongoing support
• Access to our proven sales system and marketing materials

To get started, please click the link below to complete your seller profile:
https://yourcitydeals.com/invite/${invite.token}

The profile setup process is simple and takes just a few minutes. You'll be able to:
• Complete your seller profile
• Set up your account preferences
• Review our seller guidelines and policies
• Access your seller dashboard

If you have any questions about this opportunity or need assistance with the setup process, please don't hesitate to reach out. We're here to help you succeed!

We look forward to welcoming you to the YourCity Deals team.

Best regards,
Ash Perry
YourCity Deals Team
support@yourcitydeals.com`;

                          const mailtoLink = `mailto:${invite.email}?subject=${encodeURIComponent('Invitation to Join YourCity Deals as a Seller')}&body=${encodeURIComponent(emailTemplate)}`;
                          window.open(mailtoLink, '_blank');
                          
                          // Update sent date
                          
                          // Update sent date
                          const updatedInvites = sellerInvites.map((inv: any) => 
                            inv.id === invite.id ? { ...inv, sentAt: new Date().toLocaleString(), emailSent: true } : inv
                          );
                          localStorage.setItem('yourcitydeals_seller_invites', JSON.stringify(updatedInvites));
                          setSellerInvites(updatedInvites);
                        }}
                        className={`mr-3 ${invite.emailSent ? 'text-green-600 hover:text-green-900' : 'text-blue-600 hover:text-blue-900'}`}
                      >
                        {invite.emailSent ? 'Send Email Again' : 'Send Email'}
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedInvite(invite);
                          setShowInviteDetails(true);
                        }}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete ${invite.first_name || invite.firstName}? This will permanently remove all their data and cannot be undone.`)) {
                            try {
                              // Delete from Supabase
                              const { error: supabaseError } = await supabase
                                .from('seller_invites')
                                .delete()
                                .eq('id', invite.id);

                              if (supabaseError) {
                                console.error('Error deleting from Supabase:', supabaseError);
                                alert('Failed to delete from database. Please try again.');
                                return;
                              }

                              // Also delete from localStorage as fallback
                              const updatedInvites = sellerInvites.filter((inv: any) => inv.id !== invite.id);
                              localStorage.setItem('yourcitydeals_seller_invites', JSON.stringify(updatedInvites));
                              setSellerInvites(updatedInvites);
                              
                              alert('Seller invite deleted successfully from database.');
                            } catch (error) {
                              console.error('Error deleting invite:', error);
                              alert('Failed to delete invite. Please try again.');
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Form Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Invite New Seller</h3>
              <button
                onClick={() => setShowInviteForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCreateInvite(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={inviteForm.firstName}
                    onChange={(e) => setInviteForm({...inviteForm, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={inviteForm.lastName}
                    onChange={(e) => setInviteForm({...inviteForm, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Hub</label>
                  <select
                    value={inviteForm.organizationHub}
                    onChange={(e) => setInviteForm({...inviteForm, organizationHub: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Organization Hub</option>
                    {organizationalHubs.map((hub) => (
                      <option key={hub.id} value={hub.name}>{hub.name}</option>
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
                    <option value="">Select Coupon Book</option>
                    {couponBooks.map((book) => (
                      <option key={book.id} value={book.title}>{book.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Send Invite & Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Approvals Tab Component
function ApprovalsTab({ 
  sellerInvites, 
  setSellerInvites, 
  organizationalHubs, 
  couponBooks 
}: {
  sellerInvites: any[];
  setSellerInvites: (invites: any[]) => void;
  organizationalHubs: any[];
  couponBooks: any[];
}) {
  const [readyForReviewInvites, setReadyForReviewInvites] = useState<any[]>([]);
  const [selectedInvite, setSelectedInvite] = useState<any>(null);
  const [showInviteDetails, setShowInviteDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrganization, setFilterOrganization] = useState('');
  const [filterBook, setFilterBook] = useState('');
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editingInvite, setEditingInvite] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: '',
    organizationHub: '',
    couponBook: ''
  });
  const [pendingEmail, setPendingEmail] = useState<any>(null);

  useEffect(() => {
    // Load ready for review invites from the main component
    const loadReadyForReviewInvites = () => {
      const readyForReview = sellerInvites.filter((invite: any) => invite.status === 'ready_for_review');
      setReadyForReviewInvites(readyForReview);
    };

    loadReadyForReviewInvites();
    
    // Set up interval to check for new ready_for_review invites
    const interval = setInterval(loadReadyForReviewInvites, 5000);
    
    return () => clearInterval(interval);
  }, [sellerInvites]);

  // Filter ready for review invites
  const filteredReadyForReviewInvites = readyForReviewInvites.filter((invite: any) => {
    const matchesSearch = searchTerm === '' || 
      invite.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOrganization = filterOrganization === '' || invite.organizationHub === filterOrganization;
    const matchesBook = filterBook === '' || invite.couponBook === filterBook;
    
    return matchesSearch && matchesOrganization && matchesBook;
  });

  const handleViewDetails = (invite: any) => {
    setSelectedInvite(invite);
    setShowInviteDetails(true);
  };

  const handleApproveSeller = (invite: any) => {
    if (confirm(`Are you sure you want to approve ${invite.first_name} ${invite.last_name}?`)) {
      // Generate seller portal credentials
      const sellerUsername = invite.email;
      const sellerPassword = Math.random().toString(36).slice(-8); // Generate random 8-character password
      
      // Update invite status in localStorage
      const updatedInvites = sellerInvites.map((inv: any) => 
        inv.id === invite.id ? { 
          ...inv, 
          status: 'approved', 
          approvedAt: new Date().toISOString(),
          sellerUsername,
          sellerPassword
        } : inv
      );
      
      // Save to localStorage
      localStorage.setItem('yourcitydeals_seller_invites', JSON.stringify(updatedInvites));
      setSellerInvites(updatedInvites);

      // Send approval email with seller portal credentials
      const sellerPortalLink = `https://yourcitydeals.com/seller`;
      const emailTemplate = `Hi ${invite.first_name},

🎉 CONGRATULATIONS! Your seller application has been APPROVED! 🎉

We're excited to welcome you to the YourCity Deals team! You're now ready to start creating and selling deals to help local businesses grow while supporting great causes.

YOUR SELLER PORTAL CREDENTIALS:
• Portal URL: ${sellerPortalLink}
• Username: ${sellerUsername}
• Password: ${sellerPassword}

NEXT STEPS:
1. Visit the seller portal using the credentials above
2. Complete your seller profile setup
3. Start creating your first deals
4. Connect with local businesses

IMPORTANT: Please change your password after your first login for security.

If you have any questions or need help getting started, please don't hesitate to reach out to us at support@yourcitydeals.com.

Welcome to the team!

Best regards,
The YourCity Deals Team
support@yourcitydeals.com`;

      // Store email content for the Send Email button
      setPendingEmail({
        to: invite.email,
        subject: '🎉 APPROVED: YourCity Deals Seller Account',
        body: emailTemplate,
        type: 'approval',
        sellerUsername,
        sellerPassword
      });

      setShowInviteDetails(false);
      alert(`Seller approved! Login credentials:\nUsername: ${sellerUsername}\nPassword: ${sellerPassword}\n\nClick the "Send Email" button to send the approval email.`);
    }
  };

  const handleRejectSeller = (invite: any) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (confirm(`Are you sure you want to reject ${invite.first_name} ${invite.last_name}?`)) {
      // Update invite status in localStorage
      const updatedInvites = sellerInvites.map((inv: any) => 
        inv.id === invite.id ? { 
          ...inv, 
          status: 'rejected', 
          rejectedAt: new Date().toISOString(),
          rejectionReason: reason || 'Application did not meet our requirements'
        } : inv
      );
      
      // Save to localStorage
      localStorage.setItem('yourcitydeals_seller_invites', JSON.stringify(updatedInvites));
      setSellerInvites(updatedInvites);

      // Send rejection email
      const emailTemplate = `Hi ${invite.first_name},

Thank you for your interest in becoming a seller with YourCity Deals.

After careful review of your application, we regret to inform you that we are unable to approve your seller application at this time.

${reason ? `REASON FOR DECISION: ${reason}` : 'We appreciate your interest and encourage you to apply again in the future if your circumstances change.'}

WHAT THIS MEANS:
• Your current application will not be processed further
• You may reapply in the future if your situation changes
• We encourage you to review our seller requirements on our website

NEXT STEPS:
If you believe this decision was made in error or if you have additional information to share, please contact us at support@yourcitydeals.com.

We appreciate your understanding and wish you the best in your future endeavors.

Best regards,
The YourCity Deals Team
support@yourcitydeals.com`;

      // Store email content for the Send Email button
      setPendingEmail({
        to: invite.email,
        subject: '❌ DECLINED: YourCity Deals Seller Application',
        body: emailTemplate,
        type: 'rejection',
        reason: reason || 'Application did not meet our requirements'
      });

      setShowInviteDetails(false);
      alert('Seller rejected! Click the "Send Email" button to send the rejection email.');
    }
  };

  const handleRequestEdits = (invite: any) => {
    const editRequest = prompt('Please specify what edits are needed:');
    if (editRequest) {
      // Update invite status in localStorage
      const updatedInvites = sellerInvites.map((inv: any) => 
        inv.id === invite.id ? { ...inv, status: 'edit_requested', editRequest, editRequestedAt: new Date().toISOString() } : inv
      );
      
      // Save to localStorage
      localStorage.setItem('yourcitydeals_seller_invites', JSON.stringify(updatedInvites));
      setSellerInvites(updatedInvites);

      // Send edit request email
      const emailTemplate = `Hi ${invite.first_name},

Thank you for your interest in becoming a seller with YourCity Deals.

We've reviewed your application and would like you to make some changes before we can approve it.

REQUESTED CHANGES:
${editRequest}

WHAT YOU NEED TO DO:
1. Review the requested changes above
2. Update your profile information
3. Resubmit your application
4. We'll review your updated application within 24-48 hours

HOW TO UPDATE YOUR PROFILE:
• Visit: https://yourcitydeals.com/invite/${invite.token}
• Complete the profile setup with the requested changes
• Submit your updated application

If you have any questions about the requested changes or need assistance, please contact us at support@yourcitydeals.com.

We look forward to reviewing your updated application!

Best regards,
The YourCity Deals Team
support@yourcitydeals.com`;

      // Store email content for the Send Email button
      setPendingEmail({
        to: invite.email,
        subject: '📝 ACTION REQUIRED: Update YourCity Deals Seller Profile',
        body: emailTemplate,
        type: 'edit_request',
        editRequest: editRequest
      });

      setShowInviteDetails(false);
      alert('Edit request ready! Click the "Send Email" button to send the edit request email.');
    }
  };

  const handleSendEmail = () => {
    if (!pendingEmail) return;
    
    const mailtoLink = `mailto:${pendingEmail.to}?subject=${encodeURIComponent(pendingEmail.subject)}&body=${encodeURIComponent(pendingEmail.body)}`;
    window.open(mailtoLink, '_blank');
    
    // Clear the pending email
    setPendingEmail(null);
  };

  const handleDeleteInvite = async (invite: any) => {
    if (confirm(`Are you sure you want to delete ${invite.first_name} ${invite.last_name}? This will permanently remove all their data and cannot be undone.`)) {
      try {
        // Delete from Supabase
        const { error: supabaseError } = await supabase
          .from('seller_invites')
          .delete()
          .eq('id', invite.id);

        if (supabaseError) {
          console.error('Error deleting from Supabase:', supabaseError);
          alert('Failed to delete from database. Please try again.');
          return;
        }

        // Also delete from localStorage as fallback
        const updatedInvites = sellerInvites.filter((inv: any) => inv.id !== invite.id);
        localStorage.setItem('yourcitydeals_seller_invites', JSON.stringify(updatedInvites));
        setSellerInvites(updatedInvites);
        
        // Close the modal
        setShowInviteDetails(false);
        setSelectedInvite(null);
        
        alert('Seller invite deleted successfully from database.');
      } catch (error) {
        console.error('Error deleting invite:', error);
        alert('Failed to delete invite. Please try again.');
      }
    }
  };

  const handleClearAllTestData = async () => {
    if (confirm('Are you sure you want to delete ALL test data? This will remove all invites and cannot be undone.')) {
      try {
        // Delete all invites from Supabase
        const { error: supabaseError } = await supabase
          .from('seller_invites')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (supabaseError) {
          console.error('Error clearing test data from Supabase:', supabaseError);
          alert('Failed to clear test data from database. Please try again.');
          return;
        }

        // Clear localStorage
        localStorage.removeItem('yourcitydeals_seller_invites');
        setSellerInvites([]);
        
        alert('All test data cleared successfully. You can now create new invites.');
      } catch (error) {
        console.error('Error clearing test data:', error);
        alert('Failed to clear test data. Please try again.');
      }
    }
  };

  const handleEditProfile = (invite: any) => {
    setEditingInvite(invite);
    setEditForm({
      firstName: invite.first_name || '',
      lastName: invite.last_name || '',
      email: invite.email || '',
      phone: invite.phone || '',
      zipCode: invite.zip_code || '',
      organizationHub: invite.organizationHub || '',
      couponBook: invite.couponBook || ''
    });
    setShowEditProfileModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingInvite) return;

    // Update the invite with edited data
    const updatedInvites = readyForReviewInvites.map((inv: any) => 
      inv.id === editingInvite.id ? {
        ...inv,
        first_name: editForm.firstName,
        last_name: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
        zip_code: editForm.zipCode,
        organizationHub: editForm.organizationHub,
        couponBook: editForm.couponBook,
        edited_at: new Date().toISOString()
      } : inv
    );
    setReadyForReviewInvites(updatedInvites);

    // Send notification email
    const emailTemplate = `Hi ${editForm.firstName},

Your seller profile has been updated by our admin team.

Updated Information:
• Name: ${editForm.firstName} ${editForm.lastName}
• Email: ${editForm.email}
• Phone: ${editForm.phone || 'Not provided'}
• ZIP Code: ${editForm.zipCode || 'Not provided'}
• Organization Hub: ${editForm.organizationHub || 'Not assigned'}
• Coupon Book: ${editForm.couponBook || 'Not assigned'}

If you notice any discrepancies or have questions about these changes, please contact us immediately.

Best regards,
The YourCity Deals Team`;

    const mailtoLink = `mailto:${editForm.email}?subject=${encodeURIComponent('YourCity Deals - Profile Updated')}&body=${encodeURIComponent(emailTemplate)}`;
    window.open(mailtoLink, '_blank');

    setShowEditProfileModal(false);
    setEditingInvite(null);
    alert('Profile updated! Notification email has been opened.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-900">Seller Approvals</h2>
          {readyForReviewInvites.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full animate-pulse">
                {readyForReviewInvites.length} ready for review
              </span>
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full animate-bounce">
                NEW!
              </span>
            </div>
          )}
        </div>
        {readyForReviewInvites.length > 0 && (
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ALL ${readyForReviewInvites.length} seller invites? This cannot be undone.`)) {
                const updatedInvites = sellerInvites.filter((inv: any) => inv.status !== 'ready_for_review');
                localStorage.setItem('yourcitydeals_seller_invites', JSON.stringify(updatedInvites));
                setSellerInvites(updatedInvites);
                alert('All seller invites have been deleted. You can now create new invites for testing.');
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Notification Banner */}
      {readyForReviewInvites.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                {readyForReviewInvites.length} seller{readyForReviewInvites.length === 1 ? '' : 's'} ready for review
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                These sellers have completed their profiles and are waiting for your approval.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Send Email Button */}
      {pendingEmail && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  {pendingEmail.type === 'approval' && 'Approval Email Ready'}
                  {pendingEmail.type === 'rejection' && 'Rejection Email Ready'}
                  {pendingEmail.type === 'edit_request' && 'Edit Request Email Ready'}
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Email to {pendingEmail.to} is ready to send. Click the button below to open your email client.
                </p>
                {pendingEmail.type === 'approval' && (
                  <p className="text-xs text-blue-600 mt-1">
                    Credentials: {pendingEmail.sellerUsername} / {pendingEmail.sellerPassword}
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Email
              </button>
              <button
                onClick={() => setPendingEmail(null)}
                className="px-4 py-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization Hub</label>
            <select
              value={filterOrganization}
              onChange={(e) => setFilterOrganization(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Organizations</option>
              {organizationalHubs.map((hub) => (
                <option key={hub.id} value={hub.name}>{hub.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Book</label>
            <select
              value={filterBook}
              onChange={(e) => setFilterBook(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Books</option>
              {couponBooks.map((book) => (
                <option key={book.id} value={book.title}>{book.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ready for Review Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Ready for Review</h3>
        </div>
        
        {filteredReadyForReviewInvites.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sellers ready for review</h3>
            <p className="mt-1 text-sm text-gray-500">
              Sellers will appear here once they complete their profiles.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Completed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReadyForReviewInvites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invite.first_name} {invite.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invite.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invite.organizationHub || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invite.couponBook || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invite.profile_completed_at ? new Date(invite.profile_completed_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewDetails(invite)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Review
                      </button>
                      <button 
                        onClick={() => handleDeleteInvite(invite)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Seller Details Modal */}
      {showInviteDetails && selectedInvite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Review Seller Application</h3>
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
              {/* Application Status */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Application Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-700">Current Status:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedInvite.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        selectedInvite.status === 'ready_for_review' ? 'bg-blue-100 text-blue-800' :
                        selectedInvite.status === 'approved' ? 'bg-green-100 text-green-800' :
                        selectedInvite.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        selectedInvite.status === 'edit_requested' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedInvite.status === 'pending' ? 'Application Pending' :
                         selectedInvite.status === 'ready_for_review' ? 'Ready for Review' :
                         selectedInvite.status === 'approved' ? 'Approved' :
                         selectedInvite.status === 'rejected' ? 'Rejected' :
                         selectedInvite.status === 'edit_requested' ? 'Edit Requested' :
                         selectedInvite.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Tracking */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Email Sent:</span>
                      <p className="text-gray-900">{selectedInvite.emailSent ? 'Yes' : 'No'}</p>
                      {selectedInvite.sentAt && <p className="text-xs text-gray-500">{new Date(selectedInvite.sentAt).toLocaleString()}</p>}
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Link Clicked:</span>
                      <p className="text-gray-900">{selectedInvite.linkClicked ? 'Yes' : 'No'}</p>
                      {selectedInvite.linkClickedAt && <p className="text-xs text-gray-500">{new Date(selectedInvite.linkClickedAt).toLocaleString()}</p>}
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Profile Completed:</span>
                      <p className="text-gray-900">{selectedInvite.profile_completed_at ? 'Yes' : 'No'}</p>
                      {selectedInvite.profile_completed_at && <p className="text-xs text-gray-500">{new Date(selectedInvite.profile_completed_at).toLocaleString()}</p>}
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Application Submitted:</span>
                      <p className="text-gray-900">{selectedInvite.status === 'ready_for_review' ? 'Yes' : 'No'}</p>
                      {selectedInvite.updated_at && <p className="text-xs text-gray-500">{new Date(selectedInvite.updated_at).toLocaleString()}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision History */}
              {(selectedInvite.status === 'rejected' || selectedInvite.status === 'edit_requested' || selectedInvite.status === 'approved') && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Decision History</h4>
                  <div className="space-y-3">
                    {selectedInvite.status === 'rejected' && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-medium text-red-700">Rejection Reason:</span>
                            <p className="text-red-900 mt-1">{selectedInvite.rejectionReason || 'No reason provided'}</p>
                          </div>
                          <span className="text-xs text-red-600">{selectedInvite.rejectedAt ? new Date(selectedInvite.rejectedAt).toLocaleDateString() : 'Recently'}</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedInvite.status === 'edit_requested' && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-medium text-yellow-700">Edit Request:</span>
                            <p className="text-yellow-900 mt-1">{selectedInvite.editRequest || 'No specific edits requested'}</p>
                          </div>
                          <span className="text-xs text-yellow-600">{selectedInvite.editRequestedAt ? new Date(selectedInvite.editRequestedAt).toLocaleDateString() : 'Recently'}</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedInvite.status === 'approved' && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-medium text-green-700">Approval Details:</span>
                            <p className="text-green-900 mt-1">Seller approved with portal access</p>
                            {selectedInvite.sellerUsername && (
                              <p className="text-sm text-green-800 mt-1">Username: {selectedInvite.sellerUsername}</p>
                            )}
                          </div>
                          <span className="text-xs text-green-600">{selectedInvite.approvedAt ? new Date(selectedInvite.approvedAt).toLocaleDateString() : 'Recently'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Submitted Application</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedInvite.first_name} {selectedInvite.last_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedInvite.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedInvite.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                    <p className="text-sm text-gray-900">{selectedInvite.zip_code || 'Not provided'}</p>
                  </div>
                </div>
                
                {/* Profile Picture */}
                {selectedInvite.profile_picture_url && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                    <div className="w-24 h-24 rounded-lg overflow-hidden border">
                      <img 
                        src={selectedInvite.profile_picture_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/96/96';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Current Assignments */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Current Assignments</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-700">Organization Hub:</span>
                      <p className="text-gray-900">{selectedInvite.organizationHub || 'Not assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-700">Coupon Book:</span>
                      <p className="text-gray-900">{selectedInvite.couponBook || 'Not assigned'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Actions</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleEditProfile(selectedInvite)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => handleRequestEdits(selectedInvite)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Request Edits & Send Email
                  </button>
                  <button
                    onClick={() => handleApproveSeller(selectedInvite)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Approve & Send Email
                  </button>
                  <button
                    onClick={() => handleRejectSeller(selectedInvite)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject & Send Email
                  </button>
                  <button
                    onClick={() => setShowInviteDetails(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDeleteInvite(selectedInvite)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete Invite
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && editingInvite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Seller Profile</h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={editForm.zipCode}
                    onChange={(e) => setEditForm({...editForm, zipCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Hub</label>
                  <select
                    value={editForm.organizationHub}
                    onChange={(e) => setEditForm({...editForm, organizationHub: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Organization Hub</option>
                    {organizationalHubs.map((hub) => (
                      <option key={hub.id} value={hub.name}>{hub.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Book</label>
                  <select
                    value={editForm.couponBook}
                    onChange={(e) => setEditForm({...editForm, couponBook: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Coupon Book</option>
                    {couponBooks.map((book) => (
                      <option key={book.id} value={book.title}>{book.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Merchants Tab Component
function MerchantsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Add Merchant</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Merchant management functionality coming soon...</p>
      </div>
    </div>
  );
}

// Books Tab Component
function BooksTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Add Book</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Coupon book management functionality coming soon...</p>
      </div>
    </div>
  );
}

// Organizations Tab Component
function OrganizationsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Add Organization</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Organization management functionality coming soon...</p>
      </div>
    </div>
  );
}
