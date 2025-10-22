import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TableCell, TableRow } from "@/components/ui/table";
import { StandardTable } from "@/components/StandardTable";
import { LiabilityAccount } from "@/types/liabilityAccount";

interface LiabilityAccountTableProps {
  liabilities: LiabilityAccount[];
  onLiabilitySelect?: (liability: LiabilityAccount) => void;
}

const columns = [
  { key: 'bankName', header: 'Bank Name' },
  { key: 'type', header: 'Type' },
  { key: 'interestRate', header: 'Interest Rate' },
  { key: 'currency', header: 'Currency' },
  { key: 'nextPaymentDueDate', header: 'Next Payment Due Date' },
  { key: 'principalAmount', header: 'Principal Amount' },
  { key: 'status', header: 'Status' },
  { key: 'usage', header: 'Payment Progress' },
];

export const LiabilityAccountTable = ({ liabilities, onLiabilitySelect }: LiabilityAccountTableProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  return (
    <StandardTable columns={columns}>
      {liabilities.map((liability, index) => {
        const primaryLiability = liability.liabilities[0];
        const principalAmount = primaryLiability?.principalAmount || 0;
        const paidPrincipalAmount = primaryLiability?.paidPrincipalAmount || 0;
        const usagePercentage = principalAmount > 0 ? (paidPrincipalAmount / principalAmount) * 100 : 0;
        
        return (
          <TableRow 
            key={liability.id}
            className={`border-b border-border hover:bg-muted/50 cursor-pointer ${
              (index + 1) % 2 === 0 ? 'bg-blue-50' : 'bg-background'
            }`}
            onClick={() => onLiabilitySelect?.(liability)}
          >
            <TableCell className="py-3 px-4 text-sm font-medium">{liability.financialInstitution}</TableCell>
            <TableCell className="py-3 px-4 text-sm">{liability.assetSubclass}</TableCell>
            <TableCell className="py-3 px-4 text-sm">{primaryLiability?.interestPercentage || 0}%</TableCell>
            <TableCell className="py-3 px-4 text-sm">{liability.currency}</TableCell>
            <TableCell className="py-3 px-4 text-sm">{primaryLiability?.nextPaymentDate || 'N/A'}</TableCell>
            <TableCell className="py-3 px-4 text-sm font-medium">
              {formatCurrency(principalAmount, liability.currency)}
            </TableCell>
            <TableCell className="py-3 px-4 text-sm">
              <Badge className={getStatusColor(liability.assetClass)}>
                {liability.assetClass}
              </Badge>
            </TableCell>
            <TableCell className="py-3 px-4 text-sm">
              <div className="w-20">
                <Progress value={usagePercentage} className="h-2" />
                <span className="text-xs text-gray-500 mt-1">{usagePercentage.toFixed(1)}%</span>
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </StandardTable>
  );
};