import { InvestmentAccount, InvestmentHolding, InvestmentTransaction } from '@/types/investmentAccount';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface InvestmentAccountFilters {
  assetClass?: string;
  financialInstitution?: string;
  currency?: string;
  search?: string;
}

export interface SecurityFilters {
  assetClass?: string;
  ticker?: string;
  search?: string;
}

export interface TransactionFilters {
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalItems: number;
  };
}

// Export Transaction type for backward compatibility
export type Transaction = InvestmentTransaction;

// Mock data for investment accounts - matching the new API structure
const mockInvestmentAccounts: InvestmentAccount[] = [
  {
    id: "Qy56RJknJvsG7KXLK1lqtRPl5EnkePCwmLEJ4",
    createdAt: null,
    updatedAt: null,
    lasEventType: null,
    lastEventAt: null,
    name: "Plaid 401k",
    assetClass: "investment",
    externalId: "Qy56RJknJvsG7KXLK1lqtRPl5EnkePCwmLEJ4",
    dataSource: null,
    assetSubclass: "401k",
    acquisitionDate: null,
    accountNumber: "6666",
    currency: "USD",
    financialInstitution: "Tartan Bank",
    balance: 0,
    transactions: null,
    holdings: [
      {
        id: "Qy56RJknJvsG7KXLK1lqtRPl5EnkePCwmLEJ4-QDQ13y1Ezxt51QbDb6A8cjk9EK978our9NaAM",
        createdAt: null,
        updatedAt: null,
        lasEventType: null,
        lastEventAt: null,
        name: "United States Treas Bills 0.000% 10/31/24 B/E Dtd 11/02/23 N/C",
        assetClass: "investment",
        externalId: "Qy56RJknJvsG7KXLK1lqtRPl5EnkePCwmLEJ4-QDQ13y1Ezxt51QbDb6A8cjk9EK978our9NaAM",
        dataSource: "PLAID",
        assetSubclass: "fixed income",
        acquisitionDate: null,
        securityId: "QDQ13y1Ezxt51QbDb6A8cjk9EK978our9NaAM",
        ticker: null,
        custodian: null,
        aquisitionValue: 948.08,
        accountId: "Qy56RJknJvsG7KXLK1lqtRPl5EnkePCwmLEJ4",
        financialInstitution: null,
        currentValue: 94.808,
        currentValueDate: null,
        currency: "USD",
        units: 10.0,
        transactions: [
          {
            id: "Wn5VBR9rRlceBgXoglvxtowEwXAPndt6Zd4xn",
            createdAt: null,
            updatedAt: null,
            lasEventType: null,
            lastEventAt: null,
            assetId: "QDQ13y1Ezxt51QbDb6A8cjk9EK978our9NaAM",
            date: "2025-09-20",
            externalId: "Wn5VBR9rRlceBgXoglvxtowEwXAPndt6Zd4xn",
            dataSource: "PLAID",
            type: "buy",
            subType: "buy",
            amount: 948.08,
            description: "BUY United States Treas Bills 0.000% 10/31/24 B/E Dtd 11/02/23 N/C",
            currency: "USD",
            pricePerUnit: null,
            fees: 0.0,
            units: 10.0
          },
          {
            id: "jzlNRbaob1c3GEv4EjPyCdwewzEjpbC6WNGQG",
            createdAt: null,
            updatedAt: null,
            lasEventType: null,
            lastEventAt: null,
            assetId: "QDQ13y1Ezxt51QbDb6A8cjk9EK978our9NaAM",
            date: "2025-09-10",
            externalId: "jzlNRbaob1c3GEv4EjPyCdwewzEjpbC6WNGQG",
            dataSource: "PLAID",
            type: "buy",
            subType: "buy",
            amount: 948.08,
            description: "BUY United States Treas Bills 0.000% 10/31/24 B/E Dtd 11/02/23 N/C",
            currency: "USD",
            pricePerUnit: null,
            fees: 0.0,
            units: 10.0
          }
        ]
      },
      {
        id: "Qy56RJknJvsG7KXLK1lqtRPl5EnkePCwmLEJ4-nnmo8doZ4lfKNEDe3mPJipLGkaGw3jfPrpxoN",
        createdAt: null,
        updatedAt: null,
        lasEventType: null,
        lastEventAt: null,
        name: "NH PORTFOLIO 1055 (FIDELITY INDEX)",
        assetClass: "investment",
        externalId: "Qy56RJknJvsG7KXLK1lqtRPl5EnkePCwmLEJ4-nnmo8doZ4lfKNEDe3mPJipLGkaGw3jfPrpxoN",
        dataSource: "PLAID",
        assetSubclass: "etf",
        acquisitionDate: null,
        securityId: "nnmo8doZ4lfKNEDe3mPJipLGkaGw3jfPrpxoN",
        ticker: "NHX105509",
        custodian: null,
        aquisitionValue: 15.0,
        accountId: "Qy56RJknJvsG7KXLK1lqtRPl5EnkePCwmLEJ4",
        financialInstitution: null,
        currentValue: 13.73,
        currentValueDate: null,
        currency: "USD",
        units: 100.05,
        transactions: [
          {
            id: "GX5AVQm1Q8ckXmdLmyV9ueygyXaG7qI6MVnwQ",
            createdAt: null,
            updatedAt: null,
            lasEventType: null,
            lastEventAt: null,
            assetId: "nnmo8doZ4lfKNEDe3mPJipLGkaGw3jfPrpxoN",
            date: "2025-09-23",
            externalId: "GX5AVQm1Q8ckXmdLmyV9ueygyXaG7qI6MVnwQ",
            dataSource: "PLAID",
            type: "buy",
            subType: "buy",
            amount: 466.71,
            description: "BUY FIDELITY INDEX 1055",
            currency: "USD",
            pricePerUnit: null,
            fees: 1.95,
            units: 33.99208384602773
          }
        ]
      }
    ],
    liabilities: null
  }
];

