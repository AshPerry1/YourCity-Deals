'use client';

export default function PointsBreakdown() {
  const pointsData = [
    {
      book: 'Lincoln High School Coupon Book',
      sales: 15,
      revenue: 675,
      points: 150,
      redemptions: 8
    },
    {
      book: 'Washington Elementary Coupon Book',
      sales: 8,
      revenue: 360,
      points: 80,
      redemptions: 5
    }
  ];

  const timeBreakdown = [
    { period: 'This Week', points: 80, sales: 8, redemptions: 5 },
    { period: 'Last Week', points: 95, sales: 9, redemptions: 6 },
    { period: 'This Month', points: 230, sales: 23, redemptions: 13 },
    { period: 'Last Month', points: 180, sales: 20, redemptions: 12 }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Points Breakdown</h3>
      
      {/* Points Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 mb-6 border border-blue-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-900">230</p>
          <p className="text-sm text-blue-700">Total Points This Month</p>
          <p className="text-xs text-blue-600 mt-1">13 redemptions</p>
        </div>
      </div>

      {/* By Book */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">By Book</h4>
        <div className="space-y-3">
          {pointsData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{item.book}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                  <span>{item.sales} sales</span>
                  <span>•</span>
                  <span>{item.redemptions} redemptions</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{item.points} pts</p>
                <p className="text-xs text-gray-600">${item.revenue} revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Breakdown */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">By Time Period</h4>
        <div className="space-y-3">
          {timeBreakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">{item.period}</p>
                <div className="text-xs text-gray-600">
                  {item.sales} sales • {item.redemptions} redemptions
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{item.points} pts</p>
                <p className="text-xs text-gray-600">
                  {Math.round(item.points / item.sales)} pts avg/sale
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Points Info */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">💡 How Points Work</h4>
        <ul className="text-xs text-yellow-800 space-y-1">
          <li>• You earn points for your school on each book sold</li>
          <li>• Additional points are awarded when coupons are redeemed</li>
          <li>• Points are awarded immediately upon sale and redemption</li>
          <li>• Your school can use points for rewards like spirit packs</li>
        </ul>
      </div>
    </div>
  );
}
