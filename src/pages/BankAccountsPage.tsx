import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3X3, List, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankAccountCard } from "@/components/BankAccountCard";
import { BankAccountTable } from "@/components/BankAccountTable";
import { BankAccountFilterDialog } from "@/components/BankAccountFilterDialog";
import { Card, CardContent } from "@/components/ui/card";
import { BankAccount, BankAccountFilters } from "@/types/bankAccount";
import { bankAccountApi } from "@/services/bankAccountApi";
import { mockBankAccountApi } from "@/services/mockBankAccountApi";

// Use mock API in development
const isDevelopment = import.meta.env.DEV;
const api = isDevelopment ? mockBankAccountApi : bankAccountApi;

export default function BankAccountsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "card">("card");
  const [timeFrame, setTimeFrame] = useState("6M");
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BankAccountFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const itemsPerPage = 9;

  useEffect(() => {
    fetchAccounts();
  }, [currentPage, filters, searchTerm]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      console.log('API not available, using mock data');
      const allFilters = searchTerm ? { ...filters, searchTerm } : filters;
      
      const response = await mockBankAccountApi.getBankAccounts(
        { page: currentPage, limit: itemsPerPage },
        allFilters
      );
      
      setAccounts(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: BankAccountFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleAccountSelect = (account: BankAccount) => {
    // Navigate to bank transactions page
    navigate(`/bank-transactions/${account.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bank Accounts</h1>
              <p className="text-sm text-gray-500">Manage your bank accounts and view transaction history</p>
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
          <BankAccountFilterDialog
            filters={filters}
            onFiltersChange={handleFiltersChange}
            open={filterDialogOpen}
            onOpenChange={setFilterDialogOpen}
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
                  <BankAccountTable accounts={accounts} onAccountSelect={handleAccountSelect} />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                  <BankAccountCard
                    key={account.id}
                    account={account}
                    onClick={() => handleAccountSelect(account)}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {accounts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No accounts found</p>
                <Button variant="outline" onClick={() => setFilters({})}>
                  Clear filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} accounts
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
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
}