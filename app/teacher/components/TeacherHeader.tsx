'use client';

import UniversalHeader from '@/app/components/UniversalHeader';

export default function TeacherHeader() {
  return (
    <UniversalHeader
      theme="teacher"
      userInfo={{
        name: "Sarah Johnson",
        role: "5th Grade Teacher",
        school: "Lincoln Elementary School"
      }}
    />
  );
}
