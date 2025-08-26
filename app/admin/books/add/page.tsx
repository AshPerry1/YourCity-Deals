'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  terms: string;
  isActive: boolean;
}

export default function AddCouponBook() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookData, setBookData] = useState({
    title: '',
    description: '',
    price: '',
    school: '',
    class: '',
    validFrom: '',
    validTo: '',
    totalOffers: 0,
    isActive: true
  });
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: '1',
      title: '',
      description: '',
      discount: '',
      terms: '',
      isActive: true
    }
  ]);

  const handleBookChange = (field: string, value: string | number | boolean) => {
    setBookData(prev => ({ ...prev, [field]: value }));
  };

  const handleOfferChange = (id: string, field: string, value: string | boolean) => {
    setOffers(prev => prev.map(offer => 
      offer.id === id ? { ...offer, [field]: value } : offer
    ));
  };

  const addOffer = () => {
    const newOffer: Offer = {
      id: Date.now().toString(),
      title: '',
      description: '',
      discount: '',
      terms: '',
      isActive: true
    };
    setOffers(prev => [...prev, newOffer]);
  };

  const removeOffer = (id: string) => {
    if (offers.length > 1) {
      setOffers(prev => prev.filter(offer => offer.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to books list
      router.push('/admin/books');
    } catch (error) {
      console.error('Error creating coupon book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/books"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Add New Coupon Book</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/admin/books"
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                form="coupon-book-form"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creating...' : 'Create Book'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="coupon-book-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Book Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Book Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  value={bookData.title}
                  onChange={(e) => handleBookChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Lincoln High School 2025 Coupon Book"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={bookData.price}
                    onChange={(e) => handleBookChange('price', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="25.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School *
                </label>
                <input
                  type="text"
                  required
                  value={bookData.school}
                  onChange={(e) => handleBookChange('school', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Lincoln High School"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class/Grade
                </label>
                <input
                  type="text"
                  value={bookData.class}
                  onChange={(e) => handleBookChange('class', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Senior Class of 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid From *
                </label>
                <input
                  type="date"
                  required
                  value={bookData.validFrom}
                  onChange={(e) => handleBookChange('validFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid To *
                </label>
                <input
                  type="date"
                  required
                  value={bookData.validTo}
                  onChange={(e) => handleBookChange('validTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={bookData.description}
                  onChange={(e) => handleBookChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Describe the coupon book and its benefits..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bookData.isActive}
                    onChange={(e) => handleBookChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active (available for purchase)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Offers Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Offers & Coupons</h2>
              <button
                type="button"
                onClick={addOffer}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Offer</span>
              </button>
            </div>

            <div className="space-y-6">
              {offers.map((offer, index) => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium text-gray-900">Offer #{index + 1}</h3>
                    {offers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOffer(offer.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offer Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={offer.title}
                        onChange={(e) => handleOfferChange(offer.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., 20% Off Pizza"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount/Deal *
                      </label>
                      <input
                        type="text"
                        required
                        value={offer.discount}
                        onChange={(e) => handleOfferChange(offer.id, 'discount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., 20% Off, Buy 1 Get 1 Free"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={offer.description}
                        onChange={(e) => handleOfferChange(offer.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Describe the offer details..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Terms & Conditions
                      </label>
                      <textarea
                        rows={2}
                        value={offer.terms}
                        onChange={(e) => handleOfferChange(offer.id, 'terms', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., Valid until December 31, 2025. Cannot be combined with other offers."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={offer.isActive}
                          onChange={(e) => handleOfferChange(offer.id, 'isActive', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Active offer</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Preview</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {bookData.title || 'Book Title'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {bookData.description || 'Book description will appear here...'}
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  ${bookData.price || '0.00'}
                </div>
              </div>
              
              {offers.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Offers ({offers.filter(o => o.isActive).length} active)</h4>
                  <div className="space-y-2">
                    {offers.map((offer, index) => (
                      <div key={offer.id} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <p className="font-medium text-gray-900">{offer.title || `Offer ${index + 1}`}</p>
                          <p className="text-sm text-gray-600">{offer.discount || 'Discount details'}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
