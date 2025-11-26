import React from 'react';
import { FormData } from '../../App';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

interface EmployeeInfoStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function EmployeeInfoStep({ formData, updateFormData }: EmployeeInfoStepProps) {
  const workforceTypes = [
    { value: 'full-time', label: 'Primarily Full-Time (75%+ full-time employees)' },
    { value: 'part-time', label: 'Primarily Part-Time (75%+ part-time employees)' },
    { value: 'mixed', label: 'Mixed Full-Time & Part-Time' },
    { value: 'contract', label: 'Primarily Contract/Freelance' },
    { value: 'seasonal', label: 'Seasonal Workers' }
  ];

  const communicationLabels = [
    { value: 0, label: 'None' },
    { value: 1, label: 'Poor' },
    { value: 2, label: 'OK' },
    { value: 3, label: 'Good' },
    { value: 4, label: 'Great' }
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-2xl text-gray-800 mb-6 text-center">Employee Information</h2>
      
      <div className="space-y-6">
        <div>
          <Label>Total Number of Employees</Label>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">1</span>
              <span className="text-sm text-gray-700">{formData.totalEmployees}</span>
              <span className="text-sm text-gray-500">1500+</span>
            </div>
            <Slider
              value={[formData.totalEmployees]}
              onValueChange={([value]) => updateFormData({ totalEmployees: value })}
              max={1500}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="workforceType">Primary Workforce Type</Label>
          <Select value={formData.workforceType} onValueChange={(value) => updateFormData({ workforceType: value })}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select workforce type" />
            </SelectTrigger>
            <SelectContent>
              {workforceTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Workforce Communication Strength</Label>
          <p className="text-sm text-gray-600 mb-3 mt-1">Rate how well your workforce communicates internally</p>
          <div className="grid grid-cols-5 gap-2">
            {communicationLabels.map((rating) => (
              <Button
                key={rating.value}
                type="button"
                variant={formData.communicationStrength === rating.value ? "default" : "outline"}
                onClick={() => updateFormData({ communicationStrength: rating.value })}
                className={`text-sm transition-all duration-200 ${
                  formData.communicationStrength === rating.value
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600'
                }`}
              >
                {rating.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}