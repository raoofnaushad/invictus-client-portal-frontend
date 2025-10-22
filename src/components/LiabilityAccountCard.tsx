import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LiabilityAccount } from "@/types/liabilityAccount";

interface LiabilityAccountCardProps {
  liability: LiabilityAccount;
  onClick: () => void;
}

export const LiabilityAccountCard = ({ liability, onClick }: LiabilityAccountCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: liability.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const primaryLiability = liability.liabilities[0];
  const principalAmount = primaryLiability?.principalAmount || 0;
  const paidPrincipalAmount = primaryLiability?.paidPrincipalAmount || 0;
  const lastStatementBalance = primaryLiability?.lastStatementBalance || 0;
  
  // Calculate usage based on liability type
  let usedAmount = 0;
  let totalFacility = 0;
  let usagePercentage = 0;
  
  if (primaryLiability?.liabilityClass === 'CREDIT_LINE') {
    // For credit lines, use statement balance as used amount
    usedAmount = lastStatementBalance;
    totalFacility = principalAmount || lastStatementBalance * 2; // Estimate if not available
    usagePercentage = totalFacility > 0 ? (usedAmount / totalFacility) * 100 : 0;
  } else {
    // For loans/mortgages, use paid amount vs total
    usedAmount = paidPrincipalAmount;
    totalFacility = principalAmount;
    usagePercentage = principalAmount > 0 ? (paidPrincipalAmount / principalAmount) * 100 : 0;
  }

  const getUsageStatus = () => {
    if (usagePercentage === 0) return 'Unused';
    if (usagePercentage >= 100) return 'Fully Used';
    return 'Partially Used';
  };

  const getUsageStatusColor = (status: string) => {
    switch (status) {
      case 'Unused':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Fully Used':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Partially Used':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (assetClass: string) => {
    switch (assetClass.toLowerCase()) {
      case 'credit':
        return 'bg-blue-100 text-blue-800';
      case 'loan':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const usageStatus = getUsageStatus();
  const remainingBalance = totalFacility - usedAmount;

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">Total Credit Facility</h3>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-2xl font-bold">{formatCurrency(totalFacility)}</p>
              <Badge className={`${getUsageStatusColor(usageStatus)} border text-xs font-medium`}>
                {usageStatus}
              </Badge>
            </div>
          </div>
          <Badge className={getStatusColor(liability.assetClass)}>
            {liability.assetClass}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Bank Name</span>
            <p className="font-medium">{liability.financialInstitution}</p>
          </div>
          <div>
            <span className="text-gray-500">Type</span>
            <p className="font-medium">{liability.assetSubclass}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Interest Rate</span>
            <p className="font-medium">{primaryLiability?.interestPercentage || 0}%</p>
          </div>
          <div>
            <span className="text-gray-500">Next Payment Due</span>
            <p className="font-medium">{primaryLiability?.nextPaymentDate || 'N/A'}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Facility Usage</span>
            <span className="font-medium">{usagePercentage.toFixed(1)}%</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          <div className="flex justify-between text-xs mt-1 text-gray-500">
            <span>{formatCurrency(usedAmount)} Used</span>
            <span>{formatCurrency(remainingBalance)} Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};