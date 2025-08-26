'use client';

import { useState, useEffect } from 'react';

interface PointsData {
  category: string;
  points: number;
  percentage: number;
  color: string;
}

export default function PointsBreakdown() {
  const [pointsData, setPointsData] = useState<PointsData[]>([
    {
      category: 'Book Sales',
      points: 1800,
      percentage: 73.5,
      color: '#3B82F6'
    },
    {
      category: 'Referral Bonuses',
      points: 450,
      percentage: 18.4,
      color: '#10B981'
    },
    {
      category: 'Special Events',
      points: 200,
      percentage: 8.1,
      color: '#F59E0B'
    }
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Points Breakdown</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">2,450</p>
          <p className="text-sm text-gray-600">Total Points</p>
        </div>
      </div>

      <div className="space-y-4">
        {pointsData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {item.category}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {item.points.toLocaleString()} pts
              </p>
              <p className="text-xs text-gray-500">
                {item.percentage}%
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">This month's goal:</span>
          <span className="font-semibold text-gray-900">3,000 points</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
            style={{ width: `${(2450 / 3000) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {Math.round((2450 / 3000) * 100)}% complete
        </p>
      </div>
    </div>
  );
}
