import React from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, Clock, XCircle, User, Building, Mail, Phone } from 'lucide-react';
import { FormData } from '../App';

interface StatusResultsProps {
  formData: FormData;
  eligibilityStatus: string;
  submissionId: string;
  onStartOver: () => void;
}

export function StatusResults({ 
  formData, 
  eligibilityStatus, 
  submissionId, 
  onStartOver 
}: StatusResultsProps) {
  // Get status configuration based on API response
  const getStatusConfig = () => {
    const status = eligibilityStatus?.toLowerCase();
    
    // Debug logging (console only)
    console.log('🔍 StatusResults Debug:', {
      originalStatus: eligibilityStatus,
      lowercaseStatus: status,
      statusMatches: {
        approved: status === 'approved',
        survey: status === 'survey',
        ndpd: status === 'nd/pd',
        notApproved: status === 'not approved'
      }
    });
    
    // Handle new API status values
    if (status === 'approved') {
      return {
        type: 'success' as const,
        icon: CheckCircle,
        title: 'Eligibility Confirmed!',
        description: "Great news! Your business qualifies for Fitness Passport. You're ready to take the next step towards unlocking wellness for your workforce. A member of our team will reach out shortly to discuss the next steps.",
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        iconColor: 'text-green-600'
      };
    }
    
    if (status === 'survey') {
      return {
        type: 'warning' as const,
        icon: Clock,
        title: 'Almost There — Employee Survey Needed',
        description: "You qualify, but we'll need to survey your eligible employees to understand their preferences before moving forward. A member of our team will reach out shortly to discuss the next steps.",
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-800',
        iconColor: 'text-amber-600'
      };
    }
    
    if (status === 'nd/pd') {
      return {
        type: 'warning' as const,
        icon: Clock,
        title: 'Pending Partner Confirmation',
        description: "There's a chance we can't move forward. We'll need to check with our facility partners first. Our team will be in touch shortly to discuss the outcome of your request.",
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-800',
        iconColor: 'text-amber-600'
      };
    }
    
    if (status === 'not approved') {
      return {
        type: 'error' as const,
        icon: XCircle,
        title: 'Not Eligible at This Time',
        description: "Unfortunately, your business doesn't currently meet the eligibility requirements for Fitness Passport. We'd be happy to revisit in the future as circumstances change. If you believe there has been a mistake, please contact us.",
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600'
      };
    }
    
    // Default fallback
    return {
      type: 'info' as const,
      icon: Clock,
      title: 'Application Received',
      description: 'Your application has been received and is being processed. A member of our team will reach out shortly to discuss the next steps.',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;



  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Main Status Alert */}
        <Alert className={`mb-8 ${config.bgColor} ${config.borderColor} border-2`}>
          <Icon className={`h-6 w-6 ${config.iconColor}`} />
          <div className="ml-4">
            <h2 className={`text-xl mb-2 ${config.textColor}`}>
              {config.title}
            </h2>
            <AlertDescription className={`text-base ${config.textColor}`}>
              {config.description}
            </AlertDescription>
            {submissionId && (
              <div className={`mt-3 text-sm ${config.textColor} opacity-80`}>
                <strong>Reference ID:</strong> {submissionId}
              </div>
            )}
            {/* Debug Status Display */}
            <div className={`mt-3 text-sm ${config.textColor} opacity-70`}>
              <strong>Status:</strong> {eligibilityStatus}
            </div>
          </div>
        </Alert>

        {/* Company Summary Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl text-gray-800 mb-4 flex items-center">
            <Building className="h-5 w-5 mr-2 text-gray-600" />
            Application Summary
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Company Information */}
            <div className="space-y-3">
              <h4 className="text-lg text-gray-700 mb-3">Company Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Company:</span>
                  <span className="ml-2 text-gray-800">{formData.companyName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 text-gray-800">{formData.businessType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Industry:</span>
                  <span className="ml-2 text-gray-800">{formData.industryCategory}</span>
                </div>
                <div>
                  <span className="text-gray-600">Employees:</span>
                  <span className="ml-2 text-gray-800">{formData.totalEmployees}</span>
                </div>
                <div>
                  <span className="text-gray-600">Locations:</span>
                  <span className="ml-2 text-gray-800">
                    {formData.offices.length + 1} location{formData.offices.length === 0 ? '' : 's'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="text-lg text-gray-700 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Contact Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-800">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 ml-6">Title:</span>
                  <span className="ml-2 text-gray-800">{formData.jobTitle}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-800">{formData.workEmail}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-800">{formData.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl text-gray-800 mb-4">What Happens Next?</h3>
          
          <div className="space-y-3 text-gray-700">
            {config.type === 'success' && (
              <>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Our team will contact you within 1-2 business days to begin the onboarding process</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>We'll provide you with a customized benefits package tailored to your workforce</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>You'll receive implementation support and employee communication materials</span>
                </div>
              </>
            )}
            
            {config.type === 'warning' && (
              <>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>A specialist will contact you within 2-3 business days to discuss requirements</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>We'll work together to address any additional requirements or checks needed</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>You'll receive updates as we progress through the approval process</span>
                </div>
              </>
            )}
            
            {config.type === 'error' && (
              <>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>If you have questions about the decision, please contact our support team</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>We'll keep your information on file for future eligibility reviews</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Consider reapplying if your business circumstances change significantly</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          {config.type === 'error' && (
            <Button 
              onClick={onStartOver}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 mr-4"
            >
              Submit New Application
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={onStartOver}
            className="border-gray-300"
          >
            {config.type === 'error' ? 'Start Over' : 'Submit Another Application'}
          </Button>
        </div>

        {/* Contact Information */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Need help? Contact our team at:</p>
          <p className="mt-1">
            <a 
              href="https://get.fitnesspassport.com.au/contact" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              https://get.fitnesspassport.com.au/contact
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}