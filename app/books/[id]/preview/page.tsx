'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Offer {
  id: string;
  title: string;
  description: string;
  businessName: string;
  businessLogo: string;
  discountType: 'percentage' | 'fixed' | 'bogo';
  discountValue: number;
  originalPrice?: number;
  newPrice?: number;
  terms: string;
  validUntil: string;
  category: string;
  heroImage: string;
  isActive: boolean;
}

interface BookDetails {
  id: string;
  title: string;
  description: string;
  school: string;
  price: number;
  coverImage: string;
  offersCount: number;
  isActive: boolean;
  category: string;
  rating: number;
  soldCount: number;
  totalValue: number;
  savings: number;
}

export default function BookPreview() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const bookId = params.id as string;
  const refCode = searchParams.get('ref');
  
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showPurchasePrompt, setShowPurchasePrompt] = useState(false);

  const categories = ['all', 'restaurant', 'retail', 'entertainment', 'services', 'health'];

  useEffect(() => {
    // Simulate loading book and offers data
    setTimeout(() => {
      const mockBook: BookDetails = {
        id: bookId,
        title: 'Birmingham Restaurant Deals',
        description: 'Amazing discounts at the best local restaurants in Birmingham. Save money while supporting local businesses!',
        school: 'Mountain Brook High School',
        price: 25,
        coverImage: '/api/placeholder/300/400',
        offersCount: 45,
        isActive: true,
        category: 'restaurant',
        rating: 4.8,
        soldCount: 234,
        totalValue: 1250,
        savings: 450
      };

      const mockOffers: Offer[] = [
        {
          id: '1',
          title: '20% Off Any Purchase',
          description: 'Get 20% off your entire bill at any participating restaurant',
          businessName: 'Local Italian Restaurant',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'percentage',
          discountValue: 20,
          terms: 'Valid for dine-in only. Cannot be combined with other offers. Expires 12/31/2024.',
          validUntil: '2024-12-31',
          category: 'restaurant',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '2',
          title: 'Free Appetizer',
          description: 'Get a free appetizer with any entrée purchase',
          businessName: 'Downtown Grill',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'bogo',
          discountValue: 100,
          originalPrice: 15,
          newPrice: 0,
          terms: 'Valid for dine-in only. Must purchase entrée. Expires 12/31/2024.',
          validUntil: '2024-12-31',
          category: 'restaurant',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '3',
          title: '$10 Off $50 Purchase',
          description: 'Save $10 on any purchase of $50 or more',
          businessName: 'Fashion Boutique',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'fixed',
          discountValue: 10,
          originalPrice: 50,
          newPrice: 40,
          terms: 'Valid for in-store purchases only. Cannot be combined with other offers.',
          validUntil: '2024-12-31',
          category: 'retail',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '4',
          title: 'Buy One Get One Free',
          description: 'Buy any item and get the second one free',
          businessName: 'Movie Theater',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'bogo',
          discountValue: 100,
          originalPrice: 12,
          newPrice: 12,
          terms: 'Valid for movie tickets only. Cannot be combined with other offers.',
          validUntil: '2024-12-31',
          category: 'entertainment',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '5',
          title: '50% Off First Session',
          description: 'Get 50% off your first tutoring session',
          businessName: 'Academic Excellence',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'percentage',
          discountValue: 50,
          originalPrice: 60,
          newPrice: 30,
          terms: 'Valid for first-time customers only. Must book in advance.',
          validUntil: '2024-12-31',
          category: 'services',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '6',
          title: 'Free Gym Membership',
          description: 'Get one month of free gym membership',
          businessName: 'Fitness Center',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'fixed',
          discountValue: 50,
          originalPrice: 50,
          newPrice: 0,
          terms: 'Valid for new members only. Must sign up for at least 3 months.',
          validUntil: '2024-12-31',
          category: 'health',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        }
      ];

      setBookDetails(mockBook);
      setOffers(mockOffers);
      setFilteredOffers(mockOffers);
      setLoading(false);
    }, 1000);
  }, [bookId]);

  useEffect(() => {
    let filtered = offers.filter(offer => offer.isActive);

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.businessName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(offer => offer.category === selectedCategory);
    }

    setFilteredOffers(filtered);
  }, [offers, searchTerm, selectedCategory]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handlePurchase = () => {
    const purchaseUrl = refCode 
      ? `/purchase?book=${bookId}&ref=${refCode}`
      : `/purchase?book=${bookId}`;
    router.push(purchaseUrl);
  };

  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
  };

  const closeOfferModal = () => {
    setSelectedOffer(null);
  };

  const handleGetRedemptionCode = () => {
    setShowPurchasePrompt(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book preview...</p>
        </div>
      </div>
    );
  }

  if (!bookDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h2>
          <p className="text-gray-600 mb-6">The book you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-purple-600 hover:text-purple-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Book Preview</h1>
                <p className="text-gray-600">{bookDetails.title}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handlePurchase}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Buy Now - {formatCurrency(bookDetails.price)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Preview Mode:</strong> This is a preview of the offers in this book. Purchase the book to get your unique redemption codes and start saving!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Book Overview */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-24 h-24 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{bookDetails.title}</h2>
                <p className="text-gray-600 mb-6">{bookDetails.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{bookDetails.offersCount}</p>
                    <p className="text-sm text-gray-600">Total Offers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(bookDetails.totalValue)}</p>
                    <p className="text-sm text-gray-600">Total Value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(bookDetails.savings)}</p>
                    <p className="text-sm text-gray-600">Total Savings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{bookDetails.soldCount}</p>
                    <p className="text-sm text-gray-600">Books Sold</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(bookDetails.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({bookDetails.rating})</span>
                  </div>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{bookDetails.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1 max-w-md">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Offers
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by offer, business, or description..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredOffers.length} of {offers.length} offers
            </div>
          </div>
        </div>

        {/* Offers Grid/List */}
        {filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => handleOfferClick(offer)}
                className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${
                  viewMode === 'list' ? 'flex items-center p-6' : 'p-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
                      <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{offer.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{offer.businessName}</p>
                        <p className="text-sm text-gray-500">{offer.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {offer.discountType === 'percentage' ? `${offer.discountValue}%` : formatCurrency(offer.discountValue)}
                        </p>
                        {offer.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">{formatCurrency(offer.originalPrice)}</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="ml-6 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{offer.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{offer.businessName}</p>
                          <p className="text-sm text-gray-500">{offer.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {offer.discountType === 'percentage' ? `${offer.discountValue}%` : formatCurrency(offer.discountValue)}
                          </p>
                          {offer.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">{formatCurrency(offer.originalPrice)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Purchase CTA */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Saving?</h3>
          <p className="text-gray-600 mb-6">
            Purchase this book for {formatCurrency(bookDetails.price)} and get access to all {bookDetails.offersCount} offers with unique redemption codes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePurchase}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
            >
              Buy Now - {formatCurrency(bookDetails.price)}
            </button>
            <Link
              href="/"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors text-lg font-semibold"
            >
              Browse Other Books
            </Link>
          </div>
        </div>
      </div>

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedOffer.title}</h2>
                <button
                  onClick={closeOfferModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-24 h-24 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedOffer.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Business</h3>
                    <p className="text-gray-600">{selectedOffer.businessName}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                    <p className="text-gray-600 capitalize">{selectedOffer.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Discount</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedOffer.discountType === 'percentage' ? `${selectedOffer.discountValue}%` : formatCurrency(selectedOffer.discountValue)}
                    </p>
                    {selectedOffer.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">{formatCurrency(selectedOffer.originalPrice)}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Valid Until</h3>
                    <p className="text-gray-600">{selectedOffer.validUntil}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
                  <p className="text-gray-600 text-sm">{selectedOffer.terms}</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Preview Mode:</strong> Purchase the book to get your unique redemption code for this offer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={closeOfferModal}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handlePurchase}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Purchase Book to Get Redemption Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
