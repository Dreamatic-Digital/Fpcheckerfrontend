import { FormData } from '../App';

export interface ApiConfig {
  endpoint: string;
  apiKey: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ApiResponse {
  success: boolean;
  data?: {
    status: string;
    reason?: string;
    key_used?: string;
    matched_row?: any;
    notes?: string[];
  };
  error?: string;
}

export interface UtmParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  sc_email?: string;
  sc_phone?: string;
  sc_uid?: string;
  _gl?: string;  // GTM conversion linker parameter
  _ga?: string;  // Google Analytics client ID
  [key: string]: string | undefined;  // Allow any additional tracking parameters
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ApiService {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  /**
   * Validate form data before API submission
   */
  validateFormData(formData: FormData): ValidationResult {
    const errors: string[] = [];

    // Required field validation
    if (!formData.companyName?.trim()) errors.push('Company name is required');
    if (!formData.businessType) errors.push('Business type is required');
    if (!formData.industryCategory) errors.push('Industry category is required');
    if (!formData.hqPostalCode?.trim()) errors.push('HQ postal code is required');
    if (!formData.hqCity?.trim()) errors.push('HQ city is required');
    if (!formData.hqState) errors.push('HQ state is required');
    if (!formData.workforceType) errors.push('Workforce type is required');
    if (!formData.existingBenefits) errors.push('Existing benefits selection is required');
    if (!formData.firstName?.trim()) errors.push('First name is required');
    if (!formData.lastName?.trim()) errors.push('Last name is required');
    if (!formData.jobTitle?.trim()) errors.push('Job title is required');
    if (!formData.workEmail?.trim()) errors.push('Work email is required');
    if (!formData.phoneNumber?.trim()) errors.push('Phone number is required');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.workEmail && !emailRegex.test(formData.workEmail)) {
      errors.push('Valid email address is required');
    }

    // Number validation
    if (formData.hqEmployees < 0) errors.push('HQ employees must be 0 or greater');
    if (formData.totalEmployees < 1) errors.push('Total employees must be 1 or greater');
    if (formData.communicationStrength < 1 || formData.communicationStrength > 5) {
      errors.push('Communication strength must be between 1 and 5');
    }

    // Business logic validation
    const officeEmployees = formData.offices.reduce((sum, office) => sum + office.employees, 0);
    if (formData.totalEmployees < formData.hqEmployees + officeEmployees) {
      errors.push('Total employees should be greater than or equal to sum of all office employees');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Transform form data to API payload format
   */
  private transformFormDataToPayload(formData: FormData, utmParams?: UtmParameters): Record<string, any> {
    const payload: Record<string, any> = {
      company_name: formData.companyName,
      business_type: formData.businessType,
      industry_category: formData.industryCategory,
      hq_postal_code: formData.hqPostalCode,
      hq_city: formData.hqCity,
      hq_state: formData.hqState,
      hq_employees: formData.hqEmployees,
      total_employees: formData.totalEmployees,
      workforce_type: formData.workforceType,
      communication_strength: formData.communicationStrength,
      offices: formData.offices,
      wellness_goals: formData.wellnessGoals,
      existing_benefits: formData.existingBenefits,
      current_benefits: formData.currentBenefits,
      first_name: formData.firstName,
      last_name: formData.lastName,
      job_title: formData.jobTitle,
      work_email: formData.workEmail,
      phone_number: formData.phoneNumber
    };

    // Include all UTM and tracking parameters if provided
    if (utmParams) {
      // Merge all tracking parameters into the payload
      Object.keys(utmParams).forEach(key => {
        const value = utmParams[key as keyof UtmParameters];
        if (value !== undefined) {
          payload[key] = value;
        }
      });
    }

    return payload;
  }

  /**
   * Submit form data to API
   */
  async submitFormData(formData: FormData, utmParams?: UtmParameters): Promise<ApiResponse> {
    try {
      const payload = this.transformFormDataToPayload(formData, utmParams);
      
      console.log('📤 Submitting to API:', {
        endpoint: this.config.endpoint,
        payload: { ...payload, phone_number: '[REDACTED]', work_email: '[REDACTED]' },
        utmParams: utmParams || 'No UTM parameters'
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout || 30000);

      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
          ...this.config.headers
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        return {
          success: false,
          error: `API Error: ${response.status} ${response.statusText}`
        };
      }

      const result = await response.json();
      console.log('✅ API Success Response:', result);

      return {
        success: true,
        data: result.data || result
      };

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏰ API Request Timeout');
        return {
          success: false,
          error: 'Request timeout - please try again'
        };
      }

      console.error('💥 API Submission Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

/**
 * Factory function to create API service instance
 */
export function createApiService(config: ApiConfig): ApiService {
  return new ApiService(config);
}

export type { FormData };