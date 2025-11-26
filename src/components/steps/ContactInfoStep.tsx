import React, { useState, useEffect } from 'react';
import { FormData } from '../../App';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

interface ContactInfoStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

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
  "internode.on.net"
];

export function ContactInfoStep({ formData, updateFormData }: ContactInfoStepProps) {
  const [showPersonalEmailAlert, setShowPersonalEmailAlert] = useState(false);

  // Check if email domain is personal when email changes
  useEffect(() => {
    if (formData.workEmail) {
      const emailParts = formData.workEmail.split('@');
      if (emailParts.length === 2) {
        const domain = emailParts[1].toLowerCase();
        const isPersonalDomain = PERSONAL_EMAIL_DOMAINS.includes(domain);
        setShowPersonalEmailAlert(isPersonalDomain);
      } else {
        setShowPersonalEmailAlert(false);
      }
    } else {
      setShowPersonalEmailAlert(false);
    }
  }, [formData.workEmail]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ workEmail: e.target.value });
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-2xl text-gray-800 mb-6 text-center">Contact Information</h2>
      <p className="text-gray-600 mb-6 text-center">Please provide your contact details so we can follow up with your eligibility results</p>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
              placeholder="Enter your first name"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => updateFormData({ lastName: e.target.value })}
              placeholder="Enter your last name"
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
            placeholder="e.g., HR Manager, CEO, Benefits Administrator"
            className="mt-2"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workEmail">Work Email</Label>
            <Input
              id="workEmail"
              type="email"
              value={formData.workEmail}
              onChange={handleEmailChange}
              placeholder="your.email@company.com"
              className="mt-2"
            />
            {showPersonalEmailAlert && (
              <Alert className="mt-3 border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Please use a business email address instead of a personal email.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
              placeholder="+61 000 000 000"
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}