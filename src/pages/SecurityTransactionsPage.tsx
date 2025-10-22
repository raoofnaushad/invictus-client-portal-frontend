
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { ArrowLeft, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { InvestmentAccount, InvestmentHolding } from "@/types/investmentAccount";
import { StandardTable } from "@/components/StandardTable";
import { TransactionFilterDialog } from "@/components/TransactionFilterDialog";
import { InvestmentApiService, TransactionFilters, PaginationParams, Transaction } from "@/services/investmentApi";

const SecurityTransactionsPage = () => {
  const { accountId, securityId } = useParams<{ accountId: string; securityId: string }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<InvestmentAccount | null>(null);
  const [security, setSecurity] = useState<InvestmentHolding | null>(null);
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
    const loadData = async () => {
      if (!accountId || !securityId) return;
      
      setLoading(true);
      try {
        // Load account details
        const accountData = await InvestmentApiService.getInvestmentAccount(accountId);
        setAccount(accountData);

        // Find the specific security
        const securityData = accountData?.holdings.find(h => h.securityId === securityId);
        setSecurity(securityData || null);

        // Load transactions for this specific security
        const securityFilters = { ...filters, securityId };
        const transactionsResponse = await InvestmentApiService.getTransactions(accountId, pagination, securityFilters);
        setTransactions(transactionsResponse.data);
        setTotalPages(transactionsResponse.pagination.totalPages);
        setTotalItems(transactionsResponse.pagination.totalItems);
      } catch (error) {
        console.error("Error loading security transaction data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [accountId, securityId, pagination, filters]);

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

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTypeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'Buy':
        return 'default';
      case 'Sell':
        return 'secondary';
      case 'Dividend':
        return 'default';
      case 'Fee':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const columns = [
    { key: 'date', header: 'Date' },
    { key: 'type', header: 'Type' },
    { key: 'description', header: 'Description' },
    { key: 'units', header: 'Units' },
    { key: 'price', header: 'Price' },
    { key: 'amount', header: 'Amount' },
    { key: 'status', header: 'Status' },
  ];

  if (!account || !security) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">Security not found</div>
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
            <h1 className="text-2xl font-bold text-gray-900">{security.name} Transactions</h1>
            <p className="text-sm text-gray-500">{security.ticker} - {account.financialInstitution}</p>
          </div>
        </div>

        {/* Security Info Card */}
        <Card className="w-full max-w-md">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Current Value</span>
                <span className="font-medium">{formatCurrency(security.currentValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Units Held</span>
                <span className="font-medium">{security.units.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Value</span>
                <span className="font-medium">{formatCurrency(security.currentValue * security.units)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <CardTitle className="text-lg font-semibold">Transaction History - {security.ticker}</CardTitle>
                <TransactionFilterDialog 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </CardHeader>
            <CardContent>
              <StandardTable columns={columns}>
                {transactions.map((transaction, index) => (
                  <TableRow 
                    key={transaction.id} 
                    className={`cursor-pointer hover:bg-muted/50 ${
                      index % 2 === 1 ? 'bg-blue-50' : ''
                    }`}
                  >
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeVariant(transaction.type)} className="text-xs">
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.description}</div>
                    </TableCell>
                    <TableCell>
                      {transaction.units || '-'}
                    </TableCell>
                    <TableCell>
                      {transaction.pricePerUnit ? formatCurrency(transaction.pricePerUnit) : '-'}
                    </TableCell>
                    <TableCell>
                      <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(transaction.status || 'completed')} className="text-xs">
                        {transaction.status || 'completed'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </StandardTable>
              
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
                  <p className="text-gray-500">No transactions found for this security</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SecurityTransactionsPage;
