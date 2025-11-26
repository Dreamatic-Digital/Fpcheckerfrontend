import React from 'react';
import { FormData } from '../../App';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';

interface BenefitsStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function BenefitsStep({ formData, updateFormData }: BenefitsStepProps) {
  const wellnessGoalOptions = [
    { value: 'improve-engagement', label: 'Improve engagement' },
    { value: 'address-stress', label: 'Address stress, fatigue and burnout' },
    { value: 'boost-retention', label: 'Boost employee retention' },
    { value: 'enhance-recruitment', label: 'Enhance talent recruitment' },
    { value: 'work-life-balance', label: 'Improve work-life balance' },
    { value: 'company-culture', label: 'Strengthen company culture' },
    { value: 'corporate-requirements', label: 'Meet corporate wellness requirements' },
    { value: 'demonstrate-care', label: 'Demonstrate employee care and values' },
    { value: 'boost-productivity', label: 'Boost productivity & reduce sick leave' },
    { value: 'reduce-injuries', label: 'Reduce workplace injury and claims' }
  ];

  const currentBenefitOptions = [
    { value: 'corporate-fitness', label: 'Corporate fitness benefit' },
    { value: 'gym-reimbursement', label: 'Gym membership reimbursement' },
    { value: 'onsite-facilities', label: 'On-site fitness facilities' },
    { value: 'health-screenings', label: 'Health screenings' },
    { value: 'eap-mental-health', label: 'EAP and mental health support' },
    { value: 'nutrition-programs', label: 'Nutrition programs' },
    { value: 'health-coaching', label: 'Health coaching' },
    { value: 'other-wellbeing', label: 'Other wellbeing initiatives' }
  ];

  const handleWellnessGoalChange = (goalValue: string, checked: boolean) => {
    if (checked) {
      updateFormData({ wellnessGoals: [...formData.wellnessGoals, goalValue] });
    } else {
      updateFormData({ wellnessGoals: formData.wellnessGoals.filter(goal => goal !== goalValue) });
    }
  };

  const handleCurrentBenefitChange = (benefitValue: string, checked: boolean) => {
    if (checked) {
      updateFormData({ currentBenefits: [...formData.currentBenefits, benefitValue] });
    } else {
      updateFormData({ currentBenefits: formData.currentBenefits.filter(benefit => benefit !== benefitValue) });
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-2xl text-gray-800 mb-6 text-center">Wellness Program Goals & Current Benefits</h2>
      
      <div className="space-y-6">
        <div>
          <Label>Primary Company Goals for a Wellness Program</Label>
          <p className="text-sm text-gray-600 mb-4 mt-1">Select all that apply to your organization's objectives:</p>
          <div className="grid md:grid-cols-2 gap-3">
            {wellnessGoalOptions.map((goal) => (
              <div key={goal.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={goal.value}
                  checked={formData.wellnessGoals.includes(goal.value)}
                  onCheckedChange={(checked) => handleWellnessGoalChange(goal.value, checked as boolean)}
                />
                <Label htmlFor={goal.value} className="flex-1 cursor-pointer text-sm">
                  {goal.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label>Do you currently offer any fitness benefits programs?</Label>
          <RadioGroup
            value={formData.existingBenefits}
            onValueChange={(value) => updateFormData({ existingBenefits: value })}
            className="mt-4 space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="no" id="no-benefits" />
              <div className="flex-1 cursor-pointer">
                <Label htmlFor="no-benefits" className="cursor-pointer">No</Label>
                <p className="text-sm text-gray-500">We don't currently offer any fitness-related benefits</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="yes" id="yes-benefits" />
              <div className="flex-1 cursor-pointer">
                <Label htmlFor="yes-benefits" className="cursor-pointer">Yes</Label>
                <p className="text-sm text-gray-500">We currently offer some fitness or wellness benefits</p>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        {formData.existingBenefits === 'yes' && (
          <div>
            <Label>Which of the following benefits do you currently offer?</Label>
            <p className="text-sm text-gray-600 mb-4 mt-1">Select all that apply:</p>
            <div className="grid md:grid-cols-2 gap-3">
              {currentBenefitOptions.map((benefit) => (
                <div key={benefit.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={benefit.value}
                    checked={formData.currentBenefits.includes(benefit.value)}
                    onCheckedChange={(checked) => handleCurrentBenefitChange(benefit.value, checked as boolean)}
                  />
                  <Label htmlFor={benefit.value} className="flex-1 cursor-pointer text-sm">
                    {benefit.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}