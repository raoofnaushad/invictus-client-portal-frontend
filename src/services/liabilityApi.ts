// Liability API Services
import { LiabilityAccount } from "@/types/liabilityAccount";

export interface LiabilityFilters {
  searchTerm?: string;
  assetClass?: string[];
  assetSubclass?: string[];
  type?: string[];
  status?: string[];
  bankName?: string[];
  currency?: string[];
  financialInstitution?: string[];
  balanceRange?: {
    min: number;
    max: number;
  };
  interestRateRange?: {
    min: number;
    max: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

// Mock data based on the new API structure
const mockLiabilities: LiabilityAccount[] = [
  {
    id: "B7o8W5arVVhZG8BDdmePhzB6MooZMrf4MmwoG",
    createdAt: null,
    updatedAt: null,
    lasEventType: null,
    lastEventAt: null,
    name: "Plaid Credit Card",
    assetClass: "credit",
    externalId: "B7o8W5arVVhZG8BDdmePhzB6MooZMrf4MmwoG",
    dataSource: null,
    assetSubclass: "credit card",
    acquisitionDate: null,
    accountNumber: "3333",
    currency: "USD",
    financialInstitution: "Tartan Bank",
    balance: 0,
    transactions: null,
    holdings: null,
    liabilities: [{
      id: "B7o8W5arVVhZG8BDdmePhzB6MooZMrf4MmwoG",
      createdAt: null,
      updatedAt: null,
      lasEventType: null,
      lastEventAt: null,
      name: null,
      liabilityClass: "CREDIT_LINE",
      externalId: "B7o8W5arVVhZG8BDdmePhzB6MooZMrf4MmwoG",
      financialInstitution: null,
      dataSource: "PLAID",
      startDate: null,
      maturityDate: null,
      originalDate: null,
      accountId: "B7o8W5arVVhZG8BDdmePhzB6MooZMrf4MmwoG",
      lastPaymentDate: "2019-05-22",
      nextPaymentDate: "2020-05-28",
      lastPaymentAmount: 168.25,
      interestAmount: null,
      minPaymentAmount: 20.0,
      lastStatementBalance: 1708.77,
      interestRate: 0.0,
      interestType: null
    }]
  },
  {
    id: "xz6omXpENNUq6WwZGaK4flMkDGGrDji64rnao",
    createdAt: null,
    updatedAt: null,
    lasEventType: null,
    lastEventAt: null,
    name: "Plaid Mortgage",
    assetClass: "loan",
    externalId: "xz6omXpENNUq6WwZGaK4flMkDGGrDji64rnao",
    dataSource: null,
    assetSubclass: "mortgage",
    acquisitionDate: null,
    accountNumber: "8888",
    currency: "USD",
    financialInstitution: "Tartan Bank",
    balance: 0,
    transactions: null,
    holdings: null,
    liabilities: [{
      id: "xz6omXpENNUq6WwZGaK4flMkDGGrDji64rnao",
      createdAt: null,
      updatedAt: null,
      lasEventType: null,
      lastEventAt: null,
      name: null,
      liabilityClass: "MORTAGE",
      externalId: "xz6omXpENNUq6WwZGaK4flMkDGGrDji64rnao",
      financialInstitution: null,
      dataSource: "PLAID",
      startDate: null,
      maturityDate: "2045-07-31",
      originalDate: "2015-08-01",
      accountId: "xz6omXpENNUq6WwZGaK4flMkDGGrDji64rnao",
      lastPaymentDate: "2019-08-01",
      nextPaymentDate: "2019-11-15",
      lastPaymentAmount: 3141.54,
      propertyAddress: null,
      termInYears: 0,
      interestType: "fixed",
      interestPercentage: 3.99,
      interestAmount: null,
      paidInterestAmount: 12300.4,
      principalAmount: 425000.0,
      paidPrincipalAmount: 12340.5
    }]
  },
  {
    id: "3mZaxv6Q88IEobB3DKMkcW3GEDDNEKCZl4qy1",
    createdAt: null,
    updatedAt: null,
    lasEventType: null,
    lastEventAt: null,
    name: "Plaid Student Loan",
    assetClass: "loan",
    externalId: "3mZaxv6Q88IEobB3DKMkcW3GEDDNEKCZl4qy1",
    dataSource: null,
    assetSubclass: "student",
    acquisitionDate: null,
    accountNumber: "7777",
    currency: "USD",
    financialInstitution: "Tartan Bank",
    balance: 0,
    transactions: null,
    holdings: null,
    liabilities: [{
      id: "3mZaxv6Q88IEobB3DKMkcW3GEDDNEKCZl4qy1",
      createdAt: null,
      updatedAt: null,
      lasEventType: null,
      lastEventAt: null,
      name: null,
      liabilityClass: "LOAN",
      externalId: "3mZaxv6Q88IEobB3DKMkcW3GEDDNEKCZl4qy1",
      financialInstitution: null,
      dataSource: "PLAID",
      startDate: null,
      maturityDate: "2032-07-28",
      originalDate: "2002-08-28",
      accountId: "3mZaxv6Q88IEobB3DKMkcW3GEDDNEKCZl4qy1",
      lastPaymentDate: "2019-04-22",
      nextPaymentDate: "2019-05-28",
      lastPaymentAmount: 138.05,
      loanType: "Student Loan",
      interestAmount: 6227.36,
      paidInterestAmount: 280.55,
      principalAmount: 25000.0,
      paidPrincipalAmount: 271.65,
      interestPercentage: 5.25,
      interestType: null
    }]
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class LiabilityApiService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async getLiabilities(
    pagination: PaginationParams,
    filters?: LiabilityFilters
  ): Promise<PaginatedResponse<LiabilityAccount>> {
    try {
      const response = await fetch('http://localhost:9002/api/v1/portfolios/all/liabilities', {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to fetch liabilities');
      }
      const data = await response.json();
      
      let filteredLiabilities = data;
      
      if (filters) {
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          filteredLiabilities = filteredLiabilities.filter((liability: LiabilityAccount) => 
            liability.financialInstitution.toLowerCase().includes(searchLower) ||
            liability.assetSubclass.toLowerCase().includes(searchLower) ||
            liability.accountNumber.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.assetClass && filters.assetClass.length > 0) {
          filteredLiabilities = filteredLiabilities.filter((liability: LiabilityAccount) => 
            filters.assetClass!.some(cls => liability.assetClass.toLowerCase().includes(cls.toLowerCase()))
          );
        }
        
        if (filters.assetSubclass && filters.assetSubclass.length > 0) {
          filteredLiabilities = filteredLiabilities.filter((liability: LiabilityAccount) => 
            filters.assetSubclass!.some(subcls => liability.assetSubclass.toLowerCase().includes(subcls.toLowerCase()))
          );
        }
        
        if (filters.type && filters.type.length > 0) {
          filteredLiabilities = filteredLiabilities.filter((liability: LiabilityAccount) => 
            filters.type!.includes(liability.assetSubclass)
          );
        }
        
        if (filters.financialInstitution && filters.financialInstitution.length > 0) {
          filteredLiabilities = filteredLiabilities.filter((liability: LiabilityAccount) => 
            filters.financialInstitution!.includes(liability.financialInstitution)
          );
        }
        
        if (filters.bankName && filters.bankName.length > 0) {
          filteredLiabilities = filteredLiabilities.filter((liability: LiabilityAccount) => 
            filters.bankName!.includes(liability.financialInstitution)
          );
        }
        
        if (filters.currency && filters.currency.length > 0) {
          filteredLiabilities = filteredLiabilities.filter((liability: LiabilityAccount) => 
            filters.currency!.includes(liability.currency)
          );
        }
      }
      
      // Pagination
      const totalItems = filteredLiabilities.length;
      const totalPages = Math.ceil(totalItems / pagination.limit);
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedData = filteredLiabilities.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        pagination: {
          currentPage: pagination.page,
          totalPages,
          totalItems,
          limit: pagination.limit
        }
      };
    } catch (error) {
      // Fall back to mock data on error
      await delay(300);
      
      let filteredLiabilities = [...mockLiabilities];
      
      if (filters) {
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          filteredLiabilities = filteredLiabilities.filter(liability => 
            liability.financialInstitution.toLowerCase().includes(searchLower) ||
            liability.assetSubclass.toLowerCase().includes(searchLower) ||
            liability.accountNumber.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.assetClass && filters.assetClass.length > 0) {
          filteredLiabilities = filteredLiabilities.filter(liability => 
            filters.assetClass!.some(cls => liability.assetClass.toLowerCase().includes(cls.toLowerCase()))
          );
        }
        
        if (filters.assetSubclass && filters.assetSubclass.length > 0) {
          filteredLiabilities = filteredLiabilities.filter(liability => 
            filters.assetSubclass!.some(subcls => liability.assetSubclass.toLowerCase().includes(subcls.toLowerCase()))
          );
        }
        
        if (filters.type && filters.type.length > 0) {
          filteredLiabilities = filteredLiabilities.filter(liability => 
            filters.type!.includes(liability.assetSubclass)
          );
        }
        
        if (filters.financialInstitution && filters.financialInstitution.length > 0) {
          filteredLiabilities = filteredLiabilities.filter(liability => 
            filters.financialInstitution!.includes(liability.financialInstitution)
          );
        }
        
        if (filters.bankName && filters.bankName.length > 0) {
          filteredLiabilities = filteredLiabilities.filter(liability => 
            filters.bankName!.includes(liability.financialInstitution)
          );
        }
        
        if (filters.currency && filters.currency.length > 0) {
          filteredLiabilities = filteredLiabilities.filter(liability => 
            filters.currency!.includes(liability.currency)
          );
        }
      }
      
      // Pagination
      const totalItems = filteredLiabilities.length;
      const totalPages = Math.ceil(totalItems / pagination.limit);
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedData = filteredLiabilities.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        pagination: {
          currentPage: pagination.page,
          totalPages,
          totalItems,
          limit: pagination.limit
        }
      };
    }
  }

  static async getLiability(id: string): Promise<LiabilityAccount | null> {
    try {
      const response = await fetch('http://localhost:9002/api/v1/portfolios/all/liabilities', {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch liabilities');
      }
      
      const accounts: LiabilityAccount[] = await response.json();
      return accounts.find(liability => liability.id === id) || null;
    } catch (error) {
      console.error('Error fetching liability from API, using mock data:', error);
      await delay(200);
      return mockLiabilities.find(liability => liability.id === id) || null;
    }
  }

  static async getFilterOptions(): Promise<{
    types: string[];
    statuses: string[];
    bankNames: string[];
    currencies: string[];
  }> {
    await delay(100);
    
    const types = [...new Set(mockLiabilities.map(liability => liability.assetSubclass))];
    const statuses = ["Active", "Inactive"];
    const bankNames = [...new Set(mockLiabilities.map(liability => liability.financialInstitution))];
    const currencies = [...new Set(mockLiabilities.map(liability => liability.currency))];
    
    return {
      types,
      statuses,
      bankNames,
      currencies
    };
  }

  static async getAnalytics(): Promise<{
    totalLiabilities: number;
    totalCreditFacility: number;
    totalUsedAmount: number;
    totalUnusedAmount: number;
    averageInterestRate: number;
  }> {
    await delay(200);
    
    let totalBalance = 0;
    let totalPrincipalAmount = 0;
    let totalInterestAmount = 0;
    let totalInterestRate = 0;
    let count = 0;

    mockLiabilities.forEach(liability => {
      totalBalance += liability.balance;
      liability.liabilities.forEach(detail => {
        if (detail.principalAmount) totalPrincipalAmount += detail.principalAmount;
        if (detail.interestAmount) totalInterestAmount += detail.interestAmount;
        if (detail.interestPercentage) {
          totalInterestRate += detail.interestPercentage;
          count++;
        }
      });
    });
    
    return {
      totalLiabilities: mockLiabilities.length,
      totalCreditFacility: totalPrincipalAmount,
      totalUsedAmount: totalBalance,
      totalUnusedAmount: 0,
      averageInterestRate: count > 0 ? totalInterestRate / count : 0
    };
  }
}