import AdminSidebarNew from './components/AdminSidebarNew';
import AdminHeaderNew from './components/AdminHeaderNew';
import { NotificationProvider } from '../components/NotificationSystem';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebarNew />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden ml-72">
          {/* Header */}
          <AdminHeaderNew />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}
