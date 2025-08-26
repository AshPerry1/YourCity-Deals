// Tutorial system for YourCity Deals
export type ConsoleKey = 'student' | 'parent' | 'merchant' | 'merchant_owner' | 'admin';

export interface TutorialStep {
  id: string;
  title: string;
  body: string;
  image?: string;
  action?: string;
  target?: string; // CSS selector for highlighting
}

export interface TutorialState {
  version: string;
  completed_at?: string;
  skipped_at?: string;
}

export interface OnboardingState {
  student?: TutorialState;
  parent?: TutorialState;
  merchant?: TutorialState;
  merchant_owner?: TutorialState;
  admin?: TutorialState;
}

// Tutorial versions - increment to show updated tutorials
export const TUTORIAL_VERSION: Record<ConsoleKey, string> = {
  student: "1.0.0",
  parent: "1.0.0",
  merchant: "1.0.0",
  merchant_owner: "1.0.0",
  admin: "1.0.0",
} as const;

// Tutorial steps for each console
export const TUTORIAL_STEPS: Record<ConsoleKey, TutorialStep[]> = {
  student: [
    {
      id: 'welcome',
      title: 'Welcome to YourCity Deals!',
      body: 'You\'re now part of our student sales team. Let\'s get you started with selling coupon books and earning rewards for your school.',
      image: '/images/tutorials/student-welcome.png'
    },
    {
      id: 'share-link',
      title: 'Share Your Referral Link',
      body: 'Tap the "Share Link" button to copy your unique referral link. Share it with friends, family, and community members to start earning sales.',
      action: 'Share your referral link',
      target: '[data-tutorial="share-link"]'
    },
    {
      id: 'track-sales',
      title: 'Track Your Sales',
      body: 'Monitor your progress on the dashboard. See your total sales, rank on the leaderboard, and track your goals.',
      target: '[data-tutorial="sales-stats"]'
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard Competition',
      body: 'Compete with other students on the leaderboard. Top sellers earn special rewards and recognition.',
      target: '[data-tutorial="leaderboard"]'
    },
    {
      id: 'support',
      title: 'Get Help When Needed',
      body: 'Need assistance? Use the Support section for FAQs, contact information, and helpful resources.',
      target: '[data-tutorial="support"]'
    }
  ],

  parent: [
    {
      id: 'welcome',
      title: 'Welcome to Parent/Teacher Dashboard',
      body: 'Monitor your student\'s progress and class performance. Track sales, view analytics, and support their fundraising efforts.',
      image: '/images/tutorials/parent-welcome.png'
    },
    {
      id: 'student-overview',
      title: 'Student Overview',
      body: 'View individual student performance, sales totals, and progress toward goals.',
      target: '[data-tutorial="student-overview"]'
    },
    {
      id: 'class-totals',
      title: 'Class Totals',
      body: 'See aggregated class performance with progress bars and comparison metrics.',
      target: '[data-tutorial="class-totals"]'
    },
    {
      id: 'progress-tracking',
      title: 'Progress Tracking',
      body: 'Monitor progress bars and goal completion for both individual students and the entire class.',
      target: '[data-tutorial="progress"]'
    },
    {
      id: 'exports',
      title: 'Reports & Exports',
      body: 'Download detailed reports and export data for record-keeping and analysis.',
      target: '[data-tutorial="exports"]'
    }
  ],

  merchant: [
    {
      id: 'welcome',
      title: 'Welcome to Merchant Console',
      body: 'You\'re ready to verify and redeem customer coupons. This quick tutorial will show you how to process redemptions efficiently.',
      image: '/images/tutorials/merchant-welcome.png'
    },
    {
      id: 'scan-qr',
      title: 'Scan QR Code or Enter Code',
      body: 'Use your camera to scan the customer\'s QR code, or manually enter the short redemption code.',
      action: 'Try scanning a QR code',
      target: '[data-tutorial="qr-scanner"]'
    },
    {
      id: 'enter-pin',
      title: 'Enter Your Merchant PIN',
      body: 'Confirm the redemption by entering your 4-digit merchant PIN. This prevents unauthorized redemptions.',
      target: '[data-tutorial="pin-input"]'
    },
    {
      id: 'approve',
      title: 'Approve Redemption',
      body: 'Review the coupon details and tap "Approve" to complete the redemption. You\'ll see a green confirmation screen.',
      action: 'Approve redemption',
      target: '[data-tutorial="approve-button"]'
    },
    {
      id: 'complete',
      title: 'Redemption Complete',
      body: 'The coupon is now locked and cannot be used again. The customer receives their discount immediately.',
      target: '[data-tutorial="success-message"]'
    }
  ],

  merchant_owner: [
    {
      id: 'welcome',
      title: 'Welcome to Merchant Owner Dashboard',
      body: 'Manage your business analytics, staff, and redemption operations. Monitor performance and optimize your coupon program.',
      image: '/images/tutorials/merchant-owner-welcome.png'
    },
    {
      id: 'business-analytics',
      title: 'Business Analytics',
      body: 'View detailed analytics including redemption rates, customer demographics, and revenue impact.',
      target: '[data-tutorial="analytics"]'
    },
    {
      id: 'team-management',
      title: 'Team Management',
      body: 'Manage your staff members, assign PINs, and control access to the merchant console.',
      target: '[data-tutorial="team-management"]'
    },
    {
      id: 'redemption-history',
      title: 'Redemption History',
      body: 'Track all redemptions, view detailed reports, and monitor staff performance.',
      target: '[data-tutorial="redemption-history"]'
    },
    {
      id: 'exports',
      title: 'Reports & Exports',
      body: 'Download comprehensive reports for accounting, tax purposes, and business analysis.',
      target: '[data-tutorial="exports"]'
    }
  ],

  admin: [
    {
      id: 'welcome',
      title: 'Welcome to Admin Console',
      body: 'You have full access to manage the YourCity Deals platform. Create schools, manage books, and monitor system performance.',
      image: '/images/tutorials/admin-welcome.png'
    },
    {
      id: 'schools',
      title: 'Manage Schools',
      body: 'Add new schools, manage existing ones, and configure school-specific settings.',
      target: '[data-tutorial="schools"]'
    },
    {
      id: 'books',
      title: 'Create Coupon Books',
      body: 'Design and publish coupon books with custom offers, branding, and school-specific content.',
      target: '[data-tutorial="books"]'
    },
    {
      id: 'analytics',
      title: 'System Analytics',
      body: 'Monitor platform-wide performance, sales metrics, and user engagement across all schools.',
      target: '[data-tutorial="analytics"]'
    },
    {
      id: 'payouts',
      title: 'School Payouts',
      body: 'Process school payouts, generate receipts, and manage financial reporting.',
      target: '[data-tutorial="payouts"]'
    }
  ]
};

