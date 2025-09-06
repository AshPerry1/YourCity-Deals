-- Interview Tool Database Schema for Supabase
-- This creates all necessary tables for the Live Discovery Interview Tool

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE audience_type AS ENUM ('buyer', 'seller', 'organization', 'merchant');
CREATE TYPE answer_type AS ENUM ('text', 'yesno', 'scale', 'currency', 'multiselect');

-- Participants table
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(200),
    email VARCHAR(255),
    phone VARCHAR(20),
    job_title VARCHAR(200),
    specialties TEXT[],
    background TEXT,
    how_got_job TEXT,
    -- Demographic data
    age VARCHAR(20),
    gender VARCHAR(50),
    zip_code VARCHAR(10),
    household_income VARCHAR(50),
    education VARCHAR(100),
    household_size VARCHAR(20),
    children_in_school VARCHAR(20),
    commute_areas TEXT,
    photo TEXT, -- Base64 encoded image data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research questions table
CREATE TABLE research_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audience_type audience_type NOT NULL,
    question_text TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview questions table (suggested questions for each research question)
CREATE TABLE interview_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    research_question_id UUID NOT NULL REFERENCES research_questions(id) ON DELETE CASCADE,
    prompt_text TEXT NOT NULL,
    answer_type answer_type NOT NULL,
    options TEXT[], -- For multiselect questions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview sessions table
CREATE TABLE interview_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audience_type audience_type NOT NULL,
    interviewer_name VARCHAR(200) NOT NULL,
    color_theme VARCHAR(50),
    summary_takeaways TEXT,
    summary_problems TEXT,
    summary_opportunities TEXT,
    summary_quote TEXT,
    participant_id UUID REFERENCES participants(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session research questions (many-to-many relationship)
CREATE TABLE session_research_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    research_question_id UUID NOT NULL REFERENCES research_questions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, research_question_id)
);

