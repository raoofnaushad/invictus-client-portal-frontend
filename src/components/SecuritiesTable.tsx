
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2 } from "lucide-react";
import { InvestmentHolding } from "@/types/investmentAccount";
import TrendIndicator from "@/components/TrendIndicator";

interface SecuritiesTableProps {
  holdings: InvestmentHolding[];
  onSecurityClick?: (securityId: string) => void;
}

export const SecuritiesTable = ({ holdings, onSecurityClick }: SecuritiesTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculatePerformance = (holding: InvestmentHolding) => {
    const percentageChange = holding.aquisitionValue > 0 
      ? ((holding.currentValue - holding.aquisitionValue) / holding.aquisitionValue) * 100 
      : 0;
    return percentageChange;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="font-medium text-sm text-muted-foreground">Logo</TableHead>
            <TableHead className="font-medium text-sm text-muted-foreground">Investment Name</TableHead>
            <TableHead className="font-medium text-sm text-muted-foreground">Ticker</TableHead>
            <TableHead className="font-medium text-sm text-muted-foreground">Quantity</TableHead>
            <TableHead className="font-medium text-sm text-muted-foreground">Price Per Share</TableHead>
            <TableHead className="font-medium text-sm text-muted-foreground">Currency</TableHead>
            <TableHead className="font-medium text-sm text-muted-foreground">Performance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((holding, index) => {
            const performance = calculatePerformance(holding);
            
            return (
              <TableRow 
                key={holding.id}
                className={`hover:bg-muted/50 cursor-pointer ${
                  (index + 1) % 2 === 0 ? 'bg-blue-50' : 'bg-background'
                }`}
                onClick={() => onSecurityClick?.(holding.securityId)}
              >
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Building2 className="h-6 w-6 text-gray-400" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{holding.name}</TableCell>
                <TableCell className="text-gray-600">{holding.ticker || 'N/A'}</TableCell>
                <TableCell>{holding.units.toLocaleString()}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(holding.currentValue)}
                </TableCell>
                <TableCell className="text-gray-600">USD</TableCell>
                <TableCell>
                  <TrendIndicator value={performance} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
