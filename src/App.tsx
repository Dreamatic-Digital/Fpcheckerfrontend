import React, { useState, useEffect } from "react";
import { ProgressBar } from "./components/ProgressBar";
import { CompanyInfoStep } from "./components/steps/CompanyInfoStep";
import { LocationsStep } from "./components/steps/LocationsStep";
import { EmployeeInfoStep } from "./components/steps/EmployeeInfoStep";
import { BenefitsStep } from "./components/steps/BenefitsStep";
import { ContactInfoStep } from "./components/steps/ContactInfoStep";
import { Results } from "./components/Results";
import { StatusResults } from "./components/StatusResults";
import { ErrorResults } from "./components/ErrorResults";
import { Button } from "./components/ui/button";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Info, AlertCircle, CheckCircle } from "lucide-react";
import {
  createApiService,
  type ApiConfig,
  type ApiResponse,
  type UtmParameters,
} from "./services/apiService";
import svgPaths from "./imports/svg-k42qi7cdu8";
import logoImage from "figma:asset/8d0b51e997d75609c11b3fd1bc9008cf9e0fdd42.png";

// Declare global dataLayer for GTM
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export interface FormData {
  // Company Info
  companyName: string;
  businessType: string;
  industryCategory: string;

  // Locations
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

  // Employee Info
  totalEmployees: number;
  workforceType: string;
  communicationStrength: number;

  // Benefits
  wellnessGoals: string[];
  existingBenefits: string;
  currentBenefits: string[];

  // Contact
  firstName: string;
  lastName: string;
  jobTitle: string;
  workEmail: string;
  phoneNumber: string;
}

const initialFormData: FormData = {
  companyName: "",
  businessType: "",
  industryCategory: "",
  hqPostalCode: "",
  hqCity: "",
  hqState: "",
  hqEmployees: undefined as any,
  offices: [],
  totalEmployees: 50,
  workforceType: "",
  communicationStrength: -1,
  wellnessGoals: [],
  existingBenefits: "",
  currentBenefits: [],
  firstName: "",
  lastName: "",
  jobTitle: "",
  workEmail: "",
  phoneNumber: "",
};

const STORAGE_KEYS = {
  FORM_DATA: "fitness-calculator-form-data",
  CURRENT_STEP: "fitness-calculator-current-step",
  HAS_SAVED_DATA: "fitness-calculator-has-saved-data",
};

// List of personal email domains to reject
const PERSONAL_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "mail.com",
  "protonmail.com",
  "zoho.com",
  "gmx.com",
  "inbox.com",
  "hushmail.com",
  "fastmail.com",
  "bigpond.com",
  "bigpond.net.au",
  "optusnet.com.au",
  "iinet.net.au",
  "tpg.com.au",
  "dodo.com.au",
  "aapt.net.au",
  "internode.on.net",
];

// API Configuration
const API_CONFIG: ApiConfig = {
  endpoint:
    "https://fp-eligibility.scalarity.io/api/check-eligibility ",
  apiKey: "scaWqk4uN8dPrrSewbKLyjE6rlhL5o4v",
  headers: {
    "X-Client-Name": "fitness-calculator",
    "X-Client-Version": "1.0.0",
  },
  timeout: 30000,
};

