# API Field Mapping Guide

This document provides the complete mapping between the frontend form fields and the API payload structure for the Fitness Benefits Eligibility Calculator.

## API Endpoint Configuration

```
Endpoint: https://fp-api.scalarity.io/check-eligibility
Method: POST
Content-Type: application/json
Headers: 
  - X-API-Key: [API_KEY]
  - X-Client-Name: fitness-calculator
  - X-Client-Version: 1.0.0
```

## Field Mappings

### Company Information (Step 1)

| Frontend Field | Frontend Values | API Field | API Values |
|----------------|----------------|-----------|------------|
| `companyName` | User input string | `company_name` | Same value |
| `businessType` | "corporation", "partnership", "sole-proprietorship", "non-profit", "government-agency", "other" | `business_type` | Same values |
| `industryCategory` | "technology", "healthcare", "finance", "education", "manufacturing", "retail", "construction", "hospitality", "transport", "public", "other" | `industry_category` | Same values |

### Location Information (Step 2)

| Frontend Field | Frontend Values | API Field | API Values |
|----------------|----------------|-----------|------------|
| `hqPostalCode` | User input string | `hq_postal_code` | Same value |
| `hqCity` | User input string | `hq_city` | Same value |
| `hqState` | "NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT" | `hq_state` | Same values |
| `hqEmployees` | Number (0-10000+) | `hq_employees` | Same value |
| `offices[]` | Array of office objects | `offices` | Array with mapped structure |
| `offices[].postal` | User input string | `offices[].postal` | Same value |
| `offices[].city` | User input string | `offices[].city` | Same value |
| `offices[].state` | "NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT" | `offices[].state` | Same value |
| `offices[].employees` | Number (1-1000+) | `offices[].employees` | Same value |

### Employee Information (Step 3)

| Frontend Field | Frontend Values | API Field | API Values |
|----------------|----------------|-----------|------------|
| `totalEmployees` | Number (1-10000+) | `total_employees` | Same value |
| `workforceType` | "office-based", "remote", "hybrid", "mixed" | `workforce_type` | Same values |
| `communicationStrength` | Number (1-5) | `communication_strength` | Same value |

### Benefits Information (Step 4)

| Frontend Field | Frontend Values | API Field | API Values |
|----------------|----------------|-----------|------------|
| `wellnessGoals` | Array: ["employee-health", "reduce-healthcare-costs", "improve-productivity", "enhance-retention", "workplace-culture", "competitive-advantage"] | `wellness_goals` | Same array values |
| `existingBenefits` | "yes", "no", "some" | `existing_benefits` | Same values |
| `currentBenefits` | Array: ["gym-membership", "health-insurance", "wellness-programs", "mental-health", "fitness-classes", "other"] | `current_benefits` | Same array values |

### Contact Information (Step 5)

| Frontend Field | Frontend Values | API Field | API Values |
|----------------|----------------|-----------|------------|
| `firstName` | User input string | `first_name` | Same value |
| `lastName` | User input string | `last_name` | Same value |
| `jobTitle` | User input string | `job_title` | Same value |
| `workEmail` | User input email | `work_email` | Same value |
| `phoneNumber` | User input string | `phone_number` | Same value |

## Example API Payload

```json
{
  "company_name": "Acme Corporation",
  "business_type": "corporation",
  "industry_category": "technology",
  "hq_postal_code": "2000",
  "hq_city": "Sydney",
  "hq_state": "NSW",
  "hq_employees": 150,
  "total_employees": 300,
  "workforce_type": "hybrid",
  "communication_strength": 4,
  "offices": [
    {
      "postal": "3000",
      "city": "Melbourne", 
      "state": "VIC",
      "employees": 80
    },
    {
      "postal": "4000",
      "city": "Brisbane",
      "state": "QLD", 
      "employees": 70
    }
  ],
  "wellness_goals": ["employee-health", "improve-productivity"],
  "existing_benefits": "some",
  "current_benefits": ["health-insurance", "wellness-programs"],
  "first_name": "John",
  "last_name": "Smith",
  "job_title": "HR Director",
  "work_email": "john.smith@acme.com",
  "phone_number": "+61 400 123 456"
}
```

## API Response Format

```json
{
  "success": true,
  "message": "Eligibility evaluated",
  "data": {
    "Status": "Approved" | "Further Checks Required (Survey)" | "Further Checks Required (PD)" | "Not Approved",
    "reason": "Explanation of the decision",
    "kv_results": [
      {
        "key": "LOCATIONKEY",
        "region": null,
        "state": null,
        "postcode": null,
        "internal_region": null,
        "open_large": boolean,
        "open_small": boolean,
        "under_50": boolean,
        "notes": null
      }
    ]
  }
}
```

## Status Handling

The frontend handles four possible status responses:

1. **"Approved"** - Green success notification
2. **"Further Checks Required (Survey)"** - Amber warning notification  
3. **"Further Checks Required (PD)"** - Amber warning notification
4. **"Not Approved"** - Red error notification

## Validation Rules

### Required Fields
- All fields are required except `offices` array and `currentBenefits` array
- Email must be valid format
- Employee counts must be positive numbers
- States must match Australian state codes

### Business Rules
- `totalEmployees` should be >= `hqEmployees` + sum of all `offices[].employees`
- `communicationStrength` must be 1-5
- If `existingBenefits` is "no", `currentBenefits` should be empty array

Last Updated: August 2025