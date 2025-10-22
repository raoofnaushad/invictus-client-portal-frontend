import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp, Building2, CreditCard, Landmark, TrendingUpIcon, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { UnifiedTransaction, UnifiedTransactionFilters } from "@/types/unifiedTransaction";
import { UnifiedTransactionApiService, PaginationParams } from "@/services/unifiedTransactionApi";
import { AllTransactionsFilterDialog } from "@/components/AllTransactionsFilterDialog";

const AllTransactionsPage = () => {
  const [transactions, setTransactions] = useState<UnifiedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UnifiedTransactionFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const response = await UnifiedTransactionApiService.getAllTransactions(pagination, filters);
        setTransactions(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [pagination, filters]);

  const handleFiltersChange = (newFilters: UnifiedTransactionFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Deposit':
        return <Landmark className="h-4 w-4" />;
      case 'Payment':
        return <CreditCard className="h-4 w-4" />;
      case 'Investment':
      case 'Buy':
      case 'Sell':
        return <TrendingUpIcon className="h-4 w-4" />;
      case 'Withdrawal':
        return <Building2 className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'Incoming' ? (
      <ArrowDownCircle className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowUpCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getAccountTypeColor = (accountType: string) => {
    switch (accountType) {
      case 'Investment':
        return 'text-blue-600 bg-blue-50';
      case 'Liability':
        return 'text-orange-600 bg-orange-50';
      case 'Illiquid':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>
            <p className="text-sm text-gray-500">View transactions from all your accounts</p>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        )}

        {/* Transactions Table */}
        {!loading && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">All Transactions</CardTitle>
                <AllTransactionsFilterDialog 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50/50">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Amount (+)</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Currency</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Direction</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Sender/Recipient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Account No.</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={transaction.id} className={`border-b border-border hover:bg-muted/50 ${
                        (index + 1) % 2 === 0 ? 'bg-blue-50' : 'bg-white'
                      }`}>
                        <td className="py-3 px-4 text-sm font-medium">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <span className={transaction.direction === 'Incoming' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {transaction.direction === 'Incoming' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {transaction.currency}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center space-x-2">
                            {getDirectionIcon(transaction.direction)}
                            <span className={transaction.direction === 'Incoming' ? 'text-green-600' : 'text-red-600'}>
                              {transaction.direction}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {transaction.senderRecipient}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {transaction.description}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getAccountTypeColor(transaction.accountType)}`}>
                              {getTypeIcon(transaction.type)}
                              <span>{transaction.type}</span>
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm text-gray-600">
                          {transaction.accountNo}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {transaction.source}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, totalItems)} of {totalItems} transactions
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {pagination.page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {transactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No transactions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AllTransactionsPage;