
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { StandardTable } from "@/components/StandardTable";
import { IlliquidInvestment } from "@/types/illiquidInvestment";

interface IlliquidInvestmentTableProps {
  investments: IlliquidInvestment[];
  onInvestmentSelect?: (investment: IlliquidInvestment) => void;
}

const columns = [
  { key: 'fundName', header: 'Fund Name' },
  { key: 'assetClass', header: 'Asset Class' },
  { key: 'currentValue', header: 'Current Value' },
  { key: 'return', header: 'Return' },
  { key: 'vintage', header: 'Vintage' },
  { key: 'geography', header: 'Geography' },
  { key: 'status', header: 'Status' },
  { key: 'capitalCalled', header: 'Capital Called' },
];

export const IlliquidInvestmentTable = ({ investments, onInvestmentSelect }: IlliquidInvestmentTableProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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
    <StandardTable columns={columns}>
      {investments.map((investment, index) => {
        const commitmentPercentage = (investment.called / investment.commitment) * 100;
        const returnPercentage = ((investment.currentValue - investment.investmentAmount) / investment.investmentAmount) * 100;
        
        return (
          <TableRow 
            key={investment.id}
            className={`border-b border-border hover:bg-muted/50 cursor-pointer ${
              (index + 1) % 2 === 0 ? 'bg-blue-50' : 'bg-background'
            }`}
            onClick={() => onInvestmentSelect?.(investment)}
          >
            <TableCell className="py-3 px-4 text-sm">
              <div>
                <div className="font-medium">{investment.fundName}</div>
                <div className="text-xs text-gray-500">{investment.sector}</div>
              </div>
            </TableCell>
            <TableCell className="py-3 px-4 text-sm">{investment.assetClass}</TableCell>
            <TableCell className="py-3 px-4 text-sm font-medium">
              {formatCurrency(investment.currentValue, investment.currency)}
            </TableCell>
            <TableCell className="py-3 px-4 text-sm">
              <div className="flex items-center">
                <span className={`font-medium ${returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(1)}%
                </span>
                {returnPercentage >= 0 ? (
                  <TrendingUp className="h-3 w-3 ml-1 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 ml-1 text-red-600" />
                )}
              </div>
            </TableCell>
            <TableCell className="py-3 px-4 text-sm">{investment.vintageYear}</TableCell>
            <TableCell className="py-3 px-4 text-sm">{investment.geography}</TableCell>
            <TableCell className="py-3 px-4 text-sm">
              <Badge className={getStatusColor(investment.status)}>
                {investment.status}
              </Badge>
            </TableCell>
            <TableCell className="py-3 px-4 text-sm">
              <div className="w-20">
                <Progress value={commitmentPercentage} className="h-2" />
                <span className="text-xs text-gray-500 mt-1">{commitmentPercentage.toFixed(1)}%</span>
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </StandardTable>
  );
};
