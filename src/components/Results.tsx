import React, { useState, useEffect } from 'react';
import { FormData } from '../App';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, AlertCircle, XCircle, Loader2, Database, Mail } from 'lucide-react';
import { assessmentService, AssessmentResult } from '../services/assessmentService';

interface ResultsProps {
  formData: FormData;
  onStartOver: () => void;
}

interface EligibilityResult {
  eligibilityStatus: 'eligible' | 'may-be-eligible' | 'not-eligible';
  score: number;
  factors: string[];
  recommendations: string[];
}

export function Results({ formData, onStartOver }: ResultsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [submissionError, setSubmissionError] = useState<string>('');

  const calculateEligibility = (): EligibilityResult => {
    const result: EligibilityResult = {
      eligibilityStatus: 'not-eligible',
      score: 0,
      factors: [],
      recommendations: []
    };

    // Employee count scoring
    if (formData.totalEmployees >= 100) {
      result.score += 30;
      result.factors.push('✅ Large employee base (100+ employees) - Excellent fit');
    } else if (formData.totalEmployees >= 50) {
      result.score += 20;
      result.factors.push('✅ Medium employee base (50-99 employees) - Good fit');
    } else if (formData.totalEmployees >= 25) {
      result.score += 15;
      result.factors.push('✅ Small-medium employee base (25-49 employees) - Suitable');
    } else if (formData.totalEmployees >= 10) {
      result.score += 8;
      result.factors.push('⚠️ Small employee base (10-24 employees) - May require customized approach');
    } else {
      result.score += 2;
      result.factors.push('❌ Very small employee base (under 10) - Limited program viability');
    }

    // Workforce type scoring
    if (formData.workforceType === 'full-time' || formData.workforceType === 'mixed') {
      result.score += 20;
      result.factors.push('✅ Full-time workforce - High engagement potential');
    } else if (formData.workforceType === 'part-time') {
      result.score += 12;
      result.factors.push('⚠️ Part-time workforce - May need flexible options');
    } else {
      result.score += 5;
      result.factors.push('❌ Contract/seasonal workforce - Limited program engagement');
    }

    // Multiple locations
    if (formData.offices.length > 0) {
      result.score += 15;
      result.factors.push(`✅ Multiple locations (${formData.offices.length + 1} total) - Good coverage opportunity`);
    }

    // Communication strength
    if (formData.communicationStrength >= 3) {
      result.score += 15;
      result.factors.push('✅ Good/Great internal communication - High program adoption potential');
    } else if (formData.communicationStrength === 2) {
      result.score += 10;
      result.factors.push('✅ OK internal communication - Solid program adoption potential');
    } else if (formData.communicationStrength === 1) {
      result.score += 5;
      result.factors.push('⚠️ Poor communication - May need enhanced rollout support');
    } else {
      result.score += 0;
      result.factors.push('❌ No communication structure - Significant implementation challenges');
    }

    // Wellness goals alignment
    if (formData.wellnessGoals.length >= 4) {
      result.score += 20;
      result.factors.push('✅ Multiple wellness objectives - Comprehensive program needed');
    } else if (formData.wellnessGoals.length >= 2) {
      result.score += 15;
      result.factors.push('✅ Clear wellness objectives - Targeted program approach');
    } else if (formData.wellnessGoals.length === 1) {
      result.score += 8;
      result.factors.push('⚠️ Limited wellness objectives - Basic program may suffice');
    } else {
      result.score += 0;
      result.factors.push('❌ No clear wellness objectives - Program goals unclear');
    }

    // Existing benefits
    if (formData.existingBenefits === 'no') {
      result.score += 25;
      result.factors.push('✅ No existing fitness benefits - Great opportunity for impact');
    } else {
      result.score += 10;
      result.factors.push(`✅ Current benefits: ${formData.currentBenefits.length} programs - Integration approach needed`);
    }

    // Business type considerations
    if (['privately-held', 'public-company', 'educational'].includes(formData.businessType)) {
      result.score += 10;
      result.factors.push('✅ Business structure supports employee benefits');
    } else if (['government-agency', 'non-profit'].includes(formData.businessType)) {
      result.score += 5;
      result.factors.push('⚠️ Business structure may have budget constraints');
    }

    // Determine eligibility status based on score
    if (result.score >= 75) {
      result.eligibilityStatus = 'eligible';
      result.recommendations.push('Full wellness integration approach');
      result.recommendations.push('Multi-location rollout strategy');
      result.recommendations.push('Executive wellness program add-on');
      result.recommendations.push('Comprehensive employee engagement plan');
    } else if (result.score >= 45) {
      result.eligibilityStatus = 'may-be-eligible';
      result.recommendations.push('Core fitness benefits implementation');
      result.recommendations.push('Phased implementation approach');
      result.recommendations.push('Employee engagement workshops');
      result.recommendations.push('Pilot program for key locations');
    } else {
      result.eligibilityStatus = 'not-eligible';
      result.recommendations.push('Consider improving internal communication first');
      result.recommendations.push('Develop clear wellness objectives');
      result.recommendations.push('Start with basic wellness initiatives');
      result.recommendations.push('Re-evaluate when company grows or structure changes');
    }

    return result;
  };

  const results = calculateEligibility();

  // Submit assessment to database when component mounts
  useEffect(() => {
    const submitAssessment = async () => {
      setIsSubmitting(true);
      
      const assessmentData: AssessmentResult = {
        formData,
        eligibilityScore: results.score,
        eligibilityStatus: results.eligibilityStatus,
        factors: results.factors,
        recommendations: results.recommendations,
        submittedAt: new Date().toISOString()
      };

      try {
        const response = await assessmentService.submitAssessment(assessmentData);
        
        if (response.success && response.assessmentId) {
          setSubmissionStatus('success');
          setAssessmentId(response.assessmentId);
        } else {
          setSubmissionStatus('error');
          setSubmissionError(response.error || 'Failed to save assessment');
        }
      } catch (error) {
        setSubmissionStatus('error');
        setSubmissionError('Network error occurred while saving assessment');
      } finally {
        setIsSubmitting(false);
      }
    };

    submitAssessment();
  }, []);
  
  const communicationLabels = {
    0: 'None',
    1: 'Poor',
    2: 'OK',
    3: 'Good',
    4: 'Great'
  };

  const getStatusConfig = () => {
    switch (results.eligibilityStatus) {
      case 'eligible':
        return {
          icon: CheckCircle,
          badge: 'ELIGIBLE',
          badgeVariant: 'default' as const,
          message: 'Congratulations! Your company is an excellent candidate for our fitness benefits program.',
          color: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          progressColor: 'bg-green-500'
        };
      case 'may-be-eligible':
        return {
          icon: AlertCircle,
          badge: 'YOU MAY BE ELIGIBLE',
          badgeVariant: 'secondary' as const,
          message: 'Your company shows potential for our fitness benefits program with some adjustments.',
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          progressColor: 'bg-yellow-500'
        };
      default:
        return {
          icon: XCircle,
          badge: 'NOT ELIGIBLE',
          badgeVariant: 'destructive' as const,
          message: 'Based on current criteria, your company may not be ready for our fitness benefits program at this time.',
          color: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          progressColor: 'bg-red-500'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const getNextStepsContent = () => {
    const contactTime = results.eligibilityStatus === 'eligible' ? '1 business day' :
                       results.eligibilityStatus === 'may-be-eligible' ? '2 business days' : '3 business days';

    return [
      `A representative will contact you within ${contactTime}`,
      results.eligibilityStatus === 'eligible' ? 'Receive a customized benefits package proposal' :
      results.eligibilityStatus === 'may-be-eligible' ? 'Discuss modifications to meet eligibility requirements' :
      'Receive guidance on building wellness program readiness',
      results.eligibilityStatus === 'eligible' ? 'Schedule implementation consultation' :
      results.eligibilityStatus === 'may-be-eligible' ? 'Explore pilot program options' :
      'Schedule follow-up assessment in 6-12 months',
      results.eligibilityStatus === 'eligible' ? 'Begin employee wellness program rollout planning' :
      results.eligibilityStatus === 'may-be-eligible' ? 'Receive program readiness guidance' :
      'Access alternative wellness solutions for smaller organizations'
    ];
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl text-gray-800 mb-2">Eligibility Assessment Results</h1>
            <p className="text-gray-600">Your fitness benefits program eligibility evaluation</p>
          </div>

          {/* Submission Status */}
          {isSubmitting && (
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <AlertDescription className="text-blue-800">
                Saving your assessment results...
              </AlertDescription>
            </Alert>
          )}

          {submissionStatus === 'success' && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <Database className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ✅ Assessment saved successfully! Reference ID: <strong>{assessmentId}</strong>
                <br />
                <span className="flex items-center mt-2 text-sm">
                  <Mail className="h-3 w-3 mr-1" />
                  A copy will be sent to {formData.workEmail}
                </span>
              </AlertDescription>
            </Alert>
          )}

          {submissionStatus === 'error' && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                ⚠️ Could not save assessment: {submissionError}
                <br />
                <span className="text-sm">Your results are still displayed below and temporarily stored locally.</span>
              </AlertDescription>
            </Alert>
          )}

          {/* Eligibility Status Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 bg-white">
              <StatusIcon className="h-8 w-8" />
              <Badge variant={statusConfig.badgeVariant} className="text-xl px-4 py-2">
                {statusConfig.badge}
              </Badge>
            </div>
            <p className={`mt-4 text-lg ${statusConfig.color}`}>
              {statusConfig.message}
            </p>
          </div>

          {/* Company Summary Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl text-gray-800 mb-4">Assessment Summary for {formData.companyName}</h3>
            
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="text-gray-700 mb-2">Contact Information</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><strong>Contact Person:</strong> {formData.firstName} {formData.lastName}</div>
                <div><strong>Job Title:</strong> {formData.jobTitle}</div>
                <div><strong>Email:</strong> {formData.workEmail}</div>
                <div><strong>Phone:</strong> {formData.phoneNumber}</div>
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-gray-700 mb-2">Company Details</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><strong>Total Employees:</strong> {formData.totalEmployees}</div>
                <div><strong>Business Type:</strong> {formData.businessType}</div>
                <div><strong>Industry:</strong> {formData.industryCategory}</div>
                <div><strong>Workforce Type:</strong> {formData.workforceType}</div>
                <div><strong>Communication Rating:</strong> {communicationLabels[formData.communicationStrength as keyof typeof communicationLabels]}</div>
                <div><strong>Wellness Goals Selected:</strong> {formData.wellnessGoals.length}</div>
              </div>
            </div>
          </div>

          {/* Score and Analysis */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Eligibility Score */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg text-gray-800 mb-4">Eligibility Score</h3>
              <div className="text-center">
                <div className={`text-4xl mb-2 ${statusConfig.color}`}>{results.score}/100</div>
                <Progress value={results.score} className="w-full h-3 mb-2" />
                <p className="text-sm text-gray-600">
                  {results.eligibilityStatus === 'eligible' ? 'Excellent Score!' : 
                   results.eligibilityStatus === 'may-be-eligible' ? 'Moderate Score' : 'Below Threshold'}
                </p>
              </div>
            </div>

            {/* Key Factors */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg text-gray-800 mb-4">Assessment Factors</h3>
              <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                {results.factors.map((factor, index) => (
                  <div key={index} className="flex items-start">
                    <span className="mr-2 mt-0.5">•</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className={`${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-xl p-6 mb-6`}>
            <h3 className={`text-lg ${statusConfig.color} mb-3`}>
              {results.eligibilityStatus === 'eligible' ? '🎉 Congratulations! Next Steps:' :
               results.eligibilityStatus === 'may-be-eligible' ? '⚠️ Potential Eligibility - Next Steps:' :
               '❌ Not Currently Eligible - Future Opportunities:'}
            </h3>
            <ul className={`${statusConfig.color} space-y-2 text-sm`}>
              {getNextStepsContent().map((step, index) => (
                <li key={index} className="flex items-center">
                  <span className={`w-2 h-2 ${statusConfig.progressColor} rounded-full mr-3`}></span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <Button onClick={onStartOver} variant="outline">
              Start New Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}