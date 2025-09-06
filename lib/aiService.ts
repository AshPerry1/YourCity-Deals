// AI Service for OpenAI integration
export interface AIInsights {
  keyTakeaways: string[];
  problems: string[];
  opportunities: string[];
  memorableQuotes: string[];
  suggestedFollowUps: string[];
}

export interface AIQuestionSuggestion {
  question: string;
  reasoning: string;
  category: string;
}

class AIService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    // Get API key from environment or user input
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || null;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, data: any) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not provided');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  async extractInsights(responses: any[], participant: any, audienceType: string): Promise<AIInsights> {
    const prompt = this.buildInsightsPrompt(responses, participant, audienceType);
    
    const data = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview analyst specializing in user research and customer discovery. Extract key insights from interview responses and format them as JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    };

    try {
      const result = await this.makeRequest('/chat/completions', data);
      const content = result.choices[0].message.content;
      
      // Parse JSON response
      const insights = JSON.parse(content);
      return insights;
    } catch (error) {
      console.error('Error extracting insights:', error);
      // Return fallback insights
      return {
        keyTakeaways: ['AI insights temporarily unavailable'],
        problems: ['AI analysis in progress'],
        opportunities: ['AI suggestions loading'],
        memorableQuotes: ['AI quote detection offline'],
        suggestedFollowUps: ['AI suggestions unavailable']
      };
    }
  }

  async suggestFollowUpQuestions(responses: any[], currentQuestion: string): Promise<AIQuestionSuggestion[]> {
    const prompt = this.buildFollowUpPrompt(responses, currentQuestion);
    
    const data = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interviewer. Suggest 3-5 follow-up questions based on the current response. Focus on story-based questions that dig deeper into motivations and experiences.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 800
    };

    try {
      const result = await this.makeRequest('/chat/completions', data);
      const content = result.choices[0].message.content;
      
      // Parse JSON response
      const suggestions = JSON.parse(content);
      return suggestions;
    } catch (error) {
      console.error('Error suggesting follow-ups:', error);
      return [{
        question: 'Can you tell me more about that experience?',
        reasoning: 'AI suggestions temporarily unavailable',
        category: 'Follow-up'
      }];
    }
  }

  async generateBetterQuestions(audienceType: string, existingQuestions: any[], responses: any[]): Promise<AIQuestionSuggestion[]> {
    const prompt = this.buildQuestionGenerationPrompt(audienceType, existingQuestions, responses);
    
    const data = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in user research and customer discovery. Generate better, more effective interview questions based on the audience type and existing responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1000
    };

    try {
      const result = await this.makeRequest('/chat/completions', data);
      const content = result.choices[0].message.content;
      
      // Parse JSON response
      const suggestions = JSON.parse(content);
      return suggestions;
    } catch (error) {
      console.error('Error generating questions:', error);
      return [{
        question: 'What is your biggest challenge with [topic]?',
        reasoning: 'AI question generation temporarily unavailable',
        category: 'Problem Discovery'
      }];
    }
  }

  private buildInsightsPrompt(responses: any[], participant: any, audienceType: string): string {
    const responseText = responses.map(r => {
      let answer = '';
      if (r.answerText) answer = r.answerText;
      else if (r.answerYesno !== undefined) answer = r.answerYesno ? 'Yes' : 'No';
      else if (r.answerScale !== undefined) answer = `${r.answerScale}/10`;
      else if (r.answerCurrencyCents !== undefined) answer = `$${(r.answerCurrencyCents / 100).toFixed(2)}`;
      else if (r.answerMultiselect?.length) answer = r.answerMultiselect.join(', ');
      
      return `Q: ${r.questionText || 'Interview question'}\nA: ${answer}${r.notes ? `\nNotes: ${r.notes}` : ''}`;
    }).join('\n\n');

    return `
Analyze this interview with a ${audienceType} participant and extract key insights.

Participant: ${participant.firstName} ${participant.lastName}
Role: ${participant.jobTitle} at ${participant.company}
Background: ${participant.background}

Interview Responses:
${responseText}

Please extract and return a JSON object with:
{
  "keyTakeaways": ["3-5 important things to remember about this participant"],
  "problems": ["2-4 frustrations or unmet needs expressed"],
  "opportunities": ["2-4 business opportunities identified"],
  "memorableQuotes": ["1-3 direct quotes that capture key insights"],
  "suggestedFollowUps": ["2-3 follow-up questions to explore further"]
}

Focus on actionable insights for a digital coupon book business targeting ${audienceType}s.
`;
  }

  private buildFollowUpPrompt(responses: any[], currentQuestion: string): string {
    const recentResponses = responses.slice(-3).map(r => {
      let answer = '';
      if (r.answerText) answer = r.answerText;
      else if (r.answerYesno !== undefined) answer = r.answerYesno ? 'Yes' : 'No';
      else if (r.answerScale !== undefined) answer = `${r.answerScale}/10`;
      else if (r.answerCurrencyCents !== undefined) answer = `$${(r.answerCurrencyCents / 100).toFixed(2)}`;
      else if (r.answerMultiselect?.length) answer = r.answerMultiselect.join(', ');
      
      return `Q: ${r.questionText || 'Question'}\nA: ${answer}`;
    }).join('\n\n');

    return `
Based on this recent interview exchange, suggest 3-5 follow-up questions to dig deeper:

Recent Exchange:
${recentResponses}

Current Question Context: ${currentQuestion}

Return a JSON array of follow-up questions:
[
  {
    "question": "Tell me more about...",
    "reasoning": "Why this follow-up is valuable",
    "category": "Category name"
  }
]

Focus on story-based questions that explore motivations, experiences, and specific examples.
`;
  }

  private buildQuestionGenerationPrompt(audienceType: string, existingQuestions: any[], responses: any[]): string {
    const existingQText = existingQuestions.map(q => q.questionText).join('\n');
    const responseSummary = responses.length > 0 ? 
      `Based on ${responses.length} responses collected so far` : 
      'No responses collected yet';

    return `
Generate better interview questions for ${audienceType} audience research.

Audience Type: ${audienceType}
Existing Questions: ${existingQText}
Context: ${responseSummary}

Return a JSON array of improved questions:
[
  {
    "question": "Tell me about a time when...",
    "reasoning": "Why this question is effective",
    "category": "Category name"
  }
]

Focus on:
- Story-based questions ("Tell me about a time when...")
- Behavioral questions (what they actually do)
- Motivational questions (why they do it)
- Problem discovery (pain points and frustrations)
- Opportunity identification (unmet needs)

Make questions specific to ${audienceType}s and digital coupon book business context.
`;
  }
}

export const aiService = new AIService();
