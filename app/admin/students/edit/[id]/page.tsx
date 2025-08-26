'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface School {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  schoolId: string;
  class: string;
  grade: string;
  status: 'active' | 'inactive' | 'suspended';
  referralCode: string;
  notes: string;
}

export default function EditStudent() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentData, setStudentData] = useState<Student>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    schoolId: '',
    class: '',
    grade: '',
    status: 'active',
    referralCode: '',
    notes: ''
  });

  // Mock schools data - in real app, fetch from API
  const schools: School[] = [
    { id: '1', name: 'Lincoln High School', city: 'Lincoln', state: 'NE' },
    { id: '2', name: 'Washington Middle School', city: 'Lincoln', state: 'NE' },
    { id: '3', name: 'Elementary School', city: 'Lincoln', state: 'NE' },
    { id: '4', name: 'Central High School', city: 'Omaha', state: 'NE' },
    { id: '5', name: 'North High School', city: 'Lincoln', state: 'NE' }
  ];

  const grades = ['9th', '10th', '11th', '12th'];
  const classes = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock data - in real app, fetch from API using studentId
      const mockStudent: Student = {
        id: studentId,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 123-4567',
        schoolId: '1',
        class: 'Senior',
        grade: '12th',
        status: 'active',
        referralCode: 'SARAH-JO2025-ABC',
        notes: 'Excellent performer, very engaged with the program. Great at promoting deals to family and friends.'
      };
      
      setStudentData(mockStudent);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setStudentData(prev => ({ ...prev, [field]: value }));
  };

  const generateReferralCode = () => {
    const firstName = studentData.firstName.slice(0, 3).toUpperCase();
    const lastName = studentData.lastName.slice(0, 2).toUpperCase();
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    const code = `${firstName}-${lastName}${year}-${random}`;
    setStudentData(prev => ({ ...prev, referralCode: code }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to student detail page
      router.push(`/admin/students/${studentId}`);
    } catch (error) {
      console.error('Error updating student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = studentData.firstName && studentData.lastName && 
                     studentData.email && studentData.schoolId && 
                     studentData.class && studentData.grade;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/admin/students/${studentId}`}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">ID: {studentId}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/admin/students/${studentId}`}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                form="edit-student-form"
                disabled={!isFormValid || isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Updating...' : 'Update Student'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="edit-student-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Sarah"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Johnson"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={studentData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., sarah.johnson@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={studentData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* School Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">School Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School *
                </label>
                <select
                  required
                  value={studentData.schoolId}
                  onChange={(e) => handleChange('schoolId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select a school</option>
                  {schools.map(school => (
                    <option key={school.id} value={school.id}>
                      {school.name} - {school.city}, {school.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade *
                </label>
                <select
                  required
                  value={studentData.grade}
                  onChange={(e) => handleChange('grade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select grade</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                </label>
                <select
                  required
                  value={studentData.class}
                  onChange={(e) => handleChange('class', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={studentData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {studentData.status === 'suspended' && 'Suspended students cannot access the platform'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referral Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={studentData.referralCode}
                    onChange={(e) => handleChange('referralCode', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., SARAH-JO2025-ABC"
                  />
                  <button
                    type="button"
                    onClick={generateReferralCode}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Generate
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Customize or generate a new referral code
                </p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                rows={4}
                value={studentData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Any additional notes about the student..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Use this field to track important information, achievements, or special circumstances
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Student Preview</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-2xl">
                    {studentData.firstName && studentData.lastName 
                      ? `${studentData.firstName[0]}${studentData.lastName[0]}`
                      : '??'
                    }
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {studentData.firstName && studentData.lastName 
                    ? `${studentData.firstName} ${studentData.lastName}`
                    : 'Student Name'
                  }
                </h3>
                <p className="text-gray-600">
                  {studentData.email || 'email@example.com'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-500">School</div>
                  <div className="font-medium text-gray-900">
                    {schools.find(s => s.id === studentData.schoolId)?.name || 'Not selected'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Class</div>
                  <div className="font-medium text-gray-900">
                    {studentData.class || 'Not selected'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    studentData.status === 'active' ? 'bg-green-100 text-green-800' :
                    studentData.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {studentData.status.charAt(0).toUpperCase() + studentData.status.slice(1)}
                  </span>
                </div>
              </div>

              {studentData.referralCode && (
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-500 mb-2">Referral Code</div>
                  <div className="font-mono text-lg font-bold text-blue-600 bg-blue-100 px-4 py-2 rounded-lg">
                    {studentData.referralCode}
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
