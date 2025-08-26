'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import DeleteBookDialog from './components/DeleteBookDialog';
import { getOrganizerLabel } from '@/lib/organizer';

interface CouponBook {
  id: string;
  title: string;
  description: string;
  price_cents: number;
  status: 'draft' | 'active' | 'archived';
  school_id?: string;
  school?: {
    name: string;
  };
  organizer_type: 'school' | 'event' | 'neighborhood' | 'nonprofit' | 'business_group' | 'personal';
  organizer_name: string;
  organizer_external_id?: string;
  theme_primary?: string;
  theme_secondary?: string;
  referrals_enabled?: boolean;
  start_date: string | null;
  end_date: string | null;
  cover_image_url: string | null;
  _count?: {
    offers: number;
  };
}

export default function CouponBooksPage() {
  const [books, setBooks] = useState<CouponBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    bookId: string;
    bookTitle: string;
  }>({
    isOpen: false,
    bookId: '',
    bookTitle: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      const { data, error } = await supabase
        .from('coupon_books')
        .select(`
          *,
          school:schools(name),
          _count
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      // Use fallback data for development
      setBooks([
        {
          id: '1',
          title: 'Lincoln High School 2025 Coupon Book',
          description: 'Amazing deals from local businesses to support our school fundraising efforts.',
          price_cents: 2500,
          status: 'active',
          school_id: '1',
          school: { name: 'Lincoln High School' },
          organizer_type: 'school',
          organizer_name: 'Lincoln High School',
          theme_primary: '#3B82F6',
          theme_secondary: '#1E40AF',
          referrals_enabled: true,
          start_date: '2025-01-01',
          end_date: '2025-12-31',
          cover_image_url: null,
          _count: { offers: 8 }
        },
        {
          id: '2',
          title: 'SummerFest 2025 Local Deals',
          description: 'Support our annual summer festival while enjoying amazing local business discounts!',
          price_cents: 1500,
          status: 'active',
          organizer_type: 'event',
          organizer_name: 'SummerFest 2025',
          theme_primary: '#FF6B35',
          theme_secondary: '#D84315',
          referrals_enabled: true,
          start_date: '2025-06-01',
          end_date: '2025-08-31',
          cover_image_url: null,
          _count: { offers: 12 }
        },
        {
          id: '3',
          title: 'Maple Grove Community Savings',
          description: 'Exclusive deals for Maple Grove residents from our trusted local partners.',
          price_cents: 2000,
          status: 'draft',
          organizer_type: 'neighborhood',
          organizer_name: 'Maple Grove HOA',
          theme_primary: '#4CAF50',
          theme_secondary: '#2E7D32',
          referrals_enabled: false,
          start_date: '2025-01-01',
          end_date: '2025-12-31',
          cover_image_url: null,
          _count: { offers: 6 }
        },
        {
          id: '4',
          title: 'Community Care Foundation Supporters Pack',
          description: 'Help our nonprofit while discovering great local businesses in your area.',
          price_cents: 1200,
          status: 'active',
          organizer_type: 'nonprofit',
          organizer_name: 'Community Care Foundation',
          theme_primary: '#9C27B0',
          theme_secondary: '#6A1B9A',
          referrals_enabled: true,
          start_date: '2025-01-01',
          end_date: '2025-12-31',
          cover_image_url: null,
          _count: { offers: 9 }
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (bookId: string, bookTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      bookId,
      bookTitle
    });
  };

  const handleDeleteConfirm = async () => {
    const { bookId } = deleteDialog;
    setDeleting(bookId);
    
    try {
      // In real app, call API to delete
      // For now, just remove from local state
      setBooks(books.filter(book => book.id !== bookId));
      setDeleteDialog({ isOpen: false, bookId: '', bookTitle: '' });
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Error deleting book. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (status: CouponBook['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-600';
      case 'active':
        return 'bg-green-100 text-green-600';
      case 'archived':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coupon Books</h1>
            <p className="text-gray-600">Manage your digital coupon books</p>
          </div>
          <div className="animate-pulse">
            <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupon Books</h1>
          <p className="text-gray-600">Manage your digital coupon books</p>
        </div>
        <Link
          href="/admin/books/add"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Book
        </Link>
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
              <div 
                className="relative h-48 bg-gray-100"
                style={{
                  background: book.theme_primary ? 
                    `linear-gradient(135deg, ${book.theme_primary}20, ${book.theme_secondary || book.theme_primary}20)` :
                    undefined
                }}
              >
                {book.cover_image_url ? (
                  <img
                    src={book.cover_image_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                    <svg className="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                    {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{book.description || 'No description provided'}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {getOrganizerLabel(book.organizer_type)}: {book.organizer_name}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {book._count?.offers || 0} offers
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ${(book.price_cents / 100).toFixed(2)}
                    </div>
                    <div className="flex items-center space-x-2">
                      {book.referrals_enabled && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-lg">
                          Referrals
                        </span>
                      )}
                      <div className="flex space-x-1">
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: book.theme_primary }}
                          title="Primary color"
                        ></div>
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: book.theme_secondary }}
                          title="Secondary color"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <Link
                    href={`/admin/books/preview/${book.id}`}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    Preview
                  </Link>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/books/edit/${book.id}`}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(book.id, book.title)}
                      disabled={deleting === book.id}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === book.id ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </div>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="w-20 h-20 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No coupon books yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first coupon book</p>
          <Link
            href="/admin/books/add"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Your First Book
          </Link>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteBookDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, bookId: '', bookTitle: '' })}
        onConfirm={handleDeleteConfirm}
        bookTitle={deleteDialog.bookTitle}
        bookId={deleteDialog.bookId}
      />
    </div>
  );
}
