export interface BankTransaction {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  lasEventType: string | null;
  lastEventAt: string | null;
  assetId: string;
  date: string;
  externalId: string;
  dataSource: string;
  type: string | null;
  subType: string | null;
  amount: number;
  description: string;
  currency: string;
}

export interface BankAccount {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  lasEventType: string | null;
  lastEventAt: string | null;
  name: string;
  assetClass: string;
  externalId: string;
  dataSource: string | null;
  assetSubclass: string;
  acquisitionDate: string | null;
  accountNumber: string;
  currency: string;
  financialInstitution: string;
  balance: number;
  transactions: BankTransaction[];
  holdings: null;
  liabilities: null;
}

export interface BankAccountFilters {
  searchTerm?: string;
  assetSubclass?: string[];
  currency?: string[];
  financialInstitution?: string[];
  balanceRange?: {
    min: number;
    max: number;
  };
}