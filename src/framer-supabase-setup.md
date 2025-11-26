# Setting Up Supabase Integration with Framer Code Component

## Step 1: Get Your Supabase Credentials

1. **Get your Supabase URL and Anon Key:**
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy your Project URL and anon/public key

## Step 2: Configure Framer Code Component

1. **Add the Framer Code Component:**
   - Copy the `FramerFitnessCalculatorComplete.tsx` content
   - Create a new Code Component in Framer
   - Paste the code

2. **Set Supabase Credentials:**
   - In Framer's component properties panel, you'll see:
     - **Supabase URL**: Enter your project URL (e.g., `https://abc123.supabase.co`)
     - **Supabase Anon Key**: Enter your anon/public key

## Step 3: Backend Setup (Required for Full Integration)

### Option A: Use Your Existing Backend

If you already have your Supabase functions deployed:

1. **Ensure your server endpoint is accessible:**
   ```
   https://your-project.supabase.co/functions/v1/make-server-7dfaec09/assessments
   ```

2. **Update CORS settings** in your Edge Function:
   ```typescript
   // In your server/index.tsx
   import { cors } from 'npm:hono/cors'
   
   app.use('*', cors({
     origin: ['https://framer.com', 'https://*.framer.website', 'https://*.framer.app'],
     credentials: true,
     allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowHeaders: ['Content-Type', 'Authorization']
   }))
   ```

### Option B: Deploy Your Backend

If you need to deploy your backend:

1. **Deploy your Edge Functions:**
   ```bash
   # In your project directory
   supabase functions deploy server
   ```

2. **Verify deployment:**
   ```bash
   curl -X POST https://your-project.supabase.co/functions/v1/make-server-7dfaec09/assessments \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -d '{"test": "data"}'
   ```

## Step 4: Test the Integration

1. **In Framer:**
   - Add your Code Component to a page
   - Set the Supabase URL and key in the properties
   - Preview the page and test form submission

2. **Check the browser console** for any errors or successful submission logs

3. **Verify data storage:**
   - Check your Supabase database for new entries
   - Check browser localStorage for fallback storage

## Step 5: Fallback Behavior

The component includes intelligent fallback:

1. **Primary**: Attempts to submit to your Supabase backend
2. **Fallback**: If backend fails, stores data in localStorage
3. **Always**: Shows appropriate user feedback

## Advanced Configuration

### Custom Endpoint
If you want to use a different endpoint, modify the `FramerAssessmentService`:

```typescript
// Change this line in the service:
const response = await fetch(`${this.supabaseUrl}/functions/v1/your-custom-endpoint`, {
```

### Adding Authentication
For protected endpoints, modify the Authorization header:

```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${userToken}` // Use user token instead of anon key
}
```

### Error Handling
The component handles various error scenarios:

- **Network errors**: Falls back to localStorage
- **Backend errors**: Shows user-friendly messages
- **Invalid credentials**: Logs warnings and uses fallback

## Monitoring and Analytics

### Backend Logs
Monitor your Edge Functions logs:
```bash
supabase functions logs server
```

### Frontend Logs
The component logs all actions to browser console:
- Form submissions
- Backend responses
- Fallback activations
- Error states

## Security Considerations

1. **Use anon key only**: Never expose service role keys in Framer
2. **Validate data server-side**: Always validate form data in your backend
3. **Rate limiting**: Consider implementing rate limiting on your endpoints
4. **CORS configuration**: Ensure CORS is properly configured for Framer domains

## Troubleshooting

### Common Issues

1. **"Failed to save assessment"**
   - Check Supabase URL format (include https://)
   - Verify anon key is correct
   - Check network connectivity

2. **CORS errors**
   - Ensure your Edge Function includes proper CORS headers
   - Add Framer domains to allowed origins

3. **Backend not responding**
   - Verify Edge Function is deployed and active
   - Check function logs for errors
   - Test endpoint directly with curl

4. **Data not appearing in database**
   - Check your database table structure
   - Verify RLS policies allow inserts
   - Check Edge Function implementation

### Debug Mode
Enable detailed logging by setting:
```typescript
// Add to the component for more verbose logging
console.log('Supabase submission attempt:', { supabaseUrl, assessmentData });
```

This setup ensures your Framer Code Component maintains full functionality with your Supabase backend while providing graceful fallbacks for reliability.