'use client';

export default function ReferralStats() {
  const stats = [
    {
      title: 'Total Clicks',
      value: '156',
      change: '+23',
      changeType: 'positive',
      icon: '👆',
      description: 'Link clicks this month'
    },
    {
      title: 'Conversion Rate',
      value: '68%',
      change: '+5%',
      changeType: 'positive',
      icon: '🎯',
      description: 'Clicks to purchases'
    },
    {
      title: 'Sales Generated',
      value: '23',
      change: '+4',
      changeType: 'positive',
      icon: '💰',
      description: 'Books sold via referrals'
    },
    {
      title: 'Revenue Generated',
      value: '$1,035',
      change: '+$180',
      changeType: 'positive',
      icon: '📈',
      description: 'Total sales value'
    }
  ];

  const topSources = [
    { source: 'Facebook', clicks: 45, conversions: 8, rate: '18%' },
    { source: 'Email', clicks: 32, conversions: 6, rate: '19%' },
    { source: 'WhatsApp', clicks: 28, conversions: 5, rate: '18%' },
    { source: 'Twitter', clicks: 22, conversions: 3, rate: '14%' },
    { source: 'Direct', clicks: 29, conversions: 1, rate: '3%' }
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
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Referral Performance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-blue-700 mb-1">{stat.title}</p>
            <p className="text-xs text-blue-600">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Top Sources */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Top Referral Sources</h4>
        <div className="space-y-3">
          {topSources.map((source, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-500' :
                  'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{source.source}</p>
                  <p className="text-xs text-gray-600">{source.clicks} clicks</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{source.conversions} sales</p>
                <p className="text-sm text-gray-600">{source.rate} conversion</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="mt-8">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Click Trend</h4>
        <div className="h-32 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-green-900">Growing Trend</p>
            <p className="text-xs text-green-700">+15% this week</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Pro Tips for Better Referrals</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Facebook has the highest conversion rate - focus there!</li>
          <li>• Personal messages get better results than generic posts</li>
          <li>• Include your story and why you're fundraising</li>
          <li>• Follow up with people who clicked but didn't buy</li>
        </ul>
      </div>
    </div>
  );
}
