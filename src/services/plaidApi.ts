export interface PlaidLinkTokenRequest {
  type: string;
}

export interface PlaidLinkTokenResponse {
  linkToken: string;
  expiration: string;
  requestId: string;
  hostedLinkUrl: string | null;
}

export interface PlaidExchangeTokenRequest {
  products: string[];
  institutionName: string;
  publicToken: string;
}

export interface PlaidExchangeTokenResponse {
  success: boolean;
  message?: string;
}

const API_BASE_URL = 'http://localhost:9002/api/v1';

export const plaidApi = {
  async getLinkToken(type: string): Promise<PlaidLinkTokenResponse> {
    const response = await fetch(`${API_BASE_URL}/integrations/plaid/link-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ type }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get Plaid link token: ${response.statusText}`);
    }

    return response.json();
  },

  async exchangeToken(data: PlaidExchangeTokenRequest): Promise<PlaidExchangeTokenResponse> {
    const response = await fetch(`${API_BASE_URL}/integrations/plaid/exchange-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange Plaid token: ${response.statusText}`);
    }

    return response.json();
  },
};