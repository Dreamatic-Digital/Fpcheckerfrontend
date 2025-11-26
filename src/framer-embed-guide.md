# Embed Your Calculator in Framer - Simple Method

## 🎯 Quick Solution: Use Your Figma Make URL

Your calculator is already live and deployed through Figma Make! You just need to find the URL and embed it.

---

## Step 1: Get Your Calculator URL

### From Figma Make:
1. **Open your Figma Make project**
2. **Look for the "Share" or "Publish" button** (usually in the top-right corner)
3. **Copy the public URL** - it will look something like:
   ```
   https://your-project-name.figma-make.com
   ```
   or
   ```
   https://make.figma.com/projects/your-project-id
   ```

### Alternative - Check Browser URL:
1. **Open your working calculator** in Figma Make
2. **Copy the URL from your browser's address bar**
3. **Make sure it's the published/public version** (not the editor URL)

---

## Step 2: Create Embed Code for Framer

### Option A: Simple Iframe (Recommended)

```html
<iframe 
  src="YOUR_CALCULATOR_URL_HERE"
  width="100%" 
  height="800"
  frameborder="0"
  scrolling="auto"
  style="border: none; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
</iframe>
```

### Option B: Responsive Iframe with Container

```html
<div style="width: 100%; max-width: 1200px; margin: 0 auto;">
  <iframe 
    src="YOUR_CALCULATOR_URL_HERE"
    width="100%" 
    height="800"
    frameborder="0"
    scrolling="auto"
    style="border: none; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); display: block;">
  </iframe>
</div>
```

### Option C: Full-Screen Embed

```html
<iframe 
  src="YOUR_CALCULATOR_URL_HERE"
  width="100%" 
  height="100vh"
  frameborder="0"
  scrolling="auto"
  style="border: none;">
</iframe>
```

---

## Step 3: Add to Framer

### Method 1: Using Framer's Embed Component
1. **In Framer, add an "Embed" component** from the Insert menu
2. **Paste your iframe code** into the embed component
3. **Adjust size and positioning** as needed

### Method 2: Using Custom Code Component
1. **Create a new Code Component** in Framer
2. **Use this simple wrapper:**

```tsx
export default function CalculatorEmbed() {
  return (
    <div style={{ width: '100%', height: '800px' }}>
      <iframe 
        src="YOUR_CALCULATOR_URL_HERE"
        width="100%" 
        height="100%"
        frameBorder="0"
        style={{ border: 'none', borderRadius: '16px' }}
        title="Fitness Benefits Calculator"
      />
    </div>
  )
}
```

### Method 3: Direct HTML in Framer
1. **Add an HTML element** to your Framer page
2. **Paste the iframe code directly**
3. **Style the container** as needed

---

## Step 4: Customize the Embed

### Styling Options:

```html
<iframe 
  src="YOUR_CALCULATOR_URL_HERE"
  width="100%" 
  height="800"
  frameborder="0"
  scrolling="auto"
  style="
    border: none; 
    border-radius: 16px; 
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    background: #f8fafc;
    min-height: 600px;
  ">
</iframe>
```

### Size Recommendations:
- **Desktop**: 1200px width × 800px height
- **Tablet**: 768px width × 700px height  
- **Mobile**: 100% width × 600px height

---

## Step 5: Test Your Embed

### Checklist:
- [ ] Calculator loads properly in iframe
- [ ] All form steps work correctly
- [ ] Progress saves across page refreshes
- [ ] Results display properly
- [ ] Mobile responsiveness works
- [ ] No console errors

### Common Issues & Fixes:

**Issue**: "Refused to connect" error
**Fix**: Make sure your Figma Make URL is public and allows embedding

**Issue**: Calculator appears too small
**Fix**: Increase iframe height to 800px+ and width to 100%

**Issue**: Scrolling issues
**Fix**: Set `scrolling="auto"` on iframe

**Issue**: Mobile not responsive
**Fix**: Use percentage-based widths and test on actual devices

---

## Step 6: Advanced Configuration

### Add URL Parameters (if needed):
```html
<iframe src="YOUR_CALCULATOR_URL_HERE?embed=true&theme=light"></iframe>
```

### Multiple Instances:
If you need the calculator on multiple pages, just use the same iframe code on each page.

### Custom Styling:
```css
.calculator-embed {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}

.calculator-embed iframe {
  width: 100%;
  height: 800px;
  border: none;
  display: block;
}
```

---

## Complete Example for Framer

Here's a complete embed code you can copy and paste:

```html
<div style="width: 100%; max-width: 1200px; margin: 0 auto; padding: 20px;">
  <div style="
    border-radius: 20px; 
    overflow: hidden; 
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    background: white;
  ">
    <iframe 
      src="YOUR_CALCULATOR_URL_HERE"
      width="100%" 
      height="800"
      frameborder="0"
      scrolling="auto"
      style="border: none; display: block;"
      title="Fitness Benefits Eligibility Calculator"
      loading="lazy">
    </iframe>
  </div>
</div>
```

---

## ✅ Final Steps

1. **Replace `YOUR_CALCULATOR_URL_HERE`** with your actual Figma Make URL
2. **Test the embed** in Framer preview
3. **Adjust height/width** as needed for your design
4. **Publish your Framer site** and test on live URL

**🎉 Your calculator is now embedded in Framer with zero deployment hassle!**

This method uses your existing Figma Make deployment, so:
- ✅ No additional hosting needed
- ✅ Automatic updates when you modify the calculator
- ✅ All your current features work perfectly
- ✅ Maintains backend integration if you have it
- ✅ Professional appearance with custom styling