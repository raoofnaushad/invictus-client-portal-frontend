import { UnifiedTransaction, UnifiedTransactionFilters } from "@/types/unifiedTransaction";
import { InvestmentApiService, Transaction as InvestmentTransaction } from "./investmentApi";
import { LiabilityApiService } from "./liabilityApi";
import { LiabilityDetail } from "@/types/liabilityAccount";
import { mockTransactions } from "@/data/illiquidTransactionData";
import { Transaction as IlliquidTransaction } from "@/data/illiquidTransactionData";

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

export type { UnifiedTransactionFilters };

// Helper function to mask account numbers
const maskAccountNumber = (accountNumber: string): string => {
  if (accountNumber.length <= 4) return accountNumber;
  return `****${accountNumber.slice(-4)}`;
};

// Convert investment transaction to unified format
const convertInvestmentTransaction = (
  transaction: InvestmentTransaction,
  accountNumber: string
): UnifiedTransaction => {
  return {
    id: `inv_${transaction.id}`,
    date: transaction.date,
    amount: transaction.amount,
    currency: 'USD',
    direction: transaction.amount >= 0 ? 'Incoming' : 'Outgoing',
    senderRecipient: transaction.description.includes('Dividend') ? 'Company Dividend' : 'Investment Broker',
    description: transaction.description,
    type: transaction.type === 'Buy' || transaction.type === 'Sell' ? transaction.type : 'Investment',
    accountNo: maskAccountNumber(accountNumber),
    source: 'Import',
    accountType: 'Investment',
    originalId: transaction.id
  };
};

// Convert liability detail to unified format
const convertLiabilityDetail = (
  detail: LiabilityDetail,
  accountNumber: string
): UnifiedTransaction[] => {
  // Create synthetic transactions from liability details
  const transactions: UnifiedTransaction[] = [];
  
  if (detail.lastPaymentAmount && detail.lastPaymentDate) {
    transactions.push({
      id: `liab_${detail.id}_last_payment`,
      date: detail.lastPaymentDate,
      amount: -Math.abs(detail.lastPaymentAmount),
      currency: 'USD',
      direction: 'Outgoing',
      senderRecipient: 'Bank Payment',
      description: `Payment for ${detail.liabilityClass}`,
      type: 'Payment',
      accountNo: maskAccountNumber(accountNumber),
      source: 'Statement',
      accountType: 'Liability',
      originalId: detail.id
    });
  }

  return transactions;
};

// Convert illiquid transaction to unified format
const convertIlliquidTransaction = (
  transaction: IlliquidTransaction,
  investmentId: string
): UnifiedTransaction => {
  return {
    id: `illiq_${transaction.id}`,
    date: transaction.date,
    amount: transaction.amount,
    currency: transaction.currency,
    direction: transaction.direction === 'Buy' ? 'Outgoing' : 'Incoming',
    senderRecipient: transaction.senderRecipient,
    description: transaction.description,
    type: transaction.direction === 'Buy' ? 'Buy' : 'Sell',
    accountNo: maskAccountNumber(`ILLIQ${investmentId}`),
    source: 'Manual Entry',
    accountType: 'Illiquid',
    originalId: transaction.id
  };
};

export class UnifiedTransactionApiService {
  static async getAllTransactions(
    pagination: PaginationParams,
    filters?: UnifiedTransactionFilters
  ): Promise<PaginatedResponse<UnifiedTransaction>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let allTransactions: UnifiedTransaction[] = [];

    try {
      // Fetch investment transactions
      const investmentResponse = await InvestmentApiService.getTransactions(
        undefined, 
        { page: 1, limit: 1000 }
      );
      const investmentTransactions = investmentResponse.data.map(transaction => 
        convertInvestmentTransaction(transaction, `INV12345`)
      );
      allTransactions.push(...investmentTransactions);

      // Fetch liability transactions
      const liabilities = await LiabilityApiService.getLiabilities({ page: 1, limit: 100 });
      for (const liability of liabilities.data) {
        for (const detail of liability.liabilities) {
          const liabilityTransactions = convertLiabilityDetail(detail, liability.accountNumber);
          allTransactions.push(...liabilityTransactions);
        }
      }

      // Fetch illiquid transactions
      Object.entries(mockTransactions).forEach(([investmentId, transactions]) => {
        const illiquidTransactions = transactions.map(transaction =>
          convertIlliquidTransaction(transaction, investmentId)
        );
        allTransactions.push(...illiquidTransactions);
      });

    } catch (error) {
      console.error('Error fetching transactions:', error);
    }

    // Apply filters
    if (filters) {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        allTransactions = allTransactions.filter(transaction =>
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.senderRecipient.toLowerCase().includes(searchLower) ||
          transaction.type.toLowerCase().includes(searchLower)
        );
      }

      if (filters.type && filters.type.length > 0) {
        allTransactions = allTransactions.filter(transaction =>
          filters.type!.includes(transaction.type)
        );
      }

      if (filters.direction && filters.direction.length > 0) {
        allTransactions = allTransactions.filter(transaction =>
          filters.direction!.includes(transaction.direction)
        );
      }

      if (filters.source && filters.source.length > 0) {
        allTransactions = allTransactions.filter(transaction =>
          filters.source!.includes(transaction.source)
        );
      }

      if (filters.accountType && filters.accountType.length > 0) {
        allTransactions = allTransactions.filter(transaction =>
          filters.accountType!.includes(transaction.accountType)
        );
      }

      if (filters.currency && filters.currency.length > 0) {
        allTransactions = allTransactions.filter(transaction =>
          filters.currency!.includes(transaction.currency)
        );
      }

      if (filters.amountRange) {
        allTransactions = allTransactions.filter(transaction =>
          Math.abs(transaction.amount) >= filters.amountRange!.min &&
          Math.abs(transaction.amount) <= filters.amountRange!.max
        );
      }
    }

    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

    return {
      data: paginatedTransactions,
      pagination: {
        currentPage: pagination.page,
        totalPages: Math.ceil(allTransactions.length / pagination.limit),
        totalItems: allTransactions.length,
        limit: pagination.limit
      }
    };
  }

  static async getFilterOptions(): Promise<{
    types: string[];
    directions: string[];
    sources: string[];
    accountTypes: string[];
    currencies: string[];
  }> {
    return {
      types: ['Deposit', 'Payment', 'Investment', 'Withdrawal', 'Dividend', 'Fee', 'Buy', 'Sell'],
      directions: ['Incoming', 'Outgoing'],
      sources: ['Statement', 'Open Banking', 'Import', 'Manual Entry'],
      accountTypes: ['Investment', 'Liability', 'Illiquid'],
      currencies: ['USD', 'EUR', 'GBP']
    };
  }
}