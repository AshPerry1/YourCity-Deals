'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface School {
  id: string;
  name: string;
}

interface CouponBook {
  id: string;
  title: string;
  description: string;
  school_id: string;
  price_cents: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  cover_image_url: string | null;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  stripe_payment_link_id: string | null;
  stripe_payment_link_url: string | null;
}

export default function EditCouponBook() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [book, setBook] = useState<CouponBook | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    school_id: '',
    price_cents: '',
    status: 'draft',
    start_date: '',
    end_date: '',
    cover_image_url: '',
  });
  const [showPriceConfirm, setShowPriceConfirm] = useState(false);
  const [priceChangeData, setPriceChangeData] = useState({
    oldPrice: 0,
    newPrice: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch schools
        const { data: schoolsData, error: schoolsError } = await supabase
          .from('schools')
          .select('id, name')
          .order('name');

        if (schoolsError) throw schoolsError;
        setSchools(schoolsData || []);

        // Fetch book data
        const { data: bookData, error: bookError } = await supabase
          .from('coupon_books')
          .select('*')
          .eq('id', bookId)
          .single();

        if (bookError) throw bookError;
        if (bookData) {
          setBook(bookData);
          setFormData({
            title: bookData.title,
            description: bookData.description || '',
            school_id: bookData.school_id,
            price_cents: (bookData.price_cents / 100).toString(),
            status: bookData.status,
            start_date: bookData.start_date || '',
            end_date: bookData.end_date || '',
            cover_image_url: bookData.cover_image_url || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error loading book data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [bookId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPriceCents = Math.round(parseFloat(formData.price_cents) * 100);
    const oldPriceCents = book?.price_cents || 0;
    
    // Check for significant price drop (>50%)
    if (newPriceCents < oldPriceCents * 0.5 && newPriceCents !== oldPriceCents) {
      setPriceChangeData({
        oldPrice: oldPriceCents / 100,
        newPrice: newPriceCents / 100,
      });
      setShowPriceConfirm(true);
      return;
    }
    
    await saveBook(newPriceCents);
  };

  const saveBook = async (newPriceCents: number) => {
    setSaving(true);
    
    try {
      const oldPriceCents = book?.price_cents || 0;
      const priceChanged = newPriceCents !== oldPriceCents;
      
      // Log price change if it occurred
      if (priceChanged && book) {
        const { error: logError } = await supabase
          .from('book_price_changes')
          .insert({
            book_id: book.id,
            from_cents: oldPriceCents,
            to_cents: newPriceCents,
            changed_by: (await supabase.auth.getUser()).data.user?.id,
          });
        
        if (logError) {
          console.error('Error logging price change:', logError);
        }
      }

      // Update book data
      const { error } = await supabase
        .from('coupon_books')
        .update({
          title: formData.title,
          description: formData.description,
          school_id: formData.school_id,
          price_cents: newPriceCents,
          status: formData.status,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          cover_image_url: formData.cover_image_url || null,
        })
        .eq('id', bookId);

      if (error) throw error;

      router.push('/admin/books');
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Error updating book. Please try again.');
    } finally {
      setSaving(false);
      setShowPriceConfirm(false);
    }
  };

  const confirmPriceChange = () => {
    const newPriceCents = Math.round(parseFloat(formData.price_cents) * 100);
    saveBook(newPriceCents);
  };

  const cancelPriceChange = () => {
    setShowPriceConfirm(false);
    // Reset price to original value
    if (book) {
      setFormData(prev => ({
        ...prev,
        price_cents: (book.price_cents / 100).toString(),
      }));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-6">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-red-600">Book not found</h2>
        <p className="text-gray-600 mt-2">The book you're looking for doesn't exist.</p>
        <Link
          href="/admin/books"
          className="mt-4 inline-block px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Edit Book</h2>
        <p className="text-sm text-gray-600 mt-1">Update book information and pricing</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Book Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter book title"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Describe what this coupon book offers..."
          />
        </div>

        {/* School */}
        <div>
          <label htmlFor="school_id" className="block text-sm font-medium text-gray-700 mb-2">
            School *
          </label>
          <select
            id="school_id"
            name="school_id"
            required
            value={formData.school_id}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="">Select a school</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price_cents" className="block text-sm font-medium text-gray-700 mb-2">
            Price (USD) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price_cents"
              name="price_cents"
              required
              value={formData.price_cents}
              onChange={handleInputChange}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="15.00"
              min="0"
              step="0.01"
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Live preview: <span className="font-medium text-blue-600">${formData.price_cents || '0.00'}</span>
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Cover Image URL */}
        <div>
          <label htmlFor="cover_image_url" className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            id="cover_image_url"
            name="cover_image_url"
            value={formData.cover_image_url}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Add a cover image URL for the coupon book
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <Link
            href="/admin/books"
            className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Book...
              </div>
            ) : (
              'Update Book'
            )}
          </button>
        </div>
      </form>

      {/* Price Change Confirmation Modal */}
      {showPriceConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Price Change</h3>
            <p className="text-gray-600 mb-4">
              You're about to change the price from <span className="font-medium">${priceChangeData.oldPrice.toFixed(2)}</span> to <span className="font-medium">${priceChangeData.newPrice.toFixed(2)}</span>.
            </p>
            <p className="text-red-600 text-sm mb-6">
              This is a significant price decrease. Are you sure you want to continue?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelPriceChange}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPriceChange}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
