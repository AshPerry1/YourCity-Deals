import { ReactNode } from 'react';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 ml-72">
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
