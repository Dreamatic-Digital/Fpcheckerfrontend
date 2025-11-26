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

// Inline UI Components
const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'default',
  size = 'default',
  disabled = false,
  type = 'button',
  style = {}
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:opacity-90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
  }
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  }

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
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
  required = false
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    min={min}
    max={max}
    required={required}
    className={`flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
)

const Select = ({ value, onValueChange, children, placeholder = '' }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  )
}

const Alert = ({ children, className = '' }) => (
  <div className={`relative w-full rounded-lg border p-4 ${className}`}>
    {children}
  </div>
)

const AlertDescription = ({ children, className = '' }) => (
  <div className={`text-sm ${className}`}>
    {children}
  </div>
)

const Progress = ({ value, className = '' }) => (
  <div className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary ${className}`}>
    <div
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ width: `${value}%` }}
    />
  </div>
)

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80'
  }
  
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}

// Assessment Service for Framer
class FramerAssessmentService {
  constructor(private supabaseUrl?: string, private supabaseKey?: string) {}

  async submitAssessment(assessmentResult: AssessmentResult): Promise<{ success: boolean; assessmentId?: string; error?: string }> {
    try {
      console.log('Submitting assessment:', assessmentResult);
      
      // If Supabase credentials are provided, try to submit to actual backend
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
      
      // Fallback to localStorage
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
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
export default function FramerFitnessCalculatorComplete({
  backgroundColor = "#ffffff",
  primaryColor = "#3b82f6",
  borderRadius = 16,
  showHeader = true,
  headerText = "Fitness Benefits Eligibility Calculator",
  containerHeight = 700,
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

  const dynamicStyles = {
    '--primary-color': primaryColor,
    '--bg-color': backgroundColor,
    '--border-radius': `${borderRadius}px`,
    background: backgroundColor,
    borderRadius: `${borderRadius}px`,
    height: `${containerHeight}px`
  } as React.CSSProperties;

  const progressPercentage = (currentStep / totalSteps) * 100;

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
      <div 
        className="w-full p-6 shadow-lg overflow-auto"
        style={dynamicStyles}
      >
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
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl text-gray-800">Company Information</h3>
            <Input
              value={formData.companyName}
              onChange={(e) => updateFormData({ companyName: e.target.value })}
              placeholder="Company Name"
            />
            <Select
              value={formData.businessType}
              onValueChange={(value) => updateFormData({ businessType: value })}
              placeholder="Select Business Type"
            >
              <option value="privately-held">Privately held</option>
              <option value="public-company">Public company</option>
              <option value="government-agency">Government agency</option>
              <option value="non-profit">Non profit</option>
              <option value="educational">Educational</option>
              <option value="self-owned">Self owned</option>
              <option value="partnership">Partnership</option>
            </Select>
            <Select
              value={formData.industryCategory}
              onValueChange={(value) => updateFormData({ industryCategory: value })}
              placeholder="Select Industry"
            >
              <option value="agriculture">Agriculture, Forestry and Fishing</option>
              <option value="mining">Mining</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="electricity">Electricity, Gas, Water and Waste Services</option>
              <option value="construction">Construction</option>
              <option value="wholesale">Wholesale Trade</option>
              <option value="retail">Retail Trade</option>
              <option value="accommodation">Accommodation and Food Services</option>
              <option value="transport">Transport, Postal and Warehousing</option>
              <option value="information">Information Media and Telecommunications</option>
              <option value="financial">Financial and Insurance Services</option>
              <option value="rental">Rental, Hiring and Real Estate Services</option>
              <option value="professional">Professional, Scientific and Technical Services</option>
              <option value="administrative">Administrative and Support Services</option>
              <option value="public">Public Administration and Safety</option>
              <option value="education">Education and Training</option>
              <option value="healthcare">Health Care and Social Assistance</option>
              <option value="arts">Arts and Recreation Services</option>
              <option value="other-services">Other Services</option>
            </Select>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl text-gray-800">Company Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                value={formData.hqPostalCode}
                onChange={(e) => updateFormData({ hqPostalCode: e.target.value })}
                placeholder="Postal Code"
              />
              <Input
                value={formData.hqCity}
                onChange={(e) => updateFormData({ hqCity: e.target.value })}
                placeholder="City"
              />
            </div>
            <Input
              value={formData.hqState}
              onChange={(e) => updateFormData({ hqState: e.target.value })}
              placeholder="State/Province"
            />
            <Input
              type="number"
              value={formData.hqEmployees}
              onChange={(e) => updateFormData({ hqEmployees: parseInt(e.target.value) || 0 })}
              placeholder="HQ Employee Count"
              min={0}
            />
            
            {/* Office Locations */}
            <div>
              <h4 className="text-lg text-gray-700 mb-2">Other Office Locations (Optional)</h4>
              {formData.offices.map((office, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 mb-2">
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
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl text-gray-800">Employee Information</h3>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Total Employees: {formData.totalEmployees}
              </label>
              <input
                type="range"
                min="1"
                max="1000"
                value={formData.totalEmployees}
                onChange={(e) => updateFormData({ totalEmployees: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${(formData.totalEmployees / 1000) * 100}%, #e5e7eb ${(formData.totalEmployees / 1000) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1</span>
                <span>1000+</span>
              </div>
            </div>
            
            <Select
              value={formData.workforceType}
              onValueChange={(value) => updateFormData({ workforceType: value })}
              placeholder="Select Workforce Type"
            >
              <option value="full-time">Primarily Full-Time (75%+ full-time employees)</option>
              <option value="part-time">Primarily Part-Time (75%+ part-time employees)</option>
              <option value="mixed">Mixed Full-Time & Part-Time</option>
              <option value="contract">Primarily Contract/Freelance</option>
              <option value="seasonal">Seasonal Workers</option>
            </Select>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Communication Strength</label>
              <div className="grid grid-cols-5 gap-2">
                {['None', 'Poor', 'OK', 'Good', 'Great'].map((label, index) => (
                  <Button
                    key={index}
                    variant={formData.communicationStrength === index ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFormData({ communicationStrength: index })}
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
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl text-gray-800">Wellness Goals & Benefits</h3>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Primary Wellness Goals</label>
              <div className="space-y-2">
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
                  <label key={goal.value} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
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
                    />
                    <span className="text-sm">{goal.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Existing Benefits?</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
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
                <label className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
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
                <label className="block text-sm text-gray-700 mb-2">Current Benefits</label>
                <div className="space-y-2">
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
                    <label key={benefit.value} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
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
                      />
                      <span className="text-sm">{benefit.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl text-gray-800">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                value={formData.firstName}
                onChange={(e) => updateFormData({ firstName: e.target.value })}
                placeholder="First Name"
              />
              <Input
                value={formData.lastName}
                onChange={(e) => updateFormData({ lastName: e.target.value })}
                placeholder="Last Name"
              />
            </div>
            <Input
              value={formData.jobTitle}
              onChange={(e) => updateFormData({ jobTitle: e.target.value })}
              placeholder="Job Title"
            />
            <Input
              type="email"
              value={formData.workEmail}
              onChange={(e) => updateFormData({ workEmail: e.target.value })}
              placeholder="Work Email"
            />
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
              placeholder="Phone Number"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="w-full p-6 shadow-lg overflow-auto"
      style={dynamicStyles}
    >
      {/* Restore Data Prompt */}
      {showRestorePrompt && (
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            We found your previous progress. Would you like to continue where you left off?
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                onClick={restoreSavedData}
                style={{ backgroundColor: primaryColor }}
              >
                Continue Previous Session
              </Button>
              <Button size="sm" variant="outline" onClick={startFresh}>
                Start Fresh
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {showHeader && (
        <div className="text-center mb-6">
          <h1 className="text-3xl text-gray-800 mb-2" style={{ color: primaryColor }}>{headerText}</h1>
          <p className="text-gray-600">Help us determine your company's eligibility for our fitness benefits program</p>
          {hasSavedData && !showRestorePrompt && (
            <p className="text-sm text-green-600 mt-2">✓ Your progress is automatically saved</p>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3, 4, 5].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                    step < currentStep
                      ? 'bg-green-500 text-white'
                      : step === currentStep
                      ? 'text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                  style={{ 
                    backgroundColor: step === currentStep ? primaryColor : step < currentStep ? '#10b981' : undefined 
                  }}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                <span
                  className={`ml-2 text-sm transition-colors duration-300 ${
                    step <= currentStep ? '' : 'text-gray-400'
                  }`}
                >
                  {['Company', 'Location', 'Employees', 'Benefits', 'Contact'][step - 1]}
                </span>
              </div>
              {index < 4 && <div className="w-8 h-1 bg-gray-200 rounded"></div>}
            </React.Fragment>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: primaryColor 
            }}
          />
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mb-6 flex-1">
        {renderCurrentStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrev}
          className={currentStep === 1 ? 'invisible' : ''}
        >
          ← Previous
        </Button>
        
        <div className="flex-1"></div>
        
        {currentStep < totalSteps ? (
          <Button
            onClick={handleNext}
            style={{ backgroundColor: primaryColor }}
          >
            Next →
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            Calculate Eligibility
          </Button>
        )}
      </div>
    </div>
  )
}

// Framer property controls
addPropertyControls(FramerFitnessCalculatorComplete, {
  backgroundColor: {
    type: ControlType.Color,
    title: "Background Color",
    defaultValue: "#ffffff"
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
    min: 400,
    max: 1000,
    defaultValue: 700
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