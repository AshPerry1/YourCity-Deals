import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/StudentHeader';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <StudentSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-72">
        {/* Header */}
        <StudentHeader />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
