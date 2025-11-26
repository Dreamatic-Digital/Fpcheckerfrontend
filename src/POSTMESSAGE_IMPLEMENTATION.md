# PostMessage Implementation Guide

## Overview
This document describes the implementation of window.postMessage() API for query parameter handling in the Fitness Passport Eligibility Calculator.

## Changes Made

### 1. Removed URL-based UTM Parameter Extraction
- **Previous behavior**: Extracted UTM parameters from `window.location.search`
- **New behavior**: Receives parameters via `window.postMessage()` from parent window
- **Storage**: Parameters are stored in `sessionStorage` under the key `queryParams`

### 2. Updated API Service (`/services/apiService.ts`)
Extended the `UtmParameters` interface to include additional tracking parameters:
```typescript
export interface UtmParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;      // Google Click ID
  fbclid?: string;     // Facebook Click ID
  msclkid?: string;    // Microsoft Click ID
  sc_email?: string;   // Scalarity email
  sc_phone?: string;   // Scalarity phone
  sc_uid?: string;     // Scalarity user ID
}
```

### 3. PostMessage Listener (`/App.tsx`)
Added a `useEffect` hook that listens for messages from the parent window:

```typescript
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    // ✅ Verify origin for security
    if (event.origin !== 'https://get.fitnesspassport.com.au') return;

    // ✅ Check for correct message type
    if (event.data?.type === 'queryParams') {
      const params = event.data.data;
      console.log('Received query params:', params);

      // Store in sessionStorage
      sessionStorage.setItem('queryParams', JSON.stringify(params));
    }
  };

  window.addEventListener('message', handleMessage);

  return () => {
    window.removeEventListener('message', handleMessage);
  };
}, []);
```

**Security Features:**
- Origin verification: Only accepts messages from `https://get.fitnesspassport.com.au`
- Type checking: Only processes messages with `type: 'queryParams'`

### 4. Updated Parameter Retrieval
Modified `getUtmParameters()` function to read from sessionStorage instead of URL:

```typescript
const getUtmParameters = (): UtmParameters => {
  try {
    const storedParams = sessionStorage.getItem('queryParams');
    if (storedParams) {
      const params = JSON.parse(storedParams);
      return {
        utm_source: params.utm_source || undefined,
        utm_medium: params.utm_medium || undefined,
        // ... all other parameters
      };
    }
  } catch (error) {
    console.error('Error reading query params from sessionStorage:', error);
  }
  return {};
};
```

### 5. GTM DataLayer Integration
Updated the completion event to push all query parameters to GTM dataLayer:

```typescript
useEffect(() => {
  if (showResults) {
    const queryParams = getUtmParameters();
    
    const dataLayerPayload: any = {
      event: 'eligibility_checker_completion'
    };

    // Add all available query parameters
    if (queryParams.utm_source) dataLayerPayload.utm_source = queryParams.utm_source;
    if (queryParams.utm_medium) dataLayerPayload.utm_medium = queryParams.utm_medium;
    // ... all other parameters

    // Handle gclid specifically for Google Ads tracking
    if (queryParams.gclid) {
      dataLayerPayload.gclid = queryParams.gclid;
      dataLayerPayload['&gclid'] = queryParams.gclid;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(dataLayerPayload);

    console.log('📊 DataLayer pushed:', dataLayerPayload);
  }
}, [showResults]);
```

**Key Features:**
- Event name changed from `checker-completion` to `eligibility_checker_completion`
- All query parameters are included in the dataLayer push
- Special handling for `gclid` (pushed as both `gclid` and `&gclid` for GTM compatibility)

## Parent Window Integration

### How to Send Parameters from Parent Window

The parent website (`https://get.fitnesspassport.com.au`) should send parameters to the iframe like this:

```javascript
const iframe = document.getElementById('eligibility-calculator-iframe');

// Prepare the payload
const payload = {
  type: 'queryParams',
  data: {
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'summer-2025',
    utm_term: 'fitness-benefits',
    utm_content: 'ad-variant-a',
    gclid: 'abc123xyz',
    fbclid: '',
    msclkid: '',
    sc_email: 'user@example.com',
    sc_phone: '+61412345678',
    sc_uid: 'user-12345'
  }
};

// Send message to iframe
iframe.contentWindow.postMessage(payload, 'https://your-calculator-domain.com');
```

### Timing Considerations

1. **Best Practice**: Send the message after the iframe loads
```javascript
iframe.addEventListener('load', () => {
  iframe.contentWindow.postMessage(payload, 'https://your-calculator-domain.com');
});
```

2. **Alternative**: Use `setInterval` to send periodically until acknowledged
```javascript
const sendInterval = setInterval(() => {
  if (iframe.contentWindow) {
    iframe.contentWindow.postMessage(payload, 'https://your-calculator-domain.com');
  }
}, 100);

// Stop after 5 seconds
setTimeout(() => clearInterval(sendInterval), 5000);
```

## Testing

### 1. Test PostMessage Reception
Open browser console in the iframe and check for:
- `"Received query params:"` log message
- Check sessionStorage: `sessionStorage.getItem('queryParams')`

### 2. Test API Submission
Complete the form and verify:
- Console log shows `"📤 Submitting to API:"` with UTM parameters
- API receives all tracking parameters in the payload

### 3. Test DataLayer Push
Complete the form and verify:
- Console shows `"📊 DataLayer pushed:"` message
- Check dataLayer: `window.dataLayer` contains the completion event
- All query parameters are included in the event

### 4. Test Security
Try sending a message from a different origin:
```javascript
// This should be ignored
iframe.contentWindow.postMessage({
  type: 'queryParams',
  data: { utm_source: 'malicious' }
}, 'https://your-calculator-domain.com');
```

## Expected DataLayer Event Format

When the form is completed, the following event is pushed to dataLayer:

```javascript
{
  event: 'eligibility_checker_completion',
  utm_source: 'google',
  utm_medium: 'cpc',
  utm_campaign: 'summer-2025',
  utm_term: 'fitness-benefits',
  utm_content: 'ad-variant-a',
  gclid: 'abc123xyz',
  '&gclid': 'abc123xyz',  // Special format for GTM
  fbclid: 'fb-click-id',
  msclkid: 'ms-click-id',
  sc_email: 'user@example.com',
  sc_phone: '+61412345678',
  sc_uid: 'user-12345'
}
```

## Troubleshooting

### Issue: Parameters not received
- Check browser console for "Received query params:" message
- Verify parent window origin is `https://get.fitnesspassport.com.au`
- Ensure message type is exactly `'queryParams'`

### Issue: Parameters not in API payload
- Check console log for `"📤 Submitting to API:"` message
- Verify sessionStorage contains the parameters
- Check that parameters have truthy values (empty strings are excluded)

### Issue: DataLayer event not firing
- Verify form submission is successful
- Check console for `"📊 DataLayer pushed:"` message
- Ensure GTM container is properly loaded on parent page

## Migration Notes

### Breaking Changes
- **Removed**: Direct URL parameter reading
- **Changed**: Event name from `checker-completion` to `eligibility_checker_completion`
- **Added**: Security origin verification

### Backward Compatibility
- The application will still function without parameters (they're all optional)
- If no postMessage is received, the form will work normally without tracking parameters

## Files Modified

1. `/services/apiService.ts` - Extended UtmParameters interface
2. `/App.tsx` - Added postMessage listener, updated dataLayer integration
