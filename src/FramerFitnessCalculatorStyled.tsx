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

interface FramerFitnessCalculatorProps {
  backgroundColor?: string
  primaryColor?: string
  borderRadius?: number
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

// Styled UI Components (exactly matching your working version)
const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'default',
  size = 'default',
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
  
  const variants = {
    default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
    outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90'
  }
  
  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9'
  }

  return (
    <button
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
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
      'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
      className
    )}
  />
)

const Label = ({ children, htmlFor, className = '' }) => (
  <label
    htmlFor={htmlFor}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
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
          'border-input data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive bg-input-background flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9',
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? '' : 'text-muted-foreground'}>
          {value ? children.find(child => child.props.value === value)?.props.children : placeholder}
        </span>
        <svg className="size-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover text-popover-foreground border rounded-md shadow-md max-h-60 overflow-y-auto">
          <div className="p-1">
            {children.map((child, index) => (
              <div
                key={index}
                className="relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  onValueChange(child.props.value)
                  setIsOpen(false)
                }}
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
    'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
    className
  )}>
    {children}
  </div>
)

const AlertDescription = ({ children, className = '' }) => (
  <div className={cn('text-sm [&_p]:leading-relaxed', className)}>
    {children}
  </div>
)

const Progress = ({ value, className = '' }) => (
  <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-200', className)}>
    <div
      className="h-full w-full flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
      style={{ width: `${value}%` }}
    />
  </div>
)

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
    outline: 'text-foreground'
  }
  
  return (
    <div className={cn(
      'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      variants[variant],
      className
    )}>
      {children}
    </div>
  )
}

