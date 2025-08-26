'use client';

export default function RecentSales() {
  const recentSales = [
    {
      id: 1,
      customer: 'John Smith',
      amount: 45.00,
      books: 1,
      date: '2024-01-15',
      time: '14:30',
      status: 'completed',
      points: 10
    },
    {
      id: 2,
      customer: 'Mary Johnson',
      amount: 90.00,
      books: 2,
      date: '2024-01-14',
      time: '16:45',
      status: 'completed',
      points: 20
    },
    {
      id: 3,
      customer: 'David Wilson',
      amount: 45.00,
      books: 1,
      date: '2024-01-14',
      time: '11:20',
      status: 'completed',
      points: 10
    },
    {
      id: 4,
      customer: 'Lisa Brown',
      amount: 135.00,
      books: 3,
      date: '2024-01-13',
      time: '19:15',
      status: 'completed',
      points: 30
    },
    {
      id: 5,
      customer: 'Robert Davis',
      amount: 45.00,
      books: 1,
      date: '2024-01-13',
      time: '13:40',
      status: 'completed',
      points: 10
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
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All →
        </button>
      </div>
      
      <div className="space-y-4">
        {recentSales.map((sale) => (
          <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">{sale.customer}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">
                    {formatDate(sale.date)} at {sale.time}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(sale.status)}`}>
                    {sale.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-gray-900">${sale.amount.toFixed(2)}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">{sale.books} book{sale.books > 1 ? 's' : ''}</span>
                <span className="text-xs text-green-600 font-medium">
                  +{sale.points} pts
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-900">This Week's Earnings</p>
            <p className="text-lg font-bold text-green-900">$36.00</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-700">8 sales</p>
            <p className="text-xs text-green-600">+$12.50 from last week</p>
          </div>
        </div>
      </div>
    </div>
  );
}
