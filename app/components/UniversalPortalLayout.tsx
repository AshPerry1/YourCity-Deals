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
  emoji: string;
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
    emoji: '👨‍🎓'
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
    emoji: '👩‍🏫'
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
    emoji: '🏪'
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
    emoji: '👨‍💼'
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
    emoji: '🛒'
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
