
import { TableCell, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Transaction } from "@/data/illiquidTransactionData";

interface IlliquidTransactionRowProps {
  transaction: Transaction;
  index: number;
}

export const IlliquidTransactionRow = ({ transaction, index }: IlliquidTransactionRowProps) => {
  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(absAmount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <TableRow 
      className={`hover:bg-muted/50 ${
        (index + 1) % 2 === 0 ? 'bg-blue-50' : 'bg-background'
      }`}
    >
      <TableCell className="font-medium">
        {transaction.date}
      </TableCell>
      <TableCell>
        {formatNumber(transaction.quantity)}
      </TableCell>
      <TableCell>
        <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
          {transaction.amount >= 0 ? '' : '('}
          {formatCurrency(transaction.amount)}
          {transaction.amount >= 0 ? '' : ')'}
        </span>
      </TableCell>
      <TableCell>
        {transaction.currency}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {transaction.direction === 'Buy' ? (
            <TrendingDown className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingUp className="h-4 w-4 text-red-600" />
          )}
          <span className={transaction.direction === 'Buy' ? 'text-green-600' : 'text-red-600'}>
            {transaction.direction}
          </span>
        </div>
      </TableCell>
      <TableCell>
        {transaction.senderRecipient}
      </TableCell>
      <TableCell className="text-gray-600">
        {transaction.description}
      </TableCell>
    </TableRow>
  );
};
