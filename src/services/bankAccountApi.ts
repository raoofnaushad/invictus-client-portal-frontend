import { BankAccount, BankAccountFilters } from '@/types/bankAccount';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

// Mock data for fallback
const mockBankAccounts: BankAccount[] = [
  {
    "id": "ndze65jW5gCBPovloNAyTR7mlkDLn7CAl7wng",
    "createdAt": null,
    "updatedAt": null,
    "lasEventType": null,
    "lastEventAt": null,
    "name": "Plaid Money Market",
    "assetClass": "depository",
    "externalId": "ndze65jW5gCBPovloNAyTR7mlkDLn7CAl7wng",
    "dataSource": null,
    "assetSubclass": "money market",
    "acquisitionDate": null,
    "accountNumber": "4444",
    "currency": "USD",
    "financialInstitution": "Plaid Bank",
    "balance": 43200.0,
    "transactions": [],
    "holdings": null,
    "liabilities": null
  },
  {
    "id": "nlebwVLwknixVeEJlWqEsRVRWW3QwmCAlmkQ9",
    "createdAt": null,
    "updatedAt": null,
    "lasEventType": null,
    "lastEventAt": null,
    "name": "Plaid Checking",
    "assetClass": "depository",
    "externalId": "nlebwVLwknixVeEJlWqEsRVRWW3QwmCAlmkQ9",
    "dataSource": null,
    "assetSubclass": "checking",
    "acquisitionDate": null,
    "accountNumber": "0000",
    "currency": "USD",
    "financialInstitution": "Plaid Bank",
    "balance": 100.0,
    "transactions": [],
    "holdings": null,
    "liabilities": null
  }
];

class BankAccountApiService {
  private baseUrl = 'http://localhost:9002/api/v1/portfolios/all';

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getBankAccounts(
    pagination: PaginationParams,   
    filters?: BankAccountFilters
  ): Promise<PaginatedResponse<BankAccount>> {
    try {
      const response = await fetch(`${this.baseUrl}/accounts`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bank accounts');
      }

      const accounts: BankAccount[] = await response.json();
      
      // Apply filters
      let filteredAccounts = accounts;
      
      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredAccounts = filteredAccounts.filter(account =>
          account.name.toLowerCase().includes(searchLower) ||
          account.accountNumber.includes(searchLower) ||
          account.financialInstitution.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.assetSubclass?.length) {
        filteredAccounts = filteredAccounts.filter(account =>
          filters.assetSubclass!.includes(account.assetSubclass)
        );
      }

      if (filters?.currency?.length) {
        filteredAccounts = filteredAccounts.filter(account =>
          filters.currency!.includes(account.currency)
        );
      }

      if (filters?.financialInstitution?.length) {
        filteredAccounts = filteredAccounts.filter(account =>
          filters.financialInstitution!.includes(account.financialInstitution)
        );
      }

      if (filters?.balanceRange) {
        filteredAccounts = filteredAccounts.filter(account =>
          account.balance >= filters.balanceRange!.min &&
          account.balance <= filters.balanceRange!.max
        );
      }

      // Apply pagination
      const totalItems = filteredAccounts.length;
      const totalPages = Math.ceil(totalItems / pagination.limit);
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

      return {
        data: paginatedAccounts,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          totalPages,
          totalItems,
        },
      };
    } catch (error) {
      console.error('Error fetching bank accounts from API, using mock data:', error);
      
      // Fallback to mock data
      let filteredAccounts = [...mockBankAccounts];
      
      // Apply filters
      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredAccounts = filteredAccounts.filter(account =>
          account.name.toLowerCase().includes(searchLower) ||
          account.accountNumber.includes(searchLower) ||
          account.financialInstitution.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.assetSubclass?.length) {
        filteredAccounts = filteredAccounts.filter(account =>
          filters.assetSubclass!.includes(account.assetSubclass)
        );
      }

      if (filters?.currency?.length) {
        filteredAccounts = filteredAccounts.filter(account =>
          filters.currency!.includes(account.currency)
        );
      }

      if (filters?.financialInstitution?.length) {
        filteredAccounts = filteredAccounts.filter(account =>
          filters.financialInstitution!.includes(account.financialInstitution)
        );
      }

      if (filters?.balanceRange) {
        filteredAccounts = filteredAccounts.filter(account =>
          account.balance >= filters.balanceRange!.min &&
          account.balance <= filters.balanceRange!.max
        );
      }

      // Apply pagination
      const totalItems = filteredAccounts.length;
      const totalPages = Math.ceil(totalItems / pagination.limit);
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

      return {
        data: paginatedAccounts,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          totalPages,
          totalItems,
        },
      };
    }
  }

  async getBankAccountById(id: string): Promise<BankAccount> {
    try {
      const response = await fetch(`${this.baseUrl}/accounts`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bank accounts');
      }

      const accounts: BankAccount[] = await response.json();
      const account = accounts.find(acc => acc.id === id);
      
      if (!account) {
        throw new Error('Bank account not found');
      }
      
      return account;
    } catch (error) {
      console.error('Error fetching bank account from API, using mock data:', error);
      const account = mockBankAccounts.find(acc => acc.id === id);
      if (!account) {
        throw new Error('Bank account not found');
      }
      return account;
    }
  }

  getFilterOptions() {
    return {
      assetSubclasses: ['checking', 'savings', 'money market', 'cd'],
      currencies: ['USD', 'EUR', 'GBP', 'CAD'],
      financialInstitutions: ['Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'HSBC']
    };
  }
}

export const bankAccountApi = new BankAccountApiService();