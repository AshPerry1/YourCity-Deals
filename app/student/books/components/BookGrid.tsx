'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface CouponBook {
  id: string;
  name: string;
  description: string;
  price: number;
  points: number;
  image_url?: string;
  school: { name: string };
  total_coupons: number;
  total_value: number;
}

export default function BookGrid() {
  const [books, setBooks] = useState<CouponBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<CouponBook | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        console.log('Fetching books from Supabase...');
        
        const { data, error } = await supabase
          .from('coupon_books')
          .select(`
            id,
            name,
            description,
            price,
            points,
            image_url,
            total_coupons,
            total_value
          `)
          .order('name');

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        // Transform the data to match the CouponBook interface
        const transformedData = (data || []).map(book => ({
          ...book,
          school: { name: 'Unknown School' } // We'll need to fetch school names separately
        }));
        
        console.log('Books fetched successfully:', transformedData);
        setBooks(transformedData);
      } catch (error) {
        console.error('Error fetching books:', error);
        
        // Fallback data for development/testing
        const fallbackBooks = [
          {
            id: '1',
            name: 'Local Business Coupon Book',
            description: 'Amazing deals from your favorite local businesses',
            price: 25.00,
            points: 15,
            image_url: undefined,
            total_coupons: 50,
            total_value: 500.00,
            school: { name: 'Lincoln High School' }
          },
          {
            id: '2',
            name: 'Restaurant & Entertainment',
            description: 'Save big on dining and fun activities',
            price: 20.00,
            points: 12,
            image_url: undefined,
            total_coupons: 35,
            total_value: 400.00,
            school: { name: 'Lincoln High School' }
          }
        ];
        
        setBooks(fallbackBooks);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  const handlePreview = (book: CouponBook) => {
    setSelectedBook(book);
  };

  const handleShare = async (book: CouponBook) => {
    const shareText = `Check out this amazing coupon book: ${book.name} - ${book.description}`;
    const shareUrl = `https://yourcitydeals.com/book/${book.id}?ref=STU-AB12CD`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
            <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Book Image */}
            <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              {book.image_url ? (
                <img 
                  src={book.image_url} 
                  alt={book.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-blue-900 font-medium">{book.name}</p>
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{book.description}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">${book.price}</p>
                  <p className="text-xs text-gray-600">Price</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{book.points || 0}</p>
                  <p className="text-xs text-gray-600">Points for School</p>
                </div>
              </div>

              {/* Value Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-semibold text-gray-900">${book.total_value}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Coupons:</span>
                  <span className="font-semibold text-gray-900">{book.total_coupons}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handlePreview(book)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Preview
                </button>
                <button
                  onClick={() => handleShare(book)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{selectedBook.name}</h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">{selectedBook.description}</p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">${selectedBook.price}</p>
                    <p className="text-xs text-blue-700">Price</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{selectedBook.points || 0}</p>
                    <p className="text-xs text-green-700">Points</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">{selectedBook.total_coupons}</p>
                    <p className="text-xs text-purple-700">Coupons</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">What's Inside:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {selectedBook.total_coupons} amazing deals</li>
                    <li>• Total value of ${selectedBook.total_value}</li>
                    <li>• Local and national brands</li>
                    <li>• Valid for 12 months</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleShare(selectedBook)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                  >
                    Share This Book
                  </button>
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
