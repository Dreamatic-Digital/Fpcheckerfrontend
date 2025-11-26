import React, { useState } from "react";
import logoImage from "figma:asset/8d0b51e997d75609c11b3fd1bc9008cf9e0fdd42.png";

interface LandingWrapperProps {
  onStartCalculator: () => void;
  calculatorComponent: React.ReactNode;
  showCalculator: boolean;
}

export function LandingWrapper({
  onStartCalculator,
  calculatorComponent,
  showCalculator,
}: LandingWrapperProps) {
  if (showCalculator) {
    return <>{calculatorComponent}</>;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl w-full">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center gap-12 xl:gap-16">
          {/* Left Column */}
          <div className="flex-1 max-w-[500px]">
            <div className="flex flex-col gap-6">
              {/* Get Started Badge */}
              <div className="inline-flex">
                <div className="relative rounded-[10px] border border-[#333333] px-4 py-2">
                  <p className="font-['Oxygen',sans-serif] text-[14px] text-[#333333]">
                    Get started
                  </p>
                </div>
              </div>

              {/* Heading */}
              <h1 className="font-['Oxygen',sans-serif] text-[64px] leading-[1.1] tracking-[-2.56px]" style={{ fontWeight: 700 }}>
                <span className="text-black">Check your eligibility </span>
                <span className="text-[#0093d3]">today</span>
              </h1>

              {/* Description */}
              <div className="space-y-4">
                <p className="font-['Oxygen',sans-serif] text-[24px] leading-normal text-[#333333]">
                  In just 5 minutes, you can find out if your company is eligible for Fitness Passport.
                </p>
                <p className="font-['Oxygen',sans-serif] text-[24px] leading-normal text-[#333333]">
                  You'll receive an instant result and guidance on what to do next.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Calculator Preview */}
          <div className="flex-1">
            <div className="border border-[#dfdfdf] rounded-[25px] shadow-[0px_0px_32px_0px_rgba(0,0,0,0.15)] overflow-hidden bg-white p-8">
              <div className="text-center mb-6">
                <img 
                  src={logoImage} 
                  alt="Fitness Passport" 
                  className="h-16 mx-auto mb-4"
                />
                <button
                  onClick={onStartCalculator}
                  className="w-full bg-[#0693E3] hover:bg-[#0582d1] text-white px-8 py-4 rounded-lg transition-colors text-lg"
                  style={{ fontWeight: 600 }}
                >
                  Start Eligibility Check →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden flex flex-col items-center text-center gap-8">
          {/* Get Started Badge */}
          <div className="inline-flex">
            <div className="relative rounded-[10px] border border-[#333333] px-4 py-2">
              <p className="font-['Oxygen',sans-serif] text-[14px] text-[#333333]">
                Get started
              </p>
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-['Oxygen',sans-serif] text-[36px] md:text-[48px] leading-[1.1] tracking-[-1.5px] md:tracking-[-2px]" style={{ fontWeight: 700 }}>
            <span className="text-black">Check your eligibility </span>
            <span className="text-[#0093d3]">today</span>
          </h1>

          {/* Description */}
          <div className="space-y-3 max-w-xl">
            <p className="font-['Oxygen',sans-serif] text-[18px] md:text-[20px] leading-normal text-[#333333]">
              In just 5 minutes, you can find out if your company is eligible for Fitness Passport.
            </p>
            <p className="font-['Oxygen',sans-serif] text-[18px] md:text-[20px] leading-normal text-[#333333]">
              You'll receive an instant result and guidance on what to do next.
            </p>
          </div>

          {/* CTA Button */}
          <div className="w-full max-w-md">
            <div className="border border-[#dfdfdf] rounded-[25px] shadow-[0px_0px_32px_0px_rgba(0,0,0,0.15)] overflow-hidden bg-white p-6">
              <img 
                src={logoImage} 
                alt="Fitness Passport" 
                className="h-12 mx-auto mb-4"
              />
              <button
                onClick={onStartCalculator}
                className="w-full bg-[#0693E3] hover:bg-[#0582d1] text-white px-6 py-3 rounded-lg transition-colors"
                style={{ fontWeight: 600 }}
              >
                Start Eligibility Check →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
