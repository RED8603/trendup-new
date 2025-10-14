#!/bin/bash
# TrendUp Production Build Script
# Run this on your LOCAL machine before deploying to EC2

echo "🚀 Building TrendUp for Production (EC2: 3.25.92.137)"
echo "=================================================="

# Check if in correct directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Run this from the trendup-new root directory"
    exit 1
fi

# Build frontend
echo ""
echo "📦 Building frontend..."
cd frontend

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "⚠️  Creating .env.production file..."
    cat > .env.production << EOF
VITE_API_URL=http://3.25.92.137/api/v1
VITE_WEB3_PROJECT_ID=a65bc026af82f217afeb8f7543a83113
EOF
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
fi

# Build
npm run build

# Check if dist folder was created
if [ -d "dist" ]; then
    echo "✅ Frontend build successful!"
    echo "   Output: frontend/dist"
    echo "   Size: $(du -sh dist | cut -f1)"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

cd ..

echo ""
echo "=================================================="
echo "✅ Build Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Commit and push: git add . && git commit -m 'Production build' && git push"
echo "2. On EC2: cd trendup-new && git pull"
echo "3. On EC2: docker-compose -f docker-compose.prod.yml up -d --build"
echo ""
echo "🌐 Your app will be at: http://3.25.92.137"
echo "=================================================="

