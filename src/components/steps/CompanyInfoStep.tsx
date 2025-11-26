import React from 'react';
import { FormData } from '../../App';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface CompanyInfoStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function CompanyInfoStep({ formData, updateFormData }: CompanyInfoStepProps) {
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
            <Select value={formData.businessType} onValueChange={(value) => updateFormData({ businessType: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="industryCategory">Industry Category (ABS)</Label>
            <Select value={formData.industryCategory} onValueChange={(value) => updateFormData({ industryCategory: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.value} value={industry.value}>
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}