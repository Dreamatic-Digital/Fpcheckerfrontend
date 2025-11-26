# Exact API Payload Structure

## API Endpoint
**POST** `https://fp-api.scalarity.io/check-eligibility`

## Request Headers
```json
{
  "Content-Type": "application/json",
  "X-API-Key": "scL5cEZQ2obbP5lHxOcnunk58x01qFZG",
  "X-Client-Name": "fitness-calculator",
  "X-Client-Version": "1.0.0"
}
```

## Complete Example Payload

Here's exactly what gets sent to the API when a user completes the form (using actual frontend dropdown values):

```json
{
  "company_name": "Acme Corporation",
  "business_type": "privately-held",
  "industry_category": "professional",
  "hq_postal_code": "2000",
  "hq_city": "Sydney",
  "hq_state": "NSW",
  "hq_employees": 75,
  "offices": [
    {
      "postal": "3000",
      "city": "Melbourne", 
      "state": "VIC",
      "employees": 45
    },
    {
      "postal": "4000",
      "city": "Brisbane",
      "state": "QLD", 
      "employees": 30
    }
  ],
  "total_employees": 150,
  "workforce_type": "mixed",
  "communication_strength": 4,
  "wellness_goals": [
    "improve-engagement",
    "address-stress",
    "boost-retention"
  ],
  "existing_benefits": "yes",
  "current_benefits": [
    "corporate-fitness",
    "eap-mental-health",
    "gym-reimbursement"
  ],
  "first_name": "John",
  "last_name": "Smith",
  "job_title": "Head of People & Culture",
  "work_email": "john.smith@acmecorp.com",
  "phone_number": "+61 2 9876 5432"
}
```

## Field Mapping from Form to API

| **Form Field (Internal)** | **API Field (Sent)** | **Type** | **Possible Values** | **Description** |
|---|---|---|---|---|
| `companyName` | `company_name` | string | Free text | Company name |
| `businessType` | `business_type` | string | `privately-held`, `public-company`, `government-agency`, `non-profit`, `educational`, `self-owned`, `partnership` | Type of business entity |
| `industryCategory` | `industry_category` | string | `agriculture`, `mining`, `manufacturing`, `electricity`, `construction`, `wholesale`, `retail`, `accommodation`, `transport`, `information`, `financial`, `rental`, `professional`, `administrative`, `public`, `education`, `healthcare`, `arts`, `other-services` | ABS Industry classification |
| `hqPostalCode` | `hq_postal_code` | string | Free text | Headquarters postal/zip code |
| `hqCity` | `hq_city` | string | Free text | Headquarters city |
| `hqState` | `hq_state` | string | Free text | Headquarters state/province |
| `hqEmployees` | `hq_employees` | number | 0-999+ | Number of employees at HQ |
| `offices` | `offices` | array | Array of office objects | Additional office locations |
| `totalEmployees` | `total_employees` | number | 1-1000+ | Total company employees |
| `workforceType` | `workforce_type` | string | `full-time`, `part-time`, `mixed`, `contract`, `seasonal` | Primary workforce arrangement |
| `communicationStrength` | `communication_strength` | number | 0-4 | Communication rating (0=None, 1=Poor, 2=OK, 3=Good, 4=Great) |
| `wellnessGoals` | `wellness_goals` | string[] | Array from: `improve-engagement`, `address-stress`, `boost-retention`, `enhance-recruitment`, `work-life-balance`, `company-culture`, `corporate-requirements`, `demonstrate-care` | Selected wellness objectives |
| `existingBenefits` | `existing_benefits` | string | `no`, `yes` | Has existing benefits |
| `currentBenefits` | `current_benefits` | string[] | Array from: `corporate-fitness`, `gym-reimbursement`, `onsite-facilities`, `health-screenings`, `eap-mental-health`, `nutrition-programs`, `health-coaching`, `other-wellbeing` | Current benefit offerings |
| `firstName` | `first_name` | string | Free text | Contact person first name |
| `lastName` | `last_name` | string | Free text | Contact person last name |
| `jobTitle` | `job_title` | string | Free text | Contact person job title |
| `workEmail` | `work_email` | string | Valid email format | Contact work email |
| `phoneNumber` | `phone_number` | string | Free text | Contact phone number |

## Data Types & Constraints

### String Fields
- All string fields default to empty string `""` if not provided
- Required fields are validated before submission

### Number Fields  
- `hq_employees`: Integer ≥ 0 (defaults to 0)
- `total_employees`: Integer 1-1000+ (required, defaults to 50)
- `communication_strength`: Integer 0-4 (0="None", 1="Poor", 2="OK", 3="Good", 4="Great", defaults to -1="Not Selected")

### Array Fields
- `offices`: Array of office objects with postal, city, state, employees
- `wellness_goals`: Array of selected goal strings
- `current_benefits`: Array of selected benefit strings
- All arrays default to empty `[]` if not provided

## Validation Rules Applied Before Sending

