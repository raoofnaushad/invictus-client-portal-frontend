
export interface IlliquidInvestment {
  id: string;
  fundName: string;
  assetClass: string;
  investmentAmount: number;
  currentValue: number;
  unrealizedGainLoss: number;
  status: string;
  vintageYear: string;
  targetReturn: number;
  maturityDate: string;
  currency: string;
  geography: string;
  sector: string;
  commitment: number;
  called: number;
  uncalled: number;
  description: string;
}
