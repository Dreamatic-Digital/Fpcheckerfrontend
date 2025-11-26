# Fitness Benefits Eligibility Calculator

A modern React-based multi-step form calculator that determines company eligibility for fitness benefits programs. Built with TypeScript, Tailwind CSS, and comprehensive API integration.

## 🚀 Features

- **Multi-step Form**: 5-step wizard with progress tracking
- **Real-time Validation**: Client-side validation with clear error messaging
- **Data Persistence**: Auto-save progress using localStorage
- **API Integration**: Secure submission to eligibility assessment API
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Status Results**: Color-coded eligibility results with detailed next steps
- **Production Ready**: Security-first architecture with environment variables

## 📋 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [your-repo-url]
cd fitness-calculator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API configuration

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file with:
```bash
REACT_APP_API_ENDPOINT=https://fp-api.scalarity.io/check-eligibility
REACT_APP_API_KEY=your_api_key_here
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── steps/              # Form step components
│   ├── ui/                 # Reusable ShadCN components
│   ├── ProgressBar.tsx     # Progress indicator
│   ├── Results.tsx         # Results display
│   └── StatusResults.tsx   # API-powered results
├── config/
│   └── apiConfig.ts        # Secure API configuration
├── services/
│   └── apiService.ts       # API integration service
├── docs/                   # Documentation
└── styles/
    └── globals.css         # Tailwind + design tokens
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Lint code
npm run type-check   # TypeScript type checking
```

### Form Steps
1. **Company Information** - Business details and industry
2. **Locations** - Head office and additional office locations
3. **Employee Information** - Workforce size and communication
4. **Benefits** - Current benefits and wellness goals
5. **Contact** - Contact person details

## 🔐 Security

- ✅ API keys stored in environment variables
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ No sensitive data in client-side code
- ✅ Secure API communication with headers

## 📡 API Integration

### Endpoint Configuration
```
POST https://fp-api.scalarity.io/check-eligibility
Headers:
  - X-API-Key: [API_KEY]
  - Content-Type: application/json
```

### Response Statuses
- `"Approved"` - Eligible for benefits
- `"Further Checks Required (Survey)"` - Survey needed
- `"Further Checks Required (PD)"` - Partner confirmation needed  
- `"Not Approved"` - Not eligible

See `/docs/api-field-mapping.md` for complete field mappings.

## 🚀 Deployment

### Production Build
```bash
# Build for production
npm run build

# Serve locally to test
npx serve -s build
```

### Deployment Options
1. **Static Hosting** (Recommended)
   - Vercel: `vercel --prod`
   - Netlify: `npm run build` + drag build folder
   - AWS S3 + CloudFront

2. **Docker**
   ```bash
   docker build -t fitness-calculator .
   docker run -p 80:80 fitness-calculator
   ```

3. **Framer Integration**
   - Deploy to static hosting
   - Embed via iframe or Framer Code Component

See `/docs/production-deployment.md` for detailed deployment instructions.

## 🎨 Customization

### Design System
The calculator uses a cohesive design system with:
- Tailwind V4 with design tokens
- Consistent spacing and typography
- Accessible color contrast
- Mobile-responsive layouts

### Styling
- Global styles: `/styles/globals.css`
- Component styles: Tailwind utility classes
- Design tokens: CSS custom properties

## 📚 Documentation

- [API Field Mapping](/docs/api-field-mapping.md) - Complete field mappings
- [Production Deployment](/docs/production-deployment.md) - Deployment guide
- [Security Guidelines](/docs/security.md) - Security best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commits for commit messages
- Component-based architecture

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:
- Documentation: Check `/docs/` folder
- API Issues: Contact API provider
- Bug Reports: Create an issue
- General Support: https://get.fitnesspassport.com.au/contact

---

**Version**: 1.0.0  
**Last Updated**: August 2025  
**Node Version**: 18+  
**React Version**: 18+