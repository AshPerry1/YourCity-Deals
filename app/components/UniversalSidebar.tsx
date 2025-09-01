'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { portalThemes, PortalTheme } from './UniversalPortalLayout';

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  description: string;
}

interface UniversalSidebarProps {
  theme: keyof typeof portalThemes;
  navigation: NavigationItem[];
  userInfo?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export default function UniversalSidebar({ theme, navigation, userInfo }: UniversalSidebarProps) {
  const pathname = usePathname();
  const themeConfig = portalThemes[theme];

  // Get theme-specific classes
  const getThemeClasses = (theme: keyof typeof portalThemes) => {
    switch (theme) {
      case 'student':
        return {
          header: 'bg-gradient-to-r from-green-600 via-green-700 to-emerald-800',
          activeLink: 'bg-green-50 text-green-600 border-l-4 border-green-600 shadow-sm',
          activeIcon: 'bg-green-100 text-green-600',
          hoverIcon: 'group-hover:bg-green-100 group-hover:text-green-600',
          activeText: 'text-green-700',
          activeSubtext: 'text-green-600',
          footerBg: 'bg-gradient-to-r from-gray-50 to-green-50',
          footerIcon: 'bg-gradient-to-r from-green-500 to-green-600'
        };
      case 'teacher':
        return {
          header: 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-800',
          activeLink: 'bg-orange-50 text-orange-600 border-l-4 border-orange-600 shadow-sm',
          activeIcon: 'bg-orange-100 text-orange-600',
          hoverIcon: 'group-hover:bg-orange-100 group-hover:text-orange-600',
          activeText: 'text-orange-600',
          activeSubtext: 'text-orange-600',
          footerBg: 'bg-gradient-to-r from-gray-50 to-orange-50',
          footerIcon: 'bg-gradient-to-r from-orange-500 to-red-600'
        };
      case 'merchant':
        return {
          header: 'bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800',
          activeLink: 'bg-purple-50 text-purple-600 border-l-4 border-purple-600 shadow-sm',
          activeIcon: 'bg-purple-100 text-purple-600',
          hoverIcon: 'group-hover:bg-purple-100 group-hover:text-purple-600',
          activeText: 'text-purple-600',
          activeSubtext: 'text-purple-600',
          footerBg: 'bg-gradient-to-r from-gray-50 to-purple-50',
          footerIcon: 'bg-gradient-to-r from-purple-500 to-purple-600'
        };
      case 'admin':
        return {
          header: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800',
          activeLink: 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 shadow-sm',
          activeIcon: 'bg-blue-100 text-blue-600',
          hoverIcon: 'group-hover:bg-blue-100 group-hover:text-blue-600',
          activeText: 'text-blue-600',
          activeSubtext: 'text-blue-600',
          footerBg: 'bg-gradient-to-r from-gray-50 to-blue-50',
          footerIcon: 'bg-gradient-to-r from-blue-500 to-blue-600'
        };
      case 'purchaser':
        return {
          header: 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800',
          activeLink: 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 shadow-sm',
          activeIcon: 'bg-indigo-100 text-indigo-600',
          hoverIcon: 'group-hover:bg-indigo-100 group-hover:text-indigo-600',
          activeText: 'text-indigo-600',
          activeSubtext: 'text-indigo-600',
          footerBg: 'bg-gradient-to-r from-gray-50 to-indigo-50',
          footerIcon: 'bg-gradient-to-r from-indigo-500 to-indigo-600'
        };
      default:
        return {
          header: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800',
          activeLink: 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 shadow-sm',
          activeIcon: 'bg-blue-100 text-blue-600',
          hoverIcon: 'group-hover:bg-blue-100 group-hover:text-blue-600',
          activeText: 'text-blue-600',
          activeSubtext: 'text-blue-600',
          footerBg: 'bg-gradient-to-r from-gray-50 to-blue-50',
          footerIcon: 'bg-gradient-to-r from-blue-500 to-blue-600'
        };
    }
  };

  const themeClasses = getThemeClasses(theme);

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl border-r border-gray-200">
      {/* Premium Header */}
      <div className={`h-20 flex items-center justify-center border-b border-gray-200 ${themeClasses.header}`}>
        <div className="text-center">
          <h1 className="text-xl font-bold text-white tracking-wide">YourCity Deals</h1>
          <p className="text-white text-opacity-80 text-sm font-medium">{themeConfig.name}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-start p-4 rounded-xl transition-all duration-200 ${
                  isActive
                    ? themeClasses.activeLink
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <div className={`p-2 rounded-lg mr-4 ${
                  isActive 
                    ? themeClasses.activeIcon
                    : `bg-gray-100 text-gray-600 ${themeClasses.hoverIcon}`
                } transition-colors duration-200`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${isActive ? themeClasses.activeText : 'text-gray-900'}`}>
                    {item.name}
                  </p>
                  <p className={`text-xs mt-1 ${isActive ? themeClasses.activeSubtext : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Premium Footer */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 ${themeClasses.footerBg}`}>
        <div className="text-center">
          <div className={`w-12 h-12 ${themeClasses.footerIcon} rounded-full mx-auto mb-3 flex items-center justify-center`}>
            <span className="text-white text-xl">{themeConfig.emoji}</span>
          </div>
          <div className="text-sm font-semibold text-gray-700">YourCity Deals</div>
          <div className="text-xs text-gray-500 mt-1">{themeConfig.name}</div>
        </div>
      </div>
    </div>
  );
}
