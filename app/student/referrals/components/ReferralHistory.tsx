'use client';

import { useState } from 'react';

interface ReferralEvent {
  id: string;
  timestamp: string;
  source: string;
  ip_address: string;
  user_agent: string;
  converted: boolean;
  sale_amount?: number;
  points?: number;
  customer_email?: string;
}

export default function ReferralHistory() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const referralEvents: ReferralEvent[] = [
    {
      id: '1',
      timestamp: '2024-01-15T14:30:00Z',
      source: 'Facebook',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      converted: true,
      sale_amount: 45.00,
      points: 10,
      customer_email: 'john.smith@email.com'
    },
    {
      id: '2',
      timestamp: '2024-01-15T13:45:00Z',
      source: 'Email',
      ip_address: '192.168.1.101',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      converted: true,
      sale_amount: 90.00,
      points: 20,
      customer_email: 'mary.johnson@email.com'
    },
    {
      id: '3',
      timestamp: '2024-01-15T12:20:00Z',
      source: 'WhatsApp',
      ip_address: '192.168.1.102',
      user_agent: 'Mozilla/5.0 (Android 11; Mobile)',
      converted: false,
    },
    {
      id: '4',
      timestamp: '2024-01-15T11:15:00Z',
      source: 'Twitter',
      ip_address: '192.168.1.103',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      converted: true,
      sale_amount: 45.00,
      points: 10,
      customer_email: 'david.wilson@email.com'
    },
    {
      id: '5',
      timestamp: '2024-01-15T10:30:00Z',
      source: 'Facebook',
      ip_address: '192.168.1.104',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      converted: false,
    },
    {
      id: '6',
      timestamp: '2024-01-15T09:45:00Z',
      source: 'Direct',
      ip_address: '192.168.1.105',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      converted: false,
    }
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'facebook': return '📘';
      case 'email': return '📧';
      case 'whatsapp': return '📱';
      case 'twitter': return '🐦';
      case 'direct': return '🔗';
      default: return '🌐';
    }
  };

  const filteredEvents = referralEvents.filter(event => {
    const matchesFilter = filter === 'all' || 
      (filter === 'converted' && event.converted) ||
      (filter === 'not_converted' && !event.converted);
    const matchesSearch = event.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Referral History</h2>
        <p className="text-sm text-gray-600 mt-1">Track all your referral link clicks and conversions</p>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by source or customer..."
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
            <option value="all">All Events</option>
            <option value="converted">Converted</option>
            <option value="not_converted">Not Converted</option>
          </select>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getSourceIcon(event.source)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{event.source}</p>
                    <p className="text-sm text-gray-600">{formatDate(event.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.converted 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-gray-600 bg-gray-100'
                  }`}>
                    {event.converted ? 'Converted' : 'Clicked'}
                  </span>
                </div>
              </div>
              
              {event.converted && (
                <div className="bg-green-50 rounded-lg p-3 mb-3 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-900">Sale Generated</p>
                      <p className="text-xs text-green-700">{event.customer_email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-900">${event.sale_amount?.toFixed(2)}</p>
                      <p className="text-sm text-green-700">+${event.points} points</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>IP: {event.ip_address}</span>
                <span>Device: {event.user_agent.split('(')[1]?.split(')')[0] || 'Unknown'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">This Period</p>
              <p className="text-lg font-bold text-blue-900">{filteredEvents.length} events</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-700">
                {filteredEvents.filter(e => e.converted).length} conversions
              </p>
              <p className="text-xs text-blue-600">
                {((filteredEvents.filter(e => e.converted).length / filteredEvents.length) * 100).toFixed(1)}% rate
              </p>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Export History →
          </button>
        </div>
      </div>
    </div>
  );
}
