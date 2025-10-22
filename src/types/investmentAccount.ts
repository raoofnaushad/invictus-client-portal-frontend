
export interface InvestmentTransaction {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  lasEventType: string | null;
  lastEventAt: string | null;
  assetId: string;
  date: string;
  externalId: string;
  dataSource: string;
  type: string;
  subType: string;
  amount: number;
  description: string;
  currency: string;
  pricePerUnit: number | null;
  fees: number;
  units: number;
  // Added for compatibility
  securityId?: string;
  price?: number;
  status?: string;
}

export interface InvestmentHolding {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  lasEventType: string | null;
  lastEventAt: string | null;
  name: string;
  assetClass: string;
  externalId: string;
  dataSource: string;
  assetSubclass: string;
  acquisitionDate: string | null;
  securityId: string;
  ticker: string | null;
  custodian: string | null;
  aquisitionValue: number;
  accountId: string;
  financialInstitution: string | null;
  currentValue: number;
  currentValueDate: string | null;
  currency: string;
  units: number;
  transactions: InvestmentTransaction[];
}

export interface InvestmentAccount {
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
  transactions: any | null;
  holdings: InvestmentHolding[];
  liabilities: any | null;
}
