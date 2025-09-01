'use client';

import UniversalHeader from '@/app/components/UniversalHeader';

export default function StudentHeaderNew() {
  return (
    <UniversalHeader
      theme="student"
      userInfo={{
        name: "Alex Johnson",
        role: "Student",
        avatar: "A",
        school: "Lincoln High School"
      }}
    />
  );
}
