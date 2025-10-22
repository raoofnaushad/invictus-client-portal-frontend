
export interface LiabilityDetail {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  lasEventType: string | null;
  lastEventAt: string | null;
  name: string | null;
  liabilityClass: string;
  externalId: string;
  financialInstitution: string | null;
  dataSource: string;
  startDate: string | null;
  maturityDate: string | null;
  originalDate: string | null;
  accountId: string;
  lastPaymentDate: string | null;
  nextPaymentDate: string | null;
  lastPaymentAmount: number | null;
  interestAmount: number | null;
  minPaymentAmount?: number | null;
  lastStatementBalance?: number | null;
  interestRate?: number;
  interestType: string | null;
  propertyAddress?: string | null;
  termInYears?: number;
  interestPercentage?: number;
  paidInterestAmount?: number | null;
  principalAmount?: number | null;
  paidPrincipalAmount?: number | null;
  loanType?: string;
}

export interface LiabilityAccount {
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
  transactions: any[] | null;
  holdings: any[] | null;
  liabilities: LiabilityDetail[];
}
