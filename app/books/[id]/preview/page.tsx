'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Offer {
  id: string;
  bookId: string;
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

export default function BookPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showPurchasePrompt, setShowPurchasePrompt] = useState(false);
  const router = useRouter();

  const categories = ['all', 'restaurant', 'retail', 'entertainment', 'services', 'health'];

  useEffect(() => {
    // Handle async params
    const getParams = async () => {
      const resolvedParams = await params;
      loadBookData(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const loadBookData = (bookId: string) => {
    try {
      // Try to load from localStorage first
      const savedBooks = localStorage.getItem('yourcitydeals_books');
      const savedOffers = localStorage.getItem('yourcitydeals_offers');
      
      if (savedBooks && savedOffers) {
        const books = JSON.parse(savedBooks);
        const offers = JSON.parse(savedOffers);
        
        // Find the specific book by ID
        const book = books.find((b: BookDetails) => b.id === bookId);
        const bookOffers = offers.filter((o: Offer) => o.bookId === bookId);
        
        if (book && bookOffers.length > 0) {
          setBookDetails(book);
          setOffers(bookOffers);
          setFilteredOffers(bookOffers);
          setLoading(false);
          return;
        }
      }
      
      // If no localStorage data or book not found, use default data and save it
      const defaultBook: BookDetails = {
        id: bookId,
        title: 'Lincoln High School 2025 Coupon Book',
        description: 'Amazing discounts at the best local businesses. Save money while supporting your school!',
        school: 'Lincoln High School',
        price: 25,
        coverImage: '/api/placeholder/300/400',
        offersCount: 20,
        isActive: true,
        category: 'high',
        rating: 4.8,
        soldCount: 234,
        totalValue: 1250,
        savings: 450
      };

      const defaultOffers: Offer[] = [
        {
          id: '1',
          bookId: bookId,
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
          bookId: bookId,
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
          bookId: bookId,
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
          bookId: bookId,
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
          bookId: bookId,
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
          bookId: bookId,
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
        },
        {
          id: '7',
          bookId: bookId,
          title: '30% Off Pizza',
          description: 'Get 30% off any large pizza',
          businessName: 'Pizza Palace',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'percentage',
          discountValue: 30,
          originalPrice: 25,
          newPrice: 17.50,
          terms: 'Valid for delivery and pickup. Cannot be combined with other offers.',
          validUntil: '2024-12-31',
          category: 'restaurant',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '8',
          bookId: bookId,
          title: 'Free Coffee with Pastry',
          description: 'Get a free coffee with any pastry purchase',
          businessName: 'Sweet Treats Bakery',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'bogo',
          discountValue: 100,
          originalPrice: 4,
          newPrice: 0,
          terms: 'Valid for in-store purchases only. Must purchase pastry.',
          validUntil: '2024-12-31',
          category: 'restaurant',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '9',
          bookId: bookId,
          title: '$15 Off $75 Purchase',
          description: 'Save $15 on any purchase of $75 or more',
          businessName: 'Electronics Store',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'fixed',
          discountValue: 15,
          originalPrice: 75,
          newPrice: 60,
          terms: 'Valid for in-store purchases only. Cannot be combined with other offers.',
          validUntil: '2024-12-31',
          category: 'retail',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '10',
          bookId: bookId,
          title: 'Free Bowling Game',
          description: 'Get a free bowling game with shoe rental',
          businessName: 'Strike Zone Bowling',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'fixed',
          discountValue: 8,
          originalPrice: 8,
          newPrice: 0,
          terms: 'Valid for one free game. Must rent shoes separately.',
          validUntil: '2024-12-31',
          category: 'entertainment',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '11',
          bookId: bookId,
          title: '25% Off Haircut',
          description: 'Get 25% off any haircut service',
          businessName: 'Style Studio',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'percentage',
          discountValue: 25,
          originalPrice: 40,
          newPrice: 30,
          terms: 'Valid for haircuts only. Must book appointment in advance.',
          validUntil: '2024-12-31',
          category: 'services',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '12',
          bookId: bookId,
          title: 'Free Dental Cleaning',
          description: 'Get a free dental cleaning for new patients',
          businessName: 'Bright Smiles Dental',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'fixed',
          discountValue: 100,
          originalPrice: 100,
          newPrice: 0,
          terms: 'Valid for new patients only. Must schedule appointment.',
          validUntil: '2024-12-31',
          category: 'health',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '13',
          bookId: bookId,
          title: 'Buy One Get One 50% Off',
          description: 'Buy one item and get the second at 50% off',
          businessName: 'Shoe Store',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'percentage',
          discountValue: 50,
          originalPrice: 80,
          newPrice: 60,
          terms: 'Valid for any two items. Cannot be combined with other offers.',
          validUntil: '2024-12-31',
          category: 'retail',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '14',
          bookId: bookId,
          title: 'Free Ice Cream Cone',
          description: 'Get a free ice cream cone with any purchase',
          businessName: 'Cold Treats Ice Cream',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'fixed',
          discountValue: 5,
          originalPrice: 5,
          newPrice: 0,
          terms: 'Valid with any purchase. Cannot be combined with other offers.',
          validUntil: '2024-12-31',
          category: 'restaurant',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '15',
          bookId: bookId,
          title: '40% Off Massage',
          description: 'Get 40% off any massage service',
          businessName: 'Relaxation Spa',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'percentage',
          discountValue: 40,
          originalPrice: 80,
          newPrice: 48,
          terms: 'Valid for any massage service. Must book in advance.',
          validUntil: '2024-12-31',
          category: 'services',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '16',
          bookId: bookId,
          title: 'Free Movie Ticket',
          description: 'Get a free movie ticket with any concession purchase',
          businessName: 'Cinema Center',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'fixed',
          discountValue: 12,
          originalPrice: 12,
          newPrice: 0,
          terms: 'Valid with concession purchase. Cannot be combined with other offers.',
          validUntil: '2024-12-31',
          category: 'entertainment',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '17',
          bookId: bookId,
          title: '$20 Off $100 Purchase',
          description: 'Save $20 on any purchase of $100 or more',
          businessName: 'Home Improvement Store',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'fixed',
          discountValue: 20,
          originalPrice: 100,
          newPrice: 80,
          terms: 'Valid for in-store purchases only. Cannot be combined with other offers.',
          validUntil: '2024-12-31',
          category: 'retail',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '18',
          bookId: bookId,
          title: 'Free Yoga Class',
          description: 'Get a free yoga class for new members',
          businessName: 'Zen Yoga Studio',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'fixed',
          discountValue: 20,
          originalPrice: 20,
          newPrice: 0,
          terms: 'Valid for new members only. Must sign up for membership.',
          validUntil: '2024-12-31',
          category: 'health',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '19',
          bookId: bookId,
          title: '50% Off Second Entrée',
          description: 'Get 50% off your second entrée',
          businessName: 'Family Restaurant',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'percentage',
          discountValue: 50,
          originalPrice: 18,
          newPrice: 9,
          terms: 'Valid for dine-in only. Must order two entrées.',
          validUntil: '2024-12-31',
          category: 'restaurant',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        },
        {
          id: '20',
          bookId: bookId,
          title: 'Free Car Wash',
          description: 'Get a free car wash with any service',
          businessName: 'Quick Car Care',
          businessLogo: '/api/placeholder/50/50',
          discountType: 'fixed',
          discountValue: 15,
          originalPrice: 15,
          newPrice: 0,
          terms: 'Valid with any service purchase. Cannot be combined with other offers.',
          validUntil: '2024-12-31',
          category: 'services',
          heroImage: '/api/placeholder/300/200',
          isActive: true
        }
      ];

      // Save to localStorage
      const existingBooks = savedBooks ? JSON.parse(savedBooks) : [];
      const existingOffers = savedOffers ? JSON.parse(savedOffers) : [];
      
      // Check if book already exists, if not add it
      const bookExists = existingBooks.some((b: BookDetails) => b.id === bookId);
      if (!bookExists) {
        existingBooks.push(defaultBook);
        localStorage.setItem('yourcitydeals_books', JSON.stringify(existingBooks));
      }
      
      // Check if offers already exist, if not add them
      const offersExist = existingOffers.some((o: Offer) => o.bookId === bookId);
      if (!offersExist) {
        existingOffers.push(...defaultOffers);
        localStorage.setItem('yourcitydeals_offers', JSON.stringify(existingOffers));
      }

      setBookDetails(defaultBook);
      setOffers(defaultOffers);
      setFilteredOffers(defaultOffers);
      setLoading(false);
      
    } catch (error) {
      console.error('Error loading book data:', error);
      // Show book not found if there's an error
      setBookDetails(null);
      setOffers([]);
      setFilteredOffers([]);
      setLoading(false);
    }
  };

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
    router.push(`/purchase?book=${bookDetails?.id}`);
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
