'use client';

import { useState } from 'react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  school: string;
  class: string;
  sales: number;
  points: number;
  books_sold: number;
  conversion_rate: number;
  isCurrentUser: boolean;
  trend: 'up' | 'down' | 'stable';
}

export default function LeaderboardTable() {
  const [sortBy, setSortBy] = useState('earnings');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Sarah Johnson',
      school: 'Lincoln High School',
      class: 'Senior',
      sales: 2450,
      points: 2450,
      books_sold: 23,
      conversion_rate: 72,
      isCurrentUser: false,
      trend: 'up'
    },
    {
      rank: 2,
      name: 'Mike Chen',
      school: 'Washington Elementary',
      class: '8th Grade',
      sales: 1890,
      points: 1890,
      books_sold: 18,
      conversion_rate: 68,
      isCurrentUser: false,
      trend: 'down'
    },
    {
      rank: 3,
      name: 'Emma Davis',
      school: 'Lincoln High School',
      class: 'Junior',
      sales: 1650,
      points: 1650,
      books_sold: 15,
      conversion_rate: 65,
      isCurrentUser: true,
      trend: 'up'
    },
    {
      rank: 4,
      name: 'Alex Rodriguez',
      school: 'Lincoln High School',
      class: 'Senior',
      sales: 1320,
      points: 1320,
      books_sold: 12,
      conversion_rate: 58,
      isCurrentUser: false,
      trend: 'up'
    },
    {
      rank: 5,
      name: 'Jordan Smith',
      school: 'Washington Elementary',
      class: '7th Grade',
      sales: 1100,
      points: 1100,
      books_sold: 10,
      conversion_rate: 55,
      isCurrentUser: false,
      trend: 'down'
    },
    {
      rank: 6,
      name: 'Taylor Wilson',
      school: 'Lincoln High School',
      class: 'Sophomore',
      sales: 980,
      points: 980,
      books_sold: 9,
      conversion_rate: 52,
      isCurrentUser: false,
      trend: 'stable'
    },
    {
      rank: 7,
      name: 'Casey Brown',
      school: 'Washington Elementary',
      class: '6th Grade',
      sales: 850,
      points: 850,
      books_sold: 8,
      conversion_rate: 48,
      isCurrentUser: false,
      trend: 'up'
    },
    {
      rank: 8,
      name: 'Riley Garcia',
      school: 'Lincoln High School',
      class: 'Freshman',
      sales: 720,
      points: 720,
      books_sold: 7,
      conversion_rate: 45,
      isCurrentUser: false,
      trend: 'down'
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedData = [...leaderboardData].sort((a, b) => {
    let aValue: number;
    let bValue: number;

    switch (sortBy) {
              case 'points':
        aValue = a.points;
        bValue = b.points;
        break;
      case 'sales':
        aValue = a.sales;
        bValue = b.sales;
        break;
      case 'books_sold':
        aValue = a.books_sold;
        bValue = b.books_sold;
        break;
      case 'conversion_rate':
        aValue = a.conversion_rate;
        bValue = b.conversion_rate;
        break;
      default:
        aValue = a.rank;
        bValue = b.rank;
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Top Performers</h2>
        <p className="text-sm text-gray-600 mt-1">Lincoln High School - All Classes</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('points')}
              >
                <div className="flex items-center space-x-1">
                  <span>Points</span>
                  {sortBy === 'points' && (
                    <span className="text-gray-400">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('books_sold')}
              >
                <div className="flex items-center space-x-1">
                  <span>Books Sold</span>
                  {sortBy === 'books_sold' && (
                    <span className="text-gray-400">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('conversion_rate')}
              >
                <div className="flex items-center space-x-1">
                  <span>Conversion</span>
                  {sortBy === 'conversion_rate' && (
                    <span className="text-gray-400">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((entry) => (
              <tr 
                key={entry.rank} 
                className={`hover:bg-gray-50 transition-colors ${
                  entry.isCurrentUser ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getRankIcon(entry.rank)}</span>
                    <span className={`font-medium ${
                      entry.isCurrentUser ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {entry.rank}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="flex items-center">
                      <p className={`font-medium ${
                        entry.isCurrentUser ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {entry.name}
                        {entry.isCurrentUser && ' (You)'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">{entry.school}</p>
                    <p className="text-xs text-gray-500">{entry.class}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-semibold text-gray-900">{entry.points.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">${entry.sales.toLocaleString()} sales</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-medium text-gray-900">{entry.books_sold}</p>
                  <p className="text-sm text-gray-600">books</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-medium text-gray-900">{entry.conversion_rate}%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${entry.conversion_rate}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-lg ${getTrendColor(entry.trend)}`}>
                    {getTrendIcon(entry.trend)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Your Position Summary */}
      <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Your Position</h3>
            <p className="text-sm text-blue-700">Keep up the great work!</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-900">#3</p>
            <p className="text-sm text-blue-700">240 points to #2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
