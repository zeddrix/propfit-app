#!/bin/bash

# Local testing script for GitHub Pages deployment
# This script serves the built site locally to verify it works correctly

echo "🚀 Testing GitHub Pages deployment locally..."
echo ""

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "❌ Build directory not found. Running build first..."
    BASE_PATH='/propfit-app' npm run build
fi

echo "✅ Build directory found"

# Check if .nojekyll exists
if [ -f "build/.nojekyll" ]; then
    echo "✅ .nojekyll file found in build directory"
else
    echo "❌ .nojekyll file missing from build directory"
fi

# Check if index.html has correct base path
if grep -q "/propfit-app/_app/" build/index.html; then
    echo "✅ Asset paths are correctly prefixed with /propfit-app/"
else
    echo "❌ Asset paths missing /propfit-app/ prefix"
fi

echo ""
echo "🌐 Starting local server to test the site..."
echo "📝 Note: The site will be served from http://localhost:8080/propfit-app/"
echo "   This simulates the GitHub Pages environment"
echo ""

# Start a simple HTTP server in the build directory
cd build && python3 -m http.server 8080
