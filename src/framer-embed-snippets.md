# Framer Embed Code Snippets

## 🎯 Ready-to-Use Framer Embed Codes

### 1. Basic Iframe for Framer Embed Component

```html
<iframe 
  src="YOUR_FIGMA_MAKE_URL_HERE"
  width="100%" 
  height="800"
  frameborder="0"
  style="border: none; border-radius: 16px;">
</iframe>
```

### 2. Styled Container with Iframe

```html
<div class="calculator-embed">
  <iframe 
    src="YOUR_FIGMA_MAKE_URL_HERE"
    width="100%" 
    height="800"
    frameborder="0"
    title="Fitness Calculator">
  </iframe>
</div>

<style>
.calculator-embed {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}

.calculator-embed iframe {
  border: none;
  display: block;
}
</style>
```

### 3. Framer Code Component Version

```tsx
export default function Calculator() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
    }}>
      <iframe 
        src="YOUR_FIGMA_MAKE_URL_HERE"
        width="100%" 
        height="800"
        frameBorder="0"
        style={{ border: 'none', display: 'block' }}
        title="Fitness Calculator"
      />
    </div>
  )
}
```

### 4. Responsive Embed with Mobile Optimization

```html
<div class="calculator-responsive">
  <iframe 
    src="YOUR_FIGMA_MAKE_URL_HERE"
    frameborder="0"
    title="Fitness Calculator">
  </iframe>
</div>

<style>
.calculator-responsive {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.calculator-responsive iframe {
  width: 100%;
  height: 800px;
  border: none;
  display: block;
}

@media (max-width: 768px) {
  .calculator-responsive iframe {
    height: 600px;
  }
  
  .calculator-responsive {
    margin: 1rem;
    border-radius: 12px;
  }
}
</style>
```

---

## 🎨 Framer Property Controls Version

If you want to make it customizable in Framer:

```tsx
import { addPropertyControls, ControlType } from 'framer'

export default function CalculatorEmbed({
  calculatorUrl = "YOUR_FIGMA_MAKE_URL_HERE",
  height = 800,
  borderRadius = 16,
  showShadow = true
}) {
  const containerStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    borderRadius: `${borderRadius}px`,
    overflow: 'hidden',
    boxShadow: showShadow ? '0 20px 60px rgba(0,0,0,0.15)' : 'none'
  }

  return (
    <div style={containerStyle}>
      <iframe 
        src={calculatorUrl}
        width="100%" 
        height={`${height}px`}
        frameBorder="0"
        style={{ border: 'none', display: 'block' }}
        title="Fitness Calculator"
      />
    </div>
  )
}

addPropertyControls(CalculatorEmbed, {
  calculatorUrl: {
    type: ControlType.String,
    title: "Calculator URL",
    defaultValue: "YOUR_FIGMA_MAKE_URL_HERE"
  },
  height: {
    type: ControlType.Number,
    title: "Height",
    min: 400,
    max: 1200,
    defaultValue: 800
  },
  borderRadius: {
    type: ControlType.Number,
    title: "Border Radius",
    min: 0,
    max: 50,
    defaultValue: 16
  },
  showShadow: {
    type: ControlType.Boolean,
    title: "Show Shadow",
    defaultValue: true
  }
})
```

---

## 📱 How to Find Your Figma Make URL

### Method 1: From Figma Make Dashboard
1. Open your Figma Make project
2. Look for "Share" or "Publish" button
3. Copy the public URL

### Method 2: From Browser
1. Open your working calculator
2. Look at the browser URL bar
3. Copy the URL (should be something like):
   - `https://your-project.figma-make.com`
   - `https://make.figma.com/projects/abc123`

### Method 3: Check Project Settings
1. In Figma Make, go to project settings
2. Look for "Public URL" or "Share URL"
3. Copy that URL

---

## 🚀 Quick Setup Steps for Framer

1. **Get your calculator URL** from Figma Make
2. **Choose one of the embed codes** above
3. **Replace `YOUR_FIGMA_MAKE_URL_HERE`** with your actual URL
4. **Add to Framer** using one of these methods:
   - Embed component (paste HTML)
   - Code component (paste React code)
   - HTML element (paste HTML directly)
5. **Test and adjust** sizing as needed

---

## ✅ Testing Checklist

- [ ] Calculator loads in iframe
- [ ] All form steps work
- [ ] Results display correctly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Styling looks good in Framer

---

**🎉 Your calculator is ready to embed in Framer!**

Choose the method that works best for your Framer setup and design needs.