-- Session responses table
CREATE TABLE session_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    research_question_id UUID NOT NULL REFERENCES research_questions(id) ON DELETE CASCADE,
    interview_question_id UUID REFERENCES interview_questions(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL, -- Denormalized for easier querying
    -- Answer fields (only one will be populated based on answer_type)
    answer_text TEXT,
    answer_yesno BOOLEAN,
    answer_scale INTEGER CHECK (answer_scale >= 1 AND answer_scale <= 10),
    answer_currency_cents INTEGER,
    answer_multiselect TEXT[],
    notes TEXT,
    is_unanswered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI suggestions table (for storing AI-generated follow-up questions)
CREATE TABLE ai_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    research_question_id UUID NOT NULL REFERENCES research_questions(id) ON DELETE CASCADE,
    suggestion_text TEXT NOT NULL,
    reasoning TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_participants_company ON participants(company);
CREATE INDEX idx_research_questions_audience ON research_questions(audience_type);
CREATE INDEX idx_interview_questions_research ON interview_questions(research_question_id);
CREATE INDEX idx_interview_sessions_audience ON interview_sessions(audience_type);
CREATE INDEX idx_interview_sessions_participant ON interview_sessions(participant_id);
CREATE INDEX idx_session_research_questions_session ON session_research_questions(session_id);
CREATE INDEX idx_session_research_questions_research ON session_research_questions(research_question_id);
CREATE INDEX idx_session_responses_session ON session_responses(session_id);
CREATE INDEX idx_session_responses_research ON session_responses(research_question_id);
CREATE INDEX idx_ai_suggestions_session ON ai_suggestions(session_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_research_questions_updated_at BEFORE UPDATE ON research_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_questions_updated_at BEFORE UPDATE ON interview_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_sessions_updated_at BEFORE UPDATE ON interview_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_session_responses_updated_at BEFORE UPDATE ON session_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample research questions
INSERT INTO research_questions (audience_type, question_text, category) VALUES
-- Buyer questions
('buyer', 'What are your biggest challenges when shopping for deals and discounts?', 'Pain Points'),
('buyer', 'How do you currently discover new businesses and offers in your area?', 'Discovery'),
('buyer', 'What would make you more likely to try a new restaurant or service?', 'Motivation'),
('buyer', 'How important is supporting local businesses to you?', 'Values'),
('buyer', 'What frustrates you most about current coupon and deal systems?', 'Frustrations'),

-- Seller questions
('seller', 'What are your biggest challenges in attracting new customers?', 'Customer Acquisition'),
('seller', 'How do you currently promote your business and offers?', 'Marketing'),
('seller', 'What would help you reach more local customers?', 'Local Reach'),
('seller', 'How do you measure the success of your promotional efforts?', 'Analytics'),
('seller', 'What barriers prevent you from offering more discounts?', 'Constraints'),

-- Organization questions
('organization', 'What are your main fundraising challenges?', 'Fundraising'),
('organization', 'How do you currently engage with local businesses?', 'Business Relations'),
('organization', 'What would make businesses more likely to partner with you?', 'Partnership'),
('organization', 'How do you track and measure community impact?', 'Impact'),
('organization', 'What resources do you need most to grow your programs?', 'Resources'),

-- Merchant questions
('merchant', 'What are your biggest operational challenges?', 'Operations'),
('merchant', 'How do you currently manage customer relationships?', 'CRM'),
('merchant', 'What would help you increase customer loyalty?', 'Loyalty'),
('merchant', 'How do you handle seasonal fluctuations in business?', 'Seasonality'),
('merchant', 'What technology would most improve your business?', 'Technology');

-- Insert sample interview questions for each research question
INSERT INTO interview_questions (research_question_id, prompt_text, answer_type, options) 
SELECT 
    rq.id,
    'Can you tell me about a specific time when you experienced this challenge?',
    'text',
    NULL
FROM research_questions rq WHERE rq.question_text LIKE '%challenges%';

INSERT INTO interview_questions (research_question_id, prompt_text, answer_type, options) 
SELECT 
    rq.id,
    'On a scale of 1-10, how important is this to you?',
    'scale',
    NULL
FROM research_questions rq WHERE rq.question_text LIKE '%important%';

INSERT INTO interview_questions (research_question_id, prompt_text, answer_type, options) 
SELECT 
    rq.id,
    'What specific solutions have you tried before?',
    'text',
    NULL
FROM research_questions rq WHERE rq.question_text LIKE '%currently%';

INSERT INTO interview_questions (research_question_id, prompt_text, answer_type, options) 
SELECT 
    rq.id,
    'What would an ideal solution look like for you?',
    'text',
    NULL
FROM research_questions rq WHERE rq.question_text LIKE '%would%';

INSERT INTO interview_questions (research_question_id, prompt_text, answer_type, options) 
SELECT 
    rq.id,
    'How much would you be willing to pay for a solution like this?',
    'currency',
    NULL
FROM research_questions rq WHERE rq.question_text LIKE '%pay%';

-- Create views for easier querying
CREATE VIEW interview_session_summary AS
SELECT 
    s.id,
    s.audience_type,
    s.interviewer_name,
    s.created_at,
    s.updated_at,
    p.first_name,
    p.last_name,
    p.company,
    p.job_title,
    COUNT(sr.id) as response_count,
    COUNT(DISTINCT srq.research_question_id) as questions_explored
FROM interview_sessions s
LEFT JOIN participants p ON s.participant_id = p.id
LEFT JOIN session_responses sr ON s.id = sr.session_id
LEFT JOIN session_research_questions srq ON s.id = srq.session_id
GROUP BY s.id, s.audience_type, s.interviewer_name, s.created_at, s.updated_at, 
         p.first_name, p.last_name, p.company, p.job_title;

-- Create a function to get complete interview data
CREATE OR REPLACE FUNCTION get_interview_session_data(session_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'session', row_to_json(s),
        'participant', row_to_json(p),
        'research_questions', (
            SELECT json_agg(
                json_build_object(
                    'id', rq.id,
                    'question_text', rq.question_text,
                    'category', rq.category,
                    'suggested_questions', (
                        SELECT json_agg(
                            json_build_object(
                                'id', iq.id,
                                'prompt_text', iq.prompt_text,
                                'answer_type', iq.answer_type,
                                'options', iq.options
                            )
                        )
                        FROM interview_questions iq 
                        WHERE iq.research_question_id = rq.id
                    )
                )
            )
            FROM research_questions rq
            JOIN session_research_questions srq ON rq.id = srq.research_question_id
            WHERE srq.session_id = session_uuid
        ),
        'responses', (
            SELECT json_agg(
                json_build_object(
                    'id', sr.id,
                    'question_text', sr.question_text,
                    'answer_text', sr.answer_text,
                    'answer_yesno', sr.answer_yesno,
                    'answer_scale', sr.answer_scale,
                    'answer_currency_cents', sr.answer_currency_cents,
                    'answer_multiselect', sr.answer_multiselect,
                    'notes', sr.notes,
                    'is_unanswered', sr.is_unanswered
                )
            )
            FROM session_responses sr
            WHERE sr.session_id = session_uuid
        )
    ) INTO result
    FROM interview_sessions s
    LEFT JOIN participants p ON s.participant_id = p.id
    WHERE s.id = session_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create a function to save interview session
CREATE OR REPLACE FUNCTION save_interview_session(
    p_session_id UUID DEFAULT NULL,
    p_audience_type audience_type,
    p_interviewer_name VARCHAR(200),
    p_participant_data JSONB,
    p_research_question_ids UUID[],
    p_responses JSONB,
    p_summary JSONB
)
RETURNS UUID AS $$
DECLARE
    v_session_id UUID;
    v_participant_id UUID;
    response JSONB;
BEGIN
    -- Create or update session
    IF p_session_id IS NULL THEN
        INSERT INTO interview_sessions (audience_type, interviewer_name, summary_takeaways, summary_problems, summary_opportunities, summary_quote)
        VALUES (p_audience_type, p_interviewer_name, 
                p_summary->>'takeaways', p_summary->>'problems', 
                p_summary->>'opportunities', p_summary->>'quote')
        RETURNING id INTO v_session_id;
    ELSE
        v_session_id := p_session_id;
        UPDATE interview_sessions 
        SET summary_takeaways = p_summary->>'takeaways',
            summary_problems = p_summary->>'problems',
            summary_opportunities = p_summary->>'opportunities',
            summary_quote = p_summary->>'quote',
            updated_at = NOW()
        WHERE id = v_session_id;
    END IF;

    -- Create or update participant
    INSERT INTO participants (
        first_name, last_name, company, email, phone, job_title, specialties,
        background, how_got_job, age, gender, zip_code, household_income,
        education, household_size, children_in_school, commute_areas, photo
    ) VALUES (
        p_participant_data->>'firstName', p_participant_data->>'lastName',
        p_participant_data->>'company', p_participant_data->>'email',
        p_participant_data->>'phone', p_participant_data->>'jobTitle',
        ARRAY(SELECT jsonb_array_elements_text(p_participant_data->'specialties')),
        p_participant_data->>'background', p_participant_data->>'howGotJob',
        p_participant_data->>'age', p_participant_data->>'gender',
        p_participant_data->>'zipCode', p_participant_data->>'householdIncome',
        p_participant_data->>'education', p_participant_data->>'householdSize',
        p_participant_data->>'childrenInSchool', p_participant_data->>'commuteAreas',
        p_participant_data->>'photo'
    )
    ON CONFLICT (email) WHERE email IS NOT NULL AND email != ''
    DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        company = EXCLUDED.company,
        phone = EXCLUDED.phone,
        job_title = EXCLUDED.job_title,
        specialties = EXCLUDED.specialties,
        background = EXCLUDED.background,
        how_got_job = EXCLUDED.how_got_job,
        age = EXCLUDED.age,
        gender = EXCLUDED.gender,
        zip_code = EXCLUDED.zip_code,
        household_income = EXCLUDED.household_income,
        education = EXCLUDED.education,
        household_size = EXCLUDED.household_size,
        children_in_school = EXCLUDED.children_in_school,
        commute_areas = EXCLUDED.commute_areas,
        photo = EXCLUDED.photo,
        updated_at = NOW()
    RETURNING id INTO v_participant_id;

    -- Link participant to session
    UPDATE interview_sessions 
    SET participant_id = v_participant_id 
    WHERE id = v_session_id;

    -- Clear existing research questions for this session
    DELETE FROM session_research_questions WHERE session_id = v_session_id;

    -- Add research questions
    INSERT INTO session_research_questions (session_id, research_question_id)
    SELECT v_session_id, unnest(p_research_question_ids);

    -- Clear existing responses
    DELETE FROM session_responses WHERE session_id = v_session_id;

    -- Add responses
    FOR response IN SELECT * FROM jsonb_array_elements(p_responses)
    LOOP
        INSERT INTO session_responses (
            session_id, research_question_id, interview_question_id,
            question_text, answer_text, answer_yesno, answer_scale,
            answer_currency_cents, answer_multiselect, notes, is_unanswered
        ) VALUES (
            v_session_id,
            (response->>'researchQuestionId')::UUID,
            (response->>'interviewQuestionId')::UUID,
            response->>'questionText',
            response->>'answerText',
            (response->>'answerYesno')::BOOLEAN,
            (response->>'answerScale')::INTEGER,
            (response->>'answerCurrencyCents')::INTEGER,
            ARRAY(SELECT jsonb_array_elements_text(response->'answerMultiselect')),
            response->>'notes',
            COALESCE((response->>'isUnanswered')::BOOLEAN, FALSE)
        );
    END LOOP;

    RETURN v_session_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_research_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now - you can restrict later)
CREATE POLICY "Allow all operations on participants" ON participants FOR ALL USING (true);
CREATE POLICY "Allow all operations on research_questions" ON research_questions FOR ALL USING (true);
CREATE POLICY "Allow all operations on interview_questions" ON interview_questions FOR ALL USING (true);
CREATE POLICY "Allow all operations on interview_sessions" ON interview_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on session_research_questions" ON session_research_questions FOR ALL USING (true);
CREATE POLICY "Allow all operations on session_responses" ON session_responses FOR ALL USING (true);
CREATE POLICY "Allow all operations on ai_suggestions" ON ai_suggestions FOR ALL USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create a function to get research questions by audience type
CREATE OR REPLACE FUNCTION get_research_questions_by_audience(audience audience_type)
RETURNS TABLE (
    id UUID,
    question_text TEXT,
    category VARCHAR(100),
    suggested_questions JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rq.id,
        rq.question_text,
        rq.category,
        (
            SELECT json_agg(
                json_build_object(
                    'id', iq.id,
                    'prompt_text', iq.prompt_text,
                    'answer_type', iq.answer_type,
                    'options', iq.options
                )
            )
            FROM interview_questions iq 
            WHERE iq.research_question_id = rq.id
        ) as suggested_questions
    FROM research_questions rq
    WHERE rq.audience_type = audience
    ORDER BY rq.category, rq.question_text;
END;
$$ LANGUAGE plpgsql;

COMMENT ON SCHEMA public IS 'Interview Tool Database Schema for YourCity Deals';
COMMENT ON TABLE participants IS 'Stores participant information and demographic data';
COMMENT ON TABLE research_questions IS 'Master list of research questions by audience type';
COMMENT ON TABLE interview_questions IS 'Suggested interview questions for each research question';
COMMENT ON TABLE interview_sessions IS 'Interview session metadata and summary';
COMMENT ON TABLE session_research_questions IS 'Many-to-many relationship between sessions and research questions';
COMMENT ON TABLE session_responses IS 'Individual responses to interview questions';
COMMENT ON TABLE ai_suggestions IS 'AI-generated follow-up questions and suggestions';
