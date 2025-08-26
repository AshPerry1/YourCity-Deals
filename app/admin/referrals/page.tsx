'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ReferralLink {
  id: string;
  code: string;
  studentName: string;
  schoolName: string;
  schoolId: string;
  createdAt: string;
  clicks: number;
  conversions: number;
  totalRevenue: number;
  status: 'active' | 'inactive';
  url: string;
}

export default function ReferralsPage() {
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const router = useRouter();

  // Mock data - in real app, fetch from API
  const schools = [
    { id: 'school-1', name: 'Mountain Brook High School' },
    { id: 'school-2', name: 'Vestavia Hills High School' },
    { id: 'school-3', name: 'Homewood High School' },
  ];

  const students = [
    { id: 'student-1', name: 'John Smith', schoolId: 'school-1' },
    { id: 'student-2', name: 'Sarah Johnson', schoolId: 'school-1' },
    { id: 'student-3', name: 'Mike Davis', schoolId: 'school-2' },
  ];

  useEffect(() => {
    fetchReferralLinks();
  }, []);

  const fetchReferralLinks = async () => {
    // Mock data - in real app, fetch from API
    const mockLinks: ReferralLink[] = [
      {
        id: '1',
        code: 'ABC123',
        studentName: 'John Smith',
        schoolName: 'Mountain Brook High School',
        schoolId: 'school-1',
        createdAt: '2025-01-15',
        clicks: 45,
        conversions: 8,
        totalRevenue: 20000, // $200.00
        status: 'active',
        url: 'https://yourcitydeals.com/ref/ABC123'
      },
      {
        id: '2',
        code: 'DEF456',
        studentName: 'Sarah Johnson',
        schoolName: 'Mountain Brook High School',
        schoolId: 'school-1',
        createdAt: '2025-01-10',
        clicks: 32,
        conversions: 5,
        totalRevenue: 12500, // $125.00
        status: 'active',
        url: 'https://yourcitydeals.com/ref/DEF456'
      }
    ];

    setReferralLinks(mockLinks);
    setLoading(false);
  };

  const generateReferralLink = async () => {
    if (!selectedSchool || !selectedStudent) {
      alert('Please select both a school and student');
      return;
    }

    setGenerating(true);

    try {
      // In real app, call API to generate referral link
      const student = students.find(s => s.id === selectedStudent);
      const school = schools.find(s => s.id === selectedSchool);
      
      if (!student || !school) {
        alert('Invalid selection');
        return;
      }

      // Generate unique code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const url = `https://yourcitydeals.com/ref/${code}`;

      const newLink: ReferralLink = {
        id: Date.now().toString(),
        code,
        studentName: student.name,
        schoolName: school.name,
        schoolId: selectedSchool,
        createdAt: new Date().toISOString().split('T')[0],
        clicks: 0,
        conversions: 0,
        totalRevenue: 0,
        status: 'active',
        url
      };

      setReferralLinks(prev => [newLink, ...prev]);
      
      // Reset form
      setSelectedSchool('');
      setSelectedStudent('');
      
      alert(`Referral link generated: ${url}`);
    } catch (error) {
      alert('Failed to generate referral link');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const getFilteredStudents = () => {
    if (!selectedSchool) return students;
    return students.filter(student => student.schoolId === selectedSchool);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading referral links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Links</h1>
          <p className="text-gray-600">Generate and manage referral links for students</p>
        </div>

        {/* Generate New Link */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate New Referral Link</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select School
              </label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a school...</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedSchool}
              >
                <option value="">Choose a student...</option>
                {getFilteredStudents().map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={generateReferralLink}
            disabled={generating || !selectedSchool || !selectedStudent}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating...' : 'Generate Referral Link'}
          </button>
        </div>

        {/* Referral Links Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active Referral Links</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referralLinks.map((link) => (
                  <tr key={link.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{link.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{link.studentName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{link.schoolName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{link.clicks}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{link.conversions}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        ${(link.totalRevenue / 100).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => copyToClipboard(link.url)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => window.open(link.url, '_blank')}
                        className="text-green-600 hover:text-green-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Links</h3>
            <p className="text-3xl font-bold text-blue-600">{referralLinks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Clicks</h3>
            <p className="text-3xl font-bold text-green-600">
              {referralLinks.reduce((sum, link) => sum + link.clicks, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Conversions</h3>
            <p className="text-3xl font-bold text-purple-600">
              {referralLinks.reduce((sum, link) => sum + link.conversions, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-orange-600">
              ${(referralLinks.reduce((sum, link) => sum + link.totalRevenue, 0) / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