export class InvestmentApiService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async getInvestmentAccounts(
    pagination: PaginationParams,
    filters?: InvestmentAccountFilters
  ): Promise<PaginatedResponse<InvestmentAccount>> {
    try {
      // Try to fetch from real API first
      const response = await fetch('http://localhost:9002/api/v1/portfolios/all/investment-accounts', {
        headers: this.getAuthHeaders()
      });
      if (response.ok) {
        const accounts: InvestmentAccount[] = await response.json();
        
        let filteredAccounts = [...accounts];

        // Apply filters
        if (filters) {
          if (filters.assetClass) {
            filteredAccounts = filteredAccounts.filter(account => 
              account.assetClass.toLowerCase().includes(filters.assetClass!.toLowerCase())
            );
          }
          if (filters.financialInstitution) {
            filteredAccounts = filteredAccounts.filter(account => 
              account.financialInstitution.toLowerCase().includes(filters.financialInstitution!.toLowerCase())
            );
          }
          if (filters.currency) {
            filteredAccounts = filteredAccounts.filter(account => 
              account.currency === filters.currency
            );
          }
          if (filters.search) {
            filteredAccounts = filteredAccounts.filter(account => 
              account.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
              account.accountNumber.toLowerCase().includes(filters.search!.toLowerCase())
            );
          }
        }

        // Apply pagination
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedData = filteredAccounts.slice(startIndex, endIndex);

        return {
          data: paginatedData,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: filteredAccounts.length,
            totalPages: Math.ceil(filteredAccounts.length / pagination.limit),
            totalItems: filteredAccounts.length
          }
        };
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredAccounts = [...mockInvestmentAccounts];

    // Apply filters
    if (filters) {
      if (filters.assetClass) {
        filteredAccounts = filteredAccounts.filter(account => 
          account.assetClass.toLowerCase().includes(filters.assetClass!.toLowerCase())
        );
      }
      if (filters.financialInstitution) {
        filteredAccounts = filteredAccounts.filter(account => 
          account.financialInstitution.toLowerCase().includes(filters.financialInstitution!.toLowerCase())
        );
      }
      if (filters.currency) {
        filteredAccounts = filteredAccounts.filter(account => 
          account.currency === filters.currency
        );
      }
      if (filters.search) {
        filteredAccounts = filteredAccounts.filter(account => 
          account.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          account.accountNumber.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
    }

    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedData = filteredAccounts.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: filteredAccounts.length,
        totalPages: Math.ceil(filteredAccounts.length / pagination.limit),
        totalItems: filteredAccounts.length
      }
    };
  }

  static async getInvestmentAccount(id: string): Promise<InvestmentAccount | null> {
    try {
      // Try to fetch from real API first
      const response = await fetch('http://localhost:9002/api/v1/portfolios/all/accounts', {
        headers: this.getAuthHeaders()
      });
      if (response.ok) {
        const accounts: InvestmentAccount[] = await response.json();
        const account = accounts.find(account => account.id === id);
        return account || null;
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const account = mockInvestmentAccounts.find(account => account.id === id);
    return account || null;
  }

  static async getSecurities(
    accountId: string,
    pagination: PaginationParams,
    filters?: SecurityFilters
  ): Promise<PaginatedResponse<InvestmentHolding>> {
    // Get the account first to access its holdings
    const account = await this.getInvestmentAccount(accountId);
    if (!account) {
      return {
        data: [],
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: 0,
          totalPages: 0,
          totalItems: 0
        }
      };
    }

    let filteredHoldings = [...account.holdings];

    // Apply filters
    if (filters) {
      if (filters.assetClass) {
        filteredHoldings = filteredHoldings.filter(holding => 
          holding.assetSubclass.toLowerCase().includes(filters.assetClass!.toLowerCase())
        );
      }
      if (filters.ticker) {
        filteredHoldings = filteredHoldings.filter(holding => 
          holding.ticker?.toLowerCase().includes(filters.ticker!.toLowerCase())
        );
      }
      if (filters.search) {
        filteredHoldings = filteredHoldings.filter(holding => 
          holding.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          (holding.ticker && holding.ticker.toLowerCase().includes(filters.search!.toLowerCase()))
        );
      }
    }

    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedData = filteredHoldings.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: filteredHoldings.length,
        totalPages: Math.ceil(filteredHoldings.length / pagination.limit),
        totalItems: filteredHoldings.length
      }
    };
  }

  static async getTransactions(
    accountId?: string,
    pagination?: PaginationParams,
    filters?: TransactionFilters
  ): Promise<PaginatedResponse<InvestmentTransaction>> {
    // Get all accounts to access their holdings and transactions
    const accountsResponse = await this.getInvestmentAccounts({ page: 1, limit: 1000 });
    const accounts = accountsResponse.data;

    let allTransactions: InvestmentTransaction[] = [];

    // Collect all transactions from all holdings
    accounts.forEach(account => {
      if (!accountId || account.id === accountId) {
        account.holdings.forEach(holding => {
          allTransactions.push(...holding.transactions);
        });
      }
    });

    // Apply filters
    if (filters) {
      if (filters.type) {
        allTransactions = allTransactions.filter(transaction => 
          transaction.type.toLowerCase().includes(filters.type!.toLowerCase())
        );
      }
      if (filters.dateFrom) {
        allTransactions = allTransactions.filter(transaction => 
          new Date(transaction.date) >= new Date(filters.dateFrom!)
        );
      }
      if (filters.dateTo) {
        allTransactions = allTransactions.filter(transaction => 
          new Date(transaction.date) <= new Date(filters.dateTo!)
        );
      }
      if (filters.amountMin !== undefined) {
        allTransactions = allTransactions.filter(transaction => 
          Math.abs(transaction.amount) >= filters.amountMin!
        );
      }
      if (filters.amountMax !== undefined) {
        allTransactions = allTransactions.filter(transaction => 
          Math.abs(transaction.amount) <= filters.amountMax!
        );
      }
      if (filters.search) {
        allTransactions = allTransactions.filter(transaction => 
          transaction.description.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
    }

    // Apply pagination
    const paginationParams = pagination || { page: 1, limit: 10 };
    const startIndex = (paginationParams.page - 1) * paginationParams.limit;
    const endIndex = startIndex + paginationParams.limit;
    const paginatedData = allTransactions.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page: paginationParams.page,
        limit: paginationParams.limit,
        total: allTransactions.length,
        totalPages: Math.ceil(allTransactions.length / paginationParams.limit),
        totalItems: allTransactions.length
      }
    };
  }

  static async getInvestmentAccountFilterOptions(): Promise<{
    assetClasses: string[];
    financialInstitutions: string[];
    currencies: string[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const assetClasses = [...new Set(mockInvestmentAccounts.map(acc => acc.assetClass))];
    const financialInstitutions = [...new Set(mockInvestmentAccounts.map(acc => acc.financialInstitution))];
    const currencies = [...new Set(mockInvestmentAccounts.map(acc => acc.currency))];
    
    return {
      assetClasses,
      financialInstitutions,
      currencies
    };
  }

  static async getTransactionFilterOptions(): Promise<{
    types: string[];
    statuses: string[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      types: ["buy", "sell", "dividend", "fee"],
      statuses: ["completed", "pending", "failed"]
    };
  }
}