'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface School {
  id: string;
  name: string;
}

export default function AddBusinessForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact_email: '',
    school_id: '',
    merchant_pin: '',
  });

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

  const generateMerchantPin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setFormData(prev => ({ ...prev, merchant_pin: pin }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('businesses')
        .insert({
          name: formData.name,
          address: formData.address,
          contact_email: formData.contact_email,
          school_id: formData.school_id || null,
          merchant_pin_hash: formData.merchant_pin, // In production, this should be hashed
        });

      if (error) throw error;

      router.push('/admin/businesses');
    } catch (error) {
      console.error('Error adding business:', error);
      alert('Error adding business. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
        <p className="text-sm text-gray-600 mt-1">Fill in the details for your new merchant partner</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Business Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter business name"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter business address"
          />
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email *
          </label>
          <input
            type="email"
            id="contact_email"
            name="contact_email"
            required
            value={formData.contact_email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter contact email"
          />
        </div>

        {/* School Association */}
        <div>
          <label htmlFor="school_id" className="block text-sm font-medium text-gray-700 mb-2">
            Associated School (Optional)
          </label>
          <select
            id="school_id"
            name="school_id"
            value={formData.school_id}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="">Select a school (optional)</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Optional: Associate this business with a specific school
          </p>
        </div>

        {/* Merchant PIN */}
        <div>
          <label htmlFor="merchant_pin" className="block text-sm font-medium text-gray-700 mb-2">
            Merchant PIN *
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              id="merchant_pin"
              name="merchant_pin"
              required
              value={formData.merchant_pin}
              onChange={handleInputChange}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 font-mono"
              placeholder="4-digit PIN"
              maxLength={4}
              pattern="[0-9]{4}"
            />
            <button
              type="button"
              onClick={generateMerchantPin}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This PIN will be used by merchants to verify coupon redemptions
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <Link
            href="/admin/businesses"
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
                Adding Business...
              </div>
            ) : (
              'Add Business'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
