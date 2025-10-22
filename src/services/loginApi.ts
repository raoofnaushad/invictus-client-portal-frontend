import { mockLoginApi, TEST_CREDENTIALS } from './mockLoginApi';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  refreshToken: string;
  tokenType: string;
  notBeforePolicy: number;
  sessionState: string | null;
  scope: string;
}

const API_BASE_URL = 'http://localhost:9002/api/v1/principals/public';
//const USE_MOCK = import.meta.env.DEV; // Use mock in development
const USE_MOCK = false;


export class LoginApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'LoginApiError';
  }
}

// Export test credentials for easy access
export { TEST_CREDENTIALS };

export const loginApi = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    if (USE_MOCK) {
      return mockLoginApi.login(request);
    }

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (response.status === 401) {
      throw new LoginApiError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new LoginApiError(
        errorData.message || 'Login failed',
        response.status
      );
    }

    return response.json();
  },

  // Token management utilities
  setTokens(tokens: LoginResponse): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('tokenExpiry', (Date.now() + tokens.expiresIn * 1000).toString());
  },

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  },

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !this.isTokenExpired();
  }
};