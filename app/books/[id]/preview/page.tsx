'use client';
import { useState, useEffect, Suspense } from 'react';
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

function BookPreviewContent() {
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
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/"
                className="text-purple-600 hover:text-purple-700"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Book Preview</h1>
                <p className="text-sm sm:text-base text-gray-600">{bookDetails.title}</p>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-3">
              <button
                onClick={handlePurchase}
                className="bg-purple-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Book Details Section */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Book Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">School:</span>
                <p className="text-gray-900">{bookDetails.school}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Price:</span>
                <p className="text-gray-900">{formatCurrency(bookDetails.price)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Offers:</span>
                <p className="text-gray-900">{bookDetails.offersCount} amazing deals</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Valid Until:</span>
                <p className="text-gray-900">Dec 30, 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Offers Section */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sample Offers</h2>
            <div className="space-y-4">
              {filteredOffers.slice(0, 3).map((offer) => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{offer.businessName} - {offer.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{offer.terms}</p>
                    </div>
                    <div className="text-right ml-4">
                      <span className="text-lg font-bold text-green-600">
                        {offer.discountType === 'percentage' ? `${offer.discountValue}%` : formatCurrency(offer.discountValue)}
                      </span>
                      {offer.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">{formatCurrency(offer.originalPrice)}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ready to Purchase Section */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ready to Purchase?</h2>
            <p className="text-gray-600 mb-6">
              Get access to all {bookDetails.offersCount} amazing offers and support local community initiatives!
            </p>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close Preview
              </Link>
              <button
                onClick={handlePurchase}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up to Buy
              </button>
            </div>
          </div>
         </div>
       </div>
     </div>
   );
}

export default function BookPreview() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookPreviewContent />
    </Suspense>
  );
}
