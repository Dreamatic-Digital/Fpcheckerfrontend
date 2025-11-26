import React, { useState, useEffect } from 'react'
import { addPropertyControls, ControlType } from 'framer'

// Types
interface FormData {
  companyName: string;
  businessType: string;
  industryCategory: string;
  hqPostalCode: string;
  hqCity: string;
  hqState: string;
  hqEmployees: number;
  offices: Array<{
    postal: string;
    city: string;
    state: string;
    employees: number;
  }>;
  totalEmployees: number;
  workforceType: string;
  communicationStrength: number;
  wellnessGoals: string[];
  existingBenefits: string;
  currentBenefits: string[];
  firstName: string;
  lastName: string;
  jobTitle: string;
  workEmail: string;
  phoneNumber: string;
}

interface AssessmentResult {
  id?: string;
  formData: FormData;
  eligibilityScore: number;
  eligibilityStatus: 'eligible' | 'may-be-eligible' | 'not-eligible';
  factors: string[];
  recommendations: string[];
  submittedAt: string;
}

interface FramerCalculatorProps {
  backgroundColor?: string
  primaryColor?: string
  showHeader?: boolean
  headerText?: string
  containerHeight?: number
  supabaseUrl?: string
  supabaseKey?: string
}

// Utility function for combining classes
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

// Styled UI Components with exact Tailwind classes
const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'default',
  size = 'default',
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
  }
  
  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md gap-1.5 px-3',
    lg: 'h-10 rounded-md px-6',
    icon: 'size-9 rounded-md'
  }

  return (
    <button
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: variant === 'default' ? '#030213' : undefined,
        color: variant === 'default' ? '#ffffff' : undefined,
        borderColor: variant === 'outline' ? 'rgba(0, 0, 0, 0.1)' : undefined
      }}
    >
      {children}
    </button>
  )
}

const Input = ({ 
  value, 
  onChange, 
  placeholder = '', 
  type = 'text',
  className = '',
  min,
  max,
  required = false,
  id
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    min={min}
    max={max}
    required={required}
    className={cn(
      'flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-[3px]',
      className
    )}
    style={{
      backgroundColor: '#f3f3f5',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      color: '#030213'
    }}
  />
)

const Label = ({ children, htmlFor, className = '' }) => (
  <label
    htmlFor={htmlFor}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    style={{ color: '#030213', fontWeight: '500' }}
  >
    {children}
  </label>
)

const Select = ({ value, onValueChange, children, placeholder = '', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9',
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#f3f3f5',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          color: value ? '#030213' : '#717182'
        }}
      >
        <span>
          {value ? children.find(child => child.props.value === value)?.props.children : placeholder}
        </span>
        <svg className="size-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 z-50 mt-1 border rounded-md shadow-md max-h-60 overflow-y-auto"
          style={{ backgroundColor: '#ffffff', borderColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <div className="p-1">
            {children.map((child, index) => (
              <div
                key={index}
                className="relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  onValueChange(child.props.value)
                  setIsOpen(false)
                }}
                style={{ color: '#030213' }}
              >
                {child.props.children}
                {value === child.props.value && (
                  <span className="absolute right-2 flex size-3.5 items-center justify-center">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const SelectItem = ({ value, children }) => <option value={value}>{children}</option>

const Alert = ({ children, className = '' }) => (
  <div className={cn(
    'relative w-full rounded-lg border px-4 py-3 text-sm',
    className
  )}>
    {children}
  </div>
)

const AlertDescription = ({ children, className = '' }) => (
  <div className={cn('text-sm leading-relaxed', className)}>
    {children}
  </div>
)

const Progress = ({ value, className = '' }) => (
  <div className={cn('relative h-2 w-full overflow-hidden rounded-full', className)} style={{ backgroundColor: '#ececf0' }}>
    <div
      className="h-full w-full flex-1 transition-all duration-500"
      style={{ 
        width: `${value}%`,
        background: 'linear-gradient(to right, #3b82f6, #6366f1)'
      }}
    />
  </div>
)

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: { backgroundColor: '#030213', color: '#ffffff' },
    secondary: { backgroundColor: '#ececf0', color: '#030213' },
    destructive: { backgroundColor: '#d4183d', color: '#ffffff' },
    outline: { backgroundColor: 'transparent', color: '#030213', border: '1px solid rgba(0, 0, 0, 0.1)' }
  }
  
  return (
    <div 
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
      style={variants[variant]}
    >
      {children}
    </div>
  )
}

// Progress Bar Component with exact styling
const ProgressBar = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, label: 'Company' },
    { number: 2, label: 'Locations' },
    { number: 3, label: 'Employees' },
    { number: 4, label: 'Benefits' },
    { number: 5, label: 'Contact' }
  ];

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                  style={{
                    backgroundColor: step.number < currentStep 
                      ? '#10b981' 
                      : step.number === currentStep 
                      ? '#3b82f6' 
                      : '#d1d5db',
                    color: step.number <= currentStep ? '#ffffff' : '#6b7280'
                  }}
                >
                  {step.number < currentStep ? '✓' : step.number}
                </div>
                <span
                  className="ml-2 text-sm transition-colors duration-300"
                  style={{
                    color: step.number < currentStep
                      ? '#059669'
                      : step.number === currentStep
                      ? '#2563eb'
                      : '#9ca3af'
                  }}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-1 rounded" style={{ backgroundColor: '#e5e7eb' }}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="w-full rounded-full h-2" style={{ backgroundColor: '#e5e7eb' }}>
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ 
            width: `${progressPercentage}%`,
            background: 'linear-gradient(to right, #3b82f6, #6366f1)'
          }}
        ></div>
      </div>
    </div>
  );
}

