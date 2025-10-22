
export interface CardValues {
  total: {
    assets: number;
    liabilities: number;
    netWorth: number;
  };
  watar: {
    assets: number;
    liabilities: number;
    netWorth: number;
  };
  external: {
    assets: number;
    liabilities: number;
    netWorth: number;
  };
  unmanaged: {
    assets: number;
    liabilities: number;
    netWorth: number;
  };
}

export interface AllocationData {
  name: string;
  amount: number;
  percentage: number;
  subclasses: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}

export interface FinancialData {
  months: string[];
  assets: number[];
  liabilities: number[];
  netWorth: number[];
}
