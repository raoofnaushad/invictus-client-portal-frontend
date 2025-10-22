
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { InvestmentAccount } from "@/types/investmentAccount";
import bankLogo from "@/assets/bank-logo.png";

interface InvestmentAccountCardProps {
  account: InvestmentAccount;
  onClick?: () => void;
}

export const InvestmentAccountCard = ({ account, onClick }: InvestmentAccountCardProps) => {
  const totalCurrentValue = account.holdings.reduce((sum, holding) => 
    sum + holding.currentValue, 0
  );
  
  const totalAcquisitionValue = account.holdings.reduce((sum, holding) => 
    sum + holding.aquisitionValue, 0
  );
  
  const percentageChange = totalAcquisitionValue > 0 
    ? ((totalCurrentValue - totalAcquisitionValue) / totalAcquisitionValue) * 100 
    : 0;

  const formatCurrency = (amount: number) => {
    // Format large amounts with M/K suffixes like the image
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
  };

  const isPositive = percentageChange >= 0;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200 bg-white"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header with Total Balance and Logo */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">Total Balance</p>
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalCurrentValue)}
                </span>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded text-sm font-medium ${
                  isPositive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  <span>{isPositive ? '+' : ''}{percentageChange.toFixed(1)}%</span>
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <img 
                src={bankLogo} 
                alt="Bank Logo" 
                className="w-12 h-12 rounded-full"
              />
            </div>
          </div>

          {/* Account Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Account Name</p>
              <p className="font-medium text-gray-900">{account.financialInstitution}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Account Number</p>
              <p className="font-medium text-gray-900">{maskAccountNumber(account.accountNumber)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Account Type</p>
              <p className="font-medium text-gray-900">Investment Account</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Currency</p>
              <p className="font-medium text-gray-900">{account.currency}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
