'use client';

import { useState, useEffect } from 'react';
import { ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';

// Types
type AudienceType = 'buyer' | 'seller' | 'organization' | 'merchant';

interface Participant {
  id?: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  jobTitle: string;
  specialties: string[];
  background: string;
  howGotJob: string;
  // Demographic data
  age: string;
  gender: string;
  zipCode: string;
  householdIncome: string;
  education: string;
  householdSize: string;
  childrenInSchool: string;
  commuteAreas: string;
  photo?: string; // Base64 encoded image data
}

interface ResearchQuestion {
  id: string;
  audienceType: AudienceType;
  questionText: string;
  category: string;
  suggestedQuestions: InterviewQuestion[];
}

interface InterviewQuestion {
  id: string;
  researchQuestionId: string;
  promptText: string;
  answerType: 'text' | 'yesno' | 'scale' | 'currency' | 'multiselect';
  options?: string[];
}

interface SessionResponse {
  id?: string;
  sessionId: string;
  researchQuestionId: string;
  interviewQuestionId?: string;
  answerText?: string;
  answerYesno?: boolean;
  answerScale?: number;
  answerCurrencyCents?: number;
  answerMultiselect?: string[];
  notes?: string;
  isUnanswered?: boolean;
}

interface InterviewSession {
  id?: string;
  audienceType: AudienceType;
  interviewerName: string;
  colorTheme: string;
  summaryTakeaways: string;
  summaryProblems: string;
  summaryOpportunities: string;
  summaryQuote: string;
  participant?: Participant;
  selectedResearchQuestions: ResearchQuestion[];
  responses: SessionResponse[];
  createdAt?: string;
  updatedAt?: string;
}

// Mock data service
class MockDataService {
  private static instance: MockDataService;
  private sessions: InterviewSession[] = [];
  private researchQuestions: ResearchQuestion[] = [];

  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  constructor() {
    this.initializeResearchQuestions();
  }

  private initializeResearchQuestions() {
    this.researchQuestions = [
      // Buyer questions
      {
        id: 'b1',
        audienceType: 'buyer',
        questionText: 'Problem & Current Behavior',
        category: 'Behavior',
        suggestedQuestions: [
          { id: 'b1q1', researchQuestionId: 'b1', promptText: 'Tell me about the last time you bought (or skipped) a coupon book. What happened?', answerType: 'text' },
          { id: 'b1q2', researchQuestionId: 'b1', promptText: "What's the most annoying part of physical books?", answerType: 'text' },
          { id: 'b1q3', researchQuestionId: 'b1', promptText: 'Would you consider a digital-only version?', answerType: 'yesno' },
        ]
      },
      {
        id: 'b2',
        audienceType: 'buyer',
        questionText: 'Willingness to Pay',
        category: 'Pricing',
        suggestedQuestions: [
          { id: 'b2q1', researchQuestionId: 'b2', promptText: 'Would you pay for a digital book that supports local schools?', answerType: 'yesno' },
          { id: 'b2q2', researchQuestionId: 'b2', promptText: 'How much would you likely pay?', answerType: 'currency' },
          { id: 'b2q3', researchQuestionId: 'b2', promptText: 'What price feels too expensive?', answerType: 'currency' },
        ]
      },
      {
        id: 'b3',
        audienceType: 'buyer',
        questionText: 'Feature Priorities',
        category: 'Features',
        suggestedQuestions: [
          { 
            id: 'b3q1', 
            researchQuestionId: 'b3', 
            promptText: 'Which features would you use?', 
            answerType: 'multiselect',
            options: ['Apple/Google Pay', 'Add to home screen', 'Location-aware deals', 'Share a coupon', 'Notifications', 'Gifting']
          },
          { id: 'b3q2', researchQuestionId: 'b3', promptText: 'Rank usefulness 1–10 for "tap to redeem + QR scan"', answerType: 'scale' },
        ]
      },
      {
        id: 'b4',
        audienceType: 'buyer',
        questionText: 'Trust & Redemption',
        category: 'Trust',
        suggestedQuestions: [
          { id: 'b4q1', researchQuestionId: 'b4', promptText: 'Would you trust scanning a QR at the register to redeem?', answerType: 'yesno' },
          { id: 'b4q2', researchQuestionId: 'b4', promptText: 'What would help you feel confident (receipt note, green screen, history)?', answerType: 'text' },
        ]
      },
      {
        id: 'b5',
        audienceType: 'buyer',
        questionText: 'Adoption & Sharing',
        category: 'Adoption',
        suggestedQuestions: [
          { 
            id: 'b5q1', 
            researchQuestionId: 'b5', 
            promptText: 'How would you discover this?', 
            answerType: 'multiselect',
            options: ['Friend', 'School', 'Social media', 'Email']
          },
          { id: 'b5q2', researchQuestionId: 'b5', promptText: 'Would you gift a book? Why or why not?', answerType: 'yesno' },
        ]
      },
      {
        id: 'b6',
        audienceType: 'buyer',
        questionText: 'Usage Frequency & Retention',
        category: 'Retention',
        suggestedQuestions: [
          { 
            id: 'b6q1', 
            researchQuestionId: 'b6', 
            promptText: 'How often would you use a local deals app?', 
            answerType: 'multiselect',
            options: ['Weekly', 'Monthly', 'Seasonal', 'Rarely']
          },
          { id: 'b6q2', researchQuestionId: 'b6', promptText: 'What would keep you coming back?', answerType: 'text' },
        ]
      },
      {
        id: 'b7',
        audienceType: 'buyer',
        questionText: 'Notifications & Privacy',
        category: 'Privacy',
        suggestedQuestions: [
          { id: 'b7q1', researchQuestionId: 'b7', promptText: 'Do you want location-based reminders?', answerType: 'yesno' },
          { id: 'b7q2', researchQuestionId: 'b7', promptText: 'What notifications are helpful vs. annoying?', answerType: 'text' },
        ]
      },
      {
        id: 'b8',
        audienceType: 'buyer',
        questionText: 'Demographics & Context',
        category: 'Demographics',
        suggestedQuestions: [
          { id: 'b8q1', researchQuestionId: 'b8', promptText: 'ZIP code', answerType: 'text' },
          { id: 'b8q2', researchQuestionId: 'b8', promptText: 'Household context (kids in school? commute areas?)', answerType: 'text' },
        ]
      },
      // Seller questions
      {
        id: 's1',
        audienceType: 'seller',
        questionText: 'Past Fundraising Experience',
        category: 'Experience',
        suggestedQuestions: [
          { id: 's1q1', researchQuestionId: 's1', promptText: 'Tell me about the last time you sold for a fundraiser. What worked?', answerType: 'text' },
          { id: 's1q2', researchQuestionId: 's1', promptText: 'Biggest frustrations?', answerType: 'text' },
        ]
      },
      {
        id: 's2',
        audienceType: 'seller',
        questionText: 'Motivation & Incentives',
        category: 'Motivation',
        suggestedQuestions: [
          { 
            id: 's2q1', 
            researchQuestionId: 's2', 
            promptText: 'What would motivate you to sell a digital coupon book?', 
            answerType: 'multiselect',
            options: ['Free book', 'Badges', 'Leaderboard', 'Impact on org']
          },
          { id: 's2q2', researchQuestionId: 's2', promptText: 'Would you sell even if funds go to the org (not you)?', answerType: 'yesno' },
        ]
      },
      {
        id: 's3',
        audienceType: 'seller',
        questionText: 'Tools & Channels',
        category: 'Tools',
        suggestedQuestions: [
          { id: 's3q1', researchQuestionId: 's3', promptText: 'How would you share your link?', answerType: 'text' },
          { 
            id: 's3q2', 
            researchQuestionId: 's3', 
            promptText: 'Preferred sharing methods', 
            answerType: 'multiselect',
            options: ['Text', 'Social media', 'Email', 'QR poster']
          },
          { id: 's3q3', researchQuestionId: 's3', promptText: 'Would a real-time dashboard (clicks/sales) motivate you?', answerType: 'yesno' },
        ]
      },
      {
        id: 's4',
        audienceType: 'seller',
        questionText: 'Goal Tracking',
        category: 'Goals',
        suggestedQuestions: [
          { id: 's4q1', researchQuestionId: 's4', promptText: 'What personal goal would you set (books sold)?', answerType: 'text' },
          { id: 's4q2', researchQuestionId: 's4', promptText: 'Do progress bars/badges help?', answerType: 'yesno' },
        ]
      },
      {
        id: 's5',
        audienceType: 'seller',
        questionText: 'Onboarding & Ease',
        category: 'Onboarding',
        suggestedQuestions: [
          { id: 's5q1', researchQuestionId: 's5', promptText: 'What would make it easy to get started (invite link, short tutorial)?', answerType: 'text' },
        ]
      },
      {
        id: 's6',
        audienceType: 'seller',
        questionText: 'Trust & Accountability',
        category: 'Trust',
        suggestedQuestions: [
          { id: 's6q1', researchQuestionId: 's6', promptText: 'Do you trust that your sales will be tracked accurately?', answerType: 'yesno' },
          { id: 's6q2', researchQuestionId: 's6', promptText: 'What would give you confidence?', answerType: 'text' },
        ]
      },
      // Organization questions
      {
        id: 'o1',
        audienceType: 'organization',
        questionText: 'Current Fundraising Process',
        category: 'Process',
        suggestedQuestions: [
          { id: 'o1q1', researchQuestionId: 'o1', promptText: 'How do you run fundraisers today? What\'s hard?', answerType: 'text' },
          { id: 'o1q2', researchQuestionId: 'o1', promptText: 'What success looks like for you?', answerType: 'text' },
        ]
      },
      {
        id: 'o2',
        audienceType: 'organization',
        questionText: 'Adoption & Governance',
        category: 'Governance',
        suggestedQuestions: [
          { id: 'o2q1', researchQuestionId: 'o2', promptText: 'Would you consider a digital coupon book model?', answerType: 'yesno' },
          { 
            id: 'o2q2', 
            researchQuestionId: 'o2', 
            promptText: 'What approval/oversight do you need?', 
            answerType: 'multiselect',
            options: ['Reports', 'Payouts', 'Audit trail', 'Seller tracking']
          },
        ]
      },
      {
        id: 'o3',
        audienceType: 'organization',
        questionText: 'Goals & Economics',
        category: 'Economics',
        suggestedQuestions: [
          { id: 'o3q1', researchQuestionId: 'o3', promptText: 'First-campaign goal ($ raised)?', answerType: 'currency' },
          { id: 'o3q2', researchQuestionId: 'o3', promptText: 'What split or payout cadence works for you?', answerType: 'text' },
        ]
      },
      {
        id: 'o4',
        audienceType: 'organization',
        questionText: 'Seller Management',
        category: 'Management',
        suggestedQuestions: [
          { id: 'o4q1', researchQuestionId: 'o4', promptText: 'How do you recruit/track sellers today?', answerType: 'text' },
          { id: 'o4q2', researchQuestionId: 'o4', promptText: 'Would leaderboards and seller dashboards help?', answerType: 'yesno' },
        ]
      },
      {
        id: 'o5',
        audienceType: 'organization',
        questionText: 'Comms & Support',
        category: 'Support',
        suggestedQuestions: [
          { id: 'o5q1', researchQuestionId: 'o5', promptText: 'What announcements or templates do you need?', answerType: 'text' },
          { 
            id: 'o5q2', 
            researchQuestionId: 'o5', 
            promptText: 'Preferred support channel?', 
            answerType: 'multiselect',
            options: ['Email', 'Phone', 'Portal', 'In-person']
          },
        ]
      },
      {
        id: 'o6',
        audienceType: 'organization',
        questionText: 'Privacy & Safety',
        category: 'Privacy',
        suggestedQuestions: [
          { id: 'o6q1', researchQuestionId: 'o6', promptText: 'What data should sellers/orgs see vs. not see?', answerType: 'text' },
        ]
      },
      // Merchant questions
      {
        id: 'm1',
        audienceType: 'merchant',
        questionText: 'Current Promotions',
        category: 'Promotions',
        suggestedQuestions: [
          { id: 'm1q1', researchQuestionId: 'm1', promptText: 'How do you drive foot traffic now (discounts, loyalty)?', answerType: 'text' },
          { id: 'm1q2', researchQuestionId: 'm1', promptText: 'What works best/least?', answerType: 'text' },
        ]
      },
      {
        id: 'm2',
        audienceType: 'merchant',
        questionText: 'Willingness to Participate',
        category: 'Participation',
        suggestedQuestions: [
          { id: 'm2q1', researchQuestionId: 'm2', promptText: 'Would you offer a coupon in a local book for exposure?', answerType: 'yesno' },
          { 
            id: 'm2q2', 
            researchQuestionId: 'm2', 
            promptText: 'What incentive helps most?', 
            answerType: 'multiselect',
            options: ['Video promo', 'Inclusion in book', 'Analytics', 'Customer data']
          },
        ]
      },
      {
        id: 'm3',
        audienceType: 'merchant',
        questionText: 'Offer Structure',
        category: 'Offers',
        suggestedQuestions: [
          { 
            id: 'm3q1', 
            researchQuestionId: 'm3', 
            promptText: 'What offer types fit you?', 
            answerType: 'multiselect',
            options: ['$ off', '% off', 'BOGO', 'Free item with purchase']
          },
          { id: 'm3q2', researchQuestionId: 'm3', promptText: 'What limits matter (day/time, one per visit)?', answerType: 'text' },
        ]
      },
      {
        id: 'm4',
        audienceType: 'merchant',
        questionText: 'Redemption Trust',
        category: 'Trust',
        suggestedQuestions: [
          { id: 'm4q1', researchQuestionId: 'm4', promptText: 'Is a QR + green/red screen acceptable at the register?', answerType: 'yesno' },
          { id: 'm4q2', researchQuestionId: 'm4', promptText: 'Do you need a short code backup?', answerType: 'yesno' },
        ]
      },
      {
        id: 'm5',
        audienceType: 'merchant',
        questionText: 'Analytics & ROI',
        category: 'Analytics',
        suggestedQuestions: [
          { id: 'm5q1', researchQuestionId: 'm5', promptText: 'Would seeing redemptions by date/location help?', answerType: 'yesno' },
          { 
            id: 'm5q2', 
            researchQuestionId: 'm5', 
            promptText: 'What ROI metrics matter most?', 
            answerType: 'multiselect',
            options: ['New customers', 'Repeat visits', 'Avg ticket', 'Customer lifetime value']
          },
        ]
      },
      {
        id: 'm6',
        audienceType: 'merchant',
        questionText: 'Operational Fit',
        category: 'Operations',
        suggestedQuestions: [
          { id: 'm6q1', researchQuestionId: 'm6', promptText: 'Any friction at checkout we should address?', answerType: 'text' },
          { id: 'm6q2', researchQuestionId: 'm6', promptText: 'Preferred staff instructions (1-step, minimal training)?', answerType: 'text' },
        ]
      },
    ];
  }

  getResearchQuestions(audienceType: AudienceType): ResearchQuestion[] {
    return this.researchQuestions.filter(q => q.audienceType === audienceType);
  }

  getAllResearchQuestions(): ResearchQuestion[] {
    return this.researchQuestions;
  }

  async saveSession(session: InterviewSession): Promise<void> {
    const existingIndex = this.sessions.findIndex(s => s.id === session.id);
    if (existingIndex >= 0) {
      this.sessions[existingIndex] = { ...session, updatedAt: new Date().toISOString() };
    } else {
      this.sessions.push({ 
        ...session, 
        id: `session_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    // Simulate autosave delay
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  getSession(sessionId: string): InterviewSession | null {
    return this.sessions.find(s => s.id === sessionId) || null;
  }

  getAllSessions(): InterviewSession[] {
    return this.sessions;
  }
}

// Color themes using YourCity Deals brand colors
const colorThemes = {
  buyer: {
    primary: 'primary',
    bg: 'bg-blue-50',
    text: 'text-gray-900',
    border: 'border-blue-200',
    accent: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
    accentText: 'text-blue-600',
    brand: 'bg-blue-600',
  },
  seller: {
    primary: 'secondary',
    bg: 'bg-green-50',
    text: 'text-gray-900',
    border: 'border-green-200',
    accent: 'bg-green-600',
    accentHover: 'hover:bg-green-700',
    accentText: 'text-green-600',
    brand: 'bg-green-600',
  },
  organization: {
    primary: 'success',
    bg: 'bg-orange-50',
    text: 'text-gray-900',
    border: 'border-orange-200',
    accent: 'bg-orange-600',
    accentHover: 'hover:bg-orange-700',
    accentText: 'text-orange-600',
    brand: 'bg-orange-600',
  },
  merchant: {
    primary: 'warning',
    bg: 'bg-purple-50',
    text: 'text-gray-900',
    border: 'border-purple-200',
    accent: 'bg-purple-600',
    accentHover: 'hover:bg-purple-700',
    accentText: 'text-purple-600',
    brand: 'bg-purple-600',
  },
};

// Audience data
const audiences = [
  {
    id: 'buyer' as AudienceType,
    name: 'Buyer',
    subtitle: 'Purchaser',
    icon: '🛒',
    color: 'blue',
    description: 'People who purchase coupon books'
  },
  {
    id: 'seller' as AudienceType,
    name: 'Seller',
    subtitle: 'Ambassador',
    icon: '👥',
    color: 'purple',
    description: 'People who sell coupon books'
  },
  {
    id: 'organization' as AudienceType,
    name: 'Organization',
    subtitle: 'Fundraiser',
    icon: '🏫',
    color: 'green',
    description: 'Schools and organizations running fundraisers'
  },
  {
    id: 'merchant' as AudienceType,
    name: 'Merchant',
    subtitle: 'Business',
    icon: '🏪',
    color: 'orange',
    description: 'Local businesses offering deals'
  },
];

// Stepper component
const Stepper = ({ currentStep, totalSteps, theme }: { currentStep: number; totalSteps: number; theme: any }) => {
  const steps = ['Audience', 'Participant', 'Research', 'Interview', 'Summary'];
  
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              index <= currentStep 
                ? `${theme.accent} text-white border-current` 
                : 'bg-gray-100 border-gray-300 text-gray-400'
            }`}>
              {index < currentStep ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </div>
            <span className={`ml-3 text-sm font-medium ${
              index <= currentStep ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <ChevronRightIcon className="w-4 h-4 mx-4 text-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component
export default function InterviewTool() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAudience, setSelectedAudience] = useState<AudienceType | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const dataService = MockDataService.getInstance();
  const theme = selectedAudience ? colorThemes[selectedAudience] : colorThemes.buyer;

  // Initialize session
  useEffect(() => {
    if (!session) {
      const newSession: InterviewSession = {
        audienceType: 'buyer',
        interviewerName: 'Ash Perry',
        colorTheme: 'blue',
        summaryTakeaways: '',
        summaryProblems: '',
        summaryOpportunities: '',
        summaryQuote: '',
        selectedResearchQuestions: [],
        responses: [],
      };
      setSession(newSession);
    }
  }, [session]);

  // Autosave function
  const autosave = async () => {
    if (!session) return;
    
    setIsSaving(true);
    try {
      await dataService.saveSession(session);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Autosave failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Autosave on session changes
  useEffect(() => {
    if (session && currentStep > 0) {
      const timeoutId = setTimeout(autosave, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [session, currentStep]);

  const handleAudienceSelect = (audienceType: AudienceType) => {
    setSelectedAudience(audienceType);
    if (session) {
      setSession({
        ...session,
        audienceType,
        colorTheme: audienceType,
      });
    }
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <AudienceSelection onSelect={handleAudienceSelect} />;
      case 1:
        return <ParticipantInfo session={session} setSession={setSession} theme={theme} onNext={handleNext} />;
      case 2:
        return <ResearchQuestions session={session} setSession={setSession} theme={theme} onNext={handleNext} />;
      case 3:
        return <InterviewGuide session={session} setSession={setSession} theme={theme} onNext={handleNext} />;
      case 4:
        return <Summary session={session} setSession={setSession} theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with YourCity Deals branding */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${theme.brand} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">YC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">YourCity Deals</h1>
                <p className="text-sm text-gray-600">Discovery Interview Tool</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href="/interviews"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View All Interviews
              </a>
              <div className="text-sm text-gray-500">
                Interview Session
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Discovery Interview</h2>
          <p className="text-gray-600">Capture insights from your target audience</p>
        </div>

        <Stepper currentStep={currentStep} totalSteps={5} theme={theme} />

        {/* Autosave indicator */}
        {currentStep > 0 && (
          <div className="flex justify-center mb-6">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              isSaving ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}>
              {isSaving ? 'Saving...' : lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : 'Ready'}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        {currentStep > 0 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Back
            </button>
            {currentStep < 4 && (
              <button
                onClick={handleNext}
                className={`px-6 py-3 ${theme.accent} text-white rounded-lg ${theme.accentHover} transition-colors font-medium`}
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Audience Selection Component
const AudienceSelection = ({ onSelect }: { onSelect: (audience: AudienceType) => void }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Select Your Audience</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {audiences.map((audience) => (
          <button
            key={audience.id}
            onClick={() => onSelect(audience.id)}
            className={`p-8 rounded-xl border-2 border-transparent hover:border-current transition-all duration-200 ${
              colorThemes[audience.id].bg
            } ${colorThemes[audience.id].text} hover:shadow-lg hover:scale-105`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 ${colorThemes[audience.id].accent} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-white font-bold text-xl">{audience.name.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{audience.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{audience.subtitle}</p>
              <p className="text-sm text-gray-500">{audience.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Participant Info Component
const ParticipantInfo = ({ session, setSession, theme, onNext }: any) => {
  const [participant, setParticipant] = useState<Participant>({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    jobTitle: '',
    specialties: [],
    background: '',
    howGotJob: '',
    // Demographic data
    age: '',
    gender: '',
    zipCode: '',
    householdIncome: '',
    education: '',
    householdSize: '',
    childrenInSchool: '',
    commuteAreas: '',
  });

  // Load participant data from session
  useEffect(() => {
    if (session?.participant) {
      setParticipant(session.participant);
    }
  }, [session]);

  // Update session when participant data changes
  useEffect(() => {
    if (session) {
      setSession({
        ...session,
        participant,
      });
    }
  }, [participant, session, setSession]);

  const handleInputChange = (field: keyof Participant, value: string | string[]) => {
    setParticipant(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecialtiesChange = (value: string) => {
    const specialties = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    handleInputChange('specialties', specialties);
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // For now, we'll use a simple file input with camera option
      // In a production app, you'd want a more sophisticated camera interface
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'camera';
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files?.[0]) {
          handlePhotoCapture({ target } as any);
        }
      };
      input.click();
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access denied. Please use the file upload option instead.');
    }
  };

  const specialtiesString = participant.specialties.join(', ');

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Participant Information</h2>
      <p className="text-gray-600 mb-6">All fields are optional. Information will be autosaved.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  value={participant.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  value={participant.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company / Organization</label>
              <input
                type="text"
                placeholder="Enter company or organization"
                value={participant.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={participant.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={participant.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Photo Capture Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Participant Photo</label>
              <div className="flex items-center space-x-4">
                {participant.photo ? (
                  <div className="flex items-center space-x-4">
                    <img 
                      src={participant.photo} 
                      alt="Participant" 
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleCameraCapture}
                        className={`px-3 py-2 ${theme.accent} text-white rounded-lg hover:opacity-90 transition-opacity`}
                      >
                        📷 Take New Photo
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoCapture}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className={`px-3 py-2 ${theme.accent} text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer`}
                      >
                        📁 Upload Photo
                      </label>
                      <button
                        type="button"
                        onClick={() => handleInputChange('photo', '')}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleCameraCapture}
                      className={`px-4 py-2 ${theme.accent} text-white rounded-lg hover:opacity-90 transition-opacity`}
                    >
                      📷 Take Photo
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoCapture}
                      className="hidden"
                      id="photo-upload-empty"
                    />
                    <label
                      htmlFor="photo-upload-empty"
                      className={`px-4 py-2 ${theme.accent} text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer`}
                    >
                      📁 Upload Photo
                    </label>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This photo will be used in the interview snapshot for easy identification.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                placeholder="Enter job title"
                value={participant.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
              <input
                type="text"
                placeholder="Enter specialties (comma-separated)"
                value={specialtiesString}
                onChange={(e) => handleSpecialtiesChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {participant.specialties.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {participant.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded-full ${theme.accent} ${theme.text.replace('900', '50')}`}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">General Background</label>
              <textarea
                placeholder="Tell us about their background"
                rows={3}
                value={participant.background}
                onChange={(e) => handleInputChange('background', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">How did they get their job?</label>
              <textarea
                placeholder="Describe their career path"
                rows={2}
                value={participant.howGotJob}
                onChange={(e) => handleInputChange('howGotJob', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Demographic Data Section */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                  <select
                    value={participant.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select age range</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45-54">45-54</option>
                    <option value="55-64">55-64</option>
                    <option value="65+">65+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={participant.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    placeholder="Enter ZIP code"
                    value={participant.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Household Income</label>
                  <select
                    value={participant.householdIncome}
                    onChange={(e) => handleInputChange('householdIncome', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select income range</option>
                    <option value="Under $25,000">Under $25,000</option>
                    <option value="$25,000-$49,999">$25,000-$49,999</option>
                    <option value="$50,000-$74,999">$50,000-$74,999</option>
                    <option value="$75,000-$99,999">$75,000-$99,999</option>
                    <option value="$100,000-$149,999">$100,000-$149,999</option>
                    <option value="$150,000-$199,999">$150,000-$199,999</option>
                    <option value="$200,000+">$200,000+</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                  <select
                    value={participant.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select education level</option>
                    <option value="High School">High School</option>
                    <option value="Some College">Some College</option>
                    <option value="Associate Degree">Associate Degree</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Household Size</label>
                  <select
                    value={participant.householdSize}
                    onChange={(e) => handleInputChange('householdSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select household size</option>
                    <option value="1">1 person</option>
                    <option value="2">2 people</option>
                    <option value="3">3 people</option>
                    <option value="4">4 people</option>
                    <option value="5">5 people</option>
                    <option value="6+">6+ people</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Children in School</label>
                  <select
                    value={participant.childrenInSchool}
                    onChange={(e) => handleInputChange('childrenInSchool', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select option</option>
                    <option value="Yes - Elementary">Yes - Elementary</option>
                    <option value="Yes - Middle School">Yes - Middle School</option>
                    <option value="Yes - High School">Yes - High School</option>
                    <option value="Yes - Multiple Ages">Yes - Multiple Ages</option>
                    <option value="No">No</option>
                    <option value="Not applicable">Not applicable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commute Areas</label>
                  <input
                    type="text"
                    placeholder="Where do you commute to/from?"
                    value={participant.commuteAreas}
                    onChange={(e) => handleInputChange('commuteAreas', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Session Meta Card */}
        <div className="lg:col-span-1">
          <div className={`p-4 ${theme.bg} rounded-lg border ${theme.border}`}>
            <h3 className={`font-medium ${theme.text} mb-3`}>Session Meta</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className={`font-medium ${theme.text}`}>Interview ID:</span>
                <div className="text-gray-600 font-mono text-xs mt-1">
                  {session?.id || 'Generating...'}
                </div>
              </div>
              <div>
                <span className={`font-medium ${theme.text}`}>Date/Time:</span>
                <div className="text-gray-600 mt-1">
                  {new Date().toLocaleString()}
                </div>
              </div>
              <div>
                <span className={`font-medium ${theme.text}`}>Interviewer:</span>
                <div className="text-gray-600 mt-1">
                  {session?.interviewerName || 'Ash Perry'}
                </div>
              </div>
              <div>
                <span className={`font-medium ${theme.text}`}>Audience:</span>
                <div className="mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${theme.accent} ${theme.text.replace('900', '50')}`}>
                    {session?.audienceType || 'Not selected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Progress</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Participant info: {participant.firstName || participant.lastName ? 'Started' : 'Not started'}
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                Research questions: Pending
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                Interview: Pending
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                Summary: Pending
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResearchQuestions = ({ session, setSession, theme, onNext }: any) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const dataService = MockDataService.getInstance();
  const availableQuestions = dataService.getResearchQuestions(session?.audienceType || 'buyer');
  
  // Debug logging
  console.log('Available questions for', session?.audienceType, ':', availableQuestions.length);
  console.log('Questions:', availableQuestions.map(q => ({ id: q.id, text: q.questionText })));
  console.log('Current selectedQuestions state:', selectedQuestions);
  
  // Load selected questions from session
  useEffect(() => {
    if (session?.selectedResearchQuestions) {
      setSelectedQuestions(session.selectedResearchQuestions.map(q => q.id));
    }
  }, [session]);

  // Update session when selected questions change
  useEffect(() => {
    if (session && selectedQuestions.length > 0) {
      const selectedResearchQuestions = availableQuestions.filter(q => selectedQuestions.includes(q.id));
      setSession({
        ...session,
        selectedResearchQuestions,
      });
    }
  }, [selectedQuestions, availableQuestions]);

  const handleQuestionToggle = (questionId: string) => {
    alert(`Clicked question: ${questionId}`);
    console.log('Toggling question:', questionId);
    console.log('Current selectedQuestions:', selectedQuestions);
    setSelectedQuestions(prev => {
      const newSelection = prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId];
      console.log('New selection:', newSelection);
      alert(`New selection: ${JSON.stringify(newSelection)}`);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    alert('Select All clicked');
    const allQuestionIds = availableQuestions.map(q => q.id);
    console.log('All question IDs:', allQuestionIds);
    setSelectedQuestions(allQuestionIds);
  };

  const handleSelectNone = () => {
    setSelectedQuestions([]);
  };

  // Filter questions by search term and category
  const filteredQuestions = availableQuestions.filter(question => {
    const matchesSearch = question.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(availableQuestions.map(q => q.category)))];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Research Questions</h2>
      <p className="text-gray-600 mb-6">Select the research questions you want to explore in this interview.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search research questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Selection Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Select All
                </button>
                <button
                  onClick={handleSelectNone}
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Select None
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {selectedQuestions.length} of {availableQuestions.length} selected
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedQuestions.includes(question.id)
                    ? `${theme.border.replace('200', '500')} ${theme.bg} border-current` 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleQuestionToggle(question.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedQuestions.includes(question.id)
                        ? `${theme.accent} border-current`
                        : 'border-gray-300'
                    }`}>
                      {selectedQuestions.includes(question.id) && (
                        <CheckIcon className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{question.questionText}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedQuestions.includes(question.id)
                          ? `${theme.accent} text-white`
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {question.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {question.suggestedQuestions.length} suggested interview questions
                    </p>
                    <div className="text-xs text-gray-500">
                      Sample questions: {question.suggestedQuestions.slice(0, 2).map(q => q.promptText).join(', ')}
                      {question.suggestedQuestions.length > 2 && '...'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No research questions found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Selected Questions Summary */}
          <div className={`p-4 ${theme.bg} rounded-lg border ${theme.border} mb-6`}>
            <h3 className={`font-medium ${theme.text} mb-3`}>Selected Questions</h3>
            {selectedQuestions.length === 0 ? (
              <p className="text-sm text-gray-600">No questions selected yet</p>
            ) : (
              <div className="space-y-2">
                {selectedQuestions.map(questionId => {
                  const question = availableQuestions.find(q => q.id === questionId);
                  return question ? (
                    <div key={questionId} className="text-sm">
                      <div className="font-medium text-gray-900 truncate">{question.questionText}</div>
                      <div className="text-gray-600">{question.category}</div>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={selectedQuestions.length === 0}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedQuestions.length > 0
                ? `${theme.accent} ${theme.text.replace('900', '50')} ${theme.accentHover}`
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Generate Interview Guide
          </button>
        </div>
      </div>
    </div>
  );
};

const InterviewGuide = ({ session, setSession, theme, onNext }: any) => {
  const [responses, setResponses] = useState<SessionResponse[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [customQuestions, setCustomQuestions] = useState<{[key: string]: string}>({});
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, any[]>>({});
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState<Record<string, boolean>>({});

  // Load responses from session
  useEffect(() => {
    if (session?.responses) {
      setResponses(session.responses);
    }
  }, [session]);

  // Update session when responses change
  useEffect(() => {
    if (session) {
      setSession({
        ...session,
        responses,
      });
    }
  }, [responses, session, setSession]);

  const toggleSection = (questionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const updateResponse = (researchQuestionId: string, interviewQuestionId: string, field: string, value: any) => {
    setResponses(prev => {
      const existingIndex = prev.findIndex(r => 
        r.researchQuestionId === researchQuestionId && r.interviewQuestionId === interviewQuestionId
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], [field]: value };
        return updated;
      } else {
        return [...prev, {
          id: `response_${Date.now()}_${Math.random()}`,
          sessionId: session?.id || '',
          researchQuestionId,
          interviewQuestionId,
          [field]: value,
        }];
      }
    });
  };

  const updateNotes = (researchQuestionId: string, notes: string) => {
    setResponses(prev => {
      const existingIndex = prev.findIndex(r => 
        r.researchQuestionId === researchQuestionId && !r.interviewQuestionId
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], notes };
        return updated;
      } else {
        return [...prev, {
          id: `notes_${Date.now()}_${Math.random()}`,
          sessionId: session?.id || '',
          researchQuestionId,
          notes,
        }];
      }
    });
  };

  const addCustomQuestion = (researchQuestionId: string) => {
    const customQuestion = prompt('Enter your custom question:');
    if (customQuestion) {
      setCustomQuestions(prev => ({
        ...prev,
        [`${researchQuestionId}_custom`]: customQuestion,
      }));
    }
  };

  const generateAISuggestions = async (researchQuestionId: string) => {
    if (!session?.responses?.length) {
      alert('Please complete some responses before generating AI suggestions.');
      return;
    }

    setIsGeneratingSuggestions(prev => ({
      ...prev,
      [researchQuestionId]: true
    }));

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'suggestFollowUps',
          data: {
            responses: session.responses,
            currentQuestion: session.selectedResearchQuestions?.find(q => q.id === researchQuestionId)?.questionText || 'Current research question'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const result = await response.json();
      const suggestions = result.data;

      setAiSuggestions(prev => ({
        ...prev,
        [researchQuestionId]: suggestions
      }));

    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      alert('Error generating AI suggestions. Please check your OpenAI API key configuration.');
    } finally {
      setIsGeneratingSuggestions(prev => ({
        ...prev,
        [researchQuestionId]: false
      }));
    }
  };

  const getResponse = (researchQuestionId: string, interviewQuestionId: string) => {
    return responses.find(r => 
      r.researchQuestionId === researchQuestionId && r.interviewQuestionId === interviewQuestionId
    );
  };

  const getNotes = (researchQuestionId: string) => {
    return responses.find(r => 
      r.researchQuestionId === researchQuestionId && !r.interviewQuestionId
    )?.notes || '';
  };

  const renderQuestionInput = (question: InterviewQuestion, researchQuestionId: string) => {
    const response = getResponse(researchQuestionId, question.id);
    
    switch (question.answerType) {
      case 'yesno':
        return (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => updateResponse(researchQuestionId, question.id, 'answerYesno', true)}
              className={`px-4 py-2 rounded-lg border ${
                response?.answerYesno === true
                  ? `${theme.accent} ${theme.text.replace('900', '50')} border-current`
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => updateResponse(researchQuestionId, question.id, 'answerYesno', false)}
              className={`px-4 py-2 rounded-lg border ${
                response?.answerYesno === false
                  ? `${theme.accent} ${theme.text.replace('900', '50')} border-current`
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              No
            </button>
            <textarea
              placeholder="Why? (optional)"
              value={response?.answerText || ''}
              onChange={(e) => updateResponse(researchQuestionId, question.id, 'answerText', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
        );
      
      case 'scale':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">1</span>
              <input
                type="range"
                min="1"
                max="10"
                value={response?.answerScale || 5}
                onChange={(e) => updateResponse(researchQuestionId, question.id, 'answerScale', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600">10</span>
              <span className={`px-2 py-1 text-sm font-medium rounded ${theme.accent} ${theme.text.replace('900', '50')}`}>
                {response?.answerScale || 5}
              </span>
            </div>
            <textarea
              placeholder="Additional thoughts (optional)"
              value={response?.answerText || ''}
              onChange={(e) => updateResponse(researchQuestionId, question.id, 'answerText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
        );
      
      case 'currency':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">$</span>
            <input
              type="number"
              placeholder="0.00"
              value={response?.answerCurrencyCents ? response.answerCurrencyCents / 100 : ''}
              onChange={(e) => updateResponse(researchQuestionId, question.id, 'answerCurrencyCents', Math.round(parseFloat(e.target.value || '0') * 100))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              placeholder="Additional context (optional)"
              value={response?.answerText || ''}
              onChange={(e) => updateResponse(researchQuestionId, question.id, 'answerText', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
        );
      
      case 'multiselect':
        const selectedOptions = response?.answerMultiselect || [];
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {question.options?.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    const newSelection = selectedOptions.includes(option)
                      ? selectedOptions.filter(o => o !== option)
                      : [...selectedOptions, option];
                    updateResponse(researchQuestionId, question.id, 'answerMultiselect', newSelection);
                  }}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedOptions.includes(option)
                      ? `${theme.accent} ${theme.text.replace('900', '50')} border-current`
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Additional thoughts (optional)"
              value={response?.answerText || ''}
              onChange={(e) => updateResponse(researchQuestionId, question.id, 'answerText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
        );
      
      default: // text
        return (
          <textarea
            placeholder="Enter your response..."
            value={response?.answerText || ''}
            onChange={(e) => updateResponse(researchQuestionId, question.id, 'answerText', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        );
    }
  };

  if (!session?.selectedResearchQuestions || session.selectedResearchQuestions.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Interview Guide</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">No research questions selected. Please go back and select some questions.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interview Guide</h2>
          <p className="text-gray-600">Conduct your interview using the questions below.</p>
        </div>
        <div className="text-sm text-gray-600">
          {responses.filter(r => r.answerText || r.answerYesno !== undefined || r.answerScale || r.answerCurrencyCents || r.answerMultiselect?.length).length} responses
        </div>
      </div>

      <div className="space-y-6">
        {session.selectedResearchQuestions.map((researchQuestion) => (
          <div key={researchQuestion.id} className="border border-gray-200 rounded-lg">
            {/* Research Question Header */}
            <div
              className={`p-4 cursor-pointer ${theme.bg} rounded-t-lg border-b ${theme.border}`}
              onClick={() => toggleSection(researchQuestion.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold ${theme.text}`}>{researchQuestion.questionText}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {researchQuestion.suggestedQuestions.length} suggested interview questions
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${theme.accent} ${theme.text.replace('900', '50')}`}>
                    {researchQuestion.category}
                  </span>
                  <ChevronRightIcon 
                    className={`w-5 h-5 transition-transform ${
                      expandedSections.has(researchQuestion.id) ? 'rotate-90' : ''
                    } ${theme.text}`} 
                  />
                </div>
              </div>
            </div>

            {/* Interview Questions */}
            {expandedSections.has(researchQuestion.id) && (
              <div className="p-4 space-y-6">
                <div className="text-sm text-gray-600 mb-4">
                  <strong>Suggested interview questions (guides, not a script)</strong>
                </div>

                {researchQuestion.suggestedQuestions.map((question) => (
                  <div key={question.id} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-gray-900 flex-1">{question.promptText}</h4>
                      <label className="flex items-center text-sm text-gray-600 ml-4">
                        <input
                          type="checkbox"
                          checked={getResponse(researchQuestion.id, question.id)?.isUnanswered || false}
                          onChange={(e) => updateResponse(researchQuestion.id, question.id, 'isUnanswered', e.target.checked)}
                          className="mr-2"
                        />
                        Mark unanswered
                      </label>
                    </div>
                    
                    {!getResponse(researchQuestion.id, question.id)?.isUnanswered && (
                      <div className="ml-4">
                        {renderQuestionInput(question, researchQuestion.id)}
                      </div>
                    )}
                  </div>
                ))}

                {/* Custom Question */}
                {customQuestions[`${researchQuestion.id}_custom`] && (
                  <div className="space-y-3 border-t pt-4">
                    <h4 className="font-medium text-gray-900">
                      Custom: {customQuestions[`${researchQuestion.id}_custom`]}
                    </h4>
                    <textarea
                      placeholder="Enter your response..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                )}

                {/* AI Suggestions and Custom Question Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => generateAISuggestions(researchQuestion.id)}
                      disabled={isGeneratingSuggestions[researchQuestion.id]}
                      className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 disabled:opacity-50 font-medium"
                    >
                      {isGeneratingSuggestions[researchQuestion.id] ? '🤖 Generating...' : '🤖 AI Suggestions'}
                    </button>
                    <button
                      onClick={() => addCustomQuestion(researchQuestion.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      + Add custom question
                    </button>
                  </div>
                </div>

                {/* AI Suggestions Display */}
                {aiSuggestions[researchQuestion.id] && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900 mb-3">🤖 AI Suggested Follow-ups</h4>
                    <div className="space-y-2">
                      {aiSuggestions[researchQuestion.id].map((suggestion, index) => (
                        <div key={index} className="p-3 bg-white rounded border border-purple-100">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {suggestion.question}
                          </p>
                          <p className="text-xs text-purple-700">
                            {suggestion.reasoning}
                          </p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                            {suggestion.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    placeholder="Additional notes about this research area..."
                    value={getNotes(researchQuestion.id)}
                    onChange={(e) => updateNotes(researchQuestion.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Summary = ({ session, setSession, theme }: any) => {
  const [summary, setSummary] = useState({
    takeaways: session?.summaryTakeaways || '',
    problems: session?.summaryProblems || '',
    opportunities: session?.summaryOpportunities || '',
    quote: session?.summaryQuote || '',
  });

  // Update session when summary changes
  useEffect(() => {
    if (session) {
      setSession({
        ...session,
        summaryTakeaways: summary.takeaways,
        summaryProblems: summary.problems,
        summaryOpportunities: summary.opportunities,
        summaryQuote: summary.quote,
      });
    }
  }, [summary, session, setSession]);

  const handleSummaryChange = (field: keyof typeof summary, value: string) => {
    setSummary(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const exportToJSON = () => {
    const exportData = {
      session: {
        id: session?.id,
        audienceType: session?.audienceType,
        interviewerName: session?.interviewerName,
        createdAt: session?.createdAt,
        updatedAt: session?.updatedAt,
      },
      participant: session?.participant,
      researchQuestions: session?.selectedResearchQuestions?.map(q => ({
        id: q.id,
        questionText: q.questionText,
        category: q.category,
      })),
      responses: session?.responses,
      summary: {
        takeaways: summary.takeaways,
        problems: summary.problems,
        opportunities: summary.opportunities,
        quote: summary.quote,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${session?.id || 'session'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csvRows = [];
    
    // Header
    csvRows.push(['Question', 'Answer', 'Type', 'Category', 'Notes'].join(','));
    
    // Responses
    session?.responses?.forEach(response => {
      const researchQuestion = session.selectedResearchQuestions?.find(q => q.id === response.researchQuestionId);
      const interviewQuestion = researchQuestion?.suggestedQuestions?.find(q => q.id === response.interviewQuestionId);
      
      let answer = '';
      let answerType = '';
      
      if (response.answerText) {
        answer = `"${response.answerText.replace(/"/g, '""')}"`;
        answerType = 'text';
      } else if (response.answerYesno !== undefined) {
        answer = response.answerYesno ? 'Yes' : 'No';
        answerType = 'yesno';
      } else if (response.answerScale !== undefined) {
        answer = response.answerScale.toString();
        answerType = 'scale';
      } else if (response.answerCurrencyCents !== undefined) {
        answer = (response.answerCurrencyCents / 100).toString();
        answerType = 'currency';
      } else if (response.answerMultiselect?.length) {
        answer = `"${response.answerMultiselect.join('; ')}"`;
        answerType = 'multiselect';
      }
      
      if (answer) {
        csvRows.push([
          `"${interviewQuestion?.promptText || 'Notes'}"`,
          answer,
          answerType,
          `"${researchQuestion?.category || ''}"`,
          `"${response.notes || ''}"`
        ].join(','));
      }
    });
    
    // Summary section
    csvRows.push(['', '', '', '', '']);
    csvRows.push(['SUMMARY', '', '', '', '']);
    csvRows.push(['Key Takeaways', `"${summary.takeaways}"`, 'summary', '', '']);
    csvRows.push(['Problems Observed', `"${summary.problems}"`, 'summary', '', '']);
    csvRows.push(['Opportunities', `"${summary.opportunities}"`, 'summary', '', '']);
    csvRows.push(['Great Quote', `"${summary.quote}"`, 'summary', '', '']);
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${session?.id || 'session'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const duplicateAsTemplate = () => {
    const newSession: InterviewSession = {
      audienceType: session?.audienceType || 'buyer',
      interviewerName: session?.interviewerName || 'Ash Perry',
      colorTheme: session?.colorTheme || 'blue',
      summaryTakeaways: '',
      summaryProblems: '',
      summaryOpportunities: '',
      summaryQuote: '',
      selectedResearchQuestions: session?.selectedResearchQuestions || [],
      responses: [],
    };
    
    // Reset to step 1 (participant info) with the same research questions
    setSession(newSession);
    // This would need to be handled by the parent component to reset the step
  };

  const submitForm = async () => {
    try {
      // Save the complete interview session
      const dataService = MockDataService.getInstance();
      await dataService.saveSession(session);
      
      alert('Interview submitted successfully! You can now create a snapshot.');
    } catch (error) {
      console.error('Error submitting interview:', error);
      alert('Error submitting interview. Please try again.');
    }
  };

  const createSnapshot = async () => {
    if (!session?.participant?.firstName) {
      alert('Please complete the participant information before creating a snapshot.');
      return;
    }

    try {
      // Create Google Doc snapshot
      const snapshotData = {
        participant: session.participant,
        researchQuestions: session.selectedResearchQuestions,
        responses: session.responses,
        summary: {
          takeaways: summary.takeaways,
          problems: summary.problems,
          opportunities: summary.opportunities,
          quote: summary.quote,
        },
        session: {
          id: session.id,
          audienceType: session.audienceType,
          interviewerName: session.interviewerName,
          createdAt: session.createdAt,
        }
      };

      // For now, we'll create a downloadable document
      // Later we'll integrate with Google Docs API
      const docContent = generateSnapshotDocument(snapshotData);
      
      const blob = new Blob([docContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Interview-Snapshot-${session.participant.firstName}-${session.participant.lastName}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Snapshot created! In the future, this will automatically create a Google Doc in your folder.');
    } catch (error) {
      console.error('Error creating snapshot:', error);
      alert('Error creating snapshot. Please try again.');
    }
  };

  const generateAIInsights = async () => {
    if (!session?.participant || !session?.responses?.length) {
      alert('Please complete some interview responses before generating AI insights.');
      return;
    }

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'extractInsights',
          data: {
            responses: session.responses,
            participant: session.participant,
            audienceType: session.audienceType,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const result = await response.json();
      const insights = result.data;

      // Update summary with AI insights
      setSummary(prev => ({
        ...prev,
        takeaways: insights.keyTakeaways?.join('\n') || prev.takeaways,
        problems: insights.problems?.join('\n') || prev.problems,
        opportunities: insights.opportunities?.join('\n') || prev.opportunities,
        quote: insights.memorableQuotes?.[0] || prev.quote,
      }));

      alert('AI insights generated successfully! Check the summary sections.');
    } catch (error) {
      console.error('Error generating AI insights:', error);
      alert('Error generating AI insights. Please check your OpenAI API key configuration.');
    }
  };

  const generateSnapshotDocument = (data: any) => {
    const participant = data.participant;
    const researchQuestions = data.researchQuestions;
    const responses = data.responses;
    const summary = data.summary;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Interview Snapshot - ${participant.firstName} ${participant.lastName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
        .header { text-align: center; margin-bottom: 40px; }
        .title { font-size: 28px; font-weight: bold; margin-bottom: 10px; color: #2c3e50; }
        .subtitle { font-size: 16px; color: #7f8c8d; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; color: #27ae60; margin-bottom: 15px; border-bottom: 2px solid #27ae60; padding-bottom: 5px; }
        .participant-photo { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd; margin-bottom: 20px; }
        .info-item { margin-bottom: 8px; }
        .info-label { font-weight: bold; color: #2c3e50; }
        .research-question { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #27ae60; }
        .response-item { margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; }
        .quote { font-style: italic; background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60; margin: 15px 0; }
        .takeaway { margin-bottom: 10px; padding: 8px; background: #f0f8ff; border-radius: 5px; }
        .problem { margin-bottom: 10px; padding: 8px; background: #fff5f5; border-radius: 5px; }
        .opportunity { margin-bottom: 10px; padding: 8px; background: #f0fff0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Interview Snapshot</div>
        <div class="subtitle">YourCity Deals Discovery Interview</div>
    </div>

    <div class="section">
        <div class="section-title">Participant Information</div>
        ${participant.photo ? `<img src="${participant.photo}" alt="Participant Photo" class="participant-photo">` : ''}
        <div class="info-item"><span class="info-label">Name:</span> ${participant.firstName} ${participant.lastName}</div>
        <div class="info-item"><span class="info-label">Job Title:</span> ${participant.jobTitle}</div>
        <div class="info-item"><span class="info-label">Company:</span> ${participant.company}</div>
        <div class="info-item"><span class="info-label">Email:</span> ${participant.email}</div>
        <div class="info-item"><span class="info-label">Phone:</span> ${participant.phone}</div>
        <div class="info-item"><span class="info-label">Age:</span> ${participant.age}</div>
        <div class="info-item"><span class="info-label">Gender:</span> ${participant.gender}</div>
        <div class="info-item"><span class="info-label">Zip Code:</span> ${participant.zipCode}</div>
        <div class="info-item"><span class="info-label">Education:</span> ${participant.education}</div>
        <div class="info-item"><span class="info-label">Household Size:</span> ${participant.householdSize}</div>
        <div class="info-item"><span class="info-label">Children in School:</span> ${participant.childrenInSchool}</div>
        <div class="info-item"><span class="info-label">Background:</span> ${participant.background}</div>
    </div>

    <div class="section">
        <div class="section-title">Research Questions</div>
        ${researchQuestions?.map(q => `
            <div class="research-question">
                <strong>${q.questionText}</strong>
                <div style="color: #666; font-size: 14px; margin-top: 5px;">Category: ${q.category}</div>
            </div>
        `).join('') || '<p>No research questions selected.</p>'}
    </div>

    <div class="section">
        <div class="section-title">Interview Responses</div>
        ${responses?.map(response => {
            const researchQuestion = researchQuestions?.find(q => q.id === response.researchQuestionId);
            const interviewQuestion = researchQuestion?.suggestedQuestions?.find(q => q.id === response.interviewQuestionId);
            
            let answer = '';
            if (response.answerText) answer = response.answerText;
            else if (response.answerYesno !== undefined) answer = response.answerYesno ? 'Yes' : 'No';
            else if (response.answerScale !== undefined) answer = `${response.answerScale}/10`;
            else if (response.answerCurrencyCents !== undefined) answer = `$${(response.answerCurrencyCents / 100).toFixed(2)}`;
            else if (response.answerMultiselect?.length) answer = response.answerMultiselect.join(', ');
            
            return `
                <div class="response-item">
                    <strong>${interviewQuestion?.promptText || 'Notes'}</strong>
                    <div style="margin-top: 5px;">${answer}</div>
                    ${response.notes ? `<div style="margin-top: 5px; font-style: italic; color: #666;">Notes: ${response.notes}</div>` : ''}
                </div>
            `;
        }).join('') || '<p>No responses recorded.</p>'}
    </div>

    <div class="section">
        <div class="section-title">Key Takeaways</div>
        ${summary.takeaways ? summary.takeaways.split('\n').map(takeaway => `<div class="takeaway">${takeaway}</div>`).join('') : '<p>No takeaways recorded.</p>'}
    </div>

    <div class="section">
        <div class="section-title">Problems Observed</div>
        ${summary.problems ? summary.problems.split('\n').map(problem => `<div class="problem">${problem}</div>`).join('') : '<p>No problems recorded.</p>'}
    </div>

    <div class="section">
        <div class="section-title">Opportunities / Ideas</div>
        ${summary.opportunities ? summary.opportunities.split('\n').map(opportunity => `<div class="opportunity">${opportunity}</div>`).join('') : '<p>No opportunities recorded.</p>'}
    </div>

    ${summary.quote ? `
    <div class="section">
        <div class="section-title">Great Quote from this Interview</div>
        <div class="quote">"${summary.quote}"</div>
    </div>
    ` : ''}

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
        Generated on ${new Date().toLocaleString()} by ${data.session.interviewerName}
    </div>
</body>
</html>
    `;
  };

  const responseCount = session?.responses?.filter(r => 
    r.answerText || r.answerYesno !== undefined || r.answerScale || r.answerCurrencyCents || r.answerMultiselect?.length
  ).length || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Summary & Debrief</h2>
          <p className="text-gray-600">Capture your key insights from this interview.</p>
        </div>
        <div className="text-sm text-gray-600">
          {responseCount} responses captured
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Summary Form */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Takeaways</label>
            <textarea
              placeholder="What were the main insights from this interview?"
              value={summary.takeaways}
              onChange={(e) => handleSummaryChange('takeaways', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Problems Observed</label>
            <textarea
              placeholder="What problems or pain points did the participant mention?"
              value={summary.problems}
              onChange={(e) => handleSummaryChange('problems', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opportunities / Ideas</label>
            <textarea
              placeholder="What opportunities or ideas emerged from this interview?"
              value={summary.opportunities}
              onChange={(e) => handleSummaryChange('opportunities', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Great Quote from this interview</label>
            <textarea
              placeholder="Capture any memorable quotes or statements..."
              value={summary.quote}
              onChange={(e) => handleSummaryChange('quote', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Session Summary */}
          <div className={`p-4 ${theme.bg} rounded-lg border ${theme.border} mb-6`}>
            <h3 className={`font-medium ${theme.text} mb-3`}>Interview Summary</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className={`font-medium ${theme.text}`}>Participant:</span>
                <div className="text-gray-600 mt-1">
                  {session?.participant?.firstName && session?.participant?.lastName
                    ? `${session.participant.firstName} ${session.participant.lastName}`
                    : 'Not provided'
                  }
                </div>
              </div>
              <div>
                <span className={`font-medium ${theme.text}`}>Company:</span>
                <div className="text-gray-600 mt-1">
                  {session?.participant?.company || 'Not provided'}
                </div>
              </div>
              <div>
                <span className={`font-medium ${theme.text}`}>Research Areas:</span>
                <div className="text-gray-600 mt-1">
                  {session?.selectedResearchQuestions?.length || 0} questions selected
                </div>
              </div>
              <div>
                <span className={`font-medium ${theme.text}`}>Responses:</span>
                <div className="text-gray-600 mt-1">
                  {responseCount} captured
                </div>
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="space-y-3">
            <button
              onClick={submitForm}
              className={`w-full px-4 py-2 ${theme.accent} text-white rounded-lg hover:opacity-90 transition-opacity font-medium`}
            >
              📝 Submit Form
            </button>
            <button
              onClick={generateAIInsights}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              🤖 Generate AI Insights
            </button>
            <button
              onClick={createSnapshot}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              📄 Create Snapshot
            </button>
            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-500 mb-3">Export Options:</p>
              <button
                onClick={exportToJSON}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={exportToCSV}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mt-2"
              >
                Export CSV
              </button>
              <button
                onClick={duplicateAsTemplate}
                className={`w-full px-4 py-2 ${theme.accent} ${theme.text.replace('900', '50')} rounded-lg ${theme.accentHover} transition-colors mt-2`}
              >
                Duplicate as Template
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Research Questions:</span>
                <span className="font-medium">{session?.selectedResearchQuestions?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Responses:</span>
                <span className="font-medium">{responseCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Completion:</span>
                <span className="font-medium">
                  {session?.selectedResearchQuestions?.length 
                    ? Math.round((responseCount / (session.selectedResearchQuestions.length * 3)) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
