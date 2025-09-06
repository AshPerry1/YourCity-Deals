'use client';

import { useState, useEffect } from 'react';
import { ChevronRightIcon, TrashIcon, EyeIcon, DocumentIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { InterviewService } from '../../lib/interviewService';
import { WordDocumentService, InterviewSnapshotData } from '../../lib/wordDocumentService';

// Types (matching the interview tool)
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
  age: string;
  gender: string;
  zipCode: string;
  householdIncome: string;
  education: string;
  householdSize: string;
  childrenInSchool: string;
  commuteAreas: string;
  photo?: string;
}

interface ResearchQuestion {
  id: string;
  audienceType: AudienceType;
  questionText: string;
  category: string;
  suggestedQuestions: any[];
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

// Mock data service (same as interview tool)
class MockDataService {
  private static instance: MockDataService;
  private sessions: InterviewSession[] = [];

  private constructor() {
    // Initialize with some sample data for testing
    this.sessions = [
      {
        id: 'session-1',
        audienceType: 'buyer',
        interviewerName: 'Ash Perry',
        colorTheme: 'blue',
        summaryTakeaways: 'Prefers digital solutions, values convenience, price-sensitive',
        summaryProblems: 'Physical coupon books are inconvenient, hard to organize',
        summaryOpportunities: 'Digital coupon book with mobile app, easy sharing features',
        summaryQuote: 'I would definitely use a digital version if it was easy to use and saved me money.',
        participant: {
          firstName: 'John',
          lastName: 'Smith',
          company: 'Tech Corp',
          email: 'john@techcorp.com',
          phone: '555-0123',
          jobTitle: 'Software Engineer',
          specialties: ['React', 'Node.js'],
          background: '5 years in tech, previously at startups',
          howGotJob: 'LinkedIn referral',
          age: '28',
          gender: 'Male',
          zipCode: '90210',
          householdIncome: '$75,000-$100,000',
          education: 'Bachelor\'s Degree',
          householdSize: '2',
          childrenInSchool: 'No',
          commuteAreas: 'Downtown LA',
        },
        selectedResearchQuestions: [
          {
            id: 'b1',
            audienceType: 'buyer',
            questionText: 'Problem & Current Behavior',
            category: 'Behavior',
            suggestedQuestions: []
          }
        ],
        responses: [],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T11:45:00Z',
      },
      {
        id: 'session-2',
        audienceType: 'seller',
        interviewerName: 'Ash Perry',
        colorTheme: 'green',
        summaryTakeaways: 'Experienced fundraiser, understands parent motivations',
        summaryProblems: 'Current fundraising methods are outdated and inefficient',
        summaryOpportunities: 'Digital platform could increase participation and revenue',
        summaryQuote: 'Parents want to support their kids but need easier ways to do it.',
        participant: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          company: 'Lincoln Elementary PTA',
          email: 'sarah@lincolnelem.org',
          phone: '555-0456',
          jobTitle: 'PTA President',
          specialties: ['Fundraising', 'Event Planning'],
          background: '3 years PTA experience, marketing background',
          howGotJob: 'Volunteer position',
          age: '35',
          gender: 'Female',
          zipCode: '90211',
          householdIncome: '$50,000-$75,000',
          education: 'Bachelor\'s Degree',
          householdSize: '4',
          childrenInSchool: 'Yes',
          commuteAreas: 'Westside',
        },
        selectedResearchQuestions: [
          {
            id: 's1',
            audienceType: 'seller',
            questionText: 'Fundraising Experience',
            category: 'Experience',
            suggestedQuestions: []
          }
        ],
        responses: [],
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
      }
    ];
  }

  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  async saveSession(session: InterviewSession): Promise<void> {
    const existingIndex = this.sessions.findIndex(s => s.id === session.id);
    if (existingIndex >= 0) {
      this.sessions[existingIndex] = { ...session, updatedAt: new Date().toISOString() };
    } else {
      this.sessions.push({ 
        ...session, 
        id: session.id || `session-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }

  getAllSessions(): InterviewSession[] {
    return this.sessions.sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  deleteSession(sessionId: string): boolean {
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index >= 0) {
      this.sessions.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Color themes
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

export default function InterviewsDashboard() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudience, setSelectedAudience] = useState<AudienceType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const dataService = MockDataService.getInstance();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      console.log('Loading sessions from Supabase...');
      const allSessions = await InterviewService.getInterviewSessions();
      console.log('Loaded sessions:', allSessions);
      
      // Transform Supabase data to match frontend interface
      const transformedSessions = allSessions.map(session => ({
        id: session.session_id,
        audienceType: session.audience_type,
        interviewerName: session.interviewer_name || 'Unknown',
        colorTheme: getColorTheme(session.audience_type),
        summaryTakeaways: session.summary_takeaways || '',
        summaryProblems: session.summary_problems || '',
        summaryOpportunities: session.summary_opportunities || '',
        summaryQuote: session.summary_quote || '',
        selectedResearchQuestions: [], // Will be loaded separately if needed
        responses: [], // Will be loaded separately if needed
        participant: {
          firstName: session.first_name || '',
          lastName: session.last_name || '',
          company: session.company || '',
          email: session.email || '',
          phone: session.phone || '',
          jobTitle: session.job_title || '',
          specialties: [],
          background: '',
          howGotJob: '',
          age: session.age || '',
          gender: session.gender || '',
          zipCode: session.zip_code || '',
          householdIncome: session.household_income || '',
          education: session.education || '',
          householdSize: session.household_size || '',
          childrenInSchool: session.children_in_school || '',
          commuteAreas: session.commute_areas || '',
          photo: session.photo || undefined,
        },
        createdAt: session.created_at,
        updatedAt: session.updated_at,
      }));
      
      setSessions(transformedSessions);
    } catch (error) {
      console.error('Error loading sessions from Supabase:', error);
      
      // Fallback to mock data if Supabase fails
      try {
        console.log('Falling back to mock data...');
        const dataService = MockDataService.getInstance();
        const allSessions = dataService.getAllSessions();
        setSessions(allSessions);
      } catch (mockError) {
        console.error('Mock data also failed:', mockError);
        setSessions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getColorTheme = (audienceType: string) => {
    switch (audienceType) {
      case 'buyer': return 'blue';
      case 'seller': return 'green';
      case 'organization': return 'orange';
      case 'merchant': return 'purple';
      default: return 'blue';
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      try {
        console.log('Deleting session:', sessionId);
        await InterviewService.deleteInterviewSession(sessionId);
        console.log('Session deleted successfully');
        loadSessions();
        alert('Interview deleted successfully.');
      } catch (error) {
        console.error('Error deleting session:', error);
        
        // Fallback to mock data service
        try {
          const dataService = MockDataService.getInstance();
          const success = dataService.deleteSession(sessionId);
          if (success) {
            loadSessions();
            alert('Interview deleted successfully (from local storage).');
          } else {
            alert('Error deleting interview.');
          }
        } catch (mockError) {
          console.error('Mock delete also failed:', mockError);
          alert('Error deleting interview.');
        }
      }
    }
  };

  const handleCreateSnapshot = (session: InterviewSession) => {
    if (!session.participant?.firstName) {
      alert('This interview is missing participant information.');
      return;
    }

    try {
      const snapshotData = {
        participant: session.participant,
        researchQuestions: session.selectedResearchQuestions,
        responses: session.responses,
        summary: {
          takeaways: session.summaryTakeaways,
          problems: session.summaryProblems,
          opportunities: session.summaryOpportunities,
          quote: session.summaryQuote,
        },
        session: {
          id: session.id,
          audienceType: session.audienceType,
          interviewerName: session.interviewerName,
          createdAt: session.createdAt,
        }
      };

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

      alert('Snapshot created successfully!');
    } catch (error) {
      console.error('Error creating snapshot:', error);
      alert('Error creating snapshot. Please try again.');
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

  const filteredSessions = sessions.filter(session => {
    const matchesAudience = selectedAudience === 'all' || session.audienceType === selectedAudience;
    const matchesSearch = !searchTerm || 
      session.participant?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.participant?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.participant?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.participant?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesAudience && matchesSearch;
  });

  const getAudienceLabel = (audienceType: AudienceType) => {
    const labels = {
      buyer: 'Buyer',
      seller: 'Seller', 
      organization: 'Organization',
      merchant: 'Merchant'
    };
    return labels[audienceType];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">YC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">YourCity Deals</h1>
                <p className="text-sm text-gray-600">Interview Dashboard</p>
              </div>
            </div>
            <a
              href="/interview"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start New Interview
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Interviews</label>
              <input
                type="text"
                placeholder="Search by name, company, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Audience</label>
              <select
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value as AudienceType | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Audiences</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="organization">Organization</option>
                <option value="merchant">Merchant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DocumentIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Buyers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.audienceType === 'buyer').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Sellers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.audienceType === 'seller').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Organizations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.audienceType === 'organization').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Merchants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.audienceType === 'merchant').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interviews List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Interview Sessions</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredSessions.length} of {sessions.length} interviews
            </p>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedAudience !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start your first interview to see it here.'
                }
              </p>
              <a
                href="/interview"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start New Interview
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSessions.map((session) => {
                const theme = colorThemes[session.audienceType];
                return (
                  <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-8 h-8 ${theme.accent} rounded-full flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">
                              {getAudienceLabel(session.audienceType).charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {session.participant?.firstName} {session.participant?.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {session.participant?.jobTitle} at {session.participant?.company}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {formatDate(session.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-1" />
                            {getAudienceLabel(session.audienceType)}
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${theme.bg} ${theme.accentText}`}>
                              {session.selectedResearchQuestions?.length || 0} research questions
                            </span>
                          </div>
                        </div>

                        {session.summaryQuote && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700 italic">
                              "{session.summaryQuote}"
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                          {session.summaryTakeaways && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {session.summaryTakeaways.split('\n').length} takeaways
                            </span>
                          )}
                          {session.summaryProblems && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                              {session.summaryProblems.split('\n').length} problems
                            </span>
                          )}
                          {session.summaryOpportunities && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                              {session.summaryOpportunities.split('\n').length} opportunities
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleCreateSnapshot(session)}
                          className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <DocumentIcon className="w-4 h-4 mr-1" />
                          Create Snapshot
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id!)}
                          className="flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
