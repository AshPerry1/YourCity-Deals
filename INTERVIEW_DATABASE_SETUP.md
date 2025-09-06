# Interview Tool Database Setup

This guide will help you set up the Supabase database backend for your Live Discovery Interview Tool.

## 🗄️ Database Schema Overview

The database includes the following tables:

### Core Tables
- **`participants`** - Stores participant information and demographic data
- **`research_questions`** - Master list of research questions by audience type
- **`interview_questions`** - Suggested interview questions for each research question
- **`interview_sessions`** - Interview session metadata and summaries
- **`session_research_questions`** - Many-to-many relationship between sessions and research questions
- **`session_responses`** - Individual responses to interview questions
- **`ai_suggestions`** - AI-generated follow-up questions and suggestions

### Key Features
- **Audience Types**: buyer, seller, organization, merchant
- **Answer Types**: text, yesno, scale, currency, multiselect
- **Automatic Timestamps**: created_at and updated_at for all records
- **Row Level Security**: Enabled for data protection
- **Sample Data**: Pre-populated with research questions for all audience types

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
./setup-interview-database.sh
```

### Option 2: Manual Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the contents of `interview-database-schema.sql`
5. Click **Run**

## 📊 Sample Data Included

The schema includes pre-populated research questions for all audience types:

### Buyer Questions
- "What are your biggest challenges when shopping for deals and discounts?"
- "How do you currently discover new businesses and offers in your area?"
- "What would make you more likely to try a new restaurant or service?"

### Seller Questions
- "What are your biggest challenges in attracting new customers?"
- "How do you currently promote your business and offers?"
- "What would help you reach more local customers?"

### Organization Questions
- "What are your main fundraising challenges?"
- "How do you currently engage with local businesses?"
- "What would make businesses more likely to partner with you?"

### Merchant Questions
- "What are your biggest operational challenges?"
- "How do you currently manage customer relationships?"
- "What would help you increase customer loyalty?"

## 🔧 Database Functions

### `save_interview_session()`
Saves a complete interview session including:
- Participant data
- Selected research questions
- All responses
- Summary information

### `get_interview_session_data()`
Retrieves complete interview data in JSON format for easy frontend consumption.

### `get_research_questions_by_audience()`
Gets all research questions and their suggested interview questions for a specific audience type.

## 🔒 Security

- **Row Level Security (RLS)** is enabled on all tables
- **Policies** currently allow all operations (you can restrict later)
- **Permissions** granted to both anonymous and authenticated users

## 📈 Performance Optimizations

- **Indexes** created on frequently queried columns
- **Views** for easier data access
- **Triggers** for automatic timestamp updates

## 🧪 Testing the Setup

After running the schema, you can test the connection:

```sql
-- Test basic connectivity
SELECT COUNT(*) FROM research_questions;

-- Test function
SELECT get_research_questions_by_audience('buyer');

-- Test session creation
SELECT save_interview_session(
    NULL,
    'buyer',
    'Test Interviewer',
    '{"firstName": "John", "lastName": "Doe"}',
    ARRAY[]::UUID[],
    '[]'::JSONB,
    '{"takeaways": "Test", "problems": "Test", "opportunities": "Test", "quote": "Test"}'::JSONB
);
```

## 🔄 Integration with Frontend

The database is designed to work seamlessly with the interview tool:

1. **Research Questions**: Loaded dynamically based on selected audience
2. **Session Management**: Automatic saving and loading of interview progress
3. **Response Storage**: All answers stored with proper typing
4. **AI Integration**: Suggestions can be stored and retrieved
5. **Export Ready**: Data formatted for Word document generation

## 📝 Environment Variables

Make sure these are set in your Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🎯 Next Steps

1. **Run the database setup**
2. **Update environment variables**
3. **Test the interview tool**
4. **Customize research questions** as needed
5. **Set up proper RLS policies** for production

## 🆘 Troubleshooting

### Common Issues

**"Table doesn't exist"**
- Make sure you ran the complete SQL schema
- Check that all tables were created successfully

**"Permission denied"**
- Verify your Supabase keys are correct
- Check RLS policies if you've customized them

**"Function not found"**
- Ensure all functions were created
- Check the function signatures match

### Getting Help

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Verify your environment variables
3. Test individual SQL commands
4. Check the browser console for errors

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Your interview tool database is now ready for production use!** 🎉
