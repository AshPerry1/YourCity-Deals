import { Suspense } from 'react';
import ProfileForm from './components/ProfileForm';
import AccountSettings from './components/AccountSettings';
import NotificationPreferences from './components/NotificationPreferences';

export default function ProfilePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and account settings</p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">E</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Form */}
        <Suspense fallback={<div>Loading profile form...</div>}>
          <ProfileForm />
        </Suspense>

        {/* Account Settings */}
        <Suspense fallback={<div>Loading account settings...</div>}>
          <AccountSettings />
        </Suspense>
      </div>

      {/* Notification Preferences */}
      <Suspense fallback={<div>Loading notification preferences...</div>}>
        <NotificationPreferences />
      </Suspense>
    </div>
  );
}