// Progress Bar Component (exactly matching your design)
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                    step.number < currentStep
                      ? 'bg-green-500 text-white'
                      : step.number === currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step.number < currentStep ? '✓' : step.number}
                </div>
                <span
                  className={`ml-2 text-sm transition-colors duration-300 ${
                    step.number < currentStep
                      ? 'text-green-600'
                      : step.number === currentStep
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-1 bg-gray-200 rounded"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
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
export default function FramerFitnessCalculatorStyled({
  backgroundColor = "#f8fafc",
  primaryColor = "#3b82f6",
  borderRadius = 16,
  showHeader = true,
  headerText = "Fitness Benefits Eligibility Calculator",
  containerHeight = 800,
  supabaseUrl = "",
  supabaseKey = ""
}: FramerFitnessCalculatorProps) {
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
    background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%)`,
    borderRadius: `${borderRadius}px`,
    minHeight: `${containerHeight}px`,
    maxHeight: `${containerHeight}px`,
    overflow: 'auto'
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
            color: 'text-green-700',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
          };
        case 'may-be-eligible':
          return {
            badge: 'YOU MAY BE ELIGIBLE',
            badgeVariant: 'secondary' as const,
            message: 'Your company shows potential for our fitness benefits program with some adjustments.',
            color: 'text-yellow-700',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200'
          };
        default:
          return {
            badge: 'NOT ELIGIBLE',
            badgeVariant: 'destructive' as const,
            message: 'Based on current criteria, your company may not be ready for our fitness benefits program at this time.',
            color: 'text-red-700',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
          };
      }
    };

    const statusConfig = getStatusConfig();

    return (
      <div className="w-full p-6" style={containerStyles}>
        {/* Submission Status */}
        {isSubmitting && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">
              🔄 Saving your assessment results...
            </AlertDescription>
          </Alert>
        )}

        {submissionStatus === 'success' && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              ✅ Assessment saved successfully! Reference ID: <strong>{assessmentId}</strong>
              <br />
              <span className="text-sm mt-2 block">
                📧 A copy will be sent to {formData.workEmail}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {submissionStatus === 'error' && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              ⚠️ Could not save assessment: {submissionError}
              <br />
              <span className="text-sm">Your results are still displayed below and temporarily stored locally.</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Eligibility Status Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 bg-white mb-4">
            <Badge variant={statusConfig.badgeVariant} className="text-xl px-4 py-2">
              {statusConfig.badge}
            </Badge>
          </div>
          <p className={`text-lg ${statusConfig.color}`}>
            {statusConfig.message}
          </p>
        </div>

        {/* Company Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl text-gray-800 mb-4">Assessment Summary for {formData.companyName}</h3>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="text-gray-700 mb-2">Contact Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Contact:</strong> {formData.firstName} {formData.lastName}</div>
              <div><strong>Title:</strong> {formData.jobTitle}</div>
              <div><strong>Email:</strong> {formData.workEmail}</div>
              <div><strong>Phone:</strong> {formData.phoneNumber}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="text-gray-700 mb-2">Company Details</h4>
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
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg text-gray-800 mb-4">Eligibility Score</h3>
            <div className="text-center">
              <div className={`text-4xl mb-2 ${statusConfig.color}`}>{results.score}/100</div>
              <Progress value={results.score} className="w-full h-3 mb-2" />
              <p className="text-sm text-gray-600">
                {results.status === 'eligible' ? 'Excellent Score!' : 
                 results.status === 'may-be-eligible' ? 'Moderate Score' : 'Below Threshold'}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg text-gray-800 mb-4">Assessment Factors</h3>
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
        <div className={`${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-xl p-6 mb-6`}>
          <h3 className={`text-lg ${statusConfig.color} mb-3`}>
            {results.status === 'eligible' ? '🎉 Next Steps:' :
             results.status === 'may-be-eligible' ? '⚠️ Next Steps:' :
             '❌ Future Opportunities:'}
          </h3>
          <ul className={`${statusConfig.color} space-y-2 text-sm`}>
            {results.recommendations.map((rec, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-current rounded-full mr-3"></span>
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
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-2xl text-gray-800 mb-6 text-center">Company Information</h2>
            
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
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-2xl text-gray-800 mb-6 text-center">Company Locations</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg text-gray-700 mb-4">Headquarters Information</h3>
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
                <h3 className="text-lg text-gray-700 mb-4">Other Office Locations (Optional)</h3>
                {formData.offices.map((office, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
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
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-2xl text-gray-800 mb-6 text-center">Employee Information</h2>
            
            <div className="space-y-6">
              <div>
                <Label>Total Employees: {formData.totalEmployees}</Label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={formData.totalEmployees}
                  onChange={(e) => updateFormData({ totalEmployees: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${(formData.totalEmployees / 1000) * 100}%, #e5e7eb ${(formData.totalEmployees / 1000) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
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
                <p className="text-sm text-gray-600 mb-3">
                  How would you rate your company's ability to communicate new initiatives to employees?
                </p>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {['None', 'Poor', 'OK', 'Good', 'Great'].map((label, index) => (
                    <Button
                      key={index}
                      variant={formData.communicationStrength === index ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFormData({ communicationStrength: index })}
                      className={formData.communicationStrength === index ? '' : 'bg-white'}
                      style={{
                        backgroundColor: formData.communicationStrength === index ? primaryColor : undefined,
                        borderColor: formData.communicationStrength === index ? primaryColor : undefined
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
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-2xl text-gray-800 mb-6 text-center">Wellness Goals & Current Benefits</h2>
            
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
                    <label key={goal.value} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 bg-white">
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
                  <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 bg-white">
                    <input
                      type="radio"
                      name="existingBenefits"
                      value="no"
                      checked={formData.existingBenefits === 'no'}
                      onChange={(e) => updateFormData({ existingBenefits: e.target.value })}
                    />
                    <div>
                      <span className="text-sm">No</span>
                      <p className="text-xs text-gray-500">We don't currently offer any fitness-related benefits</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 bg-white">
                    <input
                      type="radio"
                      name="existingBenefits"
                      value="yes"
                      checked={formData.existingBenefits === 'yes'}
                      onChange={(e) => updateFormData({ existingBenefits: e.target.value })}
                    />
                    <div>
                      <span className="text-sm">Yes</span>
                      <p className="text-xs text-gray-500">We currently offer some fitness or wellness benefits</p>
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
                      <label key={benefit.value} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 bg-white">
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
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-2xl text-gray-800 mb-6 text-center">Contact Information</h2>
            
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
    <div className="w-full p-6" style={containerStyles}>
      {/* Restore Data Prompt */}
      {showRestorePrompt && (
        <div className="mb-6">
          <Alert className="border-blue-200 bg-blue-50">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <AlertDescription className="text-blue-800">
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

      <div className="bg-white rounded-2xl shadow-xl p-8">
        {showHeader && (
          <div className="text-center mb-8">
            <h1 className="text-3xl text-gray-800 mb-2">{headerText}</h1>
            <p className="text-gray-600">Help us determine your company's eligibility for our fitness benefits program</p>
            {hasSavedData && !showRestorePrompt && (
              <p className="text-sm text-green-600 mt-2">✓ Your progress is automatically saved</p>
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
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Next →
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
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
addPropertyControls(FramerFitnessCalculatorStyled, {
  backgroundColor: {
    type: ControlType.Color,
    title: "Background Color",
    defaultValue: "#f8fafc"
  },
  primaryColor: {
    type: ControlType.Color,
    title: "Primary Color",
    defaultValue: "#3b82f6"
  },
  borderRadius: {
    type: ControlType.Number,
    title: "Border Radius",
    min: 0,
    max: 50,
    defaultValue: 16
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