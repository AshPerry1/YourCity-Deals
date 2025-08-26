'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AnalyticsData {
  totalRevenue: number;
  totalSales: number;
  activeUsers: number;
  conversionRate: number;
  averageOrderValue: number;
  topPerformingSchool: string;
  topPerformingStudent: string;
  monthlyGrowth: number;
}

interface SalesChartData {
  date: string;
  sales: number;
  revenue: number;
}

interface SchoolPerformance {
  name: string;
  sales: number;
  revenue: number;
  students: number;
  conversionRate: number;
}

interface TopStudents {
  name: string;
  school: string;
  sales: number;
  points: number;
  rank: number;
}

export default function AdminAnalytics() {
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalSales: 0,
    activeUsers: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    topPerformingSchool: '',
    topPerformingStudent: '',
    monthlyGrowth: 0
  });
  const [salesChartData, setSalesChartData] = useState<SalesChartData[]>([]);
  const [schoolPerformance, setSchoolPerformance] = useState<SchoolPerformance[]>([]);
  const [topStudents, setTopStudents] = useState<TopStudents[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalyticsData({
        totalRevenue: 45678,
        totalSales: 1234,
        activeUsers: 567,
        conversionRate: 23.4,
        averageOrderValue: 37.0,
        topPerformingSchool: 'Mountain Brook High School',
        topPerformingStudent: 'Emma Thompson',
        monthlyGrowth: 15.2
      });

      setSalesChartData([
        { date: '2024-01-01', sales: 45, revenue: 1675 },
        { date: '2024-01-02', sales: 52, revenue: 1940 },
        { date: '2024-01-03', sales: 38, revenue: 1420 },
        { date: '2024-01-04', sales: 61, revenue: 2280 },
        { date: '2024-01-05', sales: 49, revenue: 1830 },
        { date: '2024-01-06', sales: 67, revenue: 2500 },
        { date: '2024-01-07', sales: 58, revenue: 2170 },
        { date: '2024-01-08', sales: 72, revenue: 2690 },
        { date: '2024-01-09', sales: 55, revenue: 2050 },
        { date: '2024-01-10', sales: 63, revenue: 2350 }
      ]);

      setSchoolPerformance([
        {
          name: 'Mountain Brook High School',
          sales: 456,
          revenue: 17020,
          students: 89,
          conversionRate: 28.5
        },
        {
          name: 'Vestavia Hills High School',
          sales: 389,
          revenue: 14520,
          students: 76,
          conversionRate: 24.3
        },
        {
          name: 'Homewood High School',
          sales: 234,
          revenue: 8720,
          students: 45,
          conversionRate: 19.8
        }
      ]);

      setTopStudents([
        { name: 'Emma Thompson', school: 'Mountain Brook HS', sales: 3247, points: 3247, rank: 1 },
        { name: 'James Wilson', school: 'Vestavia Hills HS', sales: 2987, points: 2987, rank: 2 },
        { name: 'Sophia Chen', school: 'Homewood HS', sales: 2654, points: 2654, rank: 3 },
        { name: 'Lucas Brown', school: 'Mountain Brook HS', sales: 2432, points: 2432, rank: 4 },
        { name: 'Olivia Davis', school: 'Vestavia Hills HS', sales: 2187, points: 2187, rank: 5 }
      ]);

      setLoading(false);
    }, 1500);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Real-time insights and performance metrics</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p>
                <p className="text-sm text-green-600">+{analyticsData.monthlyGrowth}% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalSales)}</p>
                <p className="text-sm text-blue-600">+12.5% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.activeUsers)}</p>
                <p className="text-sm text-purple-600">+8.3% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.conversionRate}%</p>
                <p className="text-sm text-yellow-600">+2.1% from last month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-end justify-between space-x-2">
                {salesChartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-200 rounded-t" style={{ height: `${(data.sales / 80) * 200}px` }}>
                      <div className="w-full bg-purple-500 rounded-t transition-all duration-300 hover:bg-purple-600"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Daily sales over the last 10 days</p>
              </div>
            </div>
          </div>

          {/* School Performance */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">School Performance</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {schoolPerformance.map((school, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{school.name}</p>
                      <p className="text-sm text-gray-500">{school.students} students</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(school.revenue)}</p>
                      <p className="text-sm text-gray-500">{school.sales} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Students */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Students</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        student.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                        student.rank === 2 ? 'bg-gray-300 text-gray-900' :
                        student.rank === 3 ? 'bg-orange-400 text-orange-900' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {student.rank}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.school}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(student.sales)}</p>
                      <p className="text-sm text-gray-500">{student.points} points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Performance Highlights</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Order Value</span>
                      <span className="font-medium">{formatCurrency(analyticsData.averageOrderValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top School</span>
                      <span className="font-medium">{analyticsData.topPerformingSchool}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top Student</span>
                      <span className="font-medium">{analyticsData.topPerformingStudent}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Growth Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue Growth</span>
                      <span className="text-green-600 font-medium">+{analyticsData.monthlyGrowth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">User Growth</span>
                      <span className="text-green-600 font-medium">+8.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conversion Growth</span>
                      <span className="text-green-600 font-medium">+2.1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
