'use client';

export default function Leaderboard() {
  const leaderboardData = [
    {
      rank: 1,
      name: 'Sarah Johnson',
      school: 'Lincoln High School',
      sales: 23,
      earnings: 2450,
      trend: 'up',
      isCurrentUser: false
    },
    {
      rank: 2,
      name: 'Mike Chen',
      school: 'Washington Elementary',
      sales: 18,
      earnings: 1890,
      trend: 'down',
      isCurrentUser: false
    },
    {
      rank: 3,
      name: 'Emma Davis',
      school: 'Lincoln High School',
      sales: 15,
      earnings: 1650,
      trend: 'up',
      isCurrentUser: true
    },
    {
      rank: 4,
      name: 'Alex Rodriguez',
      school: 'Lincoln High School',
      sales: 12,
      earnings: 1320,
      trend: 'up',
      isCurrentUser: false
    },
    {
      rank: 5,
      name: 'Jordan Smith',
      school: 'Washington Elementary',
      sales: 10,
      earnings: 1100,
      trend: 'down',
      isCurrentUser: false
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
    return trend === 'up' ? '↗️' : '↘️';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Class Leaderboard</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Lincoln High School</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
      
      <div className="space-y-3">
        {leaderboardData.map((student) => (
          <div
            key={student.rank}
            className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
              student.isCurrentUser
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                student.rank === 1 ? 'bg-yellow-500 text-white' :
                student.rank === 2 ? 'bg-gray-400 text-white' :
                student.rank === 3 ? 'bg-orange-500 text-white' :
                'bg-gray-300 text-gray-700'
              }`}>
                {getRankIcon(student.rank)}
              </div>
              <div>
                <p className={`font-medium ${
                  student.isCurrentUser ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {student.name}
                  {student.isCurrentUser && ' (You)'}
                </p>
                <p className="text-xs text-gray-600">{student.school}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  ${student.earnings.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">
                  {getTrendIcon(student.trend)}
                </span>
              </div>
              <p className="text-xs text-gray-600">{student.sales} books sold</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Your Position */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900">Your Position</p>
            <p className="text-lg font-bold text-blue-900">#3 in Class</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-700">$700 to #2</p>
            <p className="text-xs text-blue-600">Keep pushing!</p>
          </div>
        </div>
      </div>
      
      {/* View All */}
      <div className="mt-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View Full Leaderboard →
        </button>
      </div>
    </div>
  );
}
