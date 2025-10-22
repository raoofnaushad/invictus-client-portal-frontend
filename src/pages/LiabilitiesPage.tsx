import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3X3, List } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiabilityAccountTable } from "@/components/LiabilityAccountTable";
import { LiabilityAccountCard } from "@/components/LiabilityAccountCard";
import { LiabilityAccount } from "@/types/liabilityAccount";
import { Card, CardContent } from "@/components/ui/card";
import { StandardPagination } from "@/components/StandardPagination";
import { LiabilityFilterDialog, LiabilityFilters as LiabilityPageFilters } from "@/components/LiabilityFilterDialog";
import { LiabilityApiService, LiabilityFilters, PaginationParams } from "@/services/liabilityApi";

const LiabilitiesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "card">("card");
  const [timeFrame, setTimeFrame] = useState("6M");
  const [currentPage, setCurrentPage] = useState(1);
  const [liabilities, setLiabilities] = useState<LiabilityAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<LiabilityPageFilters>({});
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchLiabilities();
  }, [currentPage, searchTerm, filters]);

  const fetchLiabilities = async () => {
    setLoading(true);
    try {
      const apiFilters: LiabilityFilters = {
        searchTerm: searchTerm || undefined,
        assetClass: filters.assetClass,
        assetSubclass: filters.assetSubclass,
        currency: filters.currency,
        financialInstitution: filters.financialInstitution,
        balanceRange: filters.balanceRange,
        interestRateRange: filters.interestRateRange
      };

      const pagination: PaginationParams = {
        page: currentPage,
        limit: itemsPerPage
      };

      const response = await LiabilityApiService.getLiabilities(pagination, apiFilters);
      setLiabilities(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch liabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: LiabilityPageFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleLiabilityClick = (liability: LiabilityAccount) => {
    navigate(`/liabilities/${liability.id}/transactions`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Liabilities</h1>
            <p className="text-sm text-gray-500">Credit facilities, loans, and debt instruments</p>
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
          <LiabilityFilterDialog
            filters={filters}
            onFiltersChange={handleFiltersChange}
            open={filterDialogOpen}
            onOpenChange={setFilterDialogOpen}
          />
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by bank name, type, status..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
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

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-muted-foreground">Loading liabilities...</div>
          </div>
        ) : viewMode === "list" ? (
          <Card>
            <CardContent>
              <LiabilityAccountTable 
                liabilities={liabilities} 
                onLiabilitySelect={handleLiabilityClick}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liabilities.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No liabilities found matching your criteria.</p>
              </div>
            ) : (
              liabilities.map((liability) => (
                <LiabilityAccountCard
                  key={liability.id}
                  liability={liability}
                  onClick={() => handleLiabilityClick(liability)}
                />
              ))
            )}
          </div>
        )}

        {totalPages > 1 && (
          <StandardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default LiabilitiesPage;