import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(action)
          },
          {
            role: 'user',
            content: getUserPrompt(action, data)
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      return NextResponse.json(
        { error: `OpenAI API error: ${error.error?.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    const result = await openaiResponse.json();
    const content = result.choices[0].message.content;

    // Try to parse as JSON, fallback to text
    try {
      const parsedContent = JSON.parse(content);
      return NextResponse.json({ data: parsedContent });
    } catch {
      return NextResponse.json({ data: { content } });
    }

  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getSystemPrompt(action: string): string {
  switch (action) {
    case 'extractInsights':
      return 'You are an expert interview analyst specializing in user research and customer discovery. Extract key insights from interview responses and format them as JSON.';
    case 'suggestFollowUps':
      return 'You are an expert interviewer. Suggest 3-5 follow-up questions based on the current response. Focus on story-based questions that dig deeper into motivations and experiences.';
    case 'generateQuestions':
      return 'You are an expert in user research and customer discovery. Generate better, more effective interview questions based on the audience type and existing responses.';
    default:
      return 'You are a helpful AI assistant specializing in user research and interview analysis.';
  }
}

function getUserPrompt(action: string, data: any): string {
  switch (action) {
    case 'extractInsights':
      return buildInsightsPrompt(data);
    case 'suggestFollowUps':
      return buildFollowUpPrompt(data);
    case 'generateQuestions':
      return buildQuestionGenerationPrompt(data);
    default:
      return 'Please help analyze this interview data.';
  }
}

function buildInsightsPrompt(data: any): string {
  const { responses, participant, audienceType } = data;
  
  const responseText = responses.map((r: any) => {
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

function buildFollowUpPrompt(data: any): string {
  const { responses, currentQuestion } = data;
  
  const recentResponses = responses.slice(-3).map((r: any) => {
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

function buildQuestionGenerationPrompt(data: any): string {
  const { audienceType, existingQuestions, responses } = data;
  
  const existingQText = existingQuestions.map((q: any) => q.questionText).join('\n');
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
