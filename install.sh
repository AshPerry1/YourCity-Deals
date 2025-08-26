#!/bin/bash

echo "🚀 Setting up Digital Coupon Book Project"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create environment file
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ .env.local created from template"
    echo "⚠️  Please edit .env.local with your actual credentials"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Edit .env.local with your Supabase and Stripe credentials"
echo "2. Set up your Supabase database (see README.md for SQL schema)"
echo "3. Configure Stripe webhooks"
echo "4. Run 'npm run dev' to start development server"
echo ""
echo "📚 Check README.md for detailed setup instructions"
echo "🌐 Visit http://localhost:3000 after starting the dev server"
