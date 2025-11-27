# Fitness Benefits Eligibility Calculator - Technical Documentation

## Table of Contents
1. [Application Overview](#application-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Step-by-Step Flow](#step-by-step-flow)
4. [Data Model & Field Specifications](#data-model--field-specifications)
5. [Key Features & Logic](#key-features--logic)
6. [API Integration](#api-integration)
7. [Component Structure](#component-structure)
8. [Styling Guidelines](#styling-guidelines)
9. [Maintenance & Updates](#maintenance--updates)
10. [Common Modification Scenarios](#common-modification-scenarios)

---

## Application Overview

### Purpose
This is a modern React-based multi-step form application that determines company eligibility for fitness benefits programs. It collects comprehensive company data across 5 steps and submits it to a backend API for assessment.

### Deployment Context
- **Primary Use**: Embedded in Framer websites via iframe
- **Integration Method**: URL-based iframe embedding
- **Data Flow**: Frontend form → API endpoint → Response → UI feedback

### Core Functionality
1. **Multi-step form** with progress indication
2. **Data persistence** via localStorage (survives page refreshes)
3. **Dynamic form elements** (add/remove office locations)
4. **Automatic calculations** (employee totals)
5. **Form validation** (required fields, format checks)
6. **API submission** with standardized field naming
7. **Status-based UI feedback** (color-coded toasts and success screens)

---

## Architecture & Technology Stack

### Technologies Used
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v4.0
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Not applicable (single-page form)
- **HTTP Client**: Fetch API
- **Icons**: Lucide React
- **Notifications**: Sonner (toast library)
- **Storage**: Browser localStorage

### File Structure
```
/
├── App.tsx                          # Main application component & form logic
├── components/
│   └── [individual components]      # Reusable UI components
├── styles/
│   └── globals.css                  # Global styles & Tailwind config
└── AGENTS.md                        # This documentation file
```

### Design Patterns
- **Controlled Components**: All form inputs are controlled via React state
- **Single Source of Truth**: Form data stored in one state object
- **Side Effects**: localStorage sync via useEffect hooks
- **Conditional Rendering**: Step-based UI rendering

---

## Step-by-Step Flow

### Step 1: Company Information
**Fields Collected:**
- Company Name (text input, required)
- Industry (dropdown select, required)

**Industries Available:**
- Technology
- Healthcare
- Finance
- Retail
- Manufacturing
- Education
- Hospitality
- Professional Services
- Construction
- Other

**Validation:**
- Both fields must be filled to proceed

---

### Step 2: Location Information
**Fields Collected:**
- Headquarters City (text input, required)
- Headquarters State (dropdown, required - Australian states)
- Headquarters Employee Count (number input, required, min: 1)
- Office Locations (dynamic array, optional)

**Australian States:**
- NSW (New South Wales)
- VIC (Victoria)
- QLD (Queensland)
- SA (South Australia)
- WA (Western Australia)
- TAS (Tasmania)
- NT (Northern Territory)
- ACT (Australian Capital Territory)

**Dynamic Office Locations:**
- Users can add multiple office locations
- Each location has: City, State (dropdown), Employee Count
- Each location can be individually removed
- "Add Another Office Location" button appears after adding locations

**UI Behavior:**
- All employee count fields start completely empty (no "0" placeholder)
- State fields use dropdown selection (not free text)
- Employee counts must be positive integers

**Validation:**
- Headquarters city, state, and employee count are required
- If office locations are added, all their fields must be completed
- Partial office location entries block progression

---

### Step 3: Employee Information
**Fields Collected:**
- Total Number of Employees (slider input, range: 1-1500)
- Percentage Interested in Wellness (slider input, range: 0-100%)

**Auto-Fill Logic (Critical Feature):**
When navigating FROM step 2 TO step 3:
1. System calculates: HQ employees + sum of all office location employees
2. Automatically sets the total_employees slider to this calculated value
3. If calculated total > 1500, caps at 1500
4. If user manually entered a value, it gets overwritten by auto-calculation
5. This ensures consistency between location data and total employee count

**Slider Specifications:**
- Total Employees: Min 1, Max 1500, Default 1
- Wellness Interest: Min 0%, Max 100%, Default 50%

**UI Details:**
- No descriptive text on this page (clean, minimal design)
- Sliders show current value dynamically
- Values update in real-time as slider moves

**Validation:**
- Total employees must be ≥ 1
- Percentage can be 0-100 (0 is valid)

---

### Step 4: Wellness Goals
**Fields Collected:**
- Primary Wellness Goals (checkboxes, at least 1 required)
- Communication Rating (star rating system, required)

**Available Wellness Goals:**
- Improve Employee Health
- Reduce Healthcare Costs
- Boost Productivity
- Enhance Company Culture
- Increase Employee Retention
- Support Mental Health

**Star Rating System:**
- Visual: 5 clickable stars
- Range: 1-5 stars
- Interactive: Hover effects, click to select
- Required: Must select at least 1 star
- Display: Shows selected count (e.g., "3 stars selected")

**Validation:**
- At least one wellness goal must be checked
- Communication rating must be selected (1-5)

---

### Step 5: Contact Information
**Fields Collected:**
- Full Name (text input, required)
- Email (email input, required, format validated)
- Phone Number (text input, optional)

**Email Validation:**
- Must contain "@" symbol
- Must have content before and after "@"
- Basic format check (not RFC-compliant, but reasonable)

**Validation:**
- Name is required
- Email is required and must be valid format
- Phone is optional (can be empty)

---

## Data Model & Field Specifications

### Form Data State Structure
```typescript
{
  // Step 1
  company_name: string,
  industry: string,
  
  // Step 2
  headquarters_city: string,
  headquarters_state: string,
  headquarters_employees: number | "",
  office_locations: Array<{
    city: string,
    state: string,
    employees: number | ""
  }>,
  
  // Step 3
  total_employees: number,
  wellness_interest_percentage: number,
  
  // Step 4
  wellness_goals: string[], // Array of selected goal strings
  communication_rating: number,
  
  // Step 5
  full_name: string,
  email: string,
  phone_number: string
}
```

### API Payload Format
**Endpoint:** `https://fp-api.scalarity.io/check-eligibility`
**Method:** POST
**Content-Type:** application/json

**Field Naming Convention:** All lowercase with underscores

**Payload Structure:**
```json
{
  "company_name": "string",
  "industry": "string",
  "headquarters_city": "string",
  "headquarters_state": "string",
  "headquarters_employees": number,
  "office_locations": [
    {
      "city": "string",
      "state": "string",
      "employees": number
    }
  ],
  "total_employees": number,
  "wellness_interest_percentage": number,
  "wellness_goals": ["string"],
  "communication_rating": number,
  "full_name": "string",
  "email": "string",
  "phone_number": "string"
}
```

**Important Notes:**
- Empty string values for employee counts are converted to 0 before submission
- office_locations array can be empty if no offices added
- wellness_goals is an array of strings (the exact text of selected goals)
- All field names use lowercase_with_underscores format

---

## Key Features & Logic

### 1. localStorage Persistence

**Implementation:**
```javascript
// Save on every form data change
useEffect(() => {
  localStorage.setItem('fitnessFormData', JSON.stringify(formData));
}, [formData]);

// Load on component mount
useEffect(() => {
  const saved = localStorage.getItem('fitnessFormData');
  if (saved) {
    setFormData(JSON.parse(saved));
  }
}, []);
```

**Behavior:**
- Form data persists across page refreshes
- Data survives browser restarts (until localStorage is cleared)
- Each field update triggers a save
- On app load, automatically restores previous session

**Storage Key:** `fitnessFormData`

---

### 2. Auto-Fill Employee Total Logic

**Trigger:** Navigation from Step 2 → Step 3

**Implementation Location:** `handleNext()` function when `currentStep === 2`

**Logic:**
```javascript
if (currentStep === 2) {
  // Calculate total from all locations
  const hqEmployees = Number(formData.headquarters_employees) || 0;
  const officeEmployees = formData.office_locations.reduce(
    (sum, loc) => sum + (Number(loc.employees) || 0), 
    0
  );
  const calculatedTotal = hqEmployees + officeEmployees;
  
  // Cap at 1500 (slider maximum)
  const finalTotal = Math.min(calculatedTotal, 1500);
  
  // Update form data
  setFormData(prev => ({
    ...prev,
    total_employees: finalTotal || 1 // Ensure minimum of 1
  }));
}
```

**Edge Cases Handled:**
- Empty employee fields treated as 0
- Total > 1500 capped at 1500
- Total of 0 defaults to 1 (slider minimum)
- Overwrites any manually entered value

**Why This Exists:**
Ensures data consistency and reduces user error by automatically calculating the total employee count from location-specific data entered in step 2.

---

### 3. Dynamic Office Locations

**Data Structure:**
```javascript
office_locations: [
  { city: "", state: "", employees: "" },
  { city: "", state: "", employees: "" }
  // ... more locations
]
```

**Operations:**

**Add Location:**
```javascript
const handleAddOffice = () => {
  setFormData(prev => ({
    ...prev,
    office_locations: [
      ...prev.office_locations,
      { city: "", state: "", employees: "" }
    ]
  }));
};
```

**Remove Location:**
```javascript
const handleRemoveOffice = (index: number) => {
  setFormData(prev => ({
    ...prev,
    office_locations: prev.office_locations.filter((_, i) => i !== index)
  }));
};
```

**Update Location Field:**
```javascript
const handleOfficeChange = (index: number, field: string, value: any) => {
  setFormData(prev => ({
    ...prev,
    office_locations: prev.office_locations.map((loc, i) => 
      i === index ? { ...loc, [field]: value } : loc
    )
  }));
};
```

**UI Notes:**
- "Add Another Office Location" button only shows when locations exist
- Each location has a remove button
- Locations are numbered in the UI (Office Location 1, Office Location 2, etc.)

---

### 4. Validation System

**Validation Function:** `validateStep(stepNumber)`

**Step-by-Step Validation:**

**Step 1:**
```javascript
if (!formData.company_name.trim() || !formData.industry) {
  return false;
}
```

**Step 2:**
```javascript
// HQ required
if (!formData.headquarters_city.trim() || 
    !formData.headquarters_state || 
    !formData.headquarters_employees) {
  return false;
}

// All office fields must be complete if any offices exist
for (const office of formData.office_locations) {
  if (!office.city.trim() || !office.state || !office.employees) {
    return false;
  }
}
```

**Step 3:**
```javascript
if (formData.total_employees < 1) {
  return false;
}
// Note: wellness_interest_percentage can be 0, so no minimum check
```

**Step 4:**
```javascript
if (formData.wellness_goals.length === 0 || 
    formData.communication_rating === 0) {
  return false;
}
```

**Step 5:**
```javascript
if (!formData.full_name.trim() || 
    !formData.email.trim() || 
    !formData.email.includes('@')) {
  return false;
}
```

**User Feedback:**
- Invalid steps show red border on "Next" button
- Toast notification: "Please fill in all required fields"
- User cannot proceed until validation passes

---

### 5. Progress Indicator

**Visual Display:**
- Shows current step number and total steps (e.g., "Step 2 of 5")
- Progress bar fills proportionally (20% per step)
- Green color (#10b981) for completed progress
- Gray background for remaining progress

**Calculation:**
```javascript
const progress = (currentStep / 5) * 100; // 5 total steps
```

---

### 6. Star Rating System

**Implementation:**
- 5 clickable star icons (lucide-react)
- Hover effect: Stars light up on hover
- Click effect: Stars become filled and colored
- Visual states:
  - Unselected: Gray outline
  - Hover: Yellow fill
  - Selected: Yellow fill (solid)

**State Management:**
```javascript
const [hoveredStar, setHoveredStar] = useState(0);

// On click
setFormData(prev => ({
  ...prev,
  communication_rating: starValue
}));

// Visual determination
const isFilled = hoveredStar >= star || formData.communication_rating >= star;
```

---

## API Integration

### Submission Process

**Trigger:** User clicks "Submit" on Step 5 (after validation passes)

**Implementation:**
```javascript
const handleSubmit = async () => {
  setIsSubmitting(true);
  
  try {
    // Prepare payload
    const payload = {
      ...formData,
      headquarters_employees: Number(formData.headquarters_employees) || 0,
      office_locations: formData.office_locations.map(loc => ({
        ...loc,
        employees: Number(loc.employees) || 0
      }))
    };
    
    // Submit to API
    const response = await fetch('https://fp-api.scalarity.io/check-eligibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    // Handle response based on status
    handleApiResponse(result, response.status);
    
  } catch (error) {
    // Network error handling
    toast.error('Submission failed. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

### Response Handling

**Expected Response Format:**
```json
{
  "status": "success" | "pending" | "rejected",
  "message": "string (optional)"
}
```

**Status-Based Actions:**

**1. Success (status: "success")**
- **Toast**: Green success notification with checkmark
- **Message**: "Application submitted successfully!"
- **Action**: Show success screen
- **Data**: Clear localStorage (form reset)

**2. Pending (status: "pending")**
- **Toast**: Blue info notification
- **Message**: "Application received and under review"
- **Action**: Show success screen
- **Data**: Clear localStorage (form reset)

**3. Rejected (status: "rejected")**
- **Toast**: Red error notification
- **Message**: API message or "Application could not be processed"
- **Action**: Stay on form (no screen change)
- **Data**: Keep localStorage (user can retry)

**4. Error (network failure, 500, etc.)**
- **Toast**: Red error notification
- **Message**: "Submission failed. Please try again."
- **Action**: Stay on form
- **Data**: Keep localStorage (user can retry)

---

### Success Screen

**Display Conditions:**
- API returns status "success" or "pending"
- Shows after form submission completes

**Content:**
- Large checkmark icon (green)
- "Thank You!" heading
- "Your fitness benefits assessment has been submitted successfully. We'll be in touch soon!"
- "Back to Home" button

**Actions:**
- "Back to Home" button: Resets form to step 1, clears all data
- Form data is cleared from localStorage when success screen shows
- Creates a fresh start for next user

---

## Component Structure

### Main Application Component (App.tsx)

**State Variables:**
```javascript
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState({...});
const [isSubmitting, setIsSubmitting] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
const [hoveredStar, setHoveredStar] = useState(0);
```

**Key Functions:**
- `handleNext()` - Validates and advances to next step, triggers auto-fill
- `handleBack()` - Returns to previous step
- `validateStep(step)` - Validates current step data
- `handleSubmit()` - Submits form to API
- `handleAddOffice()` - Adds new office location
- `handleRemoveOffice(index)` - Removes office location
- `handleOfficeChange(index, field, value)` - Updates office location field
- `resetForm()` - Clears all data and returns to step 1

**Render Logic:**
```javascript
if (showSuccess) {
  return <SuccessScreen />;
}

return (
  <div>
    <ProgressIndicator />
    {currentStep === 1 && <Step1Component />}
    {currentStep === 2 && <Step2Component />}
    {currentStep === 3 && <Step3Component />}
    {currentStep === 4 && <Step4Component />}
    {currentStep === 5 && <Step5Component />}
    <NavigationButtons />
  </div>
);
```

---

### Reusable Components

Components should be created in `/components` directory for:
- Individual step forms (optional, can be inline)
- Success screen (optional, can be inline)
- Custom input components (if needed)

**Current Implementation:**
- All logic is in App.tsx (single-component architecture)
- Can be refactored into separate components if needed
- No external component dependencies currently

---

## Styling Guidelines

### Tailwind CSS Usage

**Important Restrictions:**
- **DO NOT** use Tailwind classes for font sizes (e.g., text-2xl)
- **DO NOT** use Tailwind classes for font weights (e.g., font-bold)
- **DO NOT** use Tailwind classes for line heights (e.g., leading-none)
- **Reason**: Typography is defined in `/styles/globals.css` and should not be overridden

**Allowed Tailwind Usage:**
- Layout (flex, grid, spacing)
- Colors (bg-*, text-*, border-*)
- Borders and shadows
- Responsive design (md:, lg:, etc.)
- Interactions (hover:, focus:, etc.)

---

### Color Palette

**Primary Colors:**
- Primary Green: `#10b981` (emerald-500)
- Primary Blue: `#3b82f6` (blue-500)

**Status Colors:**
- Success: `#10b981` (green)
- Error: `#ef4444` (red)
- Info: `#3b82f6` (blue)
- Warning: `#f59e0b` (amber)

**Neutral Colors:**
- Text: `#1f2937` (gray-800)
- Background: `#ffffff` (white)
- Border: `#e5e7eb` (gray-200)
- Disabled: `#9ca3af` (gray-400)

---

### Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Form Width:**
- Max width: 600px
- Centered on page
- Padding: 20px on mobile, 40px on desktop

**Current Implementation:**
- Form is designed primarily for desktop/tablet
- Mobile-responsive layouts in place
- All inputs are touch-friendly

---

## Maintenance & Updates

### When Modifying Form Fields

**Adding a New Field:**

1. **Add to formData state:**
```javascript
const [formData, setFormData] = useState({
  // ... existing fields
  new_field: "", // Add here with default value
});
```

2. **Add to corresponding step JSX:**
```javascript
<input
  type="text"
  value={formData.new_field}
  onChange={(e) => setFormData(prev => ({
    ...prev,
    new_field: e.target.value
  }))}
/>
```

3. **Add validation (if required):**
```javascript
// In validateStep() function
if (step === X) {
  if (!formData.new_field.trim()) {
    return false;
  }
}
```

4. **Add to API payload (if needed):**
- Field will automatically be included in payload if using spread operator
- Ensure field name follows lowercase_underscore convention

---

### Modifying Dropdown Options

**Example: Adding a new industry:**

1. **Locate the industry dropdown in Step 1**
2. **Add new option:**
```javascript
<option value="New Industry">New Industry</option>
```

**Example: Modifying Australian states:**

1. **Locate state dropdowns in Step 2**
2. **Modify options as needed**
3. **Ensure both HQ and office location dropdowns are updated**

---

### Changing Slider Ranges

**Example: Increasing max employees to 2000:**

1. **Update slider max attribute:**
```javascript
<input
  type="range"
  min="1"
  max="2000" // Changed from 1500
  value={formData.total_employees}
/>
```

2. **Update auto-fill capping logic:**
```javascript
const finalTotal = Math.min(calculatedTotal, 2000); // Changed from 1500
```

3. **Update any UI text showing the range**

---

### Modifying API Endpoint

**To change the API endpoint:**

1. **Locate the fetch call in handleSubmit()**
2. **Replace the URL:**
```javascript
const response = await fetch('https://new-api-url.com/endpoint', {
  // ... rest of config
});
```

---

### Adjusting Validation Rules

**Example: Making phone number required:**

1. **Update Step 5 validation:**
```javascript
if (step === 5) {
  if (!formData.full_name.trim() || 
      !formData.email.trim() || 
      !formData.email.includes('@') ||
      !formData.phone_number.trim()) { // Add this line
    return false;
  }
}
```

---

### Modifying localStorage Behavior

**To change storage key:**
```javascript
// Change both save and load
localStorage.setItem('newKeyName', JSON.stringify(formData));
const saved = localStorage.getItem('newKeyName');
```

**To disable localStorage:**
```javascript
// Comment out or remove both useEffect hooks related to localStorage
```

---

## Common Modification Scenarios

### Scenario 1: Add a New Step

**Steps Required:**

1. **Increase total steps:**
```javascript
// Update progress calculation
const progress = (currentStep / 6) * 100; // Changed from 5 to 6

// Update step indicator
<p className="text-gray-600">Step {currentStep} of 6</p>
```

2. **Add step rendering:**
```javascript
{currentStep === 6 && (
  <div>
    {/* New step content */}
  </div>
)}
```

3. **Add validation:**
```javascript
if (step === 6) {
  // Validation logic
}
```

4. **Update handleNext() logic:**
```javascript
// Ensure submission only happens on the last step
if (currentStep === 6) { // Changed from 5
  await handleSubmit();
}
```

---

### Scenario 2: Change Success Screen Message

**Location:** Inside the `showSuccess` conditional render

**Modify:**
```javascript
<p className="text-gray-600">
  Your new custom message here!
</p>
```

---

### Scenario 3: Add More Wellness Goals

**Location:** Step 4 wellness goals checkboxes

**Add new checkbox:**
```javascript
<label>
  <input
    type="checkbox"
    checked={formData.wellness_goals.includes('New Goal')}
    onChange={(e) => {
      if (e.target.checked) {
        setFormData(prev => ({
          ...prev,
          wellness_goals: [...prev.wellness_goals, 'New Goal']
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          wellness_goals: prev.wellness_goals.filter(g => g !== 'New Goal')
        }));
      }
    }}
  />
  New Goal
</label>
```

---

### Scenario 4: Change Toast Notification Messages

**Location:** Various places in the code

**Examples:**
```javascript
// Validation error
toast.error('Your custom validation message');

// Success
toast.success('Your custom success message');

// Info
toast.info('Your custom info message');
```

---

### Scenario 5: Disable Auto-Fill Feature

**Location:** `handleNext()` function

**Action:**
```javascript
// Comment out or remove this block:
if (currentStep === 2) {
  // ... auto-fill logic
}
```

---

### Scenario 6: Change Star Rating to Different Scale

**Example: Change from 5 stars to 10 stars:**

1. **Update array generation:**
```javascript
{[...Array(10)].map((_, i) => { // Changed from 5
  const star = i + 1;
  // ... rest of logic
})}
```

2. **Update validation (if needed):**
```javascript
// Max rating is now 10 instead of 5
```

---

## Testing Checklist

When making changes, test the following:

### Functionality Tests
- [ ] All 5 steps render correctly
- [ ] Can navigate forward and backward
- [ ] Validation prevents progress with incomplete data
- [ ] Office locations can be added and removed
- [ ] Star rating works (click and hover)
- [ ] Checkboxes work (can select multiple)
- [ ] Sliders update values in real-time
- [ ] Auto-fill calculates correctly (Step 2 → 3)
- [ ] Auto-fill caps at 1500
- [ ] Form submits to API successfully
- [ ] Success screen appears on successful submission
- [ ] Error handling works for failed submissions
- [ ] "Back to Home" resets form

### Data Persistence Tests
- [ ] Form data persists on page refresh
- [ ] localStorage saves all fields correctly
- [ ] Form data clears after successful submission
- [ ] Form data persists after failed submission

### Validation Tests
- [ ] Step 1: Company name and industry required
- [ ] Step 2: HQ fields required
- [ ] Step 2: Partial office locations block progress
- [ ] Step 2: Complete office locations allow progress
- [ ] Step 3: Total employees minimum 1
- [ ] Step 4: At least one wellness goal required
- [ ] Step 4: Star rating required
- [ ] Step 5: Name and email required
- [ ] Step 5: Email format validated
- [ ] Step 5: Phone is optional

### UI Tests
- [ ] Progress bar updates correctly
- [ ] Step indicators show correct numbers
- [ ] Buttons enable/disable appropriately
- [ ] Loading states show during submission
- [ ] Toast notifications appear correctly
- [ ] Colors match status (green=success, red=error, blue=info)
- [ ] Form is centered and properly sized
- [ ] All text is readable
- [ ] No layout breaks on mobile

### API Tests
- [ ] Correct endpoint is called
- [ ] Correct HTTP method (POST)
- [ ] Correct headers (Content-Type: application/json)
- [ ] Payload uses lowercase_underscore field names
- [ ] Empty employee counts convert to 0
- [ ] Office locations array formatted correctly
- [ ] Wellness goals array formatted correctly

---

## Debugging Tips

### Form Data Not Persisting
**Check:**
- Browser localStorage is not disabled
- localStorage key name is correct ('fitnessFormData')
- No JavaScript errors in console preventing saves
- useEffect dependencies are correct

### Validation Not Working
**Check:**
- validateStep() function is being called
- Correct step number is passed
- All required fields are included in validation logic
- Trimming whitespace where appropriate

### Auto-Fill Not Working
**Check:**
- handleNext() is calling auto-fill logic for step 2
- Employee counts are being parsed as numbers
- Sum calculation is correct
- Capping logic is correct (Math.min with 1500)
- State is being updated correctly

### API Submission Failing
**Check:**
- Network connection (browser dev tools Network tab)
- CORS issues (check console errors)
- API endpoint URL is correct
- Request payload format matches API expectations
- API is returning expected response structure

### Toast Notifications Not Showing
**Check:**
- Sonner Toaster component is rendered in App
- Import statement is correct: `import { toast } from "sonner@2.0.3"`
- Toast methods are called correctly (toast.success, toast.error, etc.)

---

## LLM Assistant Guidelines

When working with this codebase as an AI assistant:

1. **Always read the current state** of App.tsx before making changes
2. **Preserve existing functionality** unless explicitly asked to change it
3. **Follow the established patterns** (state management, validation, etc.)
4. **Maintain field naming conventions** (lowercase_underscore for API)
5. **Test validation logic** when adding new fields
6. **Update documentation** when making significant changes
7. **Use fast_apply_tool** for edits to existing files
8. **Don't modify** `/styles/globals.css` unless specifically requested
9. **Don't add** font-size, font-weight, or line-height Tailwind classes
10. **Keep the single-component architecture** unless refactoring is requested

### Common Requests and How to Handle Them

**"Add a new field to step X"**
→ Follow the "Adding a New Field" guide in Maintenance section

**"Change the validation for step X"**
→ Modify the validateStep() function for that specific step

**"Add a new step"**
→ Follow the "Add a New Step" scenario

**"Change the API endpoint"**
→ Update the fetch URL in handleSubmit()

**"Modify the success message"**
→ Update the text in the showSuccess conditional render

**"Change slider maximum"**
→ Update slider max attribute AND auto-fill capping logic

**"Add more options to dropdown"**
→ Add new <option> elements to the relevant select

**"Change the styling"**
→ Modify Tailwind classes (avoid typography classes)

**"Fix a bug"**
→ Read current code, identify issue, use fast_apply_tool for surgical fix

---

## Version History & Recent Changes

### Recent Updates (Current Version)

1. **Pre-fill Feature**: Automatic total employee calculation when moving from Step 2 to Step 3
   - Sums headquarters + all office location employees
   - Caps at 1500 (slider maximum)
   - Overwrites manual entries for consistency

2. **UI Improvements**:
   - Removed descriptive text from Step 3 (Employee Information page)
   - Increased total employees slider maximum from 500 to 1500
   - Converted state fields to Australian state dropdowns (NSW, VIC, QLD, SA, WA, TAS, NT, ACT)
   - Removed "0" placeholders from employee count fields (fields start empty)

3. **Validation Updates**:
   - Added validation for partial office location entries
   - Improved state field validation (dropdown required)
   - Employee count fields now validate as empty or positive numbers

---

## Summary

This fitness benefits eligibility calculator is a self-contained React application designed for iframe embedding in Framer websites. It uses a 5-step multi-step form pattern with localStorage persistence, automatic employee count calculations, dynamic office location management, and comprehensive API integration with status-based UI feedback.

The application prioritizes data consistency (via auto-fill), user experience (via validation and persistence), and maintainability (via clear patterns and documentation). All API communication uses standardized lowercase_underscore field naming, and the application handles various response states with appropriate visual feedback.

For modifications, always preserve the existing functionality unless explicitly changing it, follow the established patterns, and test thoroughly across all steps and validation scenarios.

---

**Last Updated**: November 26, 2025  
**Maintained By**: AI-assisted development  
**Framework**: React + TypeScript + Tailwind CSS  
**Deployment**: Framer iframe embedding
