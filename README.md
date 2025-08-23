# 🚀 Ayrshare Social Media Manager

A modern, full-stack application for managing social media accounts across all platforms using the Ayrshare API.

## ✨ Features

- **🔐 Secure Authentication** - Clerk-powered user management
- **📱 Social Media Integration** - Connect and manage multiple social accounts
- **🔄 SSO Generation** - Generate secure single sign-on URLs for Ayrshare
- **📊 Profile Management** - Unified profile system across the platform
- **🎨 Modern UI/UX** - Beautiful, responsive interface built with Tailwind CSS
- **⚡ Performance** - Next.js 15 with Turbopack for lightning-fast development

## 🚀 Quick Start

### Development

```bash
# Clone the repository
git clone <your-repo-url>
cd ayrshare-copy

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

### Production Deployment

```bash
# Build for production
npm run build:prod

# Start production server
npm run start:prod

# Or use Docker
npm run docker:build
npm run docker:run
```

## 🔧 Environment Variables

**⚠️ SECURITY: Never commit environment files to Git!**

Create `.env.local` for development or `.env.production` for production:

```bash
# Ayrshare API Configuration
AYR_API_KEY=your_api_key_here
AYR_DOMAIN=your_domain_here
AYR_PRIVATE_KEY_B64=your_base64_private_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# With SSL (production)
docker-compose -f docker-compose.yml --profile production up -d
```

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete production deployment instructions
- [Security Guide](./SECURITY.md) - Security best practices and environment variable management
- [API Documentation](https://www.ayrshare.com/docs/) - Ayrshare API reference
- [Clerk Documentation](https://clerk.com/docs) - Authentication setup

## 🏗️ Architecture

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Authentication**: Clerk
- **API Integration**: Ayrshare REST API
- **State Management**: React Context + Custom Hooks
- **Deployment**: Docker + Nginx + SSL

## 🔒 Security Features

- Environment variable protection
- Secure API key handling
- Rate limiting
- Security headers
- SSL/TLS encryption
- Input validation

## 📱 Supported Platforms

- Instagram
- Facebook
- Twitter/X
- LinkedIn
- TikTok
- YouTube
- And more via Ayrshare API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the [Deployment Guide](./DEPLOYMENT.md)
- Review the [Ayrshare API docs](https://www.ayrshare.com/docs/)
- Open an issue in this repository

---

Built with ❤️ using Next.js, React, and the Ayrshare API
