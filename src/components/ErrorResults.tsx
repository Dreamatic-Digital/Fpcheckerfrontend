import React from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, User, Building, Mail, Phone } from 'lucide-react';
import { FormData } from '../App';

interface ErrorResultsProps {
  formData: FormData;
  onStartOver: () => void;
}

export function ErrorResults({ formData, onStartOver }: ErrorResultsProps) {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Yellow Notification Box */}
        <Alert className="mb-8 bg-amber-50 border-amber-200 border-2">
          <AlertCircle className="h-6 w-6 text-amber-600" />
          <div className="ml-4">
            <h2 className="text-xl mb-2 text-amber-800">
              We're sorry, there has been a technical issue.
            </h2>
            <AlertDescription className="text-base text-amber-800">
              Our tool was unable to verify your information. Please contact us and we'll be happy to discuss your enquiry.
            </AlertDescription>
          </div>
        </Alert>

        {/* Application Summary Card */}
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

        {/* What Happens Next Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl text-gray-800 mb-4">What Happens Next?</h3>
          
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Contact us to discuss your request</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>There's a chance we got things wrong</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Request a manual verification today</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Button 
            onClick={onStartOver}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Submit Another Application
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