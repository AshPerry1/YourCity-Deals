'use client';

import UniversalHeader from '@/app/components/UniversalHeader';

export default function TeacherHeader() {
  return (
    <UniversalHeader
      theme="teacher"
      title="Teacher Portal"
      subtitle="Welcome back, Ms. Johnson!"
      userInfo={{
        name: "Sarah Johnson",
        role: "5th Grade Teacher",
        school: "Lincoln Elementary School"
      }}
    />
  );
}
