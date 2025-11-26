import { FormData } from '../App';

export interface AssessmentResult {
  id?: string;
  formData: FormData;
  eligibilityScore: number;
  eligibilityStatus: 'eligible' | 'may-be-eligible' | 'not-eligible';
  factors: string[];
  recommendations: string[];
  submittedAt: string;
}

export interface AssessmentSubmissionResponse {
  success: boolean;
  assessmentId?: string;
  error?: string;
}

// Mock API for demonstration - replace with actual Supabase integration
class AssessmentService {
  private baseUrl = 'YOUR_API_ENDPOINT_HERE'; // Replace with your actual API endpoint

  async submitAssessment(assessmentResult: AssessmentResult): Promise<AssessmentSubmissionResponse> {
    try {
      // For now, we'll simulate the API call
      console.log('Submitting assessment to database:', assessmentResult);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful response
      const mockResponse: AssessmentSubmissionResponse = {
        success: true,
        assessmentId: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // Store in localStorage as a fallback
      this.storeLocally(assessmentResult, mockResponse.assessmentId!);
      
      return mockResponse;

      // Uncomment this when you have a real API endpoint:
      /*
      const response = await fetch(`${this.baseUrl}/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentResult),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        assessmentId: data.id
      };
      */
    } catch (error) {
      console.error('Error submitting assessment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private storeLocally(assessmentResult: AssessmentResult, assessmentId: string) {
    try {
      const assessments = this.getLocalAssessments();
      const newAssessment = { ...assessmentResult, id: assessmentId };
      assessments.push(newAssessment);
      
      localStorage.setItem('fitness-assessments', JSON.stringify(assessments));
    } catch (error) {
      console.error('Error storing assessment locally:', error);
    }
  }

  getLocalAssessments(): AssessmentResult[] {
    try {
      const stored = localStorage.getItem('fitness-assessments');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving local assessments:', error);
      return [];
    }
  }

  async getAssessment(assessmentId: string): Promise<AssessmentResult | null> {
    try {
      // Check local storage first
      const localAssessments = this.getLocalAssessments();
      const localAssessment = localAssessments.find(a => a.id === assessmentId);
      if (localAssessment) {
        return localAssessment;
      }

      // If you have a real API, uncomment this:
      /*
      const response = await fetch(`${this.baseUrl}/assessments/${assessmentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
      */

      return null;
    } catch (error) {
      console.error('Error retrieving assessment:', error);
      return null;
    }
  }
}

export const assessmentService = new AssessmentService();