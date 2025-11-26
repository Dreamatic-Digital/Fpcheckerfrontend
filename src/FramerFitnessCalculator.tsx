import React, { useState, useEffect } from 'react'
import { addPropertyControls, ControlType } from 'framer'

// Simplified inline components for Framer compatibility
interface FormData {
  companyName: string;
  businessType: string;
  industryCategory: string;
  hqPostalCode: string;
  hqCity: string;
  hqState: string;
  hqEmployees: number;
  totalEmployees: number;
  workforceType: string;
  communicationStrength: number;
  wellnessGoals: string[];
  existingBenefits: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  workEmail: string;
  phoneNumber: string;
}

interface FramerFitnessCalculatorProps {
  backgroundColor?: string
  primaryColor?: string
  borderRadius?: number
  showHeader?: boolean
  headerText?: string
  containerHeight?: number
}

const initialFormData: FormData = {
  companyName: '',
  businessType: '',
  industryCategory: '',
  hqPostalCode: '',
  hqCity: '',
  hqState: '',
  hqEmployees: 0,
  totalEmployees: 50,
  workforceType: '',
  communicationStrength: -1,
  wellnessGoals: [],
  existingBenefits: '',
  firstName: '',
  lastName: '',
  jobTitle: '',
  workEmail: '',
  phoneNumber: ''
}

