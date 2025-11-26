# Complete API Field Mapping

## All Form Input Keys (Lowercase with Underscores)

### Company Information Fields
```
company_name: string
business_type: string
industry_category: string
```

### Location Fields
```
hq_postal_code: string
hq_city: string
hq_state: string
hq_employees: number
offices: array of objects
```

### Office Objects (nested in offices array)
```
postal: string
city: string
state: string
employees: number
```

### Employee Information Fields
```
total_employees: number
workforce_type: string
communication_strength: number
```

### Benefits Fields
```
wellness_goals: array of strings
existing_benefits: string
current_benefits: array of strings
```

### Contact Information Fields
```
first_name: string
last_name: string
job_title: string
work_email: string
phone_number: string
```

---

## Complete API Payload Structure

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

---

## Field Value Options

### business_type Options:
- privately-held
- public-company
- government-agency
- non-profit
- educational
- self-owned
- partnership

### industry_category Options:
- agriculture
- mining
- manufacturing
- electricity
- construction
- wholesale
- retail
- accommodation
- transport
- information
- financial
- rental
- professional
- administrative
- public
- education
- healthcare
- arts
- other-services

### workforce_type Options:
- full-time
- part-time
- mixed
- contract
- seasonal

### communication_strength Values:
- 0 (None)
- 1 (Poor)
- 2 (OK)
- 3 (Good)
- 4 (Great)

### wellness_goals Options:
- improve-engagement
- address-stress
- boost-retention
- enhance-recruitment
- work-life-balance
- company-culture
- corporate-requirements
- demonstrate-care

### existing_benefits Options:
- yes
- no

### current_benefits Options (when existing_benefits = "yes"):
- corporate-fitness
- gym-reimbursement
- onsite-facilities
- health-screenings
- eap-mental-health
- nutrition-programs
- health-coaching
- other-wellbeing