'use client';

export default function LeaderboardStats() {
  const stats = [
    {
      title: 'Total Participants',
      value: '156',
      change: '+12',
      changeType: 'positive',
      icon: '👥',
      description: 'Active student sellers'
    },
    {
      title: 'Total Sales',
      value: '$45,230',
      change: '+$3,450',
      changeType: 'positive',
      icon: '💰',
      description: 'Combined sales value'
    },
    {
      title: 'Average Earnings',
      value: '$290',
      change: '+$22',
      changeType: 'positive',
      icon: '📊',
      description: 'Per student'
    },
    {
      title: 'Top Performer',
      value: '$245',
      change: 'Sarah J.',
      changeType: 'neutral',
      icon: '🏆',
      description: 'Highest individual earnings'
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
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Competition Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-gray-700 mb-1">{stat.title}</p>
            <p className="text-xs text-gray-600">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Competition Progress */}
      <div className="mt-8">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Your Competition Progress</h4>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Distance to #1</span>
              <span className="text-sm text-gray-600">$80</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full" style={{ width: '67%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">You're 67% of the way to the top!</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Lead over #4</span>
              <span className="text-sm text-gray-600">$33</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">You have a solid lead!</p>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">💡 Tips to Move Up</h4>
        <ul className="text-xs text-yellow-800 space-y-1">
          <li>• Share your referral link on social media</li>
          <li>• Ask family and friends to support your fundraising</li>
          <li>• Focus on high-value books with better points</li>
          <li>• Track your conversion rate and optimize your approach</li>
        </ul>
      </div>
    </div>
  );
}
