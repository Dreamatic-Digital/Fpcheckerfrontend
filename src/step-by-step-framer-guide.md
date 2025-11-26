# Step-by-Step Guide: Adding Fitness Calculator to Framer

## Prerequisites

### 1. Check Your Framer Plan
- **Required**: Framer Pro plan or higher
- **Feature needed**: Code Components
- **Check**: Go to your Framer project → Assets panel → Look for "Code Components" section

### 2. Prepare Your Supabase Credentials (Optional)
If you want backend integration:
- **Supabase URL**: `https://your-project.supabase.co`
- **Anon Key**: Your public/anon key from Supabase dashboard

---

## Step 1: Create the Code Component in Framer

### 1.1 Open Your Framer Project
- Open Framer and navigate to your project
- Or create a new project if needed

### 1.2 Access Code Components
- In the **Assets panel** (left sidebar), look for **"Code Components"**
- Click the **"+"** button next to "Code Components"
- Choose **"Create Code Component"**

### 1.3 Name Your Component
- **Component Name**: `FitnessCalculator`
- Click **"Create"**

---

## Step 2: Add the Component Code

### 2.1 Copy the Complete Code
Copy the entire content from `FramerFitnessCalculatorComplete.tsx` (the file I provided earlier)

### 2.2 Replace Default Code
- Framer will open the code editor
- **Select all existing code** (Ctrl/Cmd + A)
- **Delete it**
- **Paste your copied code**

