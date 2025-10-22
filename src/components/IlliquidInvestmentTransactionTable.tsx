
import { useState, useMemo } from "react";
import { StandardTable } from "@/components/StandardTable";
import { StandardPagination } from "@/components/StandardPagination";
import { mockTransactions } from "@/data/illiquidTransactionData";
import { IlliquidTransactionRow } from "@/components/IlliquidTransactionRow";

interface IlliquidInvestmentTransactionTableProps {
  investmentId: string;
}

const columns = [
  { key: 'date', header: 'Date' },
  { key: 'quantity', header: 'Quantity' },
  { key: 'amount', header: 'Amount' },
  { key: 'currency', header: 'Currency' },
  { key: 'direction', header: 'Direction' },
  { key: 'senderRecipient', header: 'Sender/Recipient' },
  { key: 'description', header: 'Description' },
];

export const IlliquidInvestmentTransactionTable = ({ investmentId }: IlliquidInvestmentTransactionTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const transactions = mockTransactions[investmentId] || [];

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return transactions.slice(startIndex, startIndex + itemsPerPage);
  }, [transactions, currentPage]);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No transactions found for this investment.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <StandardTable columns={columns}>
        {paginatedTransactions.map((transaction, index) => (
          <IlliquidTransactionRow
            key={transaction.id}
            transaction={transaction}
            index={index}
          />
        ))}
      </StandardTable>

      <StandardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
