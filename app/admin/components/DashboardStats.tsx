'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Stats {
  totalOrganizers: number;
  totalBooks: number;
  totalPromoters: number;
  totalRevenue: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalOrganizers: 0,
    totalBooks: 0,
    totalPromoters: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Count unique organizers (combination of schools and direct organizers)
        const { data: organizerData } = await supabase
          .from('coupon_books')
          .select('school_id, organizer_name');
        
        const uniqueOrganizers = new Set();
        organizerData?.forEach(book => {
          if (book.school_id) {
            uniqueOrganizers.add(`school_${book.school_id}`);
          } else {
            uniqueOrganizers.add(`organizer_${book.organizer_name}`);
          }
        });

        // Fetch books count
        const { count: booksCount } = await supabase
          .from('coupon_books')
          .select('*', { count: 'exact', head: true });

        // Fetch promoters (students) count
        const { count: promotersCount } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true });

        // Fetch total revenue from paid purchases
        const { data: purchases } = await supabase
          .from('purchases')
          .select('amount_cents')
          .eq('paid', true);

        const totalRevenue = purchases?.reduce((sum, purchase) => sum + (purchase.amount_cents || 0), 0) || 0;

        setStats({
          totalOrganizers: uniqueOrganizers.size,
          totalBooks: booksCount || 0,
          totalPromoters: promotersCount || 0,
          totalRevenue: totalRevenue / 100, // Convert cents to dollars
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-100">
            <div className="h-8 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Organizers */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Organizers</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrganizers.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">Schools, events, neighborhoods & more</p>
        </div>
      </div>

      {/* Books */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Coupon Books</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalBooks.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">Available for purchase</p>
        </div>
      </div>

      {/* Promoters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Promoters</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPromoters.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">Students, volunteers & salespeople</p>
        </div>
      </div>

      {/* Revenue */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">Lifetime earnings</p>
        </div>
      </div>
    </div>
  );
}
