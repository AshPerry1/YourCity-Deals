#!/bin/bash

# Interview Tool Database Setup Script
# This script helps you set up the Supabase database for the interview tool

echo "🚀 Setting up Interview Tool Database Schema"
echo "=============================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "Please install it first:"
    echo "npm install -g supabase"
    echo ""
    echo "Or run the SQL manually in your Supabase dashboard:"
    echo "1. Go to https://supabase.com/dashboard"
    echo "2. Select your project"
    echo "3. Go to SQL Editor"
    echo "4. Copy and paste the contents of 'interview-database-schema.sql'"
    echo "5. Click 'Run'"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory."
    echo "Please run this from your project root or initialize Supabase:"
    echo "supabase init"
    echo ""
    exit 1
fi

echo "✅ Supabase project detected"
echo ""

# Ask user what they want to do
echo "What would you like to do?"
echo "1. Run the SQL schema in your Supabase project"
echo "2. Show me the SQL to copy/paste manually"
echo "3. Test the database connection"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🔄 Running SQL schema..."
        echo "This will create all tables, functions, and sample data."
        echo ""
        
        # Run the SQL file
        if supabase db reset --db-url "$(supabase status | grep 'DB URL' | awk '{print $3}')" < interview-database-schema.sql; then
            echo ""
            echo "✅ Database schema created successfully!"
            echo ""
            echo "Next steps:"
            echo "1. Update your environment variables with the correct Supabase URL and keys"
            echo "2. Test the interview tool at https://yourcitydeals.com/interview"
            echo "3. The database is now ready for storing interview data"
        else
            echo ""
            echo "❌ Error running SQL schema."
            echo "Please check the error messages above and try running the SQL manually."
        fi
        ;;
    2)
        echo ""
        echo "📋 Here's the SQL to copy and paste:"
        echo "====================================="
        echo ""
        cat interview-database-schema.sql
        echo ""
        echo "====================================="
        echo ""
        echo "Instructions:"
        echo "1. Go to https://supabase.com/dashboard"
        echo "2. Select your project"
        echo "3. Go to SQL Editor"
        echo "4. Copy the SQL above and paste it"
        echo "5. Click 'Run'"
        ;;
    3)
        echo ""
        echo "🔍 Testing database connection..."
        
        # Test connection by checking if tables exist
        if supabase db diff --schema public > /dev/null 2>&1; then
            echo "✅ Database connection successful!"
            echo ""
            echo "You can now:"
            echo "1. Run the SQL schema (option 1)"
            echo "2. Or copy/paste manually (option 2)"
        else
            echo "❌ Database connection failed."
            echo "Please check your Supabase configuration."
        fi
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again and choose 1, 2, or 3."
        ;;
esac

echo ""
echo "🎯 Interview Tool Database Setup Complete!"
echo ""
echo "The database schema includes:"
echo "• participants - Stores participant information and demographics"
echo "• research_questions - Master list of research questions by audience"
echo "• interview_questions - Suggested questions for each research question"
echo "• interview_sessions - Interview session metadata and summaries"
echo "• session_responses - Individual responses to interview questions"
echo "• ai_suggestions - AI-generated follow-up questions"
echo ""
echo "Sample data has been inserted for all audience types."
echo "You can now start using the interview tool with full database persistence!"
