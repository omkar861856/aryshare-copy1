# 🔒 Security Guide for Ayrshare App

This guide covers security best practices for managing environment variables and deploying your application safely.

## 🚨 Critical Security Rules

### 1. **NEVER Commit Environment Files**
```bash
# ❌ WRONG - These files should NEVER be committed
.env
.env.local
.env.production
.env.example
production.env.example

# ✅ CORRECT - Only commit templates
env.template
```

### 2. **Environment File Protection**
Your `.gitignore` is configured to ignore all environment files:
```gitignore
# Environment files - NEVER commit these
.env
.env.local
.env.development
.env.test
.env.production
.env.example
production.env.example
env.template
```

### 3. **Docker Security**
Your `.dockerignore` prevents environment files from being included in Docker builds:
```dockerignore
# Environment files - NEVER include these in Docker builds
.env*
.env.local
.env.development
.env.test
.env.production
.env.example
production.env.example
env.template
```

## 🔐 Environment Variable Management

### Development Setup
```bash
# 1. Copy the template
cp env.template .env.local

# 2. Edit with your real values
nano .env.local

# 3. Verify it's ignored
git status
# .env.local should NOT appear in git status
```

### Production Setup
```bash
# 1. Create production environment file
cp env.template .env.production

# 2. Edit with production values
nano .env.production

# 3. Set on your hosting platform
# - Vercel: Environment Variables section
# - Railway: Variables tab
# - Docker: Use env_file in docker-compose.yml
# - Server: Export variables or use .env.production
```

## 🛡️ Security Best Practices

### 1. **API Key Security**
- Use different API keys for development and production
- Rotate API keys regularly
- Monitor API usage for suspicious activity
- Never log API keys in production

### 2. **Environment Separation**
```bash
# Development
NODE_ENV=development
AYR_API_KEY=dev_key_here

# Production
NODE_ENV=production
AYR_API_KEY=prod_key_here
```

### 3. **Secrets Management**
For production, consider using:
- **Vercel**: Built-in environment variables
- **Railway**: Variables management
- **Docker**: Docker secrets or external vaults
- **Server**: HashiCorp Vault or AWS Secrets Manager

### 4. **Access Control**
- Limit who has access to production environment files
- Use different Clerk keys for development and production
- Implement proper authentication and authorization

## 🔍 Security Checklist

Before deploying to production:

- [ ] All `.env*` files are in `.gitignore`
- [ ] No API keys are committed to Git
- [ ] Production environment variables are set securely
- [ ] Different keys for development and production
- [ ] SSL/TLS is enabled
- [ ] Security headers are configured
- [ ] Rate limiting is enabled
- [ ] Monitoring and logging are configured

## 🚨 Common Security Mistakes

### ❌ **What NOT to Do**
```bash
# Don't commit environment files
git add .env.local
git commit -m "Add environment variables"

# Don't hardcode API keys
const apiKey = "7FA008E8-5E8F47C9-978AF1AF-B2F965B1";

# Don't log sensitive information
console.log("API Key:", process.env.AYR_API_KEY);

# Don't use development keys in production
```

### ✅ **What TO Do**
```bash
# Use environment variables
const apiKey = process.env.AYR_API_KEY;

# Use secure logging
console.log("API Key configured:", !!process.env.AYR_API_KEY);

# Use different keys per environment
if (process.env.NODE_ENV === 'production') {
  // Use production keys
}
```

## 🔧 Security Tools

### 1. **Pre-commit Hooks**
Install `husky` to prevent accidental commits:
```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "git diff --cached --name-only | grep -E '\.(env|local)$' && exit 1 || exit 0"
```

### 2. **Environment Validation**
Create a validation script:
```bash
# scripts/validate-env.js
const required = ['AYR_API_KEY', 'AYR_DOMAIN', 'CLERK_SECRET_KEY'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('Missing required environment variables:', missing);
  process.exit(1);
}
```

### 3. **Security Scanning**
```bash
# Install security scanning tools
npm install --save-dev audit-ci

# Add to package.json scripts
"security": "audit-ci --moderate"
```

## 📞 Security Support

If you suspect a security breach:

1. **Immediate Actions**
   - Rotate all API keys
   - Check Git history for exposed secrets
   - Review access logs
   - Update environment variables

2. **Investigation**
   - Check commit history
   - Review deployment logs
   - Monitor API usage
   - Audit access permissions

3. **Prevention**
   - Implement pre-commit hooks
   - Use secrets management services
   - Regular security audits
   - Team security training

## 🔗 Additional Resources

- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)

---

**Remember: Security is everyone's responsibility. When in doubt, err on the side of caution.**
