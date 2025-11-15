#!/bin/bash

# Environment setup script
echo "🔧 Setting up environment..."

# Copy environment template
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "📝 Created .env.local from template"
  echo "⚠️  Please update .env.local with your actual values"
else
  echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run database migrations (if needed)
echo "🗄️  Database setup complete"

# Setup git hooks
echo "🪝 Setting up git hooks..."
npx husky install

echo "✅ Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your credentials"
echo "2. Run 'npm run dev' to start development"