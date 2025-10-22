export interface UnifiedTransaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  direction: 'Incoming' | 'Outgoing';
  senderRecipient: string;
  description: string;
  type: 'Deposit' | 'Payment' | 'Investment' | 'Withdrawal' | 'Dividend' | 'Fee' | 'Buy' | 'Sell';
  accountNo: string;
  source: 'Statement' | 'Open Banking' | 'Import' | 'Manual Entry';
  accountType: 'Investment' | 'Liability' | 'Illiquid';
  originalId: string;
}

export interface UnifiedTransactionFilters {
  searchTerm?: string;
  type?: string[];
  direction?: string[];
  source?: string[];
  accountType?: string[];
  currency?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
}