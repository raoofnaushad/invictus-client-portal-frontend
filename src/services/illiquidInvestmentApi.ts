// Illiquid Investment API Services
import { IlliquidInvestment } from "@/types/illiquidInvestment";

export interface IlliquidInvestmentFilters {
  searchTerm?: string;
  assetClass?: string[];
  status?: string[];
  geography?: string[];
  vintageYear?: string[];
  targetReturnRange?: {
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

// Mock data
const mockIlliquidInvestments: IlliquidInvestment[] = [
  {
    id: "1",
    fundName: "Blackstone Real Estate Fund",
    assetClass: "Real Estate",
    investmentAmount: 50000000,
    currentValue: 65000000,
    unrealizedGainLoss: 15000000,
    status: "Active",
    vintageYear: "2019",
    targetReturn: 12.5,
    maturityDate: "2026-12-31",
    currency: "USD",
    geography: "North America",
    sector: "Commercial Real Estate",
    commitment: 75000000,
    called: 50000000,
    uncalled: 25000000,
    description: "Private equity real estate fund focused on commercial properties across major US markets."
  },
  {
    id: "2",
    fundName: "KKR Private Credit Fund",
    assetClass: "Private Credit",
    investmentAmount: 30000000,
    currentValue: 33500000,
    unrealizedGainLoss: 3500000,
    status: "Active",
    vintageYear: "2021",
    targetReturn: 8.5,
    maturityDate: "2028-06-30",
    currency: "USD",
    geography: "Global",
    sector: "Diversified Credit",
    commitment: 40000000,
    called: 30000000,
    uncalled: 10000000,
    description: "Direct lending fund providing credit to middle-market companies."
  },
  {
    id: "3",
    fundName: "Apollo Infrastructure Fund",
    assetClass: "Infrastructure",
    investmentAmount: 25000000,
    currentValue: 28750000,
    unrealizedGainLoss: 3750000,
    status: "Active",
    vintageYear: "2020",
    targetReturn: 10.0,
    maturityDate: "2030-12-31",
    currency: "USD",
    geography: "Europe",
    sector: "Energy Infrastructure",
    commitment: 35000000,
    called: 25000000,
    uncalled: 10000000,
    description: "Infrastructure fund focusing on European energy projects."
  },
  {
    id: "4",
    fundName: "Carlyle Growth Fund",
    assetClass: "Private Equity",
    investmentAmount: 40000000,
    currentValue: 38000000,
    unrealizedGainLoss: -2000000,
    status: "Active",
    vintageYear: "2022",
    targetReturn: 15.0,
    maturityDate: "2029-03-31",
    currency: "USD",
    geography: "North America",
    sector: "Technology",
    commitment: 50000000,
    called: 40000000,
    uncalled: 10000000,
    description: "Growth equity fund focused on technology companies."
  },
  {
    id: "5",
    fundName: "TPG Real Estate Partners",
    assetClass: "Real Estate",
    investmentAmount: 35000000,
    currentValue: 42000000,
    unrealizedGainLoss: 7000000,
    status: "Active",
    vintageYear: "2018",
    targetReturn: 11.0,
    maturityDate: "2025-09-30",
    currency: "USD",
    geography: "Asia",
    sector: "Residential Real Estate",
    commitment: 45000000,
    called: 35000000,
    uncalled: 10000000,
    description: "Real estate fund focusing on residential properties in Asia."
  },
  {
    id: "6",
    fundName: "Bain Capital Credit",
    assetClass: "Private Credit",
    investmentAmount: 20000000,
    currentValue: 21500000,
    unrealizedGainLoss: 1500000,
    status: "Matured",
    vintageYear: "2017",
    targetReturn: 9.0,
    maturityDate: "2024-12-31",
    currency: "USD",
    geography: "Global",
    sector: "Diversified Credit",
    commitment: 25000000,
    called: 20000000,
    uncalled: 5000000,
    description: "Mature credit fund with global diversification."
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class IlliquidInvestmentApiService {
  static async getIlliquidInvestments(
    pagination: PaginationParams,
    filters?: IlliquidInvestmentFilters
  ): Promise<PaginatedResponse<IlliquidInvestment>> {
    await delay(300);
    
    let filteredInvestments = [...mockIlliquidInvestments];
    
    if (filters) {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredInvestments = filteredInvestments.filter(investment => 
          investment.fundName.toLowerCase().includes(searchLower) ||
          investment.assetClass.toLowerCase().includes(searchLower) ||
          investment.geography.toLowerCase().includes(searchLower) ||
          investment.sector.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.assetClass && filters.assetClass.length > 0) {
        filteredInvestments = filteredInvestments.filter(investment => 
          filters.assetClass!.includes(investment.assetClass)
        );
      }
      
      if (filters.status && filters.status.length > 0) {
        filteredInvestments = filteredInvestments.filter(investment => 
          filters.status!.includes(investment.status)
        );
      }
      
      if (filters.geography && filters.geography.length > 0) {
        filteredInvestments = filteredInvestments.filter(investment => 
          filters.geography!.includes(investment.geography)
        );
      }
      
      if (filters.vintageYear && filters.vintageYear.length > 0) {
        filteredInvestments = filteredInvestments.filter(investment => 
          filters.vintageYear!.includes(investment.vintageYear)
        );
      }
      
      if (filters.targetReturnRange) {
        filteredInvestments = filteredInvestments.filter(investment => 
          investment.targetReturn >= filters.targetReturnRange!.min && 
          investment.targetReturn <= filters.targetReturnRange!.max
        );
      }
    }
    
    // Pagination
    const totalItems = filteredInvestments.length;
    const totalPages = Math.ceil(totalItems / pagination.limit);
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedData = filteredInvestments.slice(startIndex, endIndex);
    
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

  static async getIlliquidInvestment(id: string): Promise<IlliquidInvestment | null> {
    await delay(200);
    return mockIlliquidInvestments.find(investment => investment.id === id) || null;
  }

  static async getFilterOptions(): Promise<{
    assetClasses: string[];
    statuses: string[];
    geographies: string[];
    vintageYears: string[];
  }> {
    await delay(100);
    
    const assetClasses = [...new Set(mockIlliquidInvestments.map(inv => inv.assetClass))];
    const statuses = [...new Set(mockIlliquidInvestments.map(inv => inv.status))];
    const geographies = [...new Set(mockIlliquidInvestments.map(inv => inv.geography))];
    const vintageYears = [...new Set(mockIlliquidInvestments.map(inv => inv.vintageYear))];
    
    return {
      assetClasses,
      statuses,
      geographies,
      vintageYears
    };
  }

  static async getAnalytics(): Promise<{
    totalInvestments: number;
    totalInvestmentAmount: number;
    totalCurrentValue: number;
    totalUnrealizedGainLoss: number;
    averageTargetReturn: number;
  }> {
    await delay(200);
    
    const totalInvestmentAmount = mockIlliquidInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
    const totalCurrentValue = mockIlliquidInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalUnrealizedGainLoss = mockIlliquidInvestments.reduce((sum, inv) => sum + inv.unrealizedGainLoss, 0);
    const averageTargetReturn = mockIlliquidInvestments.reduce((sum, inv) => sum + inv.targetReturn, 0) / mockIlliquidInvestments.length;
    
    return {
      totalInvestments: mockIlliquidInvestments.length,
      totalInvestmentAmount,
      totalCurrentValue,
      totalUnrealizedGainLoss,
      averageTargetReturn
    };
  }
}