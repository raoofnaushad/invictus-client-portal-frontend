import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { InvestmentAccount } from "@/types/investmentAccount";
import { InvestmentAccountCard } from "@/components/InvestmentAccountCard";
import { TransactionFilterDialog } from "@/components/TransactionFilterDialog";
import { InvestmentApiService, TransactionFilters, PaginationParams, Transaction } from "@/services/investmentApi";

const InvestmentTransactionsPage = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<InvestmentAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadAccountAndTransactions = async () => {
      if (!accountId) return;
      
      setLoading(true);
      try {
        // Load account details
        const accountData = await InvestmentApiService.getInvestmentAccount(accountId);
        setAccount(accountData);

        // Load transactions with pagination and filters
        const transactionsResponse = await InvestmentApiService.getTransactions(accountId, pagination, filters);
        setTransactions(transactionsResponse.data);
        setTotalPages(transactionsResponse.pagination.totalPages);
        setTotalItems(transactionsResponse.pagination.totalItems);
      } catch (error) {
        console.error("Error loading transaction data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAccountAndTransactions();
  }, [accountId, pagination, filters]);

  const handleFiltersChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-50';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'Failed':
        return 'text-red-600 bg-red-50';
      case 'Cancelled':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Buy':
        return 'text-blue-600 bg-blue-50';
      case 'Sell':
        return 'text-orange-600 bg-orange-50';
      case 'Dividend':
        return 'text-green-600 bg-green-50';
      case 'Fee':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">Account not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/investment-accounts/${accountId}/securities`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Securities</span>
        </Button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-sm text-gray-500">{account.financialInstitution} - {account.name}</p>
          </div>
        </div>

        {/* Account Card */}
        <div className="w-full max-w-md">
          <InvestmentAccountCard account={account} />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        )}

        {/* Transactions Table */}
        {!loading && account && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
                <TransactionFilterDialog 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Units</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            {transaction.assetId && (
                              <p className="text-sm text-gray-500">{transaction.assetId}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {transaction.units || '-'}
                        </td>
                        <td className="py-3 px-4">
                          {transaction.pricePerUnit ? formatCurrency(transaction.pricePerUnit) : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status || 'completed')}`}>
                            {transaction.status || 'completed'}
                          </span>
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

export default InvestmentTransactionsPage;