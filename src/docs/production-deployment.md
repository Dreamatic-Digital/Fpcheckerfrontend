# Production Deployment Guide

This guide covers deploying the Fitness Benefits Eligibility Calculator to production environments.

## Security Checklist

### ✅ Environment Variables
Before deploying to production, ensure these environment variables are configured:

```bash
# API Configuration
REACT_APP_API_ENDPOINT=https://fp-api.scalarity.io/check-eligibility
REACT_APP_API_KEY=your_production_api_key_here

# Optional - Analytics/Monitoring
REACT_APP_ANALYTICS_ID=your_analytics_id
REACT_APP_SENTRY_DSN=your_sentry_dsn
```

### ✅ Remove Development Code
1. **Remove DEV_API_CONFIG**: Update `App.tsx` to use `getApiConfig()` instead of `DEV_API_CONFIG`
2. **Remove console.log statements**: Clean up debug logging in production
3. **Remove development flags**: Ensure no development-only features are enabled

### ✅ API Key Security
- ❌ **Never commit API keys to version control**
- ✅ Use environment variables for all sensitive configuration
- ✅ Rotate API keys regularly
- ✅ Use different API keys for development/staging/production

## Build Configuration

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "react-scripts start",
    "build": "react-scripts build",
    "build:prod": "REACT_APP_ENV=production npm run build",
    "test": "react-scripts test",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  }
}
```

### Build Optimization
1. **Tree Shaking**: Remove unused ShadCN components
2. **Code Splitting**: Implement lazy loading for large components
3. **Bundle Analysis**: Use `webpack-bundle-analyzer` to optimize bundle size
4. **Minification**: Ensure production builds are minified

## Deployment Options

### Option 1: Static Hosting (Recommended)
Deploy to Vercel, Netlify, or similar static hosting platform.

**Vercel Deployment:**
```bash
npm install -g vercel
vercel --prod
```

**Environment Variables Setup:**
- Add environment variables in Vercel dashboard
- Ensure `REACT_APP_API_KEY` is set correctly

### Option 2: Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Option 3: Framer Integration
For embedding in Framer websites:

1. Deploy to static hosting
2. Use iframe embed or Framer Code Component
3. Configure CORS headers if needed

## Performance Optimization

### Bundle Size Reduction
Remove unused ShadCN components:
```bash
# Keep only used components
components/ui/
├── button.tsx
├── input.tsx
├── select.tsx
├── alert.tsx
├── progress.tsx
└── label.tsx
```

### Lazy Loading
```typescript
// Implement lazy loading for results components
const StatusResults = lazy(() => import('./components/StatusResults'));
const Results = lazy(() => import('./components/Results'));
```

### Caching Strategy
- **Static Assets**: Cache for 1 year
- **HTML**: No cache or short cache (5 minutes)
- **API Responses**: No cache (eligibility data changes frequently)

## Monitoring & Analytics

### Error Tracking
```typescript
// Add error boundary for production
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENV || 'development'
});
```

### Performance Monitoring
- Core Web Vitals tracking
- API response time monitoring
- Form completion rates
- Error rate monitoring

### User Analytics
- Form step completion rates
- Most common validation errors
- API submission success rates
- User flow analysis

## Testing Before Deployment

### Pre-deployment Checklist
- [ ] All form validation works correctly
- [ ] API integration functions properly
- [ ] LocalStorage persistence works
- [ ] Responsive design on all devices
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Performance meets requirements (< 3s load time)
- [ ] Security scan passed
- [ ] All environment variables configured

### Load Testing
Test with realistic user loads:
- Concurrent form submissions
- API rate limiting behavior
- LocalStorage limits
- Memory usage patterns

## Rollback Strategy

### Quick Rollback Plan
1. **Version Tagging**: Tag each production release
2. **Database Backup**: If using database for submissions
3. **Configuration Backup**: Save working environment variable sets
4. **Monitoring**: Set up alerts for error rates, performance degradation

### Rollback Commands
```bash
# Vercel
vercel rollback [deployment-url]

# Docker
docker pull [previous-image-tag]
docker-compose up -d
```

## Maintenance

### Regular Updates
- Monthly security updates
- Quarterly dependency updates
- API endpoint health checks
- SSL certificate renewal
- Performance optimization reviews

### Backup Strategy
- Configuration files backup
- Environment variables backup
- Analytics data export (if applicable)
- User feedback/support tickets backup

## Support & Documentation

### API Documentation
- Keep API field mapping guide updated
- Document all error responses
- Maintain example payloads

### User Support
- Clear error messages for users
- Contact information for technical issues
- FAQ documentation
- Troubleshooting guides

Last Updated: August 2025