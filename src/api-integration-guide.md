# API Integration Guide

## 🎯 Quick Setup

### 1. Update API Configuration

Edit `/config/apiConfig.ts`:

```typescript
export const PRODUCTION_CONFIG: ApiEnvironment = {
  name: 'production',
  endpoint: 'https://fp-api.scalarity.io/check-eligibility', // ← Updated endpoint
  apiKey: 'scL5cEZQ2obbP5lHxOcnunk58x01qFZG', // ← API key configured
  headers: {
    'X-Environment': 'production',
    'X-Client-Name': 'fitness-calculator'
  },
  timeout: 30000
};
```

### 2. Test API Connection

The app automatically validates and tests your API connection. Check the browser console for:
- ✅ `API connection test successful`
- ❌ `API connection test failed: [error details]`

---

## 📡 API Endpoint Requirements

### Expected Request Format

**Method:** `POST`  
**Content-Type:** `application/json`  
**Endpoint:** `https://fp-api.scalarity.io/check-eligibility`

### Request Headers
```
Content-Type: application/json
X-API-Key: scL5cEZQ2obbP5lHxOcnunk58x01qFZG
X-Client-Name: fitness-calculator
X-Client-Version: 1.0.0
```

### Request Body Schema
```json
{
  "company_name": "string",
  "business_type": "string",
  "industry_category": "string",
  "hq_postal_code": "string",
  "hq_city": "string",
  "hq_state": "string",
  "hq_employees": 0,
  "offices": [
    {
      "postal": "string",
      "city": "string",
      "state": "string",
      "employees": 0
    }
  ],
  "total_employees": 0,
  "workforce_type": "string",
  "communication_strength": 0,
  "wellness_goals": ["string"],
  "existing_benefits": "string",
  "current_benefits": ["string"],
  "first_name": "string",
  "last_name": "string",
  "job_title": "string",
  "work_email": "string",
  "phone_number": "string"
}
```

### Expected Response Format