export default function FramerFitnessCalculator({
  backgroundColor = "#ffffff",
  primaryColor = "#3b82f6",
  borderRadius = 16,
  showHeader = true,
  headerText = "Fitness Benefits Eligibility Calculator",
  containerHeight = 600
}: FramerFitnessCalculatorProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [showResults, setShowResults] = useState(false)
  const totalSteps = 5

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.companyName && formData.businessType && formData.industryCategory)
      case 2:
        return !!(formData.hqPostalCode && formData.hqCity && formData.hqState)
      case 3:
        return !!(formData.workforceType && formData.communicationStrength >= 0)
      case 4:
        return !!formData.existingBenefits
      case 5:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !!(formData.firstName && formData.lastName && formData.jobTitle && emailRegex.test(formData.workEmail))
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1)
      }
    } else {
      alert('Please fill in all required fields before continuing.')
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      setShowResults(true)
    } else {
      alert('Please fill in all required fields before submitting.')
    }
  }

  const handleStartOver = () => {
    setFormData(initialFormData)
    setCurrentStep(1)
    setShowResults(false)
  }

  const calculateResults = () => {
    let score = 0
    let status = 'not-eligible'
    
    // Simplified scoring
    if (formData.totalEmployees >= 100) score += 30
    else if (formData.totalEmployees >= 50) score += 20
    else if (formData.totalEmployees >= 25) score += 15
    else score += 5
    
    if (formData.workforceType === 'full-time' || formData.workforceType === 'mixed') score += 20
    if (formData.communicationStrength >= 3) score += 15
    if (formData.wellnessGoals.length >= 2) score += 15
    if (formData.existingBenefits === 'no') score += 20
    
    if (score >= 75) status = 'eligible'
    else if (score >= 45) status = 'may-be-eligible'
    
    return { score, status }
  }

  const dynamicStyles = {
    '--primary-color': primaryColor,
    '--bg-color': backgroundColor,
    '--border-radius': `${borderRadius}px`,
    background: backgroundColor,
    borderRadius: `${borderRadius}px`,
    height: `${containerHeight}px`
  } as React.CSSProperties

  const progressPercentage = (currentStep / totalSteps) * 100

  if (showResults) {
    const results = calculateResults()
    return (
      <div 
        className="w-full p-6 shadow-lg overflow-auto"
        style={dynamicStyles}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Assessment Results</h2>
          <div className={`text-4xl font-bold mb-4 ${results.status === 'eligible' ? 'text-green-600' : results.status === 'may-be-eligible' ? 'text-yellow-600' : 'text-red-600'}`}>
            {results.score}/100
          </div>
          <div className={`inline-block px-4 py-2 rounded-full text-white ${results.status === 'eligible' ? 'bg-green-500' : results.status === 'may-be-eligible' ? 'bg-yellow-500' : 'bg-red-500'}`}>
            {results.status === 'eligible' ? 'ELIGIBLE' : results.status === 'may-be-eligible' ? 'MAY BE ELIGIBLE' : 'NOT ELIGIBLE'}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Company: {formData.companyName}</h3>
          <p>Contact: {formData.firstName} {formData.lastName}</p>
          <p>Email: {formData.workEmail}</p>
          <p>Employees: {formData.totalEmployees}</p>
        </div>

        <button 
          onClick={handleStartOver}
          className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Start New Assessment
        </button>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Company Information</h3>
            <input
              type="text"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={(e) => updateFormData({ companyName: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <select
              value={formData.businessType}
              onChange={(e) => updateFormData({ businessType: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Business Type</option>
              <option value="privately-held">Privately held</option>
              <option value="public-company">Public company</option>
              <option value="government-agency">Government agency</option>
              <option value="non-profit">Non profit</option>
            </select>
            <select
              value={formData.industryCategory}
              onChange={(e) => updateFormData({ industryCategory: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Industry</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail</option>
            </select>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Company Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Postal Code"
                value={formData.hqPostalCode}
                onChange={(e) => updateFormData({ hqPostalCode: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="City"
                value={formData.hqCity}
                onChange={(e) => updateFormData({ hqCity: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <input
              type="text"
              placeholder="State/Province"
              value={formData.hqState}
              onChange={(e) => updateFormData({ hqState: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="HQ Employee Count"
              value={formData.hqEmployees}
              onChange={(e) => updateFormData({ hqEmployees: parseInt(e.target.value) || 0 })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Employee Information</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Total Employees: {formData.totalEmployees}</label>
              <input
                type="range"
                min="1"
                max="1000"
                value={formData.totalEmployees}
                onChange={(e) => updateFormData({ totalEmployees: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <select
              value={formData.workforceType}
              onChange={(e) => updateFormData({ workforceType: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Workforce Type</option>
              <option value="full-time">Primarily Full-Time</option>
              <option value="part-time">Primarily Part-Time</option>
              <option value="mixed">Mixed Full-Time & Part-Time</option>
              <option value="contract">Primarily Contract/Freelance</option>
            </select>
            <div>
              <label className="block text-sm font-medium mb-2">Communication Strength</label>
              <div className="grid grid-cols-5 gap-2">
                {['None', 'Poor', 'OK', 'Good', 'Great'].map((label, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => updateFormData({ communicationStrength: index })}
                    className={`p-2 rounded text-sm ${formData.communicationStrength === index ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Wellness Goals</h3>
            <div className="space-y-2">
              {['improve-engagement', 'address-stress', 'boost-retention', 'work-life-balance'].map((goal) => (
                <label key={goal} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.wellnessGoals.includes(goal)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateFormData({ wellnessGoals: [...formData.wellnessGoals, goal] })
                      } else {
                        updateFormData({ wellnessGoals: formData.wellnessGoals.filter(g => g !== goal) })
                      }
                    }}
                  />
                  <span className="text-sm">{goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </label>
              ))}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Existing Benefits?</label>
              <div className="space-y-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="existingBenefits"
                    value="no"
                    checked={formData.existingBenefits === 'no'}
                    onChange={(e) => updateFormData({ existingBenefits: e.target.value })}
                  />
                  <span className="text-sm">No existing benefits</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="existingBenefits"
                    value="yes"
                    checked={formData.existingBenefits === 'yes'}
                    onChange={(e) => updateFormData({ existingBenefits: e.target.value })}
                  />
                  <span className="text-sm">Yes, we have benefits</span>
                </label>
              </div>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => updateFormData({ firstName: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => updateFormData({ lastName: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <input
              type="text"
              placeholder="Job Title"
              value={formData.jobTitle}
              onChange={(e) => updateFormData({ jobTitle: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="email"
              placeholder="Work Email"
              value={formData.workEmail}
              onChange={(e) => updateFormData({ workEmail: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div 
      className="w-full p-6 shadow-lg overflow-auto"
      style={dynamicStyles}
    >
      {showHeader && (
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>{headerText}</h1>
          <p className="text-gray-600">Help us determine your company's eligibility for our fitness benefits program</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep ? 'text-white' : 'bg-gray-300 text-gray-600'
                }`}
                style={{ backgroundColor: step <= currentStep ? primaryColor : undefined }}
              >
                {step}
              </div>
              <span className={`ml-2 text-sm ${step <= currentStep ? '' : 'text-gray-400'}`}>
                {['Company', 'Location', 'Employees', 'Benefits', 'Contact'][step - 1]}
              </span>
            </div>
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
        <button
          type="button"
          onClick={handlePrev}
          className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${currentStep === 1 ? 'invisible' : ''}`}
        >
          ← Previous
        </button>
        
        <div className="flex-1"></div>
        
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
          >
            Calculate Eligibility
          </button>
        )}
      </div>
    </div>
  )
}

// Framer property controls
addPropertyControls(FramerFitnessCalculator, {
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
    defaultValue: 600
  }
})