### 2.3 Save the Component
- Click **"Save"** or use Ctrl/Cmd + S
- Wait for Framer to compile (you'll see a loading indicator)
- Look for **green checkmark** indicating successful compilation

---

## Step 3: Configure Component Properties

Once saved, you should see a **Properties panel** on the right with these controls:

### 3.1 Basic Styling
- **Background Color**: `#ffffff` (white)
- **Primary Color**: `#3b82f6` (blue) 
- **Border Radius**: `16` (rounded corners)
- **Container Height**: `700` (adjust as needed)

### 3.2 Content Settings
- **Show Header**: ✅ (checked)
- **Header Text**: `"Fitness Benefits Eligibility Calculator"`

### 3.3 Supabase Integration (Optional)
- **Supabase URL**: Your Supabase project URL
- **Supabase Anon Key**: Your public key
- Leave blank to use localStorage fallback only

---

## Step 4: Add Component to Your Page

### 4.1 Navigate to Your Page
- Go to the page where you want the calculator
- Or create a new page

### 4.2 Add the Component
- In **Assets panel**, find your `FitnessCalculator` component
- **Drag and drop** it onto your canvas
- Or **double-click** to add at cursor position

### 4.3 Size and Position
- **Resize** the component as needed
- **Recommended size**: At least 800px wide × 700px tall
- **Position** where you want it on the page

---

## Step 5: Test Your Calculator

### 5.1 Preview Mode
- Click **"Preview"** button (or press P)
- Test the calculator functionality:
  - Fill out the first step (Company Info)
  - Click "Next" to navigate between steps
  - Verify form validation works
  - Complete all steps and submit

### 5.2 Check Browser Console
- In preview mode, press **F12** (or right-click → Inspect)
- Go to **"Console"** tab
- Look for any error messages (they'll be in red)
- Should see success messages for form submissions

### 5.3 Test Data Persistence
- Fill out some form fields
- **Refresh the page**
- You should see a "restore progress" prompt
- Test both "Continue" and "Start Fresh" options

---

## Step 6: Customize Appearance (Optional)

### 6.1 Match Your Brand Colors
- Update **Primary Color** to match your brand
- Adjust **Background Color** if needed
- Test different **Border Radius** values

### 6.2 Integrate with Page Design
- Ensure calculator fits well with surrounding content
- Consider adding margin/padding around the component
- Test on different screen sizes

### 6.3 Mobile Responsiveness
- **Preview on mobile** (use device selector in preview)
- Verify all form fields are accessible
- Check that buttons are touch-friendly

---

## Step 7: Supabase Backend Setup (Optional)

### 7.1 Get Supabase Credentials
```
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy:
   - Project URL (e.g., https://abc123.supabase.co)
   - anon/public key (starts with "eyJ...")
```

### 7.2 Add Credentials to Framer
- Select your calculator component
- In **Properties panel**, enter:
  - **Supabase URL**: Your project URL
  - **Supabase Anon Key**: Your anon key

### 7.3 Test Backend Connection
- Submit a completed form
- Check for success message with assessment ID
- Verify data appears in your Supabase database

---

## Step 8: Publish and Deploy

### 8.1 Publish Your Site
- Click **"Publish"** in top-right corner
- Choose your domain or use Framer's free domain
- Wait for deployment to complete

### 8.2 Test Live Site
- Visit your published URL
- Test calculator functionality on live site
- Verify all features work as expected

### 8.3 Monitor Performance
- Check loading times
- Test on different devices/browsers
- Monitor any error reports

---

## Troubleshooting Common Issues

### ❌ "Code Component failed to compile"
**Solution:**
- Check for syntax errors in code
- Ensure all brackets and parentheses are closed
- Try copying the code again from the source file

### ❌ Component appears blank/empty
**Solution:**
- Check container height (increase to 700px+)
- Verify component has proper width (800px+)
- Check browser console for JavaScript errors

### ❌ Form doesn't save progress
**Solution:**
- Test in published site (not just preview)
- Check browser's localStorage permissions
- Verify component has proper permissions

### ❌ Supabase integration not working
**Solution:**
- Verify Supabase URL format includes `https://`
- Check anon key is correct (no extra spaces)
- Test backend endpoint directly
- Check browser network tab for failed requests

### ❌ Styling looks different than expected
**Solution:**
- Check if page has conflicting CSS
- Adjust component's container height/width
- Update primary/background colors in properties

---

## Advanced Customization

### Custom Branding
```tsx
// Modify the component properties to add more customization
{
  companyLogo: {
    type: ControlType.Image,
    title: "Company Logo"
  },
  accentColor: {
    type: ControlType.Color,
    title: "Accent Color",
    defaultValue: "#10b981"
  }
}
```

### Analytics Integration
```tsx
// Add to form submission
gtag('event', 'form_submit', {
  event_category: 'fitness_calculator',
  event_label: formData.companyName
});
```

### Custom Validation
```tsx
// Modify validateStep function for custom rules
case 1:
  const hasValidDomain = formData.workEmail.includes('@yourcompany.com');
  return !!(formData.companyName && hasValidDomain);
```

---

## Support and Maintenance

### Regular Updates
- Monitor calculator usage and feedback
- Update validation rules as needed
- Keep Supabase integration current

### Performance Monitoring
- Check load times regularly
- Monitor form completion rates
- Track any error reports

### Data Management
- Regular backup of form submissions
- Monitor database storage usage
- Implement data retention policies

---

## Quick Reference Checklist

- [ ] Framer Pro plan confirmed
- [ ] Code Component created and named
- [ ] Complete code copied and pasted
- [ ] Component compiles successfully (green checkmark)
- [ ] Component added to page
- [ ] Proper sizing (800px+ wide, 700px+ tall)
- [ ] Preview tested - all steps work
- [ ] Form validation tested
- [ ] Data persistence tested (refresh page)
- [ ] Supabase credentials added (if using backend)
- [ ] Live site published and tested
- [ ] Mobile responsiveness verified

**🎉 Your fitness calculator is now live in Framer!**

---

## Next Steps After Setup

1. **Monitor Usage**: Track how users interact with your calculator
2. **Gather Feedback**: Ask users about their experience
3. **Iterate**: Make improvements based on usage data
4. **Scale**: Consider adding more features or integrations
5. **Promote**: Share your calculator across your marketing channels

Need help with any step? Check the browser console for error messages or refer to the troubleshooting section above.