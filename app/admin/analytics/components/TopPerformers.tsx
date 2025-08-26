'use client';

export default function TopPerformers() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performers</h3>
      
      {/* Top Students */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-700 mb-4">Top Student Sellers</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Sarah Johnson</p>
                <p className="text-xs text-gray-600">Lincoln High School</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">$2,450</p>
              <p className="text-xs text-gray-600">23 books sold</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Mike Chen</p>
                <p className="text-xs text-gray-600">Washington Elementary</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">$1,890</p>
              <p className="text-xs text-gray-600">18 books sold</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Emma Davis</p>
                <p className="text-xs text-gray-600">Lincoln High School</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">$1,650</p>
              <p className="text-xs text-gray-600">15 books sold</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Schools */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-4">Top Schools</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Lincoln High School</p>
                <p className="text-xs text-gray-600">45 students</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">$12,450</p>
              <p className="text-xs text-gray-600">89 books sold</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Washington Elementary</p>
                <p className="text-xs text-gray-600">32 students</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">$8,230</p>
              <p className="text-xs text-gray-600">67 books sold</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
