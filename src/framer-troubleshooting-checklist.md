# Framer Code Component - Quick Troubleshooting

## 🚨 Immediate Issues - Check These First

### Component Won't Compile
```
❌ Error: "Failed to compile"
✅ Solutions:
1. Check for missing brackets: {}, [], ()
2. Ensure all strings are properly quoted
3. Verify all imports are at the top
4. Check for typos in function names
5. Copy code again from source file
```

### Component Shows Nothing
```
❌ Issue: Blank white box
✅ Solutions:
1. Increase container height to 700px+
2. Set width to at least 800px
3. Check "Show Header" is enabled
4. Verify background color isn't transparent
5. Check browser console for errors (F12)
```

### Form Doesn't Work
```
❌ Issue: Can't fill form or navigate
✅ Solutions:
1. Test in published site, not just preview
2. Check component has proper click handlers
3. Verify form validation logic
4. Look for JavaScript errors in console
5. Test with simpler input first
```

---

## 🔧 Step-by-Step Diagnostic

### 1. Check Framer Setup
- [ ] Using Framer Pro plan?
- [ ] Code Components feature available?
- [ ] Component saved without errors?
- [ ] Green checkmark visible after save?

### 2. Check Component Size
- [ ] Width: 800px minimum
- [ ] Height: 700px minimum  
- [ ] Not hidden behind other elements?
- [ ] Proper margins/padding?

### 3. Check Code Integration
- [ ] All code copied completely?
- [ ] No missing sections?
- [ ] Framer property controls showing?
- [ ] Component properties responding?

### 4. Check Browser Compatibility
- [ ] Modern browser (Chrome, Firefox, Safari, Edge)?
- [ ] JavaScript enabled?
- [ ] LocalStorage permissions allowed?
- [ ] No ad blockers interfering?

---

## 🐛 Common Error Messages & Fixes

### "Cannot read property 'map' of undefined"
```tsx
// Problem: Array not initialized
const [offices, setOffices] = useState(); // ❌ Wrong

// Solution: Initialize with empty array
const [offices, setOffices] = useState([]); // ✅ Correct
```

### "localStorage is not defined"
```tsx
// Problem: Server-side rendering
localStorage.setItem('key', 'value'); // ❌ Might fail

// Solution: Check if available
if (typeof localStorage !== 'undefined') {
  localStorage.setItem('key', 'value'); // ✅ Safe
}
```

### "Component not found"
```tsx
// Problem: Import paths wrong
import { Button } from './ui/button'; // ❌ Won't work in Framer

// Solution: Inline components (already done in our code)
const Button = ({ children, onClick }) => { // ✅ Inline
  return <button onClick={onClick}>{children}</button>;
};
```

---

## 🔍 Debug Mode Checklist

### Enable Console Logging
Add these lines to see what's happening:

```tsx
// Add at start of component
console.log('Component loaded');

// Add in form submission
console.log('Form data:', formData);

// Add in validation
console.log('Validation result:', isValid);
```

### Check Network Requests
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Submit form
4. Look for any failed requests (red)
5. Check request/response details

### Verify LocalStorage
1. Open DevTools → "Application" tab
2. Look for "Local Storage" section
3. Check if data is being saved
4. Clear storage if corrupted

---

## 📱 Mobile Testing Checklist

### Framer Preview
- [ ] Use device selector in preview
- [ ] Test on actual phone if possible
- [ ] Check form field accessibility
- [ ] Verify button touch targets
- [ ] Test scrolling behavior

### Common Mobile Issues
```css
/* Fix viewport issues */
width: 100%;
max-width: 100vw;
overflow-x: hidden;

/* Fix touch targets */
button {
  min-height: 44px;
  min-width: 44px;
}

/* Fix input zoom on iOS */
input {
  font-size: 16px; /* Prevents zoom */
}
```

---

## 🔄 Reset and Retry Process

### If Nothing Works - Start Fresh

1. **Create New Component**
   - Delete problematic component
   - Create new Code Component
   - Use different name

2. **Minimal Test First**
   ```tsx
   export default function TestComponent() {
     return <div>Hello World</div>;
   }
   ```

3. **Gradually Add Features**
   - Get basic component working first
   - Add form functionality step by step
   - Test each addition

4. **Compare Working Version**
   - Use provided complete code as reference
   - Copy exactly, don't modify initially
   - Customize only after basic version works

---

## 🆘 Get Help Resources

### Check These When Stuck

1. **Browser Console** (Most important!)
   - Press F12 → Console tab
   - Look for red error messages
   - Google specific error messages

2. **Framer Community**
   - Search existing questions
   - Post with specific error messages
   - Include code snippets

3. **Documentation**
   - Framer Code Components docs
   - React documentation for syntax
   - Our provided troubleshooting files

### What to Include When Asking for Help

```
❌ "It doesn't work"

✅ Include:
- Specific error message from console
- What you expected to happen
- What actually happened
- Screenshots of the issue
- Browser and Framer version
```

---

## ✅ Success Indicators

Your component is working correctly when:

- [ ] Component compiles with green checkmark
- [ ] Shows calculator interface (not blank)
- [ ] Form fields accept input
- [ ] Next/Previous buttons work
- [ ] Form validation shows appropriate messages
- [ ] Progress saves and restores on page refresh
- [ ] Final results display correctly
- [ ] No console errors
- [ ] Works on both desktop and mobile
- [ ] Published site functions same as preview

**🎉 If all boxes checked - you're ready to go!**