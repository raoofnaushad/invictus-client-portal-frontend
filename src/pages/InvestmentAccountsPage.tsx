
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3X3, List, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentAccountTable } from "@/components/InvestmentAccountTable";
import { InvestmentAccountCard } from "@/components/InvestmentAccountCard";
import { InvestmentAccountFilterDialog } from "@/components/InvestmentAccountFilterDialog";
import { InvestmentAccount } from "@/types/investmentAccount";
import { Card, CardContent } from "@/components/ui/card";
import { InvestmentApiService, InvestmentAccountFilters, PaginationParams } from "@/services/investmentApi";

const InvestmentAccountsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "card">("card");
  const [timeFrame, setTimeFrame] = useState("6M");
  const [accounts, setAccounts] = useState<InvestmentAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<InvestmentAccountFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 9
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      try {
        const searchFilters = {
          ...filters,
          searchTerm: searchTerm || undefined
        };
        const response = await InvestmentApiService.getInvestmentAccounts(pagination, searchFilters);
        setAccounts(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      } catch (error) {
        console.error("Error loading accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, [pagination, filters, searchTerm]);

  const handleFiltersChange = (newFilters: InvestmentAccountFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleAccountSelect = (account: InvestmentAccount) => {
    console.log("Selected account:", account);
    navigate(`/investment-accounts/${account.id}/securities`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Investment Accounts</h1>
              <p className="text-sm text-gray-500">Placeholder for the descriptions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Tabs value={timeFrame} onValueChange={setTimeFrame}>
              <TabsList>
                <TabsTrigger 
                  value="1M" 
                  className="min-w-auto px-2.5 py-1 text-sm font-medium data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  1M
                </TabsTrigger>
                <TabsTrigger 
                  value="6M" 
                  className="min-w-auto px-2.5 py-1 text-sm font-medium data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  6M
                </TabsTrigger>
                <TabsTrigger 
                  value="YTD" 
                  className="min-w-auto px-2.5 py-1 text-sm font-medium data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  YTD
                </TabsTrigger>
                <TabsTrigger 
                  value="1Y" 
                  className="min-w-auto px-2.5 py-1 text-sm font-medium data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  1Y
                </TabsTrigger>
                <TabsTrigger 
                  value="5Y" 
                  className="min-w-auto px-2.5 py-1 text-sm font-medium data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  5Y
                </TabsTrigger>
                <TabsTrigger 
                  value="Custom" 
                  className="min-w-auto px-2.5 py-1 text-sm font-medium data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Custom
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center justify-between">
          <InvestmentAccountFilterDialog 
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by account name, type, institution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80 bg-white"
              />
            </div>
            
            <div className="flex border border-gray-200 rounded-lg">
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("card")}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading accounts...</p>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {viewMode === "list" ? (
              <Card>
                <CardContent>
                  <InvestmentAccountTable 
                    accounts={accounts} 
                    onAccountSelect={handleAccountSelect}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                  <InvestmentAccountCard
                    key={account.id}
                    account={account}
                    onClick={() => handleAccountSelect(account)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, totalItems)} of {totalItems} accounts
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
          </>
        )}
      </div>
    </div>
  );
};

export default InvestmentAccountsPage;
