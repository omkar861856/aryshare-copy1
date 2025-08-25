# 🚀 Ayrshare Copy - Production Deployment Guide

This guide covers everything you need to deploy the Ayrshare Copy application to production.

## 📋 Prerequisites

- Docker and Docker Compose installed
- SSL certificates for HTTPS
- Domain name configured
- Environment variables set up

## 🔧 Environment Setup

### 1. Create Production Environment File

```bash
cp env.production.example .env.production
```

Edit `.env.production` with your actual production values:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Ayrshare API
AYR_API_KEY=your_ayrshare_api_key_here
NEXT_PUBLIC_AYR_API_URL=https://app.ayrshare.com/api

# Security
NEXTAUTH_SECRET=your_secure_secret_here
NEXTAUTH_URL=https://yourdomain.com
```

### 2. SSL Certificates

Place your SSL certificates in the `ssl/` directory:

- `ssl/cert.pem` - Your SSL certificate
- `ssl/key.pem` - Your private key

## 🐳 Docker Deployment

### Quick Start

```bash
# Build and start production containers
./scripts/deploy.sh

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

### Manual Deployment

```bash
# Build production image
docker build -f Dockerfile.prod -t ayrshare-app:latest .

# Start with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Check health
curl http://localhost:3000/api/health
```

## 📊 Monitoring and Health Checks

### Health Check Endpoint

The application exposes a health check endpoint at `/api/health` that returns:

- HTTP 200: Application is healthy
- HTTP 500: Application has issues

### Container Health Checks

Docker containers include built-in health checks:

- Checks every 30 seconds
- 10 second timeout
- 3 retry attempts
- 40 second start period

## 🔒 Security Features

### Security Headers

- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (prevents MIME type sniffing)
- **X-XSS-Protection**: 1; mode=block (XSS protection)
- **Strict-Transport-Security**: HSTS with 1 year max-age
- **Content-Security-Policy**: Restrictive CSP policy
- **Referrer-Policy**: origin-when-cross-origin

### Rate Limiting

- **API Routes**: 10 requests per second with 20 burst
- **General Routes**: 30 requests per second with 50 burst

### SSL/TLS Configuration

- TLS 1.2 and 1.3 only
- Strong cipher suites
- HSTS enabled
- HTTP to HTTPS redirect

## 🚀 Deployment Scripts

### Available Commands

```bash
./scripts/deploy.sh          # Deploy new version
./scripts/deploy.sh rollback # Rollback to previous version
./scripts/deploy.sh health   # Check application health
./scripts/deploy.sh cleanup  # Clean up old images
./scripts/deploy.sh help     # Show help
```

### Deployment Process

1. **Pre-deployment Checks**

   - Docker running
   - Required files present
   - Environment configured

2. **Backup Current**

   - Creates backup image with timestamp
   - Preserves current deployment

3. **Build & Deploy**

   - Builds new production image
   - Stops old container
   - Starts new container
   - Waits for health checks

4. **Verification**

   - Health check validation
   - Container status display
   - Automatic rollback on failure

5. **Cleanup**
   - Removes old images
   - Keeps last 3 backup tags

## 📈 Performance Optimizations

### Next.js Configuration

- **Standalone Output**: Optimized for containers
- **SWC Minification**: Fast JavaScript minification
- **Image Optimization**: WebP/AVIF support
- **Bundle Analysis**: Available with `npm run analyze`

### Nginx Configuration

- **Gzip Compression**: Reduces file sizes
- **Static File Caching**: 1 year cache for static assets
- **Keep-alive Connections**: Optimized connection handling
- **Rate Limiting**: API and general route protection

## 🔍 Troubleshooting

### Common Issues

#### Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs app

# Check container status
docker ps -a

# Verify environment file
docker-compose -f docker-compose.prod.yml config
```

#### Health Check Failures

```bash
# Test health endpoint directly
curl -v http://localhost:3000/api/health

# Check container health
docker inspect ayrshare-app-prod | grep Health -A 10
```

#### SSL Issues

```bash
# Verify certificate files
ls -la ssl/

# Check nginx configuration
docker exec ayrshare-nginx-prod nginx -t

# View nginx logs
docker logs ayrshare-nginx-prod
```

### Rollback Process

```bash
# Automatic rollback on deployment failure
./scripts/deploy.sh

# Manual rollback
./scripts/deploy.sh rollback

# Check backup images
docker images ayrshare-app --format "table {{.Tag}}\t{{.CreatedAt}}"
```

## 📝 Logging

### Application Logs

```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f app

# View nginx logs
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Log Locations

- **Application**: Container stdout/stderr
- **Nginx**: `/var/log/nginx/` (access.log, error.log)
- **Docker**: `docker logs` command

## 🔄 Updates and Maintenance

### Regular Updates

```bash
# Pull latest code
git pull origin main

# Deploy new version
./scripts/deploy.sh

# Verify deployment
./scripts/deploy.sh health
```

### Maintenance Mode

```bash
# Stop application
docker-compose -f docker-compose.prod.yml down

# Perform maintenance tasks
# ...

# Restart application
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring and Alerts

### Health Monitoring

- Health check endpoint: `/api/health`
- Docker health checks
- Nginx status monitoring

### Performance Metrics

- Response times
- Error rates
- Resource usage
- Rate limiting statistics

## 🆘 Support

### Emergency Contacts

- **DevOps Team**: [Contact Info]
- **On-Call Engineer**: [Contact Info]
- **Escalation Manager**: [Contact Info]

### Emergency Procedures

1. **Immediate Rollback**: `./scripts/deploy.sh rollback`
2. **Health Check**: `./scripts/deploy.sh health`
3. **Log Analysis**: Check container and nginx logs
4. **Escalation**: Contact on-call engineer

---

## 🎯 Quick Reference

```bash
# Deploy to production
./scripts/deploy.sh

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Health check
curl http://localhost:3000/api/health

# Rollback if needed
./scripts/deploy.sh rollback
```

**Remember**: Always test deployments in staging first and ensure you have proper backups before production deployments.
