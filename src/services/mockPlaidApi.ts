import { PlaidLinkTokenResponse, PlaidExchangeTokenRequest, PlaidExchangeTokenResponse } from './plaidApi';

// Mock tokens for testing different scenarios
const MOCK_TOKENS = {
  success: 'link-sandbox-success-token',
  error: 'link-sandbox-error-token',
  expired: 'link-sandbox-expired-token',
};

export const mockPlaidApi = {
  async getLinkToken(type: string): Promise<PlaidLinkTokenResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate different scenarios based on type
    if (type === 'Error') {
      throw new Error('Invalid account type');
    }

    if (type === 'Expired') {
      return {
        linkToken: MOCK_TOKENS.expired,
        expiration: new Date(Date.now() - 1000).toISOString(), // Expired token
        requestId: 'mock-request-expired',
        hostedLinkUrl: null,
      };
    }

    return {
      linkToken: MOCK_TOKENS.success,
      expiration: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      requestId: 'mock-request-success',
      hostedLinkUrl: null,
    };
  },

  async exchangeToken(data: PlaidExchangeTokenRequest): Promise<PlaidExchangeTokenResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Mock exchange token called with:', data);

    return {
      success: true,
      message: 'Token exchanged successfully',
    };
  },
};