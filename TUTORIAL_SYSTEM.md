# Tutorial System Implementation

## Overview

The YourCity Deals platform includes a comprehensive first-time setup tutorial system that automatically shows role-specific tutorials on first visit to each console. The system supports versioning, persistence, and accessibility features.

## Features

### ✅ **Auto-Show on First Visit**
- Detects first visit per role/console
- Automatically opens guided tutorial modal
- Prevents re-showing after completion or skip

### ✅ **Persistent State Management**
- Server-side storage in `user_profiles.onboarding_state`
- LocalStorage fallback for immediate response
- Version-based updates for tutorial changes

### ✅ **Role-Specific Content**
- **Student**: Share links, track sales, leaderboard, support
- **Parent/Teacher**: Student overview, class totals, progress, exports
- **Merchant**: QR scanning, PIN entry, approval process
- **Merchant Owner**: Analytics, team management, reports
- **Admin**: CRUD operations, analytics, payouts, accounting

### ✅ **Accessibility & UX**
- Keyboard navigation (Tab, Arrow keys, Enter, Escape)
- Screen reader support with ARIA labels
- Touch-friendly design (44px minimum targets)
- Reduced motion support
- Focus management and trapping

### ✅ **Version Management**
- Increment versions to show updated tutorials
- Automatic detection of version changes
- Backward compatibility with existing completions

## Implementation

### Core Files

#### `lib/tutorials.ts`
Core tutorial system with:
- Type definitions and interfaces
- Tutorial step definitions for each role
- Version management constants
- State checking and completion functions

#### `app/components/TutorialModal.tsx`
Main tutorial modal component with:
- Step-by-step navigation
- Progress tracking
- Keyboard shortcuts
- Accessibility features
- Target element highlighting

#### `app/hooks/useTutorial.ts`
Custom hook for easy integration:
- Auto-show logic
- State management
- Loading states
- Error handling

#### `app/components/HelpMenu.tsx`
Help menu component with:
- Tutorial access
- FAQ links
- Support contact
- Role-specific branding

#### API Routes
- `/api/tutorials/status` - Get user's tutorial completion status
- `/api/tutorials/complete` - Mark tutorial as completed/skipped

### Database Schema

#### `user_profiles.onboarding_state` (JSONB)
```json
{
  "student": {
    "version": "1.0.0",
    "completed_at": "2025-01-27T12:34:56Z",
    "skipped_at": null
  },
  "admin": {
    "version": "1.0.0",
    "completed_at": null,
    "skipped_at": "2025-01-27T12:34:56Z"
  }
}
```

## Usage Examples

### Basic Integration

```tsx
import { useTutorial } from '@/app/hooks/useTutorial';
import TutorialModal from '@/app/components/TutorialModal';
import HelpMenu from '@/app/components/HelpMenu';

export default function StudentDashboard() {
  const {
    isTutorialOpen,
    tutorialSteps,
    showTutorial,
    completeTutorial,
    skipTutorial,
    isLoading
  } = useTutorial('student');

  return (
    <div className="main-content">
      {/* Header with Help Menu */}
      <div className="flex justify-between items-center mb-6">
        <h1>Student Dashboard</h1>
        <HelpMenu 
          consoleKey="student" 
          onShowTutorial={showTutorial} 
        />
      </div>

      {/* Tutorial Target Elements */}
      <div data-tutorial="share-link">
        <button className="btn btn--primary">Share Link</button>
      </div>

      <div data-tutorial="sales-stats">
        <div className="stats-grid">
          {/* Sales statistics */}
        </div>
      </div>

      {/* Tutorial Modal */}
      <TutorialModal
        consoleKey="student"
        steps={tutorialSteps}
        isOpen={isTutorialOpen}
        onClose={skipTutorial}
        onComplete={completeTutorial}
      />
    </div>
  );
}
```

### Advanced Integration with Custom Steps

