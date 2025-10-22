import { mockProfileApi } from './mockProfileApi';

const USE_MOCK = false; // Force mock for development
const BASE_URL = 'http://localhost:9002/api/v1';

export interface UserCredential {
  id: string;
  createdAt: string;
  updatedAt: string;
  lasEventType: string | null;
  lastEventAt: string | null;
  username: string;
  fullName: string;
  phoneNumber: string;
  iamUserId: string;
  status: string;
  activationToken: string;
  activationTokenExpiry: string;
  mfaActivated: boolean;
  mfaChannel: string | null;
  totpSecret: string | null;
  refreshToken: string | null;
  isNew: boolean;
  authResponse: any | null;
}

export interface ProfileResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  lasEventType: string | null;
  lastEventAt: string | null;
  businessSpecInfo: any | null;
  alias: string;
  principalType: string | null;
  individualSpecInfo: any | null;
  phoneNumbers: any | null;
  emails: any | null;
  thirdPartyConnections: any | null;
  userCredential: UserCredential;
  isNew: boolean;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  alias?: string;
}

export interface MfaToggleRequest {
  enable: boolean;
}

export interface InitiateMfaRequest {
  method: 'sms' | 'email';
}

export interface ConfirmMfaRequest {
  method: 'sms' | 'email';
  code: string;
}

class ProfileApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'ProfileApiError';
  }
}

const profileApi = {
  async getProfile(): Promise<ProfileResponse> {
    if (USE_MOCK) {
      return mockProfileApi.getProfile();
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new ProfileApiError('No access token found', 401);
    }

    const response = await fetch(`${BASE_URL}/principals/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ProfileApiError(
        errorData.message || 'Failed to fetch profile',
        response.status,
        errorData.code
      );
    }

    return response.json();
  },

  async updateProfile(request: UpdateProfileRequest): Promise<ProfileResponse> {
    if (USE_MOCK) {
      return mockProfileApi.updateProfile(request);
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new ProfileApiError('No access token found', 401);
    }

    const response = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ProfileApiError(
        errorData.message || 'Failed to update profile',
        response.status,
        errorData.code
      );
    }

    return response.json();
  },

  async toggleMfa(request: MfaToggleRequest): Promise<void> {
    if (USE_MOCK) {
      return mockProfileApi.toggleMfa(request);
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new ProfileApiError('No access token found', 401);
    }

    const response = await fetch(`${BASE_URL}/profile/mfa`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ProfileApiError(
        errorData.message || 'Failed to toggle MFA',
        response.status,
        errorData.code
      );
    }
  },

  async initiateMfa(request: InitiateMfaRequest): Promise<void> {
    if (USE_MOCK) {
      return mockProfileApi.initiateMfa(request);
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new ProfileApiError('No access token found', 401);
    }

    const response = await fetch(`${BASE_URL}/profile/mfa/initiate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ProfileApiError(
        errorData.message || 'Failed to initiate MFA setup',
        response.status,
        errorData.code
      );
    }
  },

  async confirmMfa(request: ConfirmMfaRequest): Promise<void> {
    if (USE_MOCK) {
      return mockProfileApi.confirmMfa(request);
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new ProfileApiError('No access token found', 401);
    }

    const response = await fetch(`${BASE_URL}/profile/mfa/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ProfileApiError(
        errorData.message || 'Failed to confirm MFA setup',
        response.status,
        errorData.code
      );
    }
  },
};

export { profileApi, ProfileApiError };