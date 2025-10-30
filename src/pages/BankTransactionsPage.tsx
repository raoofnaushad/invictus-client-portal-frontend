import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableRow, TableCell } from "@/components/ui/table";
import { StandardTable } from "@/components/StandardTable";
import { StandardPagination } from "@/components/StandardPagination";
import { BankAccountCard } from "@/components/BankAccountCard";
import { BankTransactionFilterDialog, BankTransactionFilters } from "@/components/BankTransactionFilterDialog";
import { BankAccount, BankTransaction } from "@/types/bankAccount";
import { bankAccountApi } from "@/services/bankAccountApi";
import { mockBankAccountApi } from "@/services/mockBankAccountApi";

// Use mock API in development
const isDevelopment = import.meta.env.DEV1;
const api = isDevelopment ? mockBankAccountApi : bankAccountApi;

const transactionColumns = [
  { key: 'date', header: 'Date' },
  { key: 'amount', header: 'Amount', className: 'text-right' },
  { key: 'currency', header: 'Currency' },
  { key: 'direction', header: 'Direction' },
  { key: 'description', header: 'Description' },
  { key: 'source', header: 'Source' },
];

export default function BankTransactionsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [allTransactions, setAllTransactions] = useState<BankTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<BankTransactionFilters>({});
  const itemsPerPage = 10;

  useEffect(() => {
    if (id) {
      fetchAccountDetails();
    }
  }, [id]);

  const fetchAccountDetails = async () => {
    try {
      setLoading(true);
      const accountData = await api.getBankAccountById(id!);
      setAccount(accountData);
      setAllTransactions(accountData.transactions);
      setFilteredTransactions(accountData.transactions);
    } catch (error) {
      console.error('Error fetching account details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions based on filters
  const applyFilters = (transactions: BankTransaction[], filters: BankTransactionFilters) => {
    let filtered = [...transactions];

    if (filters.dateFrom) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.dateFrom!));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateTo!));
    }
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(t => Math.abs(t.amount) >= filters.minAmount!);
    }
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(t => Math.abs(t.amount) <= filters.maxAmount!);
    }
    if (filters.direction) {
      filtered = filtered.filter(t => getDirection(t.amount) === filters.direction);
    }
    if (filters.description) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(filters.description!.toLowerCase())
      );
    }
    if (filters.currency) {
      filtered = filtered.filter(t => t.currency === filters.currency);
    }
    if (filters.source) {
      filtered = filtered.filter(t => 
        t.dataSource.toLowerCase().includes(filters.source!.toLowerCase())
      );
    }

    return filtered;
  };

  const handleFiltersChange = (newFilters: BankTransactionFilters) => {
    setFilters(newFilters);
    const filtered = applyFilters(allTransactions, newFilters);
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDirection = (amount: number) => {
    return amount >= 0 ? 'Incoming' : 'Outgoing';
  };

  const getDirectionColor = (amount: number) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading account details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Account not found</div>
            <Button onClick={() => navigate('/bank-accounts')}>
              Back to Bank Accounts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          onClick={() => navigate('/bank-accounts')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Bank Accounts</span>
        </Button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{account.financialInstitution}</h1>
            <p className="text-sm text-gray-500">{account.name}</p>
          </div>
        </div>

        {/* Account Card */}
        <div className="w-full max-w-md">
          <BankAccountCard account={account} />
        </div>

        {/* Transactions */}
        {!loading && account && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Transactions</CardTitle>
                <BankTransactionFilterDialog 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500">
                    {Object.keys(filters).length > 0 ? 'No transactions match the current filters' : 'No transactions found for this account'}
                  </div>
                </div>
              ) : (
                <>
                  <StandardTable columns={transactionColumns}>
                    {paginatedTransactions.map((transaction, index) => (
                      <TableRow 
                        key={transaction.id}
                        className={`border-b border-border ${
                          (index + 1) % 2 === 0 ? 'bg-blue-50' : 'bg-white'
                        }`}
                      >
                        <TableCell className="py-3 px-4 text-sm">
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-sm text-right">
                          <span className={getDirectionColor(transaction.amount)}>
                            {transaction.amount >= 0 ? '+' : '-'}
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-sm">
                          {transaction.currency}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-sm">
                          <span className={getDirectionColor(transaction.amount)}>
                            {getDirection(transaction.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-sm max-w-xs truncate">
                          {transaction.description}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-sm">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {transaction.dataSource}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </StandardTable>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <StandardPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}