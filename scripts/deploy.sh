#!/bin/bash

# Production deployment script
set -e

echo "🚀 Starting production deployment..."

# Check environment variables
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN is required"
  exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm test

# Run security audit
echo "🔒 Running security audit..."
npm audit --audit-level=high

# Build application
echo "🔨 Building application..."
npm run build

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
npx vercel --prod --token=$VERCEL_TOKEN

echo "✅ Deployment complete!"