```tsx
import { getTutorialSteps, TutorialStep } from '@/lib/tutorials';

// Custom tutorial steps for specific features
const customSteps: TutorialStep[] = [
  {
    id: 'custom-feature',
    title: 'Custom Feature',
    body: 'This is a custom tutorial step for a specific feature.',
    target: '[data-tutorial="custom-feature"]',
    action: 'Try the feature'
  }
];

// Combine with default steps
const allSteps = [...getTutorialSteps('student'), ...customSteps];
```

## Tutorial Content

### Student Tutorial Steps
1. **Welcome** - Introduction to student role
2. **Share Link** - How to share referral links
3. **Track Sales** - Monitor progress and goals
4. **Leaderboard** - Competition and rewards
5. **Support** - Getting help and resources

### Parent/Teacher Tutorial Steps
1. **Welcome** - Introduction to monitoring role
2. **Student Overview** - Individual student tracking
3. **Class Totals** - Aggregated performance
4. **Progress Tracking** - Goal completion monitoring
5. **Reports & Exports** - Data export functionality

### Merchant Tutorial Steps
1. **Welcome** - Introduction to merchant console
2. **Scan QR** - QR code scanning process
3. **Enter PIN** - Merchant PIN verification
4. **Approve** - Redemption approval process
5. **Complete** - Confirmation and completion

### Merchant Owner Tutorial Steps
1. **Welcome** - Introduction to business management
2. **Business Analytics** - Performance metrics
3. **Team Management** - Staff and PIN management
4. **Redemption History** - Transaction tracking
5. **Reports & Exports** - Business reporting

### Admin Tutorial Steps
1. **Welcome** - Introduction to admin console
2. **Manage Schools** - School administration
3. **Create Books** - Coupon book creation
4. **System Analytics** - Platform-wide metrics
5. **School Payouts** - Financial management

## Styling and CSS

### Tutorial Highlight Styles
```css
.tutorial-highlight {
  position: relative;
  z-index: 10;
  box-shadow: 0 0 0 4px rgba(107, 61, 240, 0.3), 0 0 20px rgba(107, 61, 240, 0.2);
  border-radius: 8px;
  animation: tutorial-pulse 2s ease-in-out infinite;
}

@keyframes tutorial-pulse {
  0%, 100% {
    box-shadow: 0 0 0 4px rgba(107, 61, 240, 0.3), 0 0 20px rgba(107, 61, 240, 0.2);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(107, 61, 240, 0.4), 0 0 30px rgba(107, 61, 240, 0.3);
  }
}
```

### Modal Styles
```css
.tutorial-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  animation: tutorial-slide-in 0.3s ease-out;
}
```

## API Endpoints

### GET `/api/tutorials/status`
Retrieves user's tutorial completion status.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "student": {
    "version": "1.0.0",
    "completed_at": "2025-01-27T12:34:56Z"
  },
  "admin": {
    "version": "1.0.0",
    "skipped_at": "2025-01-27T12:34:56Z"
  }
}
```

### POST `/api/tutorials/complete`
Marks tutorial as completed or skipped.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "console": "student",
  "version": "1.0.0",
  "completed_at": "2025-01-27T12:34:56Z",
  "skipped_at": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tutorial completion status updated",
  "state": {
    "student": {
      "version": "1.0.0",
      "completed_at": "2025-01-27T12:34:56Z"
    }
  }
}
```

## Version Management

### Updating Tutorials
To update a tutorial and show it to users again:

1. **Increment version** in `lib/tutorials.ts`:
```typescript
export const TUTORIAL_VERSION: Record<ConsoleKey, string> = {
  student: "1.1.0", // Increment from "1.0.0"
  parent: "1.0.0",
  merchant: "1.0.0",
  merchant_owner: "1.0.0",
  admin: "1.0.0",
} as const;
```

2. **Update tutorial steps** if needed:
```typescript
export const TUTORIAL_STEPS: Record<ConsoleKey, TutorialStep[]> = {
  student: [
    // Updated steps...
  ],
  // ...
};
```

