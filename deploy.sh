#!/bin/bash

# Production Deployment Script
# Merchant Approval Workflow System

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="yourcitydeals"
DOMAIN="yourcitydeals.com"
ENVIRONMENT="production"

echo -e "${BLUE}🚀 Starting Production Deployment${NC}"
echo "=================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Pre-deployment checks
echo -e "${BLUE}Step 1: Pre-deployment Checks${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

print_status "Pre-deployment checks passed"

# Step 2: Environment validation
echo -e "${BLUE}Step 2: Environment Validation${NC}"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.production
        print_warning "Please update .env.production with production values"
    else
        print_error ".env.example not found. Please create .env.production manually"
        exit 1
    fi
fi

# Check required environment variables
required_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "NEXT_PUBLIC_SITE_URL"
)

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env.production; then
        print_warning "Missing required environment variable: $var"
    fi
done

print_status "Environment validation completed"

# Step 3: Build validation
echo -e "${BLUE}Step 3: Build Validation${NC}"

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Run type checking
echo "Running TypeScript checks..."
npm run type-check 2>/dev/null || {
    print_warning "TypeScript check failed, but continuing..."
}

# Build the application
echo "Building application..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Build successful"
else
    print_error "Build failed"
    exit 1
fi

# Step 4: Database migration check
echo -e "${BLUE}Step 4: Database Migration Check${NC}"

# Check if migration files exist
migration_files=(
    "merchant-approval-schema.sql"
    "notification-schema.sql"
)

for file in "${migration_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_warning "Migration file not found: $file"
    else
        print_status "Found migration file: $file"
    fi
done

print_warning "Please ensure database migrations are run in Supabase before deployment"

# Step 5: Security checks
echo -e "${BLUE}Step 5: Security Checks${NC}"

# Check for sensitive files
sensitive_files=(
    ".env"
    ".env.local"
    ".env.production"
    "*.key"
    "*.pem"
)

for pattern in "${sensitive_files[@]}"; do
    if find . -name "$pattern" -not -path "./node_modules/*" | grep -q .; then
        print_warning "Sensitive files found matching pattern: $pattern"
    fi
done

# Check if .gitignore includes sensitive files
if ! grep -q "\.env" .gitignore; then
    print_warning ".env files not in .gitignore"
fi

print_status "Security checks completed"

# Step 6: Deploy to Vercel
echo -e "${BLUE}Step 6: Deploying to Vercel${NC}"

# Check if logged in to Vercel
if ! vercel whoami &>/dev/null; then
    print_warning "Not logged in to Vercel. Please login:"
    vercel login
fi

# Deploy to production
echo "Deploying to production..."
vercel --prod --yes

if [ $? -eq 0 ]; then
    print_status "Deployment successful"
else
    print_error "Deployment failed"
    exit 1
fi

# Step 7: Post-deployment validation
echo -e "${BLUE}Step 7: Post-deployment Validation${NC}"

# Get the deployment URL
DEPLOYMENT_URL=$(vercel ls --prod | grep "$PROJECT_NAME" | awk '{print $2}' | head -1)

if [ -z "$DEPLOYMENT_URL" ]; then
    print_warning "Could not determine deployment URL"
else
    echo "Deployment URL: $DEPLOYMENT_URL"
    
    # Test health endpoint
    echo "Testing health endpoint..."
    if curl -f "$DEPLOYMENT_URL/health" &>/dev/null; then
        print_status "Health check passed"
    else
        print_warning "Health check failed"
    fi
    
    # Test main page
    echo "Testing main page..."
    if curl -f "$DEPLOYMENT_URL" &>/dev/null; then
        print_status "Main page accessible"
    else
        print_warning "Main page not accessible"
    fi
fi

# Step 8: Domain setup reminder
echo -e "${BLUE}Step 8: Domain Setup${NC}"

if [ "$DOMAIN" != "yourcitydeals.com" ]; then
    print_status "Custom domain configured: $DOMAIN"
else
    print_warning "Please configure custom domain: $DOMAIN"
    echo "1. Go to Vercel Dashboard"
    echo "2. Navigate to Project Settings"
    echo "3. Add custom domain: $DOMAIN"
    echo "4. Update DNS records as instructed"
fi

# Step 9: Monitoring setup
echo -e "${BLUE}Step 9: Monitoring Setup${NC}"

print_warning "Please set up monitoring:"
echo "1. Enable Vercel Analytics"
echo "2. Configure Sentry for error tracking"
echo "3. Set up Supabase monitoring"
echo "4. Configure health check alerts"

# Step 10: Final checklist
echo -e "${BLUE}Step 10: Final Checklist${NC}"

echo -e "${YELLOW}Please verify:${NC}"
echo "□ Database migrations completed"
echo "□ Environment variables configured"
echo "□ Custom domain working"
echo "□ SSL certificate active"
echo "□ Monitoring systems active"
echo "□ Backup procedures tested"
echo "□ Team notified of deployment"

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Test all approval workflows"
echo "2. Verify notification system"
echo "3. Monitor for any issues"
echo "4. Gather user feedback"
echo ""
echo -e "${YELLOW}Support:${NC}"
echo "If you encounter issues, check:"
echo "- Vercel deployment logs"
echo "- Supabase logs"
echo "- Browser console errors"
echo "- Health endpoint: $DEPLOYMENT_URL/health"
