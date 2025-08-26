'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface School {
  id: string;
  name: string;
  classes?: { id: string; name: string }[];
}

export default function AddStudentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    school_id: '',
    class_id: '',
    ref_code: '',
    nfc_id: '',
  });

  useEffect(() => {
    async function fetchSchools() {
      try {
        const { data, error } = await supabase
          .from('schools')
          .select(`
            id,
            name,
            classes(id, name)
          `)
          .order('name');

        if (error) throw error;
        setSchools(data || []);
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    }

    fetchSchools();
  }, []);

  useEffect(() => {
    if (formData.school_id) {
      const selectedSchool = schools.find(s => s.id === formData.school_id);
      setClasses(selectedSchool?.classes || []);
      setFormData(prev => ({ ...prev, class_id: '' }));
    } else {
      setClasses([]);
    }
  }, [formData.school_id, schools]);

  const generateRefCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'STU-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, ref_code: result }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('students')
        .insert({
          first_name: formData.first_name,
          last_name: formData.last_name,
          school_id: formData.school_id,
          class_id: formData.class_id || null,
          ref_code: formData.ref_code,
          nfc_id: formData.nfc_id || null,
        });

      if (error) throw error;

      router.push('/admin/students');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student. Please try again.');
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
        <h2 className="text-xl font-semibold text-gray-900">Student Information</h2>
        <p className="text-sm text-gray-600 mt-1">Fill in the details for your new student seller</p>
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
              placeholder="Enter first name"
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
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* School Selection */}
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

        {/* Class Selection */}
        <div>
          <label htmlFor="class_id" className="block text-sm font-medium text-gray-700 mb-2">
            Class (Optional)
          </label>
          <select
            id="class_id"
            name="class_id"
            value={formData.class_id}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            disabled={!formData.school_id}
          >
            <option value="">Select a class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {!formData.school_id && (
            <p className="text-xs text-gray-500 mt-1">Please select a school first</p>
          )}
        </div>

        {/* Referral Code */}
        <div>
          <label htmlFor="ref_code" className="block text-sm font-medium text-gray-700 mb-2">
            Referral Code *
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              id="ref_code"
              name="ref_code"
              required
              value={formData.ref_code}
              onChange={handleInputChange}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 font-mono"
              placeholder="STU-XXXXXX"
            />
            <button
              type="button"
              onClick={generateRefCode}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This unique code will be used for tracking sales and referrals
          </p>
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
          <p className="text-xs text-gray-500 mt-1">
            Optional: Add NFC ID for physical card integration
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <Link
            href="/admin/students"
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
                Adding Student...
              </div>
            ) : (
              'Add Student'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
