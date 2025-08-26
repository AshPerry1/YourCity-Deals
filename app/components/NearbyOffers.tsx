'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NearbyOffer {
  id: string;
  title: string;
  business: string;
  businessAddress: string;
  businessCoordinates: {
    lat: number;
    lng: number;
  };
  discount: string;
  category: string;
  description: string;
  validFrom: string;
  validTo: string;
  bookTitle: string;
  school: string;
  distance: number;
}

interface NearbyOffersProps {
  userLocation: { lat: number; lng: number } | null;
  offers: NearbyOffer[];
  onLocationRequest: () => void;
}

export default function NearbyOffers({ userLocation, offers, onLocationRequest }: NearbyOffersProps) {
  const [nearbyOffers, setNearbyOffers] = useState<NearbyOffer[]>([]);
  const [maxDistance, setMaxDistance] = useState(10); // miles
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'expiry' | 'discount'>('distance');

  useEffect(() => {
    if (userLocation) {
      calculateDistances();
    }
  }, [userLocation, offers]);

  const calculateDistances = () => {
    if (!userLocation) return;

    const offersWithDistance = offers.map(offer => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        offer.businessCoordinates.lat,
        offer.businessCoordinates.lng
      );
      return { ...offer, distance };
    });

    // Filter by max distance and sort
    const filtered = offersWithDistance
      .filter(offer => offer.distance <= maxDistance)
      .sort((a, b) => {
        switch (sortBy) {
          case 'distance':
            return a.distance - b.distance;
          case 'expiry':
            return new Date(a.validTo).getTime() - new Date(b.validTo).getTime();
          case 'discount':
            // Extract numeric value from discount for sorting
            const aValue = extractDiscountValue(a.discount);
            const bValue = extractDiscountValue(b.discount);
            return bValue - aValue;
          default:
            return 0;
        }
      });

    setNearbyOffers(filtered);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
  };

  const extractDiscountValue = (discount: string): number => {
    const match = discount.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Automotive': 'bg-blue-100 text-blue-800',
      'Beauty & Wellness': 'bg-pink-100 text-pink-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Services': 'bg-gray-100 text-gray-800',
      'Health & Fitness': 'bg-green-100 text-green-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (validTo: string) => {
    const today = new Date();
    const expiry = new Date(validTo);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryColor = (days: number) => {
    if (days <= 7) return 'text-red-600';
    if (days <= 30) return 'text-orange-600';
    return 'text-green-600';
  };

  const categories = Array.from(new Set(offers.map(offer => offer.category))).sort();

  if (!userLocation) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Enable Location to See Nearby Offers</h3>
        <p className="text-gray-600 mb-4">We'll show you the best deals near your current location</p>
        <button
          onClick={onLocationRequest}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Enable Location
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Distance</label>
              <select
                value={maxDistance}
                onChange={(e) => {
                  setMaxDistance(Number(e.target.value));
                  setTimeout(calculateDistances, 100);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value={5}>5 miles</option>
                <option value={10}>10 miles</option>
                <option value={15}>15 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as 'distance' | 'expiry' | 'discount');
                  setTimeout(calculateDistances, 100);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="distance">Distance</option>
                <option value="expiry">Expiry Date</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">{nearbyOffers.length}</span> offers within {maxDistance} miles
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      {nearbyOffers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No offers nearby</h3>
          <p className="text-gray-600">Try increasing the distance or check back later for new deals</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyOffers
            .filter(offer => selectedCategory === 'all' || offer.category === selectedCategory)
            .map((offer) => {
              const daysUntilExpiry = getDaysUntilExpiry(offer.validTo);
              
              return (
                <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(offer.category)}`}>
                        {offer.category}
                      </span>
                      <span className={`text-xs font-medium ${getExpiryColor(daysUntilExpiry)}`}>
                        {daysUntilExpiry} days left
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{offer.business}</p>
                    <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Distance:</span>
                        <span className="font-medium text-blue-600">{offer.distance} miles</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {offer.businessAddress}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {offer.bookTitle}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xl font-bold text-blue-600">{offer.discount}</div>
                      <span className="text-xs text-gray-500">Valid until {formatDate(offer.validTo)}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link
                        href={`/purchaser/offers/${offer.id}`}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm text-center"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`https://maps.google.com/?q=${encodeURIComponent(offer.businessAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Map View Toggle */}
      <div className="text-center">
        <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          View on Map
        </button>
      </div>
    </div>
  );
}