**Success Response (200):**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "data": {
    "Status": "Approved",
    "id": "submission_12345",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Possible Status Values:**
- `"Approved"` - Company is eligible for Fitness Passport
- `"Further Checks Required (Survey)"` - Needs employee survey
- `"Further Checks Required (PD)"` - Needs partner confirmation  
- `"Not Approved"` - Not eligible at this time

**Status-Based UI Messages:**

**Green (Approved):**
- Title: "Eligibility Confirmed!"
- Description: "Great news! Your business qualifies for Fitness Passport. You're ready to take the next step towards unlocking wellness for your workforce. A member of our team will reach out shortly to discuss the next steps."

**Amber (Further Checks Required - Survey):**
- Title: "Almost There — Employee Survey Needed"
- Description: "You qualify, but we'll need to survey your eligible employees to understand their preferences before moving forward. A member of our team will reach out shortly to discuss the next steps."

**Amber (Further Checks Required - PD):**
- Title: "Pending Partner Confirmation"
- Description: "There's a chance we can't move forward. We'll need to check with our facility partners first. Our team will be in touch shortly to discuss the outcome of your request."

**Red (Not Approved):**
- Title: "Not Eligible at This Time"
- Description: "Unfortunately, your business doesn't currently meet the eligibility requirements for Fitness Passport. We'd be happy to revisit in the future as circumstances change. If you believe there has been a mistake, please contact us."

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "code": "ERROR_CODE"
}
```

---

## 🔧 Field Value References

### Business Types
```
privately-held | public-company | government-agency | 
non-profit | educational | self-owned | partnership
```

### Industry Categories
```
agriculture | mining | manufacturing | electricity | construction |
wholesale | retail | accommodation | transport | information |
financial | rental | professional | administrative | public |
education | healthcare | arts | other-services
```

### Workforce Types
```
full-time | part-time | mixed | contract | seasonal
```

### Communication Strength
```
0 = None | 1 = Poor | 2 = OK | 3 = Good | 4 = Great
```

### Wellness Goals
```
improve-engagement | address-stress | boost-retention | 
enhance-recruitment | work-life-balance | company-culture |
corporate-requirements | demonstrate-care
```

### Existing Benefits
```
yes | no
```

### Current Benefits (when existing_benefits = "yes")
```
corporate-fitness | gym-reimbursement | onsite-facilities |
health-screenings | eap-mental-health | nutrition-programs |
health-coaching | other-wellbeing
```

---

## 🛠️ Backend Implementation Examples

### Node.js/Express Example
```javascript
app.post('/fitness-calculator', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate the data
    if (!formData.company_name || !formData.work_email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Save to database
    const submissionId = await saveSubmission(formData);
    
    // Send confirmation email
    await sendConfirmationEmail(formData.work_email, submissionId);
    
    res.json({
      success: true,
      message: 'Form submitted successfully',
      id: submissionId
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});
```

### Python/FastAPI Example
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

class OfficeLocation(BaseModel):
    postal: str
    city: str
    state: str
    employees: int

class CalculatorSubmission(BaseModel):
    company_name: str
    business_type: str
    industry_category: str
    # ... all other fields
    
@app.post("/fitness-calculator")
async def submit_calculator(submission: CalculatorSubmission):
    try:
        # Process the submission
        submission_id = await save_submission(submission.dict())
        
        return {
            "success": True,
            "message": "Form submitted successfully", 
            "id": submission_id
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Submission failed: {str(e)}"
        )
```

### PHP Example
```php
<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input['company_name'] || !$input['work_email']) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $submissionId = saveSubmission($input);
    
    echo json_encode([
        'success' => true,
        'message' => 'Form submitted successfully',
        'id' => $submissionId
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Submission failed',
        'error' => $e->getMessage()
    ]);
}
?>
```

---

## ✅ Testing Your API

### 1. Test with curl
```bash
curl -X POST https://fp-api.scalarity.io/check-eligibility \
  -H "Content-Type: application/json" \
  -H "X-API-Key: scL5cEZQ2obbP5lHxOcnunk58x01qFZG" \
  -d '{
    "company_name": "Test Company",
    "business_type": "privately-held",
    "industry_category": "technology",
    "hq_postal_code": "12345",
    "hq_city": "Test City",
    "hq_state": "Test State",
    "hq_employees": 50,
    "offices": [],
    "total_employees": 50,
    "workforce_type": "full-time",
    "communication_strength": 3,
    "wellness_goals": ["improve-engagement"],
    "existing_benefits": "no",
    "current_benefits": [],
    "first_name": "John",
    "last_name": "Doe",
    "job_title": "CEO",
    "work_email": "john@test.com",
    "phone_number": "555-0123"
  }'
```

### 2. Check API Logs
Monitor your API logs for:
- Incoming requests
- Validation errors
- Processing success/failures
- Database saves
- Email confirmations

### 3. Verify Database Storage
Ensure submissions are being saved correctly with all fields.

---

## 🚨 Common Issues & Solutions

### Issue: CORS Errors
**Solution:** Add CORS headers to your API:
```javascript
res.header('Access-Control-Allow-Origin', 'https://your-frontend-domain.com');
res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

### Issue: Validation Failures
**Solution:** Check that all required fields are present and properly formatted.

### Issue: Timeout Errors
**Solution:** Optimize your API response time or increase the timeout in the config.

### Issue: Authentication Errors
**Solution:** Verify your API key and authentication method.

---

## 📈 Next Steps

1. **Set up your API endpoint** with the required schema
2. **Update the configuration** with your actual endpoint and credentials
3. **Test the integration** using the built-in validation
4. **Monitor submissions** and verify data is being saved correctly
5. **Set up email confirmations** for users
6. **Add analytics/tracking** if needed

Your calculator will now send all form data directly to your API endpoint with proper error handling and user feedback!