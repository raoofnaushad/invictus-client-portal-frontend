const BASE_URL = 'http://localhost:9002/api/v1';

export interface UpdateSettingsRequest {
  fullName: string;
  phoneNumber: string;
  organizationName: string;
  email: string;
}

export class SettingsApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'SettingsApiError';
  }
}

export const settingsApi = {
  async updateSettings(request: UpdateSettingsRequest): Promise<void> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new SettingsApiError('No access token found', 401);
    }

    const response = await fetch(`${BASE_URL}/principals/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new SettingsApiError(
        errorData.message || 'Failed to update settings',
        response.status,
        errorData.code
      );
    }
  },
};