import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { InvestmentAccount, InvestmentHolding } from "@/types/investmentAccount";
import { InvestmentAccountCard } from "@/components/InvestmentAccountCard";
import { SecuritiesTable } from "@/components/SecuritiesTable";
import { SecurityFilterDialog } from "@/components/SecurityFilterDialog";
import { InvestmentApiService, SecurityFilters, PaginationParams } from "@/services/investmentApi";

const InvestmentSecuritiesPage = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<InvestmentAccount | null>(null);
  const [securities, setSecurities] = useState<InvestmentHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SecurityFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadAccountAndSecurities = async () => {
      if (!accountId) return;
      
      setLoading(true);
      try {
        // Load account details
        const accountData = await InvestmentApiService.getInvestmentAccount(accountId);
        setAccount(accountData);

        // Load securities with pagination and filters
        const securitiesResponse = await InvestmentApiService.getSecurities(accountId, pagination, filters);
        setSecurities(securitiesResponse.data);
        setTotalPages(securitiesResponse.pagination.totalPages);
        setTotalItems(securitiesResponse.pagination.totalItems);
      } catch (error) {
        console.error("Error loading account data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAccountAndSecurities();
  }, [accountId, pagination, filters]);

  const handleFiltersChange = (newFilters: SecurityFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSecurityClick = (securityId: string) => {
    console.log("Selected security:", securityId);
    navigate(`/investment-accounts/${accountId}/securities/${securityId}/transactions`);
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
          onClick={() => navigate("/investment-accounts")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Investment Accounts</span>
        </Button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{account.financialInstitution}</h1>
            <p className="text-sm text-gray-500">Placeholder for the descriptions</p>
          </div>
        </div>

        {/* Account Card */}
        <div className="w-full max-w-md">
          <InvestmentAccountCard account={account} />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading securities...</p>
          </div>
        )}

        {/* Securities Table */}
        {!loading && account && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">List of Investments</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/investment-accounts/${accountId}/transactions`)}
                  >
                    View Transactions
                  </Button>
                  <SecurityFilterDialog 
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SecuritiesTable 
                holdings={securities} 
                onSecurityClick={handleSecurityClick}
              />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, totalItems)} of {totalItems} securities
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InvestmentSecuritiesPage;
