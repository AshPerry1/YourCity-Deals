'use client';

import UniversalHeader from '@/app/components/UniversalHeader';

export default function AdminHeaderNew() {
  return (
    <UniversalHeader
      theme="admin"
      userInfo={{
        name: "System Admin",
        role: "Administrator",
        avatar: "A",
        school: "YourCity Deals Platform"
      }}
    />
  );
}
