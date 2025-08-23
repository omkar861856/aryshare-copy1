# 🚀 Ayrshare App Deployment Guide

This guide will help you deploy your Ayrshare application to production.

## 📋 Prerequisites

- Node.js 18+ installed on your server
- Docker and Docker Compose (optional, for containerized deployment)
- Domain name and SSL certificate
- Clerk production account and keys
- Ayrshare production API keys

## 🎯 Deployment Options

### Option 1: Traditional Server Deployment

#### 1. Build for Production

```bash
# Make build script executable
chmod +x scripts/build.sh

# Run production build
./scripts/build.sh
```

#### 2. Deploy to Server

```bash
# Copy production directory to your server
scp -r production/ user@your-server:/var/www/ayrshare/

# SSH into your server
ssh user@your-server

# Navigate to app directory
cd /var/www/ayrshare

# Install production dependencies
npm ci --only=production

# Set environment variables
cp .env.example .env.production
# Edit .env.production with your production values
nano .env.production

# Start the application
npm start
```

#### 3. Set Up Process Manager (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start npm --name "ayrshare" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

### Option 2: Docker Deployment

#### 1. Build Docker Image

```bash
# Build the image
docker build -t ayrshare-app .

# Tag for your registry (if using one)
docker tag ayrshare-app your-registry/ayrshare-app:latest
```

#### 2. Deploy with Docker Compose

```bash
# Copy environment file
cp .env.example .env.production
# Edit with your production values
nano .env.production

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

#### 3. Update SSL Certificates

```bash
# Create SSL directory
mkdir -p ssl

# Copy your SSL certificates
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem

# Restart with SSL
docker-compose -f docker-compose.yml --profile production up -d
```

### Option 3: Cloud Platform Deployment

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

#### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

## 🔧 Environment Variables

**⚠️ SECURITY WARNING: Never commit environment files to Git!**

Create `.env.production` with these variables:

```bash
# Ayrshare API Configuration
AYR_API_KEY=your_production_api_key
AYR_DOMAIN=id-8ig3h
AYR_PRIVATE_KEY_B64=your_base64_encoded_private_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Clerk Authentication (Production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_production_clerk_publishable_key
CLERK_SECRET_KEY=your_production_clerk_secret_key

# Next.js Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## 🌐 Domain and SSL Setup

### 1. Point Domain to Your Server

```bash
# Add A record in your DNS
your-domain.com -> YOUR_SERVER_IP
```

### 2. SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates for Docker (if using)
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
```

## 📊 Monitoring and Maintenance

### Health Checks

```bash
# Check application health
curl https://your-domain.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-01-23T12:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Logs

```bash
# Application logs
pm2 logs ayrshare

# Docker logs
docker-compose logs -f ayrshare-app

# Nginx logs
docker-compose logs -f nginx
```

### Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
npm run build
pm2 restart ayrshare

# Or with Docker
docker-compose down
docker-compose up -d --build
```

## 🔒 Security Checklist

- [ ] All `.env*` files are in `.gitignore` and NOT committed
- [ ] Environment variables are set securely (not in Git)
- [ ] Different API keys for development and production
- [ ] SSL certificates are valid and up to date
- [ ] Firewall rules are configured
- [ ] Rate limiting is enabled
- [ ] Security headers are set
- [ ] Regular security updates are applied
- [ ] Backups are configured
- [ ] Monitoring and alerting are set up
- [ ] API keys are rotated regularly
- [ ] Access logs are monitored

## 🆘 Troubleshooting

### Common Issues

#### Application Won't Start

```bash
# Check environment variables
echo $NODE_ENV
echo $AYR_API_KEY

# Check logs
pm2 logs ayrshare
# or
docker-compose logs ayrshare-app
```

#### SSL Issues

```bash
# Check certificate validity
openssl x509 -in ssl/cert.pem -text -noout

# Test SSL connection
openssl s_client -connect your-domain.com:443
```

#### Performance Issues

```bash
# Check memory usage
pm2 monit
# or
docker stats

# Check disk space
df -h
```

## 📞 Support

If you encounter issues:

1. Check the logs for error messages
2. Verify environment variables are set correctly
3. Ensure all services are running
4. Check network connectivity and firewall rules
5. Review the security checklist

For additional help, refer to:

- Next.js deployment documentation
- Docker documentation
- Your hosting provider's support resources
