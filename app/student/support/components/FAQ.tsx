'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    // General
    {
      question: "How do I get started selling coupon books?",
      answer: "Once your account is set up, you'll receive your unique referral code. Share this code with friends, family, and community members. When they purchase books using your code, you'll earn points for your school.",
      category: "general"
    },
    {
      question: "What is my referral code and how do I use it?",
      answer: "Your referral code is a unique identifier (like STU-AB12CD) that tracks your sales. Share it via social media, email, or word of mouth. Anyone who uses your code when purchasing will be linked to your account.",
      category: "general"
    },
    {
      question: "How do I track my sales and points?",
      answer: "Visit your Dashboard to see real-time sales data, points earned, and performance metrics. You can also view detailed sales history and points breakdowns in the Sales section.",
      category: "general"
    },
    // Sales & Points
    {
      question: "How many points do I earn?",
      answer: "You earn points for your school on each coupon book sold through your referral code. Points vary by book and are awarded for both sales and actual coupon redemptions.",
      category: "sales"
    },
    {
      question: "When do points get awarded?",
      answer: "Points are awarded immediately when a book is sold and when coupons are redeemed. Your school can use these points to provide rewards like spirit packs and other incentives.",
      category: "sales"
    },
    {
      question: "What if someone returns a book I sold?",
      answer: "If a customer returns a book within the return period, the points earned for that sale will be deducted from your school's total. We'll notify you of any adjustments.",
      category: "sales"
    },
    // Technical
    {
      question: "I forgot my password. How do I reset it?",
      answer: "Click the 'Forgot Password' link on the login page. Enter your email address and we'll send you a reset link. Make sure to check your spam folder.",
      category: "technical"
    },
    {
      question: "How do I update my personal information?",
      answer: "Go to your Profile page to update your name, email, phone number, and other personal details. Some information like your referral code cannot be changed.",
      category: "technical"
    },
    {
      question: "Can I use the platform on my phone?",
      answer: "Yes! The platform is fully mobile-responsive. You can access all features including sharing referral links, tracking sales, and viewing leaderboards on your smartphone.",
      category: "technical"
    },
    // Books & Products
    {
      question: "What coupon books are available to sell?",
      answer: "Available books depend on your school and location. Check the 'My Books' section to see all available coupon books you can sell, including their prices and point values.",
      category: "books"
    },
    {
      question: "How do I preview a coupon book before selling?",
      answer: "Click the 'Preview' button on any book in the 'My Books' section to see what's inside, including sample coupons and total value.",
      category: "books"
    },
    {
      question: "What if a book is out of stock?",
      answer: "If a book becomes unavailable, it will be marked as 'Out of Stock' in your book list. We'll notify you when it's back in stock.",
      category: "books"
    }
  ];

  const categories = [
    { id: 'general', name: 'General', icon: 'question' },
    { id: 'sales', name: 'Sales & Points', icon: 'chart' },
    { id: 'technical', name: 'Technical', icon: 'wrench' },
    { id: 'books', name: 'Books & Products', icon: 'book' }
  ];

  const filteredFAQ = faqData.filter(item => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
        <p className="text-sm text-gray-600 mt-1">Find answers to common questions</p>
      </div>

      <div className="p-6">
        {/* Category Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeCategory === category.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">
                {category.icon === 'question' && (
                  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {category.icon === 'chart' && (
                  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h3a2 2 0 012 2v14a2 2 0 01-2 2h-3a2 2 0 01-2-2z" />
                  </svg>
                )}
                {category.icon === 'wrench' && (
                  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                )}
                {category.icon === 'book' && (
                  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
              </span>
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQ.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openItems.includes(index) && (
                <div className="px-4 pb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-center">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Still need help?</h4>
            <p className="text-xs text-blue-700 mb-3">Can't find what you're looking for? Contact our support team.</p>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
