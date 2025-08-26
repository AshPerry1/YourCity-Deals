'use client';

export default function HelpResources() {
  const resources = [
    {
      title: 'Getting Started Guide',
      description: 'Learn how to set up your account and start selling',
      icon: '🚀',
      link: '#',
      type: 'guide'
    },
    {
      title: 'Sales Tips & Strategies',
      description: 'Best practices for maximizing your sales and earnings',
      icon: '💡',
      link: '#',
      type: 'tips'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for all platform features',
      icon: '🎥',
      link: '#',
      type: 'video'
    },
    {
      title: 'Referral Code Guide',
      description: 'How to effectively share and track your referral code',
      icon: '🔗',
      link: '#',
      type: 'guide'
    },
    {
      title: 'Points Calculator',
      description: 'Calculate your potential points from different books',
      icon: '🧮',
      link: '#',
      type: 'tool'
    },
    {
      title: 'Leaderboard Rules',
      description: 'Understanding how the competition and rankings work',
      icon: '🏆',
      link: '#',
      type: 'rules'
    }
  ];

  const contactInfo = [
    {
      method: 'Email Support',
              value: 'support@yourcitydeals.com',
      icon: '📧',
      response: '24 hours'
    },
    {
      method: 'Phone Support',
      value: '+1 (555) 123-4567',
      icon: '📞',
      response: 'Mon-Fri 9AM-5PM'
    },
    {
      method: 'Live Chat',
      value: 'Available on website',
      icon: '💬',
      response: 'Real-time'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-800';
      case 'tips': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'tool': return 'bg-orange-100 text-orange-800';
      case 'rules': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Helpful Resources</h2>
        <p className="text-sm text-gray-600 mt-1">Tutorials, guides, and tools to help you succeed</p>
      </div>

      <div className="p-6">
        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              className="block p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{resource.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">{resource.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            {contactInfo.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{contact.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{contact.method}</p>
                    <p className="text-sm text-gray-600">{contact.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Response time</p>
                  <p className="text-sm font-medium text-gray-900">{contact.response}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-3">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Download App
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Share Feedback
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Report Bug
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Request Feature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
