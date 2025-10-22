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

// Mock tokens for testing
const WORKING_TOKEN = 'WORKING_TOKEN_123';
const INVALID_TOKEN = 'INVALID_TOKEN_456';
const NOT_ELIGIBLE_TOKEN = 'NOT_ELIGIBLE_TOKEN_789';
const MFA_ERROR_TOKEN = 'MFA_ERROR_TOKEN_101';
const CONFIRM_ERROR_TOKEN = 'CONFIRM_ERROR_TOKEN_202';

// Mock delay to simulate network requests
const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const mockOnboardingApi = {
  async getProfileByActivationToken(activationToken: string): Promise<ProfileResponse> {
    await mockDelay(800);

    if (activationToken === INVALID_TOKEN) {
      throw new OnboardingApiError('Invalid activation token', 401, 'INVALID_TOKEN');
    }

    if (activationToken === NOT_ELIGIBLE_TOKEN) {
      // Return a profile with wrong status
      return {
        id: "pcl-not-eligible",
        userCredential: {
          id: "ucd-not-eligible",
          username: "noteligible@test.com",
          fullName: "Not Eligible User",
          status: "ACTIVE", // Wrong status
          activationToken,
          activationTokenExpiry: "2025-09-28T11:19:13.985755",
          mfaActivated: false,
          mfaChannel: null,
        }
      };
    }

    // Default working response
    return {
      id: "pcl-3d8c0a6e-eba8-4d54-9916-400aad3b642b",
      userCredential: {
        id: "ucd-dc03105f-36d4-4f87-9ccd-feb99de89a1b",
        username: "test@example.com",
        fullName: "Test User",
        status: "PENDING_EMAIL_VERIFICATION",
        activationToken,
        activationTokenExpiry: "2025-09-28T11:19:13.985755",
        mfaActivated: false,
        mfaChannel: null,
      }
    };
  },

  async activateAccount(request: ActivateAccountRequest): Promise<ProfileResponse> {
    await mockDelay(1200);

    if (request.activationToken === INVALID_TOKEN) {
      throw new OnboardingApiError('Invalid activation token', 401);
    }

    if (request.newPassword.length < 6) {
      throw new OnboardingApiError('Password too short', 400);
    }

    // Return updated profile with PENDING_MFA_ACTIVATION status
    return {
      id: "pcl-3d8c0a6e-eba8-4d54-9916-400aad3b642b",
      userCredential: {
        id: "ucd-dc03105f-36d4-4f87-9ccd-feb99de89a1b",
        username: "test@example.com",
        fullName: "Test User",
        status: "PENDING_MFA_ACTIVATION",
        activationToken: request.activationToken,
        activationTokenExpiry: "2025-09-28T11:19:13.985755",
        mfaActivated: false,
        mfaChannel: null,
      }
    };
  },

  async activateMfa(request: ActivateMfaRequest): Promise<void> {
    await mockDelay(1000);

    if (request.activationToken === MFA_ERROR_TOKEN) {
      throw new OnboardingApiError('Failed to send verification code', 400);
    }

    if (request.channel === 'sms' && !request.phoneNumber) {
      throw new OnboardingApiError('Phone number required for SMS', 400);
    }

    if (request.channel === 'email' && !request.email) {
      throw new OnboardingApiError('Email required for email verification', 400);
    }

    // Success - no return value (void)
  },

  async confirmMfa(request: ConfirmMfaRequest): Promise<void> {
    await mockDelay(800);

    if (request.activationToken === CONFIRM_ERROR_TOKEN) {
      throw new OnboardingApiError('Invalid verification code', 400);
    }

    if (request.otp !== '123456') {
      throw new OnboardingApiError('Invalid verification code', 400);
    }

    // Success - no return value (void)
  },
};

// Export test tokens for easy testing
export const TEST_TOKENS = {
  WORKING: WORKING_TOKEN,
  INVALID: INVALID_TOKEN,
  NOT_ELIGIBLE: NOT_ELIGIBLE_TOKEN,
  MFA_ERROR: MFA_ERROR_TOKEN,
  CONFIRM_ERROR: CONFIRM_ERROR_TOKEN,
};