// Utility function to extract UTM and tracking parameters from sessionStorage
const getUtmParameters = (): UtmParameters => {
  try {
    const storedParams = sessionStorage.getItem('queryParams');
    if (storedParams) {
      const params = JSON.parse(storedParams);
      
      // Return all parameters, including GTM conversion linker parameters
      return {
        utm_source: params.utm_source || undefined,
        utm_medium: params.utm_medium || undefined,
        utm_campaign: params.utm_campaign || undefined,
        utm_term: params.utm_term || undefined,
        utm_content: params.utm_content || undefined,
        gclid: params.gclid || undefined,
        fbclid: params.fbclid || undefined,
        msclkid: params.msclkid || undefined,
        sc_email: params.sc_email || undefined,
        sc_phone: params.sc_phone || undefined,
        sc_uid: params.sc_uid || undefined,
        _gl: params._gl || undefined,  // GTM conversion linker
        _ga: params._ga || undefined,  // Google Analytics client ID
        // Include any additional parameters that might be present
        ...Object.keys(params).reduce((acc, key) => {
          // Skip if already included above
          const knownParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 
                               'gclid', 'fbclid', 'msclkid', 'sc_email', 'sc_phone', 'sc_uid', '_gl', '_ga'];
          if (!knownParams.includes(key) && params[key]) {
            acc[key] = params[key];
          }
          return acc;
        }, {} as Record<string, string>)
      };
    }
  } catch (error) {
    console.error('Error reading query params from sessionStorage:', error);
  }
  return {};
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] =
    useState<FormData>(initialFormData);
  const [showResults, setShowResults] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] =
    useState(false);
  const [isSubmittingToApi, setIsSubmittingToApi] =
    useState(false);
  const [apiSubmissionStatus, setApiSubmissionStatus] =
    useState<"idle" | "success" | "error">("idle");
  const [apiError, setApiError] = useState<string>("");
  const [submissionId, setSubmissionId] = useState<string>("");
  const [eligibilityStatus, setEligibilityStatus] =
    useState<string>("");
  const totalSteps = 5;

  // Initialize API service
  const apiService = createApiService(API_CONFIG);

  // Parse URL parameters on mount and store in sessionStorage
  useEffect(() => {
    // Only parse URL params once on initial mount
    const urlParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    
    // Extract all URL parameters
    urlParams.forEach((value, key) => {
      params[key] = value;
    });
    
    // Only store if we have parameters and haven't stored them yet
    if (Object.keys(params).length > 0) {
      const existingParams = sessionStorage.getItem('queryParams');
      if (!existingParams) {
        sessionStorage.setItem('queryParams', JSON.stringify(params));
        console.log('📥 URL parameters captured and stored:', params);
      }
    }
  }, []); // Empty dependency array = run once on mount

  // Trigger data layer event when results are shown with query parameters
  useEffect(() => {
    if (showResults) {
      // Get all available query parameters
      const queryParams = getUtmParameters();
      
      // Prepare dataLayer payload
      const dataLayerPayload: any = {
        event: 'eligibility_checker_completion'
      };

      // Add all available query parameters to dataLayer
      if (queryParams.utm_source) dataLayerPayload.utm_source = queryParams.utm_source;
      if (queryParams.utm_medium) dataLayerPayload.utm_medium = queryParams.utm_medium;
      if (queryParams.utm_campaign) dataLayerPayload.utm_campaign = queryParams.utm_campaign;
      if (queryParams.utm_term) dataLayerPayload.utm_term = queryParams.utm_term;
      if (queryParams.utm_content) dataLayerPayload.utm_content = queryParams.utm_content;
      if (queryParams.fbclid) dataLayerPayload.fbclid = queryParams.fbclid;
      if (queryParams.msclkid) dataLayerPayload.msclkid = queryParams.msclkid;
      if (queryParams.sc_email) dataLayerPayload.sc_email = queryParams.sc_email;
      if (queryParams.sc_phone) dataLayerPayload.sc_phone = queryParams.sc_phone;
      if (queryParams.sc_uid) dataLayerPayload.sc_uid = queryParams.sc_uid;

      // Handle gclid specifically for Google Ads tracking
      if (queryParams.gclid) {
        dataLayerPayload.gclid = queryParams.gclid;
        // Also push in the expected method for GTM to consume it
        dataLayerPayload['&gclid'] = queryParams.gclid;
      }

      // Push to dataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(dataLayerPayload);

      console.log('📊 DataLayer pushed:', dataLayerPayload);
    }
  }, [showResults]);

  // Trigger data layer events for each step
  useEffect(() => {
    // Skip if showing restore prompt to avoid triggering events on component mount
    if (showRestorePrompt) return;

    window.dataLayer = window.dataLayer || [];
    
    switch (currentStep) {
      case 1:
        window.dataLayer.push({
          event: 'checker-start'
        });
        break;
      case 2:
        window.dataLayer.push({
          event: 'checker-locations'
        });
        break;
      case 3:
        window.dataLayer.push({
          event: 'checker-employees'
        });
        break;
      case 4:
        window.dataLayer.push({
          event: 'checker-benefits'
        });
        break;
      case 5:
        window.dataLayer.push({
          event: 'checker-contact'
        });
        break;
      default:
        break;
    }
  }, [currentStep, showRestorePrompt]);

  // Load saved data on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem(
      STORAGE_KEYS.FORM_DATA,
    );
    const savedStep = localStorage.getItem(
      STORAGE_KEYS.CURRENT_STEP,
    );
    const hasSaved = localStorage.getItem(
      STORAGE_KEYS.HAS_SAVED_DATA,
    );

    if (savedFormData && savedStep && hasSaved === "true") {
      try {
        const parsedData = JSON.parse(savedFormData);
        const parsedStep = parseInt(savedStep, 10);

        // Check if the saved data is meaningful (not just initial values)
        const isDataMeaningful =
          parsedData.companyName ||
          parsedData.businessType ||
          parsedData.firstName ||
          parsedData.workEmail;

        if (isDataMeaningful) {
          setHasSavedData(true);
          setShowRestorePrompt(true);
        }
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        // Clear corrupted data
        clearSavedData();
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only save if we have meaningful data (not just initial state)
    const isDataMeaningful =
      formData.companyName ||
      formData.businessType ||
      formData.firstName ||
      formData.workEmail;

    if (isDataMeaningful) {
      localStorage.setItem(
        STORAGE_KEYS.FORM_DATA,
        JSON.stringify(formData),
      );
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_STEP,
        currentStep.toString(),
      );
      localStorage.setItem(STORAGE_KEYS.HAS_SAVED_DATA, "true");
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
    const savedFormData = localStorage.getItem(
      STORAGE_KEYS.FORM_DATA,
    );
    const savedStep = localStorage.getItem(
      STORAGE_KEYS.CURRENT_STEP,
    );

    if (savedFormData && savedStep) {
      try {
        const parsedData = JSON.parse(savedFormData);
        const parsedStep = parseInt(savedStep, 10);

        setFormData(parsedData);
        setCurrentStep(parsedStep);
        setShowRestorePrompt(false);
      } catch (error) {
        console.error("Error restoring saved data:", error);
        clearSavedData();
      }
    }
  };

  const startFresh = () => {
    clearSavedData();
    setFormData(initialFormData);
    setCurrentStep(1);
    setShowResults(false);
    setApiSubmissionStatus("idle");
    setApiError("");
    setSubmissionId("");
    setEligibilityStatus("");
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.companyName &&
          formData.businessType &&
          formData.industryCategory
        );
      case 2:
        return !!(
          formData.hqPostalCode &&
          formData.hqCity &&
          formData.hqState &&
          (formData.hqEmployees >= 0 ||
            formData.hqEmployees === 0)
        );
      case 3:
        return !!(
          formData.workforceType &&
          formData.communicationStrength >= 0
        );
      case 4:
        return !!formData.existingBenefits;
      case 5:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValidEmail = emailRegex.test(formData.workEmail);

        // Check if email domain is personal
        if (isValidEmail && formData.workEmail) {
          const emailParts = formData.workEmail.split("@");
          if (emailParts.length === 2) {
            const domain = emailParts[1].toLowerCase();
            isValidEmail =
              !PERSONAL_EMAIL_DOMAINS.includes(domain);
          }
        }

        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.jobTitle &&
          isValidEmail &&
          formData.phoneNumber
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        // Pre-fill total employees when moving from step 2 to step 3
        if (currentStep === 2) {
          const hqEmployees = formData.hqEmployees || 0;
          const officeEmployees = formData.offices.reduce(
            (sum, office) => sum + (office.employees || 0),
            0,
          );
          const calculatedTotal = hqEmployees + officeEmployees;
          const cappedTotal = Math.min(calculatedTotal, 1500);
          if (cappedTotal > formData.totalEmployees) {
            updateFormData({ totalEmployees: cappedTotal });
          }
        }
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      alert(
        "Please fill in all required fields before continuing.",
      );
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const submitToApi = async (): Promise<boolean> => {
    setIsSubmittingToApi(true);
    setApiSubmissionStatus("idle");
    setApiError("");

    try {
      // Validate form data first
      const validation = apiService.validateFormData(formData);
      if (!validation.isValid) {
        setApiError(
          `Validation failed: ${validation.errors.join(", ")}`,
        );
        setApiSubmissionStatus("error");
        return false;
      }

      // Extract UTM parameters from sessionStorage
      const utmParams = getUtmParameters();

      // Submit to API with UTM parameters
      const result: ApiResponse =
        await apiService.submitFormData(formData, utmParams);

      if (result.success) {
        setApiSubmissionStatus("success");
        // Extract status from API response
        const apiStatus = result.data?.status || "Unknown";
        setEligibilityStatus(apiStatus);
        // Generate submission ID since API doesn't provide one
        const generatedId = `FP_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setSubmissionId(generatedId);
        console.log("✅ Form successfully submitted to API", {
          status: apiStatus,
          submissionId: generatedId,
          reason: result.data?.reason || "No reason provided",
        });
        return true;
      } else {
        setApiError(result.error || "Failed to submit to API");
        setApiSubmissionStatus("error");
        console.error(
          "❌ API submission failed:",
          result.error,
        );
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error occurred";
      setApiError(errorMessage);
      setApiSubmissionStatus("error");
      console.error("💥 API submission error:", error);
      return false;
    } finally {
      setIsSubmittingToApi(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      alert(
        "Please fill in all required fields before submitting.",
      );
      return;
    }

    // Submit to API first
    const apiSuccess = await submitToApi();

    // Show results regardless of API status (but show different messages)
    setShowResults(true);

    // Clear saved data when showing results since the form is complete
    clearSavedData();
  };

  const handleStartOver = () => {
    startFresh();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <LocationsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <EmployeeInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <BenefitsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <ContactInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#0693e3] py-4 px-4 md:py-8 md:px-6 lg:px-8">
        {/* Logo and Back Button */}
        <div className="max-w-6xl mx-auto mb-4 md:mb-6 px-0 md:px-4 flex items-start justify-between">
          <a
            href="https://get.fitnesspassport.com.au"
            target="_self"
            rel="noopener noreferrer"
            className="relative w-[80px] h-[61px] md:w-[103px] md:h-[79px] scale-75 md:scale-100 origin-top-left"
          >
            <img src={logoImage} alt="Fitness Passport" className="w-full h-full object-contain" />
          </a>
          <a
            href="https://get.fitnesspassport.com.au"
            target="_self"
            rel="noopener noreferrer"
            className="bg-white rounded-full px-4 py-2 md:px-6 md:py-3 flex items-center gap-1.5 md:gap-2 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="w-2 h-3.5 md:w-2.5 md:h-4" fill="none" preserveAspectRatio="none" viewBox="0 0 10 18">
              <path d={svgPaths.pa0bd880} fill="#0693E3" />
            </svg>
            <span className="text-[#0693E3] text-base md:text-lg">BACK</span>
          </a>
        </div>

        <div className="max-w-4xl mx-auto px-0 md:px-4">
          {/* API Submission Status */}
          {isSubmittingToApi && (
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                🔄 Submitting your data to our systems...
              </AlertDescription>
            </Alert>
          )}

          {apiSubmissionStatus === "success" && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ✅ Form data successfully submitted to our
                systems!
              </AlertDescription>
            </Alert>
          )}

          {apiSubmissionStatus === "error" && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                ⚠️ Failed to submit data to API: {apiError}
                <br />
                <span className="text-sm">
                  Your results are still available below. Please
                  contact support if this issue persists.
                </span>
              </AlertDescription>
            </Alert>
          )}

          {apiSubmissionStatus === "success" &&
          eligibilityStatus ? (
            <StatusResults
              formData={formData}
              eligibilityStatus={eligibilityStatus}
              submissionId={submissionId}
              onStartOver={handleStartOver}
            />
          ) : apiSubmissionStatus === "error" ? (
            <ErrorResults
              formData={formData}
              onStartOver={handleStartOver}
            />
          ) : (
            <Results
              formData={formData}
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0693e3] py-4 px-4 md:py-8 md:px-6 lg:px-8">
      {/* Logo and Back Button */}
      <div className="max-w-6xl mx-auto mb-4 md:mb-6 px-0 md:px-4 flex items-start justify-between">
        <a
          href="https://get.fitnesspassport.com.au"
          target="_self"
          rel="noopener noreferrer"
          className="relative w-[80px] h-[61px] md:w-[103px] md:h-[79px] scale-75 md:scale-100 origin-top-left"
        >
          <img src={logoImage} alt="Fitness Passport" className="w-full h-full object-contain" />
        </a>
        <a
          href="https://get.fitnesspassport.com.au"
          target="_self"
          rel="noopener noreferrer"
          className="bg-[#0693E3] rounded-full px-4 py-2 md:px-6 md:py-3 flex items-center gap-1.5 md:gap-2 hover:bg-[#0582d1] transition-colors shadow-sm"
        >
          <svg className="w-2 h-3.5 md:w-2.5 md:h-4" fill="none" preserveAspectRatio="none" viewBox="0 0 10 18">
            <path d={svgPaths.pa0bd880} fill="white" />
          </svg>
          <span className="text-white text-base md:text-lg">BACK</span>
        </a>
      </div>

      <div className="max-w-4xl mx-auto px-0 md:px-4">
        {/* Restore Data Prompt */}
        {showRestorePrompt && (
          <div className="mb-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                We found your previous progress. Would you like
                to continue where you left off?
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={restoreSavedData}
                    className="bg-[#0693E3] hover:bg-[#0582d1]"
                  >
                    Continue Previous Session
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={startFresh}
                  >
                    Start Fresh
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 border-4 border-[rgba(255,255,255,0.22)]">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="font-['Oxygen',sans-serif] text-2xl md:text-3xl text-gray-800 mb-2" style={{ fontWeight: 700 }}>
              Eligibility Checker
            </h1>
            {hasSavedData && !showRestorePrompt && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Your progress is automatically saved
              </p>
            )}
          </div>

          <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
          />

          <div className="mt-8">{renderCurrentStep()}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              className={currentStep === 1 ? "invisible" : ""}
            >
              ← Previous
            </Button>

            <div className="flex-1"></div>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-[#0693E3] hover:bg-[#0582d1]"
              >
                Next →
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600 max-w-xs">
                  By pressing submit, you agree to being
                  contacted in accordance with our{" "}
                  <a
                    href="https://get.fitnesspassport.com.au/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0693E3] hover:text-[#0582d1] underline"
                  >
                    Privacy Policy
                  </a>
                </p>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmittingToApi}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingToApi
                    ? "Submitting..."
                    : "Calculate Eligibility"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Development Test Link - Only visible in dev */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setApiSubmissionStatus("error");
                setApiError("Test error for development");
                setShowResults(true);
              }}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              [DEV] Test Error Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}