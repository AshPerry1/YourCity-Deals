'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  class: string;
  grade: string;
  status: 'active' | 'inactive' | 'suspended';
  totalPoints: number;
  booksSold: number;
  couponsRedeemed: number;
  conversionRate: number;
  referralCode: string;
  joinedDate: string;
  lastActive: string;
  notes: string;
}

interface SaleRecord {
  id: string;
  date: string;
  bookTitle: string;
  customerEmail: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
}

interface CouponRedemption {
  id: string;
  date: string;
  offerTitle: string;
  customerEmail: string;
  discount: string;
  business: string;
}

export default function StudentDetail() {
  const params = useParams();
  const studentId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>([]);
  const [couponRedemptions, setCouponRedemptions] = useState<CouponRedemption[]>([]);

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock student data
      const mockStudent: Student = {
        id: studentId,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 123-4567',
        school: 'Lincoln High School',
        class: 'Senior',
        grade: '12th',
        status: 'active',
        totalPoints: 2450,
        booksSold: 23,
        couponsRedeemed: 156,
        conversionRate: 72,
        referralCode: 'SARAH-JO2025-ABC',
        joinedDate: '2024-09-01',
        lastActive: '2025-01-15',
        notes: 'Excellent performer, very engaged with the program. Great at promoting deals to family and friends.'
      };

      // Mock sales records
      const mockSales: SaleRecord[] = [
        {
          id: '1',
          date: '2025-01-15',
          bookTitle: 'Lincoln High School 2025 Coupon Book',
          customerEmail: 'john.doe@email.com',
          amount: 25.00,
          status: 'completed'
        },
        {
          id: '2',
          date: '2025-01-14',
          bookTitle: 'Lincoln High School 2025 Coupon Book',
          customerEmail: 'jane.smith@email.com',
          amount: 25.00,
          status: 'completed'
        },
        {
          id: '3',
          date: '2025-01-13',
          bookTitle: 'Lincoln High School 2025 Coupon Book',
          customerEmail: 'bob.wilson@email.com',
          amount: 25.00,
          status: 'completed'
        }
      ];

      // Mock coupon redemptions
      const mockRedemptions: CouponRedemption[] = [
        {
          id: '1',
          date: '2025-01-15',
          offerTitle: '20% Off Pizza',
          customerEmail: 'john.doe@email.com',
          discount: '20% Off',
          business: 'Pizza Palace'
        },
        {
          id: '2',
          date: '2025-01-14',
          offerTitle: 'Buy 1 Get 1 Free Coffee',
          customerEmail: 'jane.smith@email.com',
          discount: 'Buy 1 Get 1 Free',
          business: 'Coffee Corner'
        },
        {
          id: '3',
          date: '2025-01-13',
          offerTitle: '15% Off Oil Change',
          customerEmail: 'bob.wilson@email.com',
          discount: '15% Off',
          business: 'Quick Lube'
        }
      ];
      
      setStudent(mockStudent);
      setSalesRecords(mockSales);
      setCouponRedemptions(mockRedemptions);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

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

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Student not found</h3>
          <p className="text-gray-500 mb-6">The student you're looking for doesn't exist</p>
          <Link
            href="/admin/students"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Students
          </Link>
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
                href="/admin/students"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Student Details</h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">ID: {studentId}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/admin/students/edit/${studentId}`}
                className="px-4 py-2 text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Edit Student
              </Link>
              <Link
                href="/admin/students"
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to List
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-3xl">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{student.name}</h2>
                <p className="text-lg text-gray-600 mb-1">{student.email}</p>
                {student.phone && (
                  <p className="text-gray-600">{student.phone}</p>
                )}
                <div className="flex items-center space-x-4 mt-3">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(student.status)}`}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">Joined {formatDate(student.joinedDate)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600 mb-2">{student.totalPoints.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Points Earned</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Student Info & Performance */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{student.booksSold}</div>
                  <div className="text-sm text-blue-700">Books Sold</div>
                  <div className="text-xs text-blue-600 mt-1">
                    ${(student.booksSold * 25).toLocaleString()} Revenue
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">{student.couponsRedeemed}</div>
                  <div className="text-sm text-green-700">Coupons Redeemed</div>
                  <div className="text-xs text-green-600 mt-1">
                    {student.conversionRate}% Conversion
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {student.totalPoints > 0 ? Math.round(student.totalPoints / student.booksSold) : 0}
                  </div>
                  <div className="text-sm text-purple-700">Avg Points per Sale</div>
                  <div className="text-xs text-purple-600 mt-1">
                    Last active {formatDate(student.lastActive)}
                  </div>
                </div>
              </div>
            </div>

            {/* Sales History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Sales</h3>
              {salesRecords.length > 0 ? (
                <div className="space-y-4">
                  {salesRecords.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{sale.bookTitle}</div>
                        <div className="text-sm text-gray-600">{sale.customerEmail}</div>
                        <div className="text-xs text-gray-500">{formatDate(sale.date)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{formatCurrency(sale.amount)}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                          sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No sales records yet</p>
                </div>
              )}
            </div>

            {/* Coupon Redemptions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Coupon Redemptions</h3>
              {couponRedemptions.length > 0 ? (
                <div className="space-y-4">
                  {couponRedemptions.map((redemption) => (
                    <div key={redemption.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{redemption.offerTitle}</div>
                        <div className="text-sm text-gray-600">{redemption.customerEmail}</div>
                        <div className="text-xs text-gray-500">{formatDate(redemption.date)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">{redemption.discount}</div>
                        <div className="text-sm text-gray-600">{redemption.business}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <p>No coupon redemptions yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="space-y-8">
            {/* Student Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Information</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">School</div>
                  <div className="text-gray-900">{student.school}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Class</div>
                  <div className="text-gray-900">{student.class} • {student.grade}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Referral Code</div>
                  <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded border">
                    {student.referralCode}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Last Active</div>
                  <div className="text-gray-900">{formatDate(student.lastActive)}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/admin/students/edit/${studentId}`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Student
                </Link>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Points
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Send Message
                </button>
              </div>
            </div>

            {/* Notes */}
            {student.notes && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{student.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