// Assessment Service for Framer
class FramerAssessmentService {
  constructor(private supabaseUrl?: string, private supabaseKey?: string) {}

  async submitAssessment(assessmentResult: AssessmentResult): Promise<{ success: boolean; assessmentId?: string; error?: string }> {
    try {
      console.log('Submitting assessment:', assessmentResult);
      
      if (this.supabaseUrl && this.supabaseKey) {
        try {
          const response = await fetch(`${this.supabaseUrl}/functions/v1/make-server-7dfaec09/assessments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.supabaseKey}`
            },
            body: JSON.stringify(assessmentResult),
          });

          if (response.ok) {
            const data = await response.json();
            return {
              success: true,
              assessmentId: data.id || `assessment_${Date.now()}`
            };
          }
        } catch (error) {
          console.warn('Supabase submission failed, falling back to local storage:', error);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assessmentId = `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.storeLocally(assessmentResult, assessmentId);
      
      return {
        success: true,
        assessmentId
      };
    } catch (error) {
      console.error('Error submitting assessment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private storeLocally(assessmentResult: AssessmentResult, assessmentId: string) {
    try {
      const assessments = this.getLocalAssessments();
      const newAssessment = { ...assessmentResult, id: assessmentId };
      assessments.push(newAssessment);
      
      localStorage.setItem('fitness-assessments', JSON.stringify(assessments));
    } catch (error) {
      console.error('Error storing assessment locally:', error);
    }
  }

  getLocalAssessments(): AssessmentResult[] {
    try {
      const stored = localStorage.getItem('fitness-assessments');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving local assessments:', error);
      return [];
    }
  }
}

// Main Component
export default function FramerCalculatorFinalStyled({
  backgroundColor = "#f1f5f9",
  primaryColor = "#3b82f6",
  showHeader = true,
  headerText = "Fitness Benefits Eligibility Calculator",
  containerHeight = 800,
  supabaseUrl = "",
  supabaseKey = ""
}: FramerCalculatorProps) {
  const initialFormData: FormData = {
    companyName: '',
    businessType: '',
    industryCategory: '',
    hqPostalCode: '',
    hqCity: '',
    hqState: '',
    hqEmployees: 0,
    offices: [],
    totalEmployees: 50,
    workforceType: '',
    communicationStrength: -1,
    wellnessGoals: [],
    existingBenefits: '',
    currentBenefits: [],
    firstName: '',
    lastName: '',
    jobTitle: '',
    workEmail: '',
    phoneNumber: ''
  };

  const STORAGE_KEYS = {
    FORM_DATA: 'fitness-calculator-form-data',
    CURRENT_STEP: 'fitness-calculator-current-step',
    HAS_SAVED_DATA: 'fitness-calculator-has-saved-data'
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showResults, setShowResults] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [submissionError, setSubmissionError] = useState<string>('');
  const totalSteps = 5;

  const assessmentService = new FramerAssessmentService(supabaseUrl, supabaseKey);

  // Load saved data on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
    const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
    const hasSaved = localStorage.getItem(STORAGE_KEYS.HAS_SAVED_DATA);

    if (savedFormData && savedStep && hasSaved === 'true') {
      try {
        const parsedData = JSON.parse(savedFormData);
        const isDataMeaningful = parsedData.companyName || parsedData.businessType || 
          parsedData.firstName || parsedData.workEmail;
        
        if (isDataMeaningful) {
          setHasSavedData(true);
          setShowRestorePrompt(true);
        }
      } catch (error) {
        console.error('Error parsing saved form data:', error);
        clearSavedData();
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const isDataMeaningful = formData.companyName || formData.businessType || 
      formData.firstName || formData.workEmail;
    
    if (isDataMeaningful) {
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep.toString());
      localStorage.setItem(STORAGE_KEYS.HAS_SAVED_DATA, 'true');
    }
  }, [formData, currentStep]);

  const clearSavedData = () => {
    localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
    localStorage.removeItem(STORAGE_KEYS.HAS_SAVED_DATA);
    setHasSavedData(false);
    setShowRestorePrompt(false);
  };

  const restoreSavedData = () => {
    const savedFormData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
    const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);

    if (savedFormData && savedStep) {
      try {
        const parsedData = JSON.parse(savedFormData);
        const parsedStep = parseInt(savedStep, 10);
        
        setFormData(parsedData);
        setCurrentStep(parsedStep);
        setShowRestorePrompt(false);
      } catch (error) {
        console.error('Error restoring saved data:', error);
        clearSavedData();
      }
    }
  };

  const startFresh = () => {
    clearSavedData();
    setFormData(initialFormData);
    setCurrentStep(1);
    setShowResults(false);
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.companyName && formData.businessType && formData.industryCategory);
      case 2:
        return !!(formData.hqPostalCode && formData.hqCity && formData.hqState && formData.hqEmployees >= 0);
      case 3:
        return !!(formData.workforceType && formData.communicationStrength >= 0);
      case 4:
        return !!formData.existingBenefits;
      case 5:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !!(
          formData.firstName && 
          formData.lastName && 
          formData.jobTitle && 
          emailRegex.test(formData.workEmail) && 
          formData.phoneNumber
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      alert('Please fill in all required fields before continuing.');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      setShowResults(true);
      clearSavedData();
    } else {
      alert('Please fill in all required fields before submitting.');
    }
  };

  const handleStartOver = () => {
    startFresh();
  };

  const calculateEligibility = () => {
    let score = 0;
    const factors: string[] = [];
    let status: 'eligible' | 'may-be-eligible' | 'not-eligible' = 'not-eligible';

    // Employee count scoring
    if (formData.totalEmployees >= 100) {
      score += 30;
      factors.push('✅ Large employee base (100+ employees) - Excellent fit');
    } else if (formData.totalEmployees >= 50) {
      score += 20;
      factors.push('✅ Medium employee base (50-99 employees) - Good fit');
    } else if (formData.totalEmployees >= 25) {
      score += 15;
      factors.push('✅ Small-medium employee base (25-49 employees) - Suitable');
    } else if (formData.totalEmployees >= 10) {
      score += 8;
      factors.push('⚠️ Small employee base (10-24 employees) - May require customized approach');
    } else {
      score += 2;
      factors.push('❌ Very small employee base (under 10) - Limited program viability');
    }

    // Workforce type scoring
    if (formData.workforceType === 'full-time' || formData.workforceType === 'mixed') {
      score += 20;
      factors.push('✅ Full-time workforce - High engagement potential');
    } else if (formData.workforceType === 'part-time') {
      score += 12;
      factors.push('⚠️ Part-time workforce - May need flexible options');
    } else {
      score += 5;
      factors.push('❌ Contract/seasonal workforce - Limited program engagement');
    }

    // Multiple locations
    if (formData.offices.length > 0) {
      score += 15;
      factors.push(`✅ Multiple locations (${formData.offices.length + 1} total) - Good coverage opportunity`);
    }

    // Communication strength
    if (formData.communicationStrength >= 3) {
      score += 15;
      factors.push('✅ Good/Great internal communication - High program adoption potential');
    } else if (formData.communicationStrength === 2) {
      score += 10;
      factors.push('✅ OK internal communication - Solid program adoption potential');
    } else if (formData.communicationStrength === 1) {
      score += 5;
      factors.push('⚠️ Poor communication - May need enhanced rollout support');
    } else {
      score += 0;
      factors.push('❌ No communication structure - Significant implementation challenges');
    }

    // Wellness goals alignment
    if (formData.wellnessGoals.length >= 4) {
      score += 20;
      factors.push('✅ Multiple wellness objectives - Comprehensive program needed');
    } else if (formData.wellnessGoals.length >= 2) {
      score += 15;
      factors.push('✅ Clear wellness objectives - Targeted program approach');
    } else if (formData.wellnessGoals.length === 1) {
      score += 8;
      factors.push('⚠️ Limited wellness objectives - Basic program may suffice');
    } else {
      score += 0;
      factors.push('❌ No clear wellness objectives - Program goals unclear');
    }

    // Existing benefits
    if (formData.existingBenefits === 'no') {
      score += 25;
      factors.push('✅ No existing fitness benefits - Great opportunity for impact');
    } else {
      score += 10;
      factors.push(`✅ Current benefits: ${formData.currentBenefits.length} programs - Integration approach needed`);
    }

    // Business type considerations
    if (['privately-held', 'public-company', 'educational'].includes(formData.businessType)) {
      score += 10;
      factors.push('✅ Business structure supports employee benefits');
    } else if (['government-agency', 'non-profit'].includes(formData.businessType)) {
      score += 5;
      factors.push('⚠️ Business structure may have budget constraints');
    }

    // Determine eligibility status based on score
    const recommendations: string[] = [];
    if (score >= 75) {
      status = 'eligible';
      recommendations.push('Full wellness integration approach');
      recommendations.push('Multi-location rollout strategy');
      recommendations.push('Executive wellness program add-on');
      recommendations.push('Comprehensive employee engagement plan');
    } else if (score >= 45) {
      status = 'may-be-eligible';
      recommendations.push('Core fitness benefits implementation');
      recommendations.push('Phased implementation approach');
      recommendations.push('Employee engagement workshops');
      recommendations.push('Pilot program for key locations');
    } else {
      status = 'not-eligible';
      recommendations.push('Consider improving internal communication first');
      recommendations.push('Develop clear wellness objectives');
      recommendations.push('Start with basic wellness initiatives');
      recommendations.push('Re-evaluate when company grows or structure changes');
    }

    return { score, status, factors, recommendations };
  };

  // Submit assessment when results are shown
  useEffect(() => {
    if (showResults) {
      const submitAssessment = async () => {
        setIsSubmitting(true);
        
        const results = calculateEligibility();
        const assessmentData: AssessmentResult = {
          formData,
          eligibilityScore: results.score,
          eligibilityStatus: results.status,
          factors: results.factors,
          recommendations: results.recommendations,
          submittedAt: new Date().toISOString()
        };

        try {
          const response = await assessmentService.submitAssessment(assessmentData);
          
          if (response.success && response.assessmentId) {
            setSubmissionStatus('success');
            setAssessmentId(response.assessmentId);
          } else {
            setSubmissionStatus('error');
            setSubmissionError(response.error || 'Failed to save assessment');
          }
        } catch (error) {
          setSubmissionStatus('error');
          setSubmissionError('Network error occurred while saving assessment');
        } finally {
          setIsSubmitting(false);
        }
      };

      submitAssessment();
    }
  }, [showResults]);

  const containerStyles = {
    background: `linear-gradient(135deg, ${backgroundColor} 0%, #e0e7ff 100%)`,
    minHeight: `${containerHeight}px`,
    maxHeight: `${containerHeight}px`,
    overflow: 'auto',
    padding: '2rem'
  };

  // Results View
  if (showResults) {
    const results = calculateEligibility();
    const communicationLabels = { 0: 'None', 1: 'Poor', 2: 'OK', 3: 'Good', 4: 'Great' };

    const getStatusConfig = () => {
      switch (results.status) {
        case 'eligible':
          return {
            badge: 'ELIGIBLE',
            badgeVariant: 'default' as const,
            message: 'Congratulations! Your company is an excellent candidate for our fitness benefits program.',
            color: '#059669',
            bgColor: '#f0fdf4',
            borderColor: '#bbf7d0'
          };
        case 'may-be-eligible':
          return {
            badge: 'YOU MAY BE ELIGIBLE',
            badgeVariant: 'secondary' as const,
            message: 'Your company shows potential for our fitness benefits program with some adjustments.',
            color: '#d97706',
            bgColor: '#fffbeb',
            borderColor: '#fed7aa'
          };
        default:
          return {
            badge: 'NOT ELIGIBLE',
            badgeVariant: 'destructive' as const,
            message: 'Based on current criteria, your company may not be ready for our fitness benefits program at this time.',
            color: '#dc2626',
            bgColor: '#fef2f2',
            borderColor: '#fecaca'
          };
      }
    };

    const statusConfig = getStatusConfig();

    return (
      <div className="w-full" style={containerStyles}>
        {/* Submission Status */}
        {isSubmitting && (
          <Alert className="mb-6" style={{ borderColor: '#bfdbfe', backgroundColor: '#eff6ff' }}>
            <AlertDescription style={{ color: '#1e40af' }}>
              🔄 Saving your assessment results...
            </AlertDescription>
          </Alert>
        )}

        {submissionStatus === 'success' && (
          <Alert className="mb-6" style={{ borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }}>
            <AlertDescription style={{ color: '#059669' }}>
              ✅ Assessment saved successfully! Reference ID: <strong>{assessmentId}</strong>
              <br />
              <span className="text-sm mt-2 block">
                📧 A copy will be sent to {formData.workEmail}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {submissionStatus === 'error' && (
          <Alert className="mb-6" style={{ borderColor: '#fecaca', backgroundColor: '#fef2f2' }}>
            <AlertDescription style={{ color: '#dc2626' }}>
              ⚠️ Could not save assessment: {submissionError}
              <br />
              <span className="text-sm">Your results are still displayed below and temporarily stored locally.</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Eligibility Status Header */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-4"
            style={{ backgroundColor: '#ffffff', border: '2px solid #e5e7eb' }}
          >
            <Badge variant={statusConfig.badgeVariant} className="text-xl px-4 py-2">
              {statusConfig.badge}
            </Badge>
          </div>
          <p className="text-lg" style={{ color: statusConfig.color }}>
            {statusConfig.message}
          </p>
        </div>

        {/* Company Summary */}
        <div 
          className="rounded-xl p-6 mb-6"
          style={{ 
            background: 'linear-gradient(to right, #eff6ff, #e0e7ff)', 
            border: '1px solid #bfdbfe' 
          }}
        >
          <h3 className="text-xl mb-4" style={{ color: '#1f2937' }}>
            Assessment Summary for {formData.companyName}
          </h3>
          
          <div className="mb-4 rounded-lg p-4" style={{ backgroundColor: '#ffffff' }}>
            <h4 className="mb-2" style={{ color: '#374151' }}>Contact Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Contact:</strong> {formData.firstName} {formData.lastName}</div>
              <div><strong>Title:</strong> {formData.jobTitle}</div>
              <div><strong>Email:</strong> {formData.workEmail}</div>
              <div><strong>Phone:</strong> {formData.phoneNumber}</div>
            </div>
          </div>

          <div className="rounded-lg p-4" style={{ backgroundColor: '#ffffff' }}>
            <h4 className="mb-2" style={{ color: '#374151' }}>Company Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Employees:</strong> {formData.totalEmployees}</div>
              <div><strong>Business Type:</strong> {formData.businessType}</div>
              <div><strong>Industry:</strong> {formData.industryCategory}</div>
              <div><strong>Workforce:</strong> {formData.workforceType}</div>
              <div><strong>Communication:</strong> {communicationLabels[formData.communicationStrength as keyof typeof communicationLabels]}</div>
              <div><strong>Goals:</strong> {formData.wellnessGoals.length}</div>
            </div>
          </div>
        </div>

        {/* Score and Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="rounded-xl p-6" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <h3 className="text-lg mb-4" style={{ color: '#1f2937' }}>Eligibility Score</h3>
            <div className="text-center">
              <div className="text-4xl mb-2" style={{ color: statusConfig.color }}>{results.score}/100</div>
              <Progress value={results.score} className="w-full h-3 mb-2" />
              <p className="text-sm" style={{ color: '#6b7280' }}>
                {results.status === 'eligible' ? 'Excellent Score!' : 
                 results.status === 'may-be-eligible' ? 'Moderate Score' : 'Below Threshold'}
              </p>
            </div>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <h3 className="text-lg mb-4" style={{ color: '#1f2937' }}>Assessment Factors</h3>
            <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
              {results.factors.map((factor, index) => (
                <div key={index} className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div 
          className="rounded-xl p-6 mb-6"
          style={{ 
            backgroundColor: statusConfig.bgColor, 
            border: `1px solid ${statusConfig.borderColor}` 
          }}
        >
          <h3 className="text-lg mb-3" style={{ color: statusConfig.color }}>
            {results.status === 'eligible' ? '🎉 Next Steps:' :
             results.status === 'may-be-eligible' ? '⚠️ Next Steps:' :
             '❌ Future Opportunities:'}
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: statusConfig.color }}>
            {results.recommendations.map((rec, index) => (
              <li key={index} className="flex items-center">
                <span 
                  className="w-2 h-2 rounded-full mr-3"
                  style={{ backgroundColor: statusConfig.color }}
                ></span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Button onClick={handleStartOver} variant="outline">
            Start New Assessment
          </Button>
        </div>
      </div>
    );
  }

  // Form Steps
  const renderCurrentStep = () => {
    const businessTypes = [
      { value: 'privately-held', label: 'Privately held' },
      { value: 'public-company', label: 'Public company' },
      { value: 'government-agency', label: 'Government agency' },
      { value: 'non-profit', label: 'Non profit' },
      { value: 'educational', label: 'Educational' },
      { value: 'self-owned', label: 'Self owned' },
      { value: 'partnership', label: 'Partnership' }
    ];

    const industries = [
      { value: 'agriculture', label: 'Agriculture, Forestry and Fishing' },
      { value: 'mining', label: 'Mining' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'electricity', label: 'Electricity, Gas, Water and Waste Services' },
      { value: 'construction', label: 'Construction' },
      { value: 'wholesale', label: 'Wholesale Trade' },
      { value: 'retail', label: 'Retail Trade' },
      { value: 'accommodation', label: 'Accommodation and Food Services' },
      { value: 'transport', label: 'Transport, Postal and Warehousing' },
      { value: 'information', label: 'Information Media and Telecommunications' },
      { value: 'financial', label: 'Financial and Insurance Services' },
      { value: 'rental', label: 'Rental, Hiring and Real Estate Services' },
      { value: 'professional', label: 'Professional, Scientific and Technical Services' },
      { value: 'administrative', label: 'Administrative and Support Services' },
      { value: 'public', label: 'Public Administration and Safety' },
      { value: 'education', label: 'Education and Training' },
      { value: 'healthcare', label: 'Health Care and Social Assistance' },
      { value: 'arts', label: 'Arts and Recreation Services' },
      { value: 'other-services', label: 'Other Services' }
    ];

    switch (currentStep) {
      case 1:
        return (
          <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafb' }}>
            <h2 className="text-2xl mb-6 text-center" style={{ color: '#1f2937' }}>Company Information</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormData({ companyName: e.target.value })}
                  placeholder="Enter your company name"
                  className="mt-2"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select 
                    value={formData.businessType} 
                    onValueChange={(value) => updateFormData({ businessType: value })}
                    placeholder="Select your business type"
                    className="mt-2"
                  >
                    {businessTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="industryCategory">Industry Category (ABS)</Label>
                  <Select 
                    value={formData.industryCategory} 
                    onValueChange={(value) => updateFormData({ industryCategory: value })}
                    placeholder="Select your industry"
                    className="mt-2"
                  >
                    {industries.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafb' }}>
            <h2 className="text-2xl mb-6 text-center" style={{ color: '#1f2937' }}>Company Locations</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-4" style={{ color: '#374151' }}>Headquarters Information</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="hqPostalCode">Postal Code</Label>
                    <Input
                      id="hqPostalCode"
                      value={formData.hqPostalCode}
                      onChange={(e) => updateFormData({ hqPostalCode: e.target.value })}
                      placeholder="Postal code"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hqCity">City</Label>
                    <Input
                      id="hqCity"
                      value={formData.hqCity}
                      onChange={(e) => updateFormData({ hqCity: e.target.value })}
                      placeholder="City"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hqState">State/Province</Label>
                    <Input
                      id="hqState"
                      value={formData.hqState}
                      onChange={(e) => updateFormData({ hqState: e.target.value })}
                      placeholder="State/Province"
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="hqEmployees">Number of HQ Employees</Label>
                  <Input
                    id="hqEmployees"
                    type="number"
                    value={formData.hqEmployees}
                    onChange={(e) => updateFormData({ hqEmployees: parseInt(e.target.value) || 0 })}
                    placeholder="Number of employees at headquarters"
                    min={0}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Office Locations */}
              <div>
                <h3 className="text-lg mb-4" style={{ color: '#374151' }}>Other Office Locations (Optional)</h3>
                {formData.offices.map((office, index) => (
                  <div key={index} className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      <Input
                        value={office.postal}
                        onChange={(e) => {
                          const newOffices = [...formData.offices];
                          newOffices[index] = { ...newOffices[index], postal: e.target.value };
                          updateFormData({ offices: newOffices });
                        }}
                        placeholder="Postal Code"
                      />
                      <Input
                        value={office.city}
                        onChange={(e) => {
                          const newOffices = [...formData.offices];
                          newOffices[index] = { ...newOffices[index], city: e.target.value };
                          updateFormData({ offices: newOffices });
                        }}
                        placeholder="City"
                      />
                      <Input
                        value={office.state}
                        onChange={(e) => {
                          const newOffices = [...formData.offices];
                          newOffices[index] = { ...newOffices[index], state: e.target.value };
                          updateFormData({ offices: newOffices });
                        }}
                        placeholder="State"
                      />
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          value={office.employees}
                          onChange={(e) => {
                            const newOffices = [...formData.offices];
                            newOffices[index] = { ...newOffices[index], employees: parseInt(e.target.value) || 0 };
                            updateFormData({ offices: newOffices });
                          }}
                          placeholder="Employees"
                          min={0}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newOffices = formData.offices.filter((_, i) => i !== index);
                            updateFormData({ offices: newOffices });
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateFormData({
                      offices: [...formData.offices, { postal: '', city: '', state: '', employees: 0 }]
                    });
                  }}
                >
                  + Add Office Location
                </Button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafb' }}>
            <h2 className="text-2xl mb-6 text-center" style={{ color: '#1f2937' }}>Employee Information</h2>
            
            <div className="space-y-6">
              <div>
                <Label>Total Employees: {formData.totalEmployees}</Label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={formData.totalEmployees}
                  onChange={(e) => updateFormData({ totalEmployees: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer mt-2"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${(formData.totalEmployees / 1000) * 100}%, #e5e7eb ${(formData.totalEmployees / 1000) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-sm mt-1" style={{ color: '#6b7280' }}>
                  <span>1</span>
                  <span>1000+</span>
                </div>
              </div>
              
              <div>
                <Label>Workforce Type</Label>
                <Select
                  value={formData.workforceType}
                  onValueChange={(value) => updateFormData({ workforceType: value })}
                  placeholder="Select workforce type"
                  className="mt-2"
                >
                  <SelectItem value="full-time">Primarily Full-Time (75%+ full-time employees)</SelectItem>
                  <SelectItem value="part-time">Primarily Part-Time (75%+ part-time employees)</SelectItem>
                  <SelectItem value="mixed">Mixed Full-Time & Part-Time</SelectItem>
                  <SelectItem value="contract">Primarily Contract/Freelance</SelectItem>
                  <SelectItem value="seasonal">Seasonal Workers</SelectItem>
                </Select>
              </div>
              
              <div>
                <Label>Internal Communication Strength</Label>
                <p className="text-sm mb-3" style={{ color: '#6b7280' }}>
                  How would you rate your company's ability to communicate new initiatives to employees?
                </p>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {['None', 'Poor', 'OK', 'Good', 'Great'].map((label, index) => (
                    <Button
                      key={index}
                      variant={formData.communicationStrength === index ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFormData({ communicationStrength: index })}
                      style={{
                        backgroundColor: formData.communicationStrength === index ? primaryColor : '#ffffff',
                        color: formData.communicationStrength === index ? '#ffffff' : '#030213',
                        borderColor: formData.communicationStrength === index ? primaryColor : 'rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafb' }}>
            <h2 className="text-2xl mb-6 text-center" style={{ color: '#1f2937' }}>Wellness Goals & Current Benefits</h2>
            
            <div className="space-y-6">
              <div>
                <Label>What are your primary wellness goals? (Select all that apply)</Label>
                <div className="space-y-2 mt-3">
                  {[
                    { value: 'improve-engagement', label: 'Improve engagement' },
                    { value: 'address-stress', label: 'Address stress, fatigue and burnout' },
                    { value: 'boost-retention', label: 'Boost employee retention' },
                    { value: 'enhance-recruitment', label: 'Enhance talent recruitment' },
                    { value: 'work-life-balance', label: 'Improve work-life balance' },
                    { value: 'company-culture', label: 'Strengthen company culture' },
                    { value: 'corporate-requirements', label: 'Meet corporate wellness requirements' },
                    { value: 'demonstrate-care', label: 'Demonstrate employee care and values' }
                  ].map((goal) => (
                    <label 
                      key={goal.value} 
                      className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer"
                      style={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb',
                        ':hover': { backgroundColor: '#f9fafb' }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.wellnessGoals.includes(goal.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData({ wellnessGoals: [...formData.wellnessGoals, goal.value] });
                          } else {
                            updateFormData({ wellnessGoals: formData.wellnessGoals.filter(g => g !== goal.value) });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{goal.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Do you currently offer any fitness or wellness benefits to your employees?</Label>
                <div className="space-y-2 mt-3">
                  <label 
                    className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer"
                    style={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <input
                      type="radio"
                      name="existingBenefits"
                      value="no"
                      checked={formData.existingBenefits === 'no'}
                      onChange={(e) => updateFormData({ existingBenefits: e.target.value })}
                    />
                    <div>
                      <span className="text-sm">No</span>
                      <p className="text-xs" style={{ color: '#6b7280' }}>We don't currently offer any fitness-related benefits</p>
                    </div>
                  </label>
                  <label 
                    className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer"
                    style={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <input
                      type="radio"
                      name="existingBenefits"
                      value="yes"
                      checked={formData.existingBenefits === 'yes'}
                      onChange={(e) => updateFormData({ existingBenefits: e.target.value })}
                    />
                    <div>
                      <span className="text-sm">Yes</span>
                      <p className="text-xs" style={{ color: '#6b7280' }}>We currently offer some fitness or wellness benefits</p>
                    </div>
                  </label>
                </div>
              </div>
              
              {formData.existingBenefits === 'yes' && (
                <div>
                  <Label>Which benefits do you currently offer? (Select all that apply)</Label>
                  <div className="space-y-2 mt-3">
                    {[
                      { value: 'corporate-fitness', label: 'Corporate fitness benefit' },
                      { value: 'gym-reimbursement', label: 'Gym membership reimbursement' },
                      { value: 'onsite-facilities', label: 'On-site fitness facilities' },
                      { value: 'health-screenings', label: 'Health screenings' },
                      { value: 'eap-mental-health', label: 'EAP and mental health support' },
                      { value: 'nutrition-programs', label: 'Nutrition programs' },
                      { value: 'health-coaching', label: 'Health coaching' },
                      { value: 'other-wellbeing', label: 'Other wellbeing initiatives' }
                    ].map((benefit) => (
                      <label 
                        key={benefit.value} 
                        className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer"
                        style={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.currentBenefits.includes(benefit.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateFormData({ currentBenefits: [...formData.currentBenefits, benefit.value] });
                            } else {
                              updateFormData({ currentBenefits: formData.currentBenefits.filter(b => b !== benefit.value) });
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{benefit.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafb' }}>
            <h2 className="text-2xl mb-6 text-center" style={{ color: '#1f2937' }}>Contact Information</h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData({ firstName: e.target.value })}
                    placeholder="Your first name"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData({ lastName: e.target.value })}
                    placeholder="Your last name"
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => updateFormData({ jobTitle: e.target.value })}
                  placeholder="Your job title"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="workEmail">Work Email</Label>
                <Input
                  id="workEmail"
                  type="email"
                  value={formData.workEmail}
                  onChange={(e) => updateFormData({ workEmail: e.target.value })}
                  placeholder="your.email@company.com"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
                  placeholder="Your phone number"
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full" style={containerStyles}>
      {/* Restore Data Prompt */}
      {showRestorePrompt && (
        <div className="mb-6">
          <Alert style={{ borderColor: '#bfdbfe', backgroundColor: '#eff6ff' }}>
            <svg className="h-4 w-4" style={{ color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <AlertDescription style={{ color: '#1e40af' }}>
              We found your previous progress. Would you like to continue where you left off?
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={restoreSavedData} style={{ backgroundColor: primaryColor }}>
                  Continue Previous Session
                </Button>
                <Button size="sm" variant="outline" onClick={startFresh}>
                  Start Fresh
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="rounded-2xl p-8" style={{ backgroundColor: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        {showHeader && (
          <div className="text-center mb-8">
            <h1 className="text-3xl mb-2" style={{ color: '#1f2937' }}>{headerText}</h1>
            <p style={{ color: '#6b7280' }}>Help us determine your company's eligibility for our fitness benefits program</p>
            {hasSavedData && !showRestorePrompt && (
              <p className="text-sm mt-2" style={{ color: '#059669' }}>✓ Your progress is automatically saved</p>
            )}
          </div>
        )}

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <div className="mt-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            ← Previous
          </Button>
          
          <div className="flex-1"></div>
          
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              style={{ 
                background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                color: '#ffffff'
              }}
            >
              Next →
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              style={{ 
                background: 'linear-gradient(to right, #059669, #047857)',
                color: '#ffffff',
                transform: 'scale(1)',
                transition: 'all 0.2s',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            >
              Calculate Eligibility
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Framer property controls
addPropertyControls(FramerCalculatorFinalStyled, {
  backgroundColor: {
    type: ControlType.Color,
    title: "Background Color",
    defaultValue: "#f1f5f9"
  },
  primaryColor: {
    type: ControlType.Color,
    title: "Primary Color",
    defaultValue: "#3b82f6"
  },
  showHeader: {
    type: ControlType.Boolean,
    title: "Show Header",
    defaultValue: true
  },
  headerText: {
    type: ControlType.String,
    title: "Header Text",
    defaultValue: "Fitness Benefits Eligibility Calculator"
  },
  containerHeight: {
    type: ControlType.Number,
    title: "Container Height",
    min: 600,
    max: 1200,
    defaultValue: 800
  },
  supabaseUrl: {
    type: ControlType.String,
    title: "Supabase URL",
    defaultValue: ""
  },
  supabaseKey: {
    type: ControlType.String,
    title: "Supabase Anon Key",
    defaultValue: ""
  }
})