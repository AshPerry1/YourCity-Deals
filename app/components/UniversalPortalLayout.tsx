'use client';

import React from 'react';

export interface PortalTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  headerGradient: string;
  hoverColor: string;
  lightBg: string;
  emoji: React.ReactNode;
}

export const portalThemes: Record<string, PortalTheme> = {
  student: {
    name: 'Student Portal',
    primary: 'blue-600',
    secondary: 'blue-700',
    accent: 'blue-50',
    gradient: 'from-blue-600 via-blue-700 to-indigo-800',
    headerGradient: 'from-blue-500 to-blue-600',
    hoverColor: 'blue-100',
    lightBg: 'blue-50',
          emoji: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
        </svg>
      )
  },
  teacher: {
    name: 'Teacher Portal',
    primary: 'orange-600',
    secondary: 'red-700',
    accent: 'orange-50',
    gradient: 'from-orange-600 via-orange-700 to-red-800',
    headerGradient: 'from-orange-500 to-red-600',
    hoverColor: 'orange-100',
    lightBg: 'orange-50',
          emoji: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
        </svg>
      )
  },
  merchant: {
    name: 'Merchant Portal',
    primary: 'purple-600',
    secondary: 'purple-700',
    accent: 'purple-50',
    gradient: 'from-purple-600 via-purple-700 to-purple-800',
    headerGradient: 'from-purple-500 to-purple-600',
    hoverColor: 'purple-100',
    lightBg: 'purple-50',
          emoji: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      )
  },
  admin: {
    name: 'Admin Portal',
    primary: 'blue-600',
    secondary: 'blue-700',
    accent: 'blue-50',
    gradient: 'from-blue-600 via-blue-700 to-blue-800',
    headerGradient: 'from-blue-500 to-blue-600',
    hoverColor: 'blue-100',
    lightBg: 'blue-50',
          emoji: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
  },
  purchaser: {
    name: 'Purchaser Portal',
    primary: 'indigo-600',
    secondary: 'indigo-700',
    accent: 'indigo-50',
    gradient: 'from-indigo-600 via-indigo-700 to-indigo-800',
    headerGradient: 'from-indigo-500 to-indigo-600',
    hoverColor: 'indigo-100',
    lightBg: 'indigo-50',
          emoji: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
        </svg>
      )
  }
};

interface UniversalPortalLayoutProps {
  children: React.ReactNode;
  theme: keyof typeof portalThemes;
  Sidebar: React.ComponentType;
  Header: React.ComponentType;
}

export default function UniversalPortalLayout({ 
  children, 
  theme, 
  Sidebar, 
  Header 
}: UniversalPortalLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-72">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
