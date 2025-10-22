
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown } from "lucide-react";
import { IlliquidInvestment } from "@/types/illiquidInvestment";

interface IlliquidInvestmentCardProps {
  investment: IlliquidInvestment;
  onClick: () => void;
}

export const IlliquidInvestmentCard = ({ investment, onClick }: IlliquidInvestmentCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: investment.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const commitmentPercentage = (investment.called / investment.commitment) * 100;
  const returnPercentage = ((investment.currentValue - investment.investmentAmount) / investment.investmentAmount) * 100;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'realized':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{investment.fundName}</h3>
            <p className="text-sm text-gray-500">{investment.assetClass}</p>
          </div>
          <Badge className={getStatusColor(investment.status)}>
            {investment.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Current Value</span>
            <p className="font-bold text-lg">{formatCurrency(investment.currentValue / 1000000)}M</p>
          </div>
          <div>
            <span className="text-gray-500">Return</span>
            <div className="flex items-center">
              <p className={`font-medium ${returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(1)}%
              </p>
              {returnPercentage >= 0 ? (
                <TrendingUp className="h-3 w-3 ml-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 ml-1 text-red-600" />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Vintage Year</span>
            <p className="font-medium">{investment.vintageYear}</p>
          </div>
          <div>
            <span className="text-gray-500">Target Return</span>
            <p className="font-medium">{investment.targetReturn}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Geography</span>
            <p className="font-medium">{investment.geography}</p>
          </div>
          <div>
            <span className="text-gray-500">Sector</span>
            <p className="font-medium">{investment.sector}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Capital Called</span>
            <span className="font-medium">{commitmentPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={commitmentPercentage} className="h-2" />
          <div className="flex justify-between text-xs mt-1 text-gray-500">
            <span>{formatCurrency(investment.called / 1000000)}M</span>
            <span>{formatCurrency(investment.commitment / 1000000)}M Committed</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Unrealized P&L</span>
            <p className={`font-medium ${investment.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {investment.unrealizedGainLoss >= 0 ? '+' : ''}{formatCurrency(investment.unrealizedGainLoss / 1000000)}M
            </p>
          </div>
          <div>
            <span className="text-gray-500">Maturity</span>
            <p className="font-medium">{new Date(investment.maturityDate).getFullYear()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