3. **Deploy changes** - users will automatically see the updated tutorial

### Version Checking Logic
```typescript
// Check if tutorial should be shown
const shouldShow = !serverVersion || serverVersion !== currentVersion;
```

## Testing

### Manual Testing Checklist

#### First Visit Testing
- [ ] Visit console for first time
- [ ] Tutorial modal opens automatically
- [ ] Progress bar shows correct step
- [ ] Navigation buttons work (Previous/Next)
- [ ] Skip button works
- [ ] "Don't show again" works

#### Persistence Testing
- [ ] Complete tutorial
- [ ] Refresh page
- [ ] Tutorial doesn't show again
- [ ] Check localStorage for state
- [ ] Check server for state

#### Version Update Testing
- [ ] Increment tutorial version
- [ ] Visit console again
- [ ] Tutorial shows with new version
- [ ] Complete new tutorial
- [ ] State updates correctly

#### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Focus management works
- [ ] Escape key closes modal
- [ ] Reduced motion respected

### Automated Testing

```typescript
// Example test for tutorial completion
describe('Tutorial System', () => {
  it('should mark tutorial as completed', async () => {
    const consoleKey = 'student';
    
    // Mock localStorage
    localStorage.setItem('onboarding_state', '{}');
    
    // Complete tutorial
    await markTutorialCompleted(consoleKey, false);
    
    // Check localStorage
    const state = JSON.parse(localStorage.getItem('onboarding_state') || '{}');
    expect(state[consoleKey].completed_at).toBeDefined();
    expect(state[consoleKey].version).toBe(TUTORIAL_VERSION[consoleKey]);
  });
});
```

## Troubleshooting

### Common Issues

#### Tutorial Not Showing
1. Check if user has completed tutorial before
2. Verify version matches current version
3. Check localStorage for cached state
4. Verify API endpoints are working

#### Tutorial Not Completing
1. Check network requests to `/api/tutorials/complete`
2. Verify authentication token
3. Check server logs for errors
4. Verify database permissions

#### Target Elements Not Highlighting
1. Check CSS selectors in tutorial steps
2. Verify elements exist in DOM
3. Check z-index conflicts
4. Verify CSS classes are applied

### Debug Tools

#### Reset Tutorial State
```typescript
import { resetTutorialState } from '@/lib/tutorials';

// Reset specific console
resetTutorialState('student');

// Reset all tutorials
localStorage.removeItem('onboarding_state');
```

#### Check Tutorial Status
```typescript
import { getAllTutorialStates } from '@/lib/tutorials';

// View all tutorial states
console.log(getAllTutorialStates());
```

## Performance Considerations

### Optimization Strategies
1. **LocalStorage First** - Check localStorage before API calls
2. **Lazy Loading** - Load tutorial content only when needed
3. **Image Optimization** - Compress tutorial images
4. **Caching** - Cache tutorial steps and images

### Bundle Size Impact
- Tutorial system adds ~15KB to bundle
- Images loaded on-demand
- Steps defined at build time
- Minimal runtime overhead

## Future Enhancements

### Planned Features
1. **Interactive Tutorials** - Click-through guided tours
2. **Video Tutorials** - Embedded video content
3. **Progressive Disclosure** - Show advanced features later
4. **A/B Testing** - Test different tutorial approaches
5. **Analytics** - Track tutorial completion rates

### Customization Options
1. **White-label Tutorials** - Custom content per school
2. **Role-based Customization** - Different content per user type
3. **Dynamic Content** - Personalized tutorial content
4. **Multi-language Support** - Internationalization

## Conclusion

The tutorial system provides a comprehensive onboarding experience that helps users understand and effectively use the YourCity Deals platform. With automatic detection, persistent state management, and accessibility features, it ensures a smooth user experience across all roles and devices.

The system is designed to be maintainable, scalable, and user-friendly, with clear separation of concerns and robust error handling. Future enhancements can be easily integrated without breaking existing functionality.
