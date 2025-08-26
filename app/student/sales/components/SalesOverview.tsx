'use client';

export default function SalesOverview() {
  const metrics = [
    {
      title: 'Total Points',
      value: '2,450',
      change: '+180',
      changeType: 'positive',
      icon: 'star',
      description: 'Points earned for school'
    },
    {
      title: 'Books Sold',
      value: '23',
      change: '+3',
      changeType: 'positive',
      icon: 'book',
      description: 'Total books sold'
    },
    {
      title: 'Coupons Redeemed',
      value: '156',
      change: '+12',
      changeType: 'positive',
      icon: 'ticket',
      description: 'Coupons used by customers'
    },
    {
      title: 'Conversion Rate',
      value: '68%',
      change: '+5%',
      changeType: 'positive',
      icon: 'target',
      description: 'Click to purchase'
    }
  ];

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                {metric.icon === 'star' && (
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
                {metric.icon === 'book' && (
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
                {metric.icon === 'ticket' && (
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                )}
                {metric.icon === 'target' && (
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
            <p className="text-sm font-medium text-gray-700 mb-1">{metric.title}</p>
            <p className="text-xs text-gray-600">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900">Weekly Performance</h4>
          <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
        
        <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-blue-900">Sales Trend</p>
            <p className="text-xs text-blue-700">+15% this week</p>
          </div>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="mt-8 space-y-4">
        <h4 className="text-md font-semibold text-gray-900">Goal Progress</h4>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Monthly Points Goal</span>
              <span className="text-sm text-gray-600">2,450 / 3,000 points</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: '82%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">550 more points to reach your goal!</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Reward Progress: Spirit Pack</span>
              <span className="text-sm text-gray-600">2,450 / 3,000 points</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '82%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">550 more points to earn your Spirit Pack!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