✅ **Required Fields:**
- company_name (must not be empty/whitespace)
- business_type (must be selected from dropdown)
- industry_category (must be selected from dropdown)
- hq_postal_code (must not be empty/whitespace)
- hq_city (must not be empty/whitespace)
- hq_state (must not be empty/whitespace - free text input)
- workforce_type (must be selected from dropdown)
- communication_strength (must be 0-4, user must select a rating button)
- existing_benefits (must be "yes" or "no")
- first_name (must not be empty/whitespace)
- last_name (must not be empty/whitespace)
- job_title (must not be empty/whitespace)
- work_email (must be valid email format)
- phone_number (must not be empty/whitespace)

✅ **Format Validation:**
- work_email: Must match email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- hq_employees: Must be ≥ 0 (integer)
- total_employees: Must be > 0 (integer, set via slider 1-1000+)
- communication_strength: Must be 0-4 (integer, -1 in form means "not selected")
- wellness_goals: Array, can be empty
- current_benefits: Array, can be empty (only shown if existing_benefits="yes")

## Office Location Structure

Each office in the `offices` array has this structure:
```json
{
  "postal": "3000",
  "city": "Melbourne",
  "state": "VIC", 
  "employees": 45
}
```

## Business Type Options (Frontend Values)
```json
[
  "privately-held",
  "public-company", 
  "government-agency",
  "non-profit",
  "educational",
  "self-owned",
  "partnership"
]
```

## Industry Category Options (Frontend Values)
```json
[
  "agriculture", "mining", "manufacturing", "electricity", "construction",
  "wholesale", "retail", "accommodation", "transport", "information",
  "financial", "rental", "professional", "administrative", "public",
  "education", "healthcare", "arts", "other-services"
]
```

## Workforce Type Options (Frontend Values)
```json
[
  "full-time",     // "Primarily Full-Time (75%+ full-time employees)"
  "part-time",     // "Primarily Part-Time (75%+ part-time employees)"
  "mixed",         // "Mixed Full-Time & Part-Time"
  "contract",      // "Primarily Contract/Freelance"
  "seasonal"       // "Seasonal Workers"
]
```

## Communication Strength Values
```json
{
  "0": "None",
  "1": "Poor", 
  "2": "OK",
  "3": "Good",
  "4": "Great"
}
```

## Wellness Goals Options (Frontend Values)
```json
[
  "improve-engagement",        // "Improve engagement"
  "address-stress",           // "Address stress, fatigue and burnout"
  "boost-retention",          // "Boost employee retention"
  "enhance-recruitment",      // "Enhance talent recruitment"
  "work-life-balance",        // "Improve work-life balance"
  "company-culture",          // "Strengthen company culture"
  "corporate-requirements",   // "Meet corporate wellness requirements"
  "demonstrate-care"          // "Demonstrate employee care and values"
]
```

## Existing Benefits Options
```json
[
  "no",   // "No" - "We don't currently offer any fitness-related benefits"
  "yes"   // "Yes" - "We currently offer some fitness or wellness benefits"
]
```

## Current Benefits Options (Frontend Values)
```json
[
  "corporate-fitness",        // "Corporate fitness benefit"
  "gym-reimbursement",       // "Gym membership reimbursement"
  "onsite-facilities",       // "On-site fitness facilities"
  "health-screenings",       // "Health screenings"
  "eap-mental-health",       // "EAP and mental health support"
  "nutrition-programs",      // "Nutrition programs"
  "health-coaching",         // "Health coaching"
  "other-wellbeing"          // "Other wellbeing initiatives"
]
```

## Key UI → API Value Transformations

### Business Type Examples
- UI: "Privately held" → API: `"privately-held"`
- UI: "Public company" → API: `"public-company"`
- UI: "Government agency" → API: `"government-agency"`

### Industry Category Examples  
- UI: "Professional, Scientific and Technical Services" → API: `"professional"`
- UI: "Health Care and Social Assistance" → API: `"healthcare"`
- UI: "Information Media and Telecommunications" → API: `"information"`

### Workforce Type Examples
- UI: "Primarily Full-Time (75%+ full-time employees)" → API: `"full-time"`
- UI: "Mixed Full-Time & Part-Time" → API: `"mixed"`
- UI: "Primarily Contract/Freelance" → API: `"contract"`

### Wellness Goals Examples
- UI: "Improve engagement" → API: `"improve-engagement"`
- UI: "Address stress, fatigue and burnout" → API: `"address-stress"`
- UI: "Boost employee retention" → API: `"boost-retention"`

### Current Benefits Examples
- UI: "Corporate fitness benefit" → API: `"corporate-fitness"`
- UI: "EAP and mental health support" → API: `"eap-mental-health"`
- UI: "Gym membership reimbursement" → API: `"gym-reimbursement"`

### Communication Strength
- UI: Button "None" → API: `0`
- UI: Button "Poor" → API: `1`
- UI: Button "OK" → API: `2`
- UI: Button "Good" → API: `3`
- UI: Button "Great" → API: `4`

---

**Note:** This payload is automatically generated by the `transformFormData()` method in `/services/apiService.ts` and logged to console during development for debugging purposes.