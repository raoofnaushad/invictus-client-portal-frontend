import { mockOnboardingApi, TEST_TOKENS } from './mockOnboardingApi';

export interface ProfileResponse {
  id: string;
  userCredential: {
    id: string;
    username: string;
    fullName: string;
    status: string;
    activationToken: string;
    activationTokenExpiry: string;
    mfaActivated: boolean;
    mfaChannel: string | null;
  };
}

export interface ActivateAccountRequest {
  activationToken: string;
  tempPassword: string;
  newPassword: string;
}

export interface ActivateMfaRequest {
  activationToken: string;
  channel: 'sms' | 'email';
  phoneNumber?: string;
  email?: string;
}

export interface ConfirmMfaRequest {
  activationToken: string;
  otp: string;
}

const API_BASE_URL = 'http://localhost:9002/api/v1/principals/public';
//const USE_MOCK = import.meta.env.DEV; // Use mock in development
const USE_MOCK = false;
export class OnboardingApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'OnboardingApiError';
  }
}

// Export test tokens for easy access
export { TEST_TOKENS };

export const onboardingApi = {
  async getProfileByActivationToken(activationToken: string): Promise<ProfileResponse> {
    if (USE_MOCK) {
      return mockOnboardingApi.getProfileByActivationToken(activationToken);
    }

    const response = await fetch(
      `${API_BASE_URL}/profileByActivationToken?activationToken=${activationToken}`
    );

    if (response.status === 401) {
      throw new OnboardingApiError('Invalid activation token', 401, 'INVALID_TOKEN');
    }

    if (!response.ok) {
      throw new OnboardingApiError('Failed to fetch profile', response.status);
    }

    const data = await response.json();
    
    if (data.userCredential?.status !== 'PENDING_EMAIL_VERIFICATION') {
      throw new OnboardingApiError('Account not eligible for onboarding', 400, 'ACCOUNT_NOT_ELIGIBLE');
    }

    return data;
  },

  async activateAccount(request: ActivateAccountRequest): Promise<ProfileResponse> {
    if (USE_MOCK) {
      return mockOnboardingApi.activateAccount(request);
    }

    const response = await fetch(`${API_BASE_URL}/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new OnboardingApiError(
        errorData.message || 'Failed to activate account',
        response.status
      );
    }

    return response.json();
  },

  async activateMfa(request: ActivateMfaRequest): Promise<void> {
    if (USE_MOCK) {
      return mockOnboardingApi.activateMfa(request);
    }

    const response = await fetch(`${API_BASE_URL}/activateMfaByToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (response.status !== 202) {
      const errorData = await response.json().catch(() => ({}));
      throw new OnboardingApiError(
        errorData.message || 'Failed to activate MFA',
        response.status
      );
    }
  },

  async confirmMfa(request: ConfirmMfaRequest): Promise<void> {
    if (USE_MOCK) {
      return mockOnboardingApi.confirmMfa(request);
    }

    const response = await fetch(`${API_BASE_URL}/activateMfaByToken/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (response.status !== 204) {
      const errorData = await response.json().catch(() => ({}));
      throw new OnboardingApiError(
        errorData.message || 'Failed to confirm MFA',
        response.status
      );
    }
  },
};