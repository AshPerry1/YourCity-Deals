import { NotificationProvider } from '../components/NotificationSystem';
import UniversalSidebar from '../components/UniversalSidebar';
import UniversalHeader from '../components/UniversalHeader';

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = [
    { name: 'Analytics', href: '/merchant', icon: '📊', current: true, description: 'View business analytics and reports' },
    { name: 'Create Offers', href: '/merchant/offers/new', icon: '➕', current: false, description: 'Create new coupon offers' },
    { name: 'Verify Coupons', href: '/merchant/verify', icon: '🎫', current: false, description: 'Verify and redeem coupons' },
    { name: 'Staff Management', href: '/merchant/staff', icon: '👥', current: false, description: 'Manage staff and permissions' },
    { name: 'Store Settings', href: '/merchant/settings', icon: '⚙️', current: false, description: 'Configure store settings' },
  ];

  const userInfo = {
    name: "Restaurant Owner",
    role: "Merchant",
    avatar: "R",
    school: "Downtown Restaurant"
  };

  return (
    <NotificationProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <UniversalSidebar 
          theme="merchant"
          navigation={navigation}
          userInfo={userInfo}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden ml-72">
          {/* Header */}
          <UniversalHeader 
            theme="merchant"
            userInfo={userInfo}
          />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}
