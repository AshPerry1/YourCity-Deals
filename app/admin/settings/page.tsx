import { Suspense } from 'react';
import SettingsHeader from './components/SettingsHeader';
import GeneralSettings from './components/GeneralSettings';
import SecuritySettings from './components/SecuritySettings';
import NotificationSettings from './components/NotificationSettings';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<div>Loading settings...</div>}>
        <SettingsHeader />
      </Suspense>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<div>Loading general settings...</div>}>
          <GeneralSettings />
        </Suspense>
        <Suspense fallback={<div>Loading security settings...</div>}>
          <SecuritySettings />
        </Suspense>
      </div>
      
      <Suspense fallback={<div>Loading notification settings...</div>}>
        <NotificationSettings />
      </Suspense>
    </div>
  );
}
