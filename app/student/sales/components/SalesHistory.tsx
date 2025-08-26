'use client';

import { useState } from 'react';

interface Sale {
  id: string;
  customer: string;
  book: string;
  amount: number;
  points: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  payment_method: string;
}

export default function SalesHistory() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sales: Sale[] = [
    {
      id: '1',
      customer: 'John Smith',
      book: 'Lincoln High School Coupon Book',
      amount: 45.00,
      points: 10,
      date: '2024-01-15',
      status: 'completed',
      payment_method: 'Credit Card'
    },
    {
      id: '2',
      customer: 'Mary Johnson',
      book: 'Lincoln High School Coupon Book',
      amount: 90.00,
      points: 20,
      date: '2024-01-14',
      status: 'completed',
      payment_method: 'PayPal'
    },
    {
      id: '3',
      customer: 'David Wilson',
      book: 'Lincoln High School Coupon Book',
      amount: 45.00,
      points: 10,
      date: '2024-01-14',
      status: 'completed',
      payment_method: 'Credit Card'
    },
    {
      id: '4',
      customer: 'Lisa Brown',
      book: 'Lincoln High School Coupon Book',
      amount: 135.00,
      points: 30,
      date: '2024-01-13',
      status: 'completed',
      payment_method: 'Credit Card'
    },
    {
      id: '5',
      customer: 'Robert Davis',
      book: 'Lincoln High School Coupon Book',
      amount: 45.00,
      points: 10,
      date: '2024-01-13',
      status: 'completed',
      payment_method: 'PayPal'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredSales = sales.filter(sale => {
    const matchesFilter = filter === 'all' || sale.status === filter;
    const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.book.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sales History</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Export →
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Sales List */}
      <div className="space-y-4">
        {filteredSales.map((sale) => (
          <div key={sale.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{sale.customer}</p>
                  <p className="text-sm text-gray-600">{sale.book}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${sale.amount.toFixed(2)}</p>
                <p className="text-sm text-green-600 font-medium">+{sale.points} pts</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{formatDate(sale.date)}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-600">{sale.payment_method}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                {sale.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-900">Total Points</p>
            <p className="text-lg font-bold text-green-900">{filteredSales.reduce((sum, sale) => sum + sale.points, 0)} pts</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-700">{filteredSales.length} sales</p>
            <p className="text-xs text-green-600">This period</p>
          </div>
        </div>
      </div>
    </div>
  );
}