// Tutorial completion status
export interface TutorialCompletion {
  console: ConsoleKey;
  version: string;
  completed_at: string;
  skipped_at?: string;
}

// Get auth token for API calls
async function getAuthToken(): Promise<string | null> {
  try {
    // This would typically come from your auth system
    // For now, we'll use a placeholder
    return localStorage.getItem('auth_token') || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

// Check if tutorial should be shown
export async function shouldShowTutorial(consoleKey: ConsoleKey): Promise<boolean> {
  try {
    // Check localStorage first for immediate response
    const local = JSON.parse(localStorage.getItem('onboarding_state') ?? '{}');
    const localVersion = local?.[consoleKey]?.version;
    const currentVersion = TUTORIAL_VERSION[consoleKey];

    // If localStorage shows completion with current version, don't show
    if (localVersion === currentVersion && local?.[consoleKey]?.completed_at) {
      return false;
    }

    // Check server state
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/tutorials/status', { headers });
    if (!response.ok) {
      // Fallback to localStorage decision
      return !localVersion || localVersion !== currentVersion;
    }

    const serverState: OnboardingState = await response.json();
    const serverVersion = serverState?.[consoleKey]?.version;

    // Show if no server record or version mismatch
    return !serverVersion || serverVersion !== currentVersion;
  } catch (error) {
    console.error('Error checking tutorial status:', error);
    // Fallback to localStorage
    const local = JSON.parse(localStorage.getItem('onboarding_state') ?? '{}');
    const localVersion = local?.[consoleKey]?.version;
    const currentVersion = TUTORIAL_VERSION[consoleKey];
    return !localVersion || localVersion !== currentVersion;
  }
}

// Mark tutorial as completed
export async function markTutorialCompleted(consoleKey: ConsoleKey, skipped: boolean = false): Promise<void> {
  const completion: TutorialCompletion = {
    console: consoleKey,
    version: TUTORIAL_VERSION[consoleKey],
    completed_at: new Date().toISOString(),
    ...(skipped && { skipped_at: new Date().toISOString() })
  };

  try {
    // Update server
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    await fetch('/api/tutorials/complete', {
      method: 'POST',
      headers,
      body: JSON.stringify(completion)
    });
  } catch (error) {
    console.error('Error updating server tutorial status:', error);
  }

  // Update localStorage
  const local = JSON.parse(localStorage.getItem('onboarding_state') ?? '{}');
  local[consoleKey] = {
    version: TUTORIAL_VERSION[consoleKey],
    completed_at: completion.completed_at,
    ...(skipped && { skipped_at: completion.skipped_at })
  };
  localStorage.setItem('onboarding_state', JSON.stringify(local));
}

// Get tutorial steps for a console
export function getTutorialSteps(consoleKey: ConsoleKey): TutorialStep[] {
  return TUTORIAL_STEPS[consoleKey] || [];
}

// Get current tutorial version
export function getTutorialVersion(consoleKey: ConsoleKey): string {
  return TUTORIAL_VERSION[consoleKey];
}

// Check if tutorial was skipped
export function wasTutorialSkipped(consoleKey: ConsoleKey): boolean {
  const local = JSON.parse(localStorage.getItem('onboarding_state') ?? '{}');
  return !!local?.[consoleKey]?.skipped_at;
}

// Reset tutorial state (for testing or manual reset)
export function resetTutorialState(consoleKey: ConsoleKey): void {
  const local = JSON.parse(localStorage.getItem('onboarding_state') ?? '{}');
  delete local[consoleKey];
  localStorage.setItem('onboarding_state', JSON.stringify(local));
}

// Get all tutorial states
export function getAllTutorialStates(): OnboardingState {
  return JSON.parse(localStorage.getItem('onboarding_state') ?? '{}');
}
