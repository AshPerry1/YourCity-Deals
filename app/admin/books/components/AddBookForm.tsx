'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { 
  OrganizerType, 
  getOrganizerTypeOptions, 
  getOrganizerCopy, 
  getDefaultTheme, 
  shouldShowLeaderboards 
} from '@/lib/organizer';

interface School {
  id: string;
  name: string;
}

export default function AddBookForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    school_id: '',
    organizer_type: 'school' as OrganizerType,
    organizer_name: '',
    organizer_external_id: '',
    price_cents: '15.00',
    theme_primary: '#3B82F6',
    theme_secondary: '#1E40AF',
    referrals_enabled: false,
    status: 'draft',
    start_date: '',
    end_date: '',
    cover_image_url: '',
  });

  // Auto-update theme colors when organizer type changes
  useEffect(() => {
    const defaultTheme = getDefaultTheme(formData.organizer_type);
    setFormData(prev => ({
      ...prev,
      theme_primary: defaultTheme.primary,
      theme_secondary: defaultTheme.secondary,
      referrals_enabled: shouldShowLeaderboards(formData.organizer_type),
      // Auto-generate title if empty
      title: !prev.title && prev.organizer_name ? 
        getOrganizerCopy(formData.organizer_type, prev.organizer_name).defaultTitle : 
        prev.title
    }));
  }, [formData.organizer_type, formData.organizer_name]);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('id, name')
          .order('name');

        if (error) throw error;
        setSchools(data || []);
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    }

    fetchSchools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/books/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          school_id: formData.organizer_type === 'school' ? formData.school_id : null,
          organizer_type: formData.organizer_type,
          organizer_name: formData.organizer_name,
          organizer_external_id: formData.organizer_external_id || null,
          price_cents: formData.price_cents,
          theme_primary: formData.theme_primary,
          theme_secondary: formData.theme_secondary,
          referrals_enabled: formData.referrals_enabled,
          status: formData.status,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          cover_image_url: formData.cover_image_url || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create book');
      }

      console.log('Book created successfully:', result);
      router.push('/admin/books');
    } catch (error: any) {
      console.error('Error adding book:', error);
      alert(error.message || 'Error adding book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Book Information</h2>
        <p className="text-sm text-gray-600 mt-1">Fill in the details for your new coupon book</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Organizer Type */}
        <div>
          <label htmlFor="organizer_type" className="block text-sm font-medium text-gray-700 mb-2">
            Organizer Type *
          </label>
          <select
            id="organizer_type"
            name="organizer_type"
            required
            value={formData.organizer_type}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            {getOrganizerTypeOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
        </div>

        {/* Organizer Name */}
        <div>
          <label htmlFor="organizer_name" className="block text-sm font-medium text-gray-700 mb-2">
            Organizer Name *
          </label>
          <input
            type="text"
            id="organizer_name"
            name="organizer_name"
            required
            value={formData.organizer_name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder={
              formData.organizer_type === 'event' ? 'e.g., SummerFest 2025' :
              formData.organizer_type === 'neighborhood' ? 'e.g., Maple Grove HOA' :
              formData.organizer_type === 'nonprofit' ? 'e.g., Community Care Foundation' :
              formData.organizer_type === 'business_group' ? 'e.g., Downtown Merchants' :
              formData.organizer_type === 'personal' ? 'e.g., Sarah\'s Favorites' :
              'e.g., Lincoln High School'
            }
          />
        </div>

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
            placeholder={
              formData.organizer_name ? 
                getOrganizerCopy(formData.organizer_type, formData.organizer_name).defaultTitle :
                "Enter book title"
            }
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

        {/* School (only for school organizer type) */}
        {formData.organizer_type === 'school' && (
          <div>
            <label htmlFor="school_id" className="block text-sm font-medium text-gray-700 mb-2">
              School *
            </label>
            <select
              id="school_id"
              name="school_id"
              required={formData.organizer_type === 'school'}
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
        )}

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

        {/* Theme Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="theme_primary" className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                id="theme_primary"
                name="theme_primary"
                value={formData.theme_primary}
                onChange={handleInputChange}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.theme_primary}
                onChange={(e) => setFormData(prev => ({ ...prev, theme_primary: e.target.value }))}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="#3B82F6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="theme_secondary" className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                id="theme_secondary"
                name="theme_secondary"
                value={formData.theme_secondary}
                onChange={handleInputChange}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.theme_secondary}
                onChange={(e) => setFormData(prev => ({ ...prev, theme_secondary: e.target.value }))}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="#1E40AF"
              />
            </div>
          </div>
        </div>

        {/* Referrals Toggle */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="referrals_enabled" className="block text-sm font-medium text-gray-700">
                Enable Referrals & Leaderboards
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Allow promoters to track their sales and show leaderboards
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="referrals_enabled"
                name="referrals_enabled"
                checked={formData.referrals_enabled}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
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
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Book...
              </div>
            ) : (
              'Create Book'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
