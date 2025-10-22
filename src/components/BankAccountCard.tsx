import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Banknote } from "lucide-react";
import { BankAccount } from "@/types/bankAccount";

interface BankAccountCardProps {
  account: BankAccount;
  onClick?: () => void;
}

export const BankAccountCard = ({ account, onClick }: BankAccountCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency
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
        return <Banknote className="h-5 w-5 text-emerald-500" />;
      case 'money market':
      case 'cd':
        return <Building2 className="h-5 w-5 text-blue-500" />;
      default:
        return <Banknote className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatAccountType = (assetSubclass: string) => {
    return assetSubclass.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getAccountTypeIcon(account.assetSubclass)}
            <CardTitle className="text-sm font-medium text-gray-900">
              {account.financialInstitution || 'Bank'}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {formatAccountType(account.assetSubclass)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Balance</p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(account.balance)}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-500 mb-1">Account Name</p>
              <p className="font-medium text-gray-900 truncate">{account.name}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 mb-1">Account Number</p>
              <p className="font-medium text-gray-900">{maskAccountNumber(account.accountNumber)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Transactions</p>
              <p className="font-medium text-gray-900">{account.transactions.length} records</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 mb-1">Currency</p>
              <p className="font-medium text-gray-900">{account.currency}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};