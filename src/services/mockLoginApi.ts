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

// Mock credentials for testing
const VALID_USERNAME = 'test@example.com';
const VALID_PASSWORD = 'password';
const INVALID_CREDENTIALS_USERNAME = 'invalid@example.com';
const NETWORK_ERROR_USERNAME = 'network@error.com';

// Mock delay to simulate network requests
const mockDelay = (ms: number = 1200) => new Promise(resolve => setTimeout(resolve, ms));

export const mockLoginApi = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    await mockDelay(1200);

    // Simulate network error
    if (request.username === NETWORK_ERROR_USERNAME) {
      throw new LoginApiError('Network error', 500, 'NETWORK_ERROR');
    }

    // Simulate invalid credentials
    if (request.username === INVALID_CREDENTIALS_USERNAME || 
        (request.username !== VALID_USERNAME || request.password !== VALID_PASSWORD)) {
      throw new LoginApiError('Invalid username or password', 401, 'INVALID_CREDENTIALS');
    }

    // Mock successful login response
    return {
      accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJYYlNJQ2UtYVJEUm9kdHdhck9FY3kzRzhHSEtVSkVCaFM3TEN3WjdoamtNIn0.eyJleHAiOjE3NTg5MjM3NDYsImlhdCI6MTc1ODg4Nzc0NiwianRpIjoib25ydHJvOjNhMGUyNzU5LTE2Y2MtNDFkMi04YWQ5LTc3MTY3NmQ3ZDFkYiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9yZWFsbXMvY2xpZW50LXBvcnRhbCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJiYjRjZTBjNC1mMTZlLTQ4MmYtOGIxNi05ZjVmYWE2MDRjODkiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1jbGllbnQiLCJzaWQiOiI3ZWQ2YjlkNi1hZjBiLTQ2NDYtYjBkMS1jNDRhYmFhM2Y3MzIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIi8qIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWNsaWVudC1wb3J0YWwiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiZXN0OTk5MCB0ZXN0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZXN0OTM3NzAxQGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJlc3Q5OTkwIiwiZmFtaWx5X25hbWUiOiJ0ZXN0IiwiZW1haWwiOiJlc3Q5Mzc3MDFAZ21haWwuY29tIn0.QgPSkwl6F_4mTEQZHLKWOokN36yI0W0iByy2E8sCluYNaC8ZkU6GbjxrBkiusgs0CW8r2tbmKTiIEOpGGep539qNwMbDpz0oSCl_QgN4Zo5aHK3q5sFPvi0o4fcIhfdYRlpQ4mO3YVBr9OMUJwsJ2VdnrG3-rHn-gTa6bmZuL0nKgzPyHW1QhVa829KZnprMCRJHa-wU5zuwEn-kwUi2WuZNBJgsjdEbOgqpDCcP2SGyFxdNeJj0-urwcockaaq-Gi9YmazbWaY3ac8HokfZYM-L7j9AI7gx8R9dX-0Ylr-e2vGwRUtvyUNT_WNtVbdsWd8IY3IEKhHUjdtosB9xzQ",
      expiresIn: 36000,
      refreshExpiresIn: 1800,
      refreshToken: "eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhZWFhYzZhNC1lY2Q3LTQ4YjEtYjA4NC00NmY2YjE3ZDQyYzEifQ.eyJleHAiOjE3NTg4ODk1NDYsImlhdCI6MTc1ODg4Nzc0NiwianRpIjoiMzBkODhmMWMtZGYyMi00OThkLTg2ZmYtZGI4NjgxMDkzMDM2IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9jbGllbnQtcG9ydGFsIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9jbGllbnQtcG9ydGFsIiwic3ViIjoiYmI0Y2UwYzQtZjE2ZS00ODJmLThiMTYtOWY1ZmFhNjA0Yzg5IiwidHlwIjoiUmVmcmVzaCIsImF6cCI6ImFkbWluLWNsaWVudCIsInNpZCI6IjdlZDZiOWQ2LWFmMGItNDY0Ni1iMGQxLWM0NGFiYWEzZjczMiIsInNjb3BlIjoicm9sZXMgd2ViLW9yaWdpbnMgc2VydmljZV9hY2NvdW50IGJhc2ljIGVtYWlsIGFjciBwcm9maWxlIn0.z41d_t9ET9kqbwiq09Da8YsXyMKM_PQGc36Dymnn7QiX5Pd1vpPOjhTK9Aghoabj3FIsNE-vK_x-RxgkLucP7g",
      tokenType: "Bearer",
      notBeforePolicy: 0,
      sessionState: null,
      scope: "email profile"
    };
  },
};

// Export test credentials for easy testing
export const TEST_CREDENTIALS = {
  VALID: {
    username: VALID_USERNAME,
    password: VALID_PASSWORD
  },
  INVALID: {
    username: INVALID_CREDENTIALS_USERNAME,
    password: 'wrongpassword'
  },
  NETWORK_ERROR: {
    username: NETWORK_ERROR_USERNAME,
    password: 'password'
  }
};