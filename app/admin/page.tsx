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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('=== LOADING DASHBOARD DATA ===');
      
      // Load seller invites from Supabase
      let { data: invites, error: invitesError } = await supabase
        .from('seller_invites')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data: invites, error: invitesError });
      console.log('Raw Supabase data:', invites);

      if (invitesError) {
        console.error('Error loading invites from Supabase:', invitesError);
        // Fallback to localStorage
        const savedInvites = localStorage.getItem('yourcitydeals_seller_invites');
        invites = savedInvites ? JSON.parse(savedInvites) : [];
        console.log('Using localStorage fallback:', invites);
      } else {
        console.log('Successfully loaded from Supabase:', invites);
        console.log('Total invites loaded:', invites?.length || 0);
        
        // Always use Supabase data - it's the source of truth
        console.log('Updating state with Supabase data');
        console.log('Data to set:', invites);
        setSellerInvites(invites || []);
        console.log('State updated, new length should be:', invites?.length || 0);
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
      
      setOrganizationalHubs(hubs || []);
      setCouponBooks(books || []);
      setLoading(false);
      
      console.log('=== DASHBOARD DATA LOADED ===');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

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

    try {
      console.log('=== CREATING NEW INVITE ===');
      console.log('Form data:', inviteForm);

      // Check for duplicate email in Supabase
      const { data: existingInvite, error: checkError } = await supabase
        .from('seller_invites')
        .select('*')
        .eq('email', inviteForm.email.toLowerCase())
        .single();

      console.log('Duplicate check result:', { existingInvite, checkError });

      if (existingInvite && !checkError) {
        alert('An invite with this email already exists');
        return;
      }

      const inviteToken = generateInviteToken();
      console.log('Generated token:', inviteToken);

      const newInvite = {
        token: inviteToken,
        first_name: inviteForm.firstName,
        last_name: inviteForm.lastName,
        email: inviteForm.email,
        status: 'pending',
        organization_hub: inviteForm.organizationHub || null,
        coupon_book: inviteForm.couponBook || null,
        sent_at: new Date().toISOString(),
        email_sent: true,
        link_clicked: false,
        profile_completed: false,
        phone: null,
        zip_code: null,
        profile_picture_url: null
      };

      console.log('Saving invite to Supabase:', newInvite);

      // Save to Supabase
      const { data: savedInvite, error: saveError } = await supabase
        .from('seller_invites')
        .insert(newInvite)
        .select()
        .single();

      console.log('Supabase save result:', { savedInvite, saveError });
      console.log('Save error details:', saveError);
      console.log('Saved invite details:', savedInvite);

      if (saveError) {
        console.error('Error saving invite to Supabase:', saveError);
        console.error('Error code:', saveError.code);
        console.error('Error message:', saveError.message);
        console.error('Error details:', saveError.details);
        alert('Failed to create invite. Please try again.');
        return;
      }

      console.log('Invite saved to Supabase successfully:', savedInvite);

      // Update local state immediately
      const updatedInvites = [savedInvite, ...sellerInvites];
      console.log('Updating local state with:', updatedInvites);
      setSellerInvites(updatedInvites);
      console.log('Local state updated, new length:', updatedInvites.length);

      // Also save to localStorage as fallback
      localStorage.setItem('yourcitydeals_seller_invites', JSON.stringify(updatedInvites));
      console.log('Saved to localStorage as fallback');

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

      alert(`Invite created successfully! Token: ${inviteToken}`);
      console.log('=== INVITE CREATION COMPLETED ===');

    } catch (error) {
      console.error('Error in handleCreateInvite:', error);
      alert('Failed to create invite. Please try again.');
    }
  };

  const handleTestDatabaseConnection = async () => {
    try {
      console.log('=== TESTING DATABASE CONNECTION ===');
      
      // Test 1: Try to insert a test record
      const testInvite = {
        token: 'TEST-CONNECTION-' + Date.now(),
        first_name: 'Test',
        last_name: 'Connection',
        email: 'test@connection.com',
        status: 'pending',
        sent_at: new Date().toISOString(),
        email_sent: true
      };

      console.log('Attempting to insert test invite:', testInvite);
      
      const { data: insertedData, error: insertError } = await supabase
        .from('seller_invites')
        .insert(testInvite)
        .select()
        .single();

      console.log('Insert result:', { data: insertedData, error: insertError });

      if (insertError) {
        console.error('Insert failed:', insertError);
        alert(`Database connection test failed: ${insertError.message}`);
        return;
      }

      // Test 2: Try to read the record back
      const { data: readData, error: readError } = await supabase
        .from('seller_invites')
        .select('*')
        .eq('token', testInvite.token)
        .single();

      console.log('Read result:', { data: readData, error: readError });

      if (readError) {
        console.error('Read failed:', readError);
        alert(`Database read test failed: ${readError.message}`);
        return;
      }

      // Test 3: Clean up the test record
      const { error: deleteError } = await supabase
        .from('seller_invites')
        .delete()
        .eq('token', testInvite.token);

      if (deleteError) {
        console.error('Delete failed:', deleteError);
        alert(`Database delete test failed: ${deleteError.message}`);
        return;
      }

      alert('Database connection test successful! All operations (insert, read, delete) worked.');
      console.log('=== DATABASE CONNECTION TEST COMPLETED ===');

    } catch (error) {
      console.error('Database connection test error:', error);
      alert(`Database connection test failed: ${error}`);
    }
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
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('invites')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invites'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Seller Invites
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'approvals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Seller Approvals
              {readyForReviewInvites.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {readyForReviewInvites.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'invites' && (
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
                  onClick={handleTestDatabaseConnection}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Test Database
                </button>
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
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Organization
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Coupon Book
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Sent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredInvites.map((invite) => (
                        <tr key={invite.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {invite.first_name} {invite.last_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{invite.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{invite.organization_hub || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{invite.coupon_book || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 inline-flex text-xs font-semibold rounded-full ${
                              invite.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              invite.status === 'ready_for_review' ? 'bg-blue-100 text-blue-800' :
                              invite.status === 'approved' ? 'bg-green-100 text-green-800' :
                              invite.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {invite.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invite.sent_at ? new Date(invite.sent_at).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              View Details
                            </button>
                            <button className="text-red-600 hover:text-red-900">
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
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Seller Approvals</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {readyForReviewInvites.length} ready for review
              </span>
            </div>

            {readyForReviewInvites.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No approvals needed</h3>
                <p className="mt-1 text-sm text-gray-500">
                  All seller applications have been reviewed.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ZIP Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {readyForReviewInvites.map((invite) => (
                        <tr key={invite.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {invite.first_name} {invite.last_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{invite.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{invite.phone || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{invite.zip_code || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-green-600 hover:text-green-900 mr-3">
                              Approve
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                              Request Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invite Form Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Invite New Seller</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateInvite(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                    <input
                      type="text"
                      value={inviteForm.firstName}
                      onChange={(e) => setInviteForm({...inviteForm, firstName: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      value={inviteForm.lastName}
                      onChange={(e) => setInviteForm({...inviteForm, lastName: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organization Hub</label>
                    <select
                      value={inviteForm.organizationHub}
                      onChange={(e) => setInviteForm({...inviteForm, organizationHub: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Organization</option>
                      {organizationalHubs.map((hub) => (
                        <option key={hub.id} value={hub.name}>{hub.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Coupon Book</label>
                    <select
                      value={inviteForm.couponBook}
                      onChange={(e) => setInviteForm({...inviteForm, couponBook: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Coupon Book</option>
                      {couponBooks.map((book) => (
                        <option key={book.id} value={book.title}>{book.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Send Invite
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
