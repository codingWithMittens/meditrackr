#!/bin/bash

# MedMindr Deployment Script
# Make executable with: chmod +x deploy.sh

echo "🏥 MedMindr Deployment Script"
echo "=============================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🏗️  Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output in ./dist/"
    echo ""
    echo "🚀 Ready to deploy! Choose an option:"
    echo ""
    echo "1. Vercel: npx vercel --prod"
    echo "2. Netlify: npx netlify deploy --prod --dir=dist"
    echo "3. Manual: Upload contents of ./dist/ folder"
    echo ""
    echo "📋 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed!"
    exit 1
fi