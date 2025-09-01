'use client';

import UniversalSidebar from '@/app/components/UniversalSidebar';

const studentNavigation = [
  {
    name: 'Dashboard',
    href: '/student',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    description: 'Overview of your sales and points'
  },
  {
    name: 'My Books',
    href: '/student/books',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    description: 'View and manage your coupon books'
  },
  {
    name: 'Sales',
    href: '/student/sales',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h3a2 2 0 012 2v14a2 2 0 01-2 2h-3a2 2 0 01-2-2z',
    description: 'Track your sales and points earned'
  },
  {
    name: 'Referrals',
    href: '/student/referrals',
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-.758l.707-.707a4 4 0 00-5.656-5.656l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-.758l.707-.707a4 4 0 00-5.656-5.656l-4 4a4 4 0 105.656 5.656l1.102-1.101',
    description: 'Manage your referral links and codes'
  },
  {
    name: 'Leaderboard',
    href: '/student/leaderboard',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'View class rankings and achievements'
  },
  {
    name: 'Profile',
    href: '/student/profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    description: 'Manage your account and preferences'
  },
  {
    name: 'Support',
    href: '/student/support',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Get help and contact support'
  }
];

export default function StudentSidebarNew() {
  const userInfo = {
    name: "Alex Johnson",
    role: "Student",
    avatar: "A"
  };

  return (
    <UniversalSidebar 
      theme="student" 
      navigation={studentNavigation} 
      userInfo={userInfo}
    />
  );
}
