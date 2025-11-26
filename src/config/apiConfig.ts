// API Configuration
// In production, these values should come from environment variables
export interface ApiConfig {
  endpoint: string;
  apiKey: string;
  headers?: Record<string, string>;
  timeout?: number;
}

// Default configuration - DO NOT commit real API keys to version control
export const getApiConfig = (): ApiConfig => {
  // In production, use environment variables
  const apiKey =
    process.env.REACT_APP_API_KEY || "YOUR_API_KEY_HERE";
  const endpoint =
    process.env.REACT_APP_API_ENDPOINT ||
    "https://fp-eligibility.scalarity.io/api/check-eligibility";

  if (apiKey === "YOUR_API_KEY_HERE") {
    console.warn(
      "⚠️ API key not configured. Please set REACT_APP_API_KEY environment variable.",
    );
  }

  return {
    endpoint,
    apiKey,
    headers: {
      "X-Client-Name": "fitness-calculator",
      "X-Client-Version": "1.0.0",
    },
    timeout: 30000,
  };
};

// For development/testing only - remove in production
export const DEV_API_CONFIG: ApiConfig = {
  endpoint:
    "https://fp-eligibility.scalarity.io/api/check-eligibility",
  apiKey: "scaWqk4uN8dPrrSewbKLyjE6rlhL5o4v", // This should be removed before production
  headers: {
    "X-Client-Name": "fitness-calculator",
    "X-Client-Version": "1.0.0",
  },
  timeout: 30000,
};