#!/bin/bash

# Production Build Script for Ayrshare App
set -e

echo "🚀 Starting production build..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Create production directory
echo "📁 Creating production directory..."
mkdir -p production

# Copy necessary files
echo "📋 Copying production files..."
cp -r .next production/
cp -r public production/
cp package.json production/
cp package-lock.json production/

# Create production start script
echo "📝 Creating production start script..."
cat > production/start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Ayrshare production server..."
npm start
EOF

chmod +x production/start.sh

# Create .env.production if it doesn't exist
if [ ! -f ".env.production" ]; then
    echo "⚠️  Warning: .env.production not found. Please create it with your production environment variables."
fi

echo "✅ Production build completed!"
echo "📁 Production files are in the 'production' directory"
echo "🚀 To deploy:"
echo "   1. Copy the 'production' directory to your server"
echo "   2. Set your environment variables"
echo "   3. Run: cd production && npm start"
