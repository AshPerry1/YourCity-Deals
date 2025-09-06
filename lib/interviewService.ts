// Supabase service for Interview Tool
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types matching the database schema
export type AudienceType = 'buyer' | 'seller' | 'organization' | 'merchant';
export type AnswerType = 'text' | 'yesno' | 'scale' | 'currency' | 'multiselect';

export interface Participant {
  id?: string;
  first_name: string;
  last_name: string;
  company?: string;
  email?: string;
  phone?: string;
  job_title?: string;
  specialties?: string[];
  background?: string;
  how_got_job?: string;
  age?: string;
  gender?: string;
  zip_code?: string;
  household_income?: string;
  education?: string;
  household_size?: string;
  children_in_school?: string;
  commute_areas?: string;
  photo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ResearchQuestion {
  id: string;
  audience_type: AudienceType;
  question_text: string;
  category: string;
  suggested_questions?: any; // JSON field from database function
  created_at?: string;
  updated_at?: string;
}

export interface InterviewQuestion {
  id: string;
  research_question_id: string;
  prompt_text: string;
  answer_type: AnswerType;
  options?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface InterviewSession {
  id?: string;
  audience_type: AudienceType;
  interviewer_name: string;
  color_theme?: string;
  summary_takeaways?: string;
  summary_problems?: string;
  summary_opportunities?: string;
  summary_quote?: string;
  participant_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SessionResponse {
  id?: string;
  session_id: string;
  research_question_id: string;
  interview_question_id?: string;
  question_text: string;
  answer_text?: string;
  answer_yesno?: boolean;
  answer_scale?: number;
  answer_currency_cents?: number;
  answer_multiselect?: string[];
  notes?: string;
  is_unanswered?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AISuggestion {
  id?: string;
  session_id: string;
  research_question_id: string;
  suggestion_text: string;
  reasoning?: string;
  category?: string;
  created_at?: string;
}

// Service class for interview operations
export class InterviewService {
  // Get research questions by audience type
  static async getResearchQuestions(audienceType: AudienceType): Promise<ResearchQuestion[]> {
    const { data, error } = await supabase
      .from('research_questions')
      .select('*')
      .eq('audience_type', audienceType)
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching research questions:', error);
      throw error;
    }

    return data || [];
  }

  // Get interview questions for a research question
  static async getInterviewQuestions(researchQuestionId: string): Promise<InterviewQuestion[]> {
    const { data, error } = await supabase
      .from('interview_questions')
      .select('*')
      .eq('research_question_id', researchQuestionId);

    if (error) {
      console.error('Error fetching interview questions:', error);
      throw error;
    }

    return data || [];
  }

  // Save interview session using the database function
  static async saveInterviewSession(
    sessionId: string | null,
    audienceType: AudienceType,
    interviewerName: string,
    participantData: any,
    researchQuestionIds: string[],
    responses: any[],
    summary: {
      takeaways: string;
      problems: string;
      opportunities: string;
      quote: string;
    }
  ): Promise<string> {
    const { data, error } = await supabase.rpc('save_interview_session', {
      p_session_id: sessionId,
      p_audience_type: audienceType,
      p_interviewer_name: interviewerName,
      p_participant_data: participantData,
      p_research_question_ids: researchQuestionIds,
      p_responses: responses,
      p_summary: summary
    });

    if (error) {
      console.error('Error saving interview session:', error);
      throw error;
    }

    return data;
  }

  // Get complete interview session data
  static async getInterviewSession(sessionId: string): Promise<any> {
    const { data, error } = await supabase.rpc('get_interview_session_data', {
      session_uuid: sessionId
    });

    if (error) {
      console.error('Error fetching interview session:', error);
      throw error;
    }

    return data;
  }

  // Get all interview sessions with summary
  static async getInterviewSessions(): Promise<any[]> {
    const { data, error } = await supabase
      .from('interview_session_summary')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interview sessions:', error);
      throw error;
    }

    return data || [];
  }

  // Delete interview session
  static async deleteInterviewSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('interview_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('Error deleting interview session:', error);
      throw error;
    }
  }

  // Save AI suggestions
  static async saveAISuggestions(
    sessionId: string,
    researchQuestionId: string,
    suggestions: Array<{
      suggestion_text: string;
      reasoning?: string;
      category?: string;
    }>
  ): Promise<void> {
    const suggestionsData = suggestions.map(suggestion => ({
      session_id: sessionId,
      research_question_id: researchQuestionId,
      suggestion_text: suggestion.suggestion_text,
      reasoning: suggestion.reasoning,
      category: suggestion.category
    }));

    const { error } = await supabase
      .from('ai_suggestions')
      .insert(suggestionsData);

    if (error) {
      console.error('Error saving AI suggestions:', error);
      throw error;
    }
  }

  // Get AI suggestions for a session and research question
  static async getAISuggestions(sessionId: string, researchQuestionId: string): Promise<AISuggestion[]> {
    const { data, error } = await supabase
      .from('ai_suggestions')
      .select('*')
      .eq('session_id', sessionId)
      .eq('research_question_id', researchQuestionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching AI suggestions:', error);
      throw error;
    }

    return data || [];
  }

  // Test database connection
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('research_questions')
        .select('count')
        .limit(1);

      if (error) {
        console.error('Database connection test failed:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Database connection test error:', error);
      return false;
    }
  }
}

// Utility function to convert frontend data to database format
export function convertToDatabaseFormat(frontendData: any): any {
  return {
    firstName: frontendData.first_name,
    lastName: frontendData.last_name,
    company: frontendData.company,
    email: frontendData.email,
    phone: frontendData.phone,
    jobTitle: frontendData.job_title,
    specialties: frontendData.specialties,
    background: frontendData.background,
    howGotJob: frontendData.how_got_job,
    age: frontendData.age,
    gender: frontendData.gender,
    zipCode: frontendData.zip_code,
    householdIncome: frontendData.household_income,
    education: frontendData.education,
    householdSize: frontendData.household_size,
    childrenInSchool: frontendData.children_in_school,
    commuteAreas: frontendData.commute_areas,
    photo: frontendData.photo
  };
}

// Utility function to convert database data to frontend format
export function convertFromDatabaseFormat(databaseData: any): any {
  return {
    first_name: databaseData.firstName,
    last_name: databaseData.lastName,
    company: databaseData.company,
    email: databaseData.email,
    phone: databaseData.phone,
    job_title: databaseData.jobTitle,
    specialties: databaseData.specialties,
    background: databaseData.background,
    how_got_job: databaseData.howGotJob,
    age: databaseData.age,
    gender: databaseData.gender,
    zip_code: databaseData.zipCode,
    household_income: databaseData.householdIncome,
    education: databaseData.education,
    household_size: databaseData.householdSize,
    children_in_school: databaseData.childrenInSchool,
    commute_areas: databaseData.commuteAreas,
    photo: databaseData.photo
  };
}
