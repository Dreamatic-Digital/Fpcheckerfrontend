import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const steps = [
    { number: 1, label: 'Company' },
    { number: 2, label: 'Locations' },
    { number: 3, label: 'Employees' },
    { number: 4, label: 'Benefits' },
    { number: 5, label: 'Contact' }
  ];

  const progressPercentage = (currentStep / totalSteps) * 100;

  // Function to determine if a step should be visible on mobile
  const isVisibleOnMobile = (stepNumber: number) => {
    return stepNumber === currentStep || stepNumber === currentStep + 1;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 overflow-x-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div 
                className={`flex items-center ${
                  isVisibleOnMobile(step.number) ? 'block' : 'hidden md:flex'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                    step.number < currentStep
                      ? 'bg-green-500 text-white'
                      : step.number === currentStep
                      ? 'bg-[#0693E3] text-white'
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
                      ? 'text-[#0693E3]'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`w-8 h-1 bg-gray-200 rounded ${
                    (isVisibleOnMobile(step.number) && isVisibleOnMobile(step.number + 1)) ? 'block' : 'hidden md:block'
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#0693E3] h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}