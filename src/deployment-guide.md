# Deploying Your Fitness Calculator for External Hosting

## Option 1: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps

1. **Prepare your repository:**
   ```bash
   # If not already a git repository
   git init
   git add .
   git commit -m "Initial commit"
   
   # Push to GitHub
   git remote add origin https://github.com/yourusername/fitness-calculator.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: "Vite" (if using Vite) or "Create React App"
     - Build Command: `npm run build`
     - Output Directory: `dist` (for Vite) or `build` (for CRA)
   - Click "Deploy"

3. **Get your public URL:**
   - After deployment, you'll get a URL like: `https://fitness-calculator-abc123.vercel.app`

## Option 2: Deploy to Netlify

### Steps

1. **Build your project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `build` folder
   - Or connect your GitHub repository for continuous deployment

## Embedding in Framer

### Method 1: Embed Component

1. **Add Embed component in Framer:**
   - Drag "Embed" from Components panel
   - Set URL to your deployed calculator
   - Configure iframe settings:
     - Width: 100%
     - Height: 600px (or desired height)
     - Allow: "fullscreen"

2. **Responsive iframe code (if needed):**
   ```html
   <iframe 
     src="https://your-calculator-url.vercel.app"
     width="100%" 
     height="600" 
     frameborder="0"
     style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
     allowfullscreen>
   </iframe>
   ```

### Method 2: Custom Embed with Responsive Height

Create a Code Component that handles responsive iframe:

```tsx
import React, { useRef, useEffect } from 'react'
import { addPropertyControls, ControlType } from 'framer'

export default function ResponsiveCalculatorEmbed({ 
  calculatorUrl, 
  minHeight = 600,
  borderRadius = 12 
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== new URL(calculatorUrl).origin) return
      
      if (event.data.type === 'resize' && iframeRef.current) {
        iframeRef.current.style.height = `${event.data.height}px`
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [calculatorUrl])
  
  return (
    <iframe
      ref={iframeRef}
      src={calculatorUrl}
      width="100%"
      height={minHeight}
      frameBorder="0"
      style={{ 
        borderRadius: `${borderRadius}px`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'height 0.3s ease'
      }}
      allowFullScreen
    />
  )
}

addPropertyControls(ResponsiveCalculatorEmbed, {
  calculatorUrl: {
    type: ControlType.String,
    title: "Calculator URL",
    defaultValue: "https://your-calculator.vercel.app"
  },
  minHeight: {
    type: ControlType.Number,
    title: "Min Height",
    min: 400,
    max: 1000,
    defaultValue: 600
  },
  borderRadius: {
    type: ControlType.Number,
    title: "Border Radius",
    min: 0,
    max: 50,
    defaultValue: 12
  }
})
```

## Making it Mobile-Friendly

Update your calculator's CSS for better mobile experience:

```css
/* Add to your globals.css */
@media (max-width: 768px) {
  .calculator-container {
    padding: 16px;
    margin: 0;
  }
  
  .step-content {
    padding: 16px;
  }
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
```

## SEO and Performance Optimization

1. **Add meta tags to your index.html:**
   ```html
   <meta name="description" content="Calculate your company's fitness benefits eligibility">
   <meta property="og:title" content="Fitness Benefits Calculator">
   <meta property="og:description" content="Determine eligibility for corporate fitness programs">
   <meta property="og:type" content="website">
   ```

2. **Optimize loading:**
   - Use React.lazy for code splitting if needed
   - Optimize images
   - Enable compression in your hosting platform

## Custom Domain (Optional)

1. **Purchase domain** (e.g., calculator.yourcompany.com)
2. **Configure DNS** in your domain provider
3. **Add custom domain** in Vercel/Netlify settings
4. **Update Framer embed** with new domain

This approach gives you maximum flexibility and keeps your calculator as a standalone, maintainable application while seamlessly integrating it into your Framer site.