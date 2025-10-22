import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Banknote } from "lucide-react";
import { BankAccount } from "@/types/bankAccount";
import { StandardTable } from "@/components/StandardTable";

interface BankAccountTableProps {
  accounts: BankAccount[];
  onAccountSelect?: (account: BankAccount) => void;
}

const columns = [
  { key: 'name', header: 'Account Name' },
  { key: 'institution', header: 'Custodian' },
  { key: 'accountNo', header: 'Account No.' },
  { key: 'type', header: 'Account Type' },
  { key: 'currency', header: 'Currency' },
  { key: 'balance', header: 'Total Balance', className: 'text-right' },
];

export const BankAccountTable = ({ accounts, onAccountSelect }: BankAccountTableProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
  };

  const getAccountTypeIcon = (assetSubclass: string) => {
    switch (assetSubclass.toLowerCase()) {
      case 'checking':
      case 'savings':
        return <Banknote className="h-4 w-4 text-emerald-500" />;
      case 'money market':
      case 'cd':
        return <Building2 className="h-4 w-4 text-blue-500" />;
      default:
        return <Banknote className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatAccountType = (assetSubclass: string) => {
    return assetSubclass.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <StandardTable columns={columns}>
      {accounts.map((account, index) => (
        <TableRow 
          key={account.id}
          className={`border-b border-border hover:bg-muted/50 cursor-pointer ${
            (index + 1) % 2 === 0 ? 'bg-blue-50' : 'bg-white'
          }`}
          onClick={() => onAccountSelect?.(account)}
        >
          <TableCell className="py-3 px-4 text-sm font-medium">
            {account.name}
          </TableCell>
          <TableCell className="py-3 px-4 text-sm">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-900">
                {account.financialInstitution || 'N/A'}
              </span>
            </div>
          </TableCell>
          <TableCell className="py-3 px-4 text-sm font-mono">
            {maskAccountNumber(account.accountNumber)}
          </TableCell>
          <TableCell className="py-3 px-4 text-sm">
            <div className="flex items-center space-x-2">
              {getAccountTypeIcon(account.assetSubclass)}
              <span>{formatAccountType(account.assetSubclass)}</span>
            </div>
          </TableCell>
          <TableCell className="py-3 px-4 text-sm">
            {account.currency}
          </TableCell>
          <TableCell className="py-3 px-4 text-sm font-semibold text-right">
            {formatCurrency(account.balance, account.currency)}
          </TableCell>
        </TableRow>
      ))}
    </StandardTable>
  );
};