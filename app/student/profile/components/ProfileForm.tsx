'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  ref_code: string;
  nfc_id: string;
  school?: { name: string };
  class?: { name: string };
}

export default function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    ref_code: '',
    nfc_id: '',
  });

  useEffect(() => {
    async function fetchStudentData() {
      try {
        // In a real app, you'd get the student ID from auth context
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('students')
            .select(`
              id,
              first_name,
              last_name,
              email,
              phone,
              ref_code,
              nfc_id
            `)
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          
          // Transform the data to match the Student interface
          const transformedData = {
            ...data,
            school: { name: 'Unknown School' }, // We'll need to fetch school names separately
            class: { name: 'Unknown Class' }    // We'll need to fetch class names separately
          };
          
          setStudent(transformedData);
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            ref_code: data.ref_code || '',
            nfc_id: data.nfc_id || '',
          });
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }

    fetchStudentData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('students')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          nfc_id: formData.nfc_id || null,
        })
        .eq('id', student?.id);

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        <p className="text-sm text-gray-600 mt-1">Update your personal details</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              required
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* School Information */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">School Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">School</label>
              <p className="text-sm font-medium text-gray-900">{student?.school?.name || 'Not assigned'}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Class</label>
              <p className="text-sm font-medium text-gray-900">{student?.class?.name || 'Not assigned'}</p>
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div>
          <label htmlFor="ref_code" className="block text-sm font-medium text-gray-700 mb-2">
            Referral Code
          </label>
          <input
            type="text"
            id="ref_code"
            name="ref_code"
            value={formData.ref_code}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">This is your unique referral code and cannot be changed</p>
        </div>

        {/* NFC ID */}
        <div>
          <label htmlFor="nfc_id" className="block text-sm font-medium text-gray-700 mb-2">
            NFC ID (Optional)
          </label>
          <input
            type="text"
            id="nfc_id"
            name="nfc_id"
            value={formData.nfc_id}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter NFC ID for physical cards"
          />
          <p className="text-xs text-gray-500 mt-1">Optional: Add NFC ID for physical card integration</p>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Profile...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
