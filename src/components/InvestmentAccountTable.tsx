
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { StandardTable } from "@/components/StandardTable";
import { InvestmentAccount } from "@/types/investmentAccount";
import TrendIndicator from "@/components/TrendIndicator";

interface InvestmentAccountTableProps {
  accounts: InvestmentAccount[];
  onAccountSelect?: (account: InvestmentAccount) => void;
}

const columns = [
  { key: 'institution', header: 'Institution' },
  { key: 'accountName', header: 'Account Name' },
  { key: 'accountNumber', header: 'Account Number' },
  { key: 'assetClass', header: 'Asset Class' },
  { key: 'totalBalance', header: 'Total Balance' },
  { key: 'performance', header: 'Performance' },
  { key: 'holdings', header: 'Holdings' },
];

export const InvestmentAccountTable = ({ accounts, onAccountSelect }: InvestmentAccountTableProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const calculatePerformance = (account: InvestmentAccount) => {
    const totalCurrentValue = account.holdings.reduce((sum, holding) => 
      sum + holding.currentValue, 0
    );
    
    const totalAcquisitionValue = account.holdings.reduce((sum, holding) => 
      sum + holding.aquisitionValue, 0
    );
    
    const percentageChange = totalAcquisitionValue > 0 
      ? ((totalCurrentValue - totalAcquisitionValue) / totalAcquisitionValue) * 100 
      : 0;

    return { totalCurrentValue, percentageChange };
  };

  return (
    <StandardTable columns={columns}>
      {accounts.map((account, index) => {
        const { totalCurrentValue, percentageChange } = calculatePerformance(account);
        
        return (
          <TableRow 
            key={account.id}
            className={`border-b border-border hover:bg-muted/50 cursor-pointer ${
              (index + 1) % 2 === 0 ? 'bg-blue-50' : 'bg-white'
            }`}
            onClick={() => onAccountSelect?.(account)}
          >
            <TableCell className="py-3 px-4 text-sm">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{account.financialInstitution}</span>
              </div>
            </TableCell>
            <TableCell className="py-3 px-4 text-sm">{account.name}</TableCell>
            <TableCell className="py-3 px-4 text-sm">{account.accountNumber}</TableCell>
            <TableCell className="py-3 px-4 text-sm">
              <Badge variant="secondary" className="text-xs">
                {account.assetClass}
              </Badge>
            </TableCell>
            <TableCell className="py-3 px-4 text-sm font-medium">
              {formatCurrency(totalCurrentValue, account.currency)}
            </TableCell>
            <TableCell className="py-3 px-4 text-sm">
              <TrendIndicator value={percentageChange} />
            </TableCell>
            <TableCell className="py-3 px-4 text-sm text-gray-500">
              {account.holdings.length} securities
            </TableCell>
          </TableRow>
        );
      })}
    </StandardTable>
  );
};
