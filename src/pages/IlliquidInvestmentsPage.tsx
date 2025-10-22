import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3X3, List } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IlliquidInvestmentTable } from "@/components/IlliquidInvestmentTable";
import { IlliquidInvestmentCard } from "@/components/IlliquidInvestmentCard";
import { IlliquidInvestment } from "@/types/illiquidInvestment";
import { Card, CardContent } from "@/components/ui/card";
import { StandardPagination } from "@/components/StandardPagination";
import { IlliquidInvestmentFilterDialog } from "@/components/IlliquidInvestmentFilterDialog";
import { IlliquidInvestmentApiService, IlliquidInvestmentFilters, PaginationParams } from "@/services/illiquidInvestmentApi";

interface FilterRule {
  column: string;
  value: string;
}

const IlliquidInvestmentsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "card">("card");
  const [timeFrame, setTimeFrame] = useState("6M");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [investments, setInvestments] = useState<IlliquidInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchInvestments();
  }, [currentPage, searchTerm, filters]);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const apiFilters: IlliquidInvestmentFilters = {
        searchTerm: searchTerm || undefined,
      };

      // Convert filter rules to API filters
      filters.forEach(filter => {
        switch (filter.column) {
          case 'assetClass':
            if (!apiFilters.assetClass) apiFilters.assetClass = [];
            apiFilters.assetClass.push(filter.value);
            break;
          case 'status':
            if (!apiFilters.status) apiFilters.status = [];
            apiFilters.status.push(filter.value);
            break;
          case 'geography':
            if (!apiFilters.geography) apiFilters.geography = [];
            apiFilters.geography.push(filter.value);
            break;
          case 'vintageYear':
            if (!apiFilters.vintageYear) apiFilters.vintageYear = [];
            apiFilters.vintageYear.push(filter.value);
            break;
        }
      });

      const pagination: PaginationParams = {
        page: currentPage,
        limit: itemsPerPage
      };

      const response = await IlliquidInvestmentApiService.getIlliquidInvestments(pagination, apiFilters);
      setInvestments(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: FilterRule[]) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleInvestmentSelect = (investment: IlliquidInvestment) => {
    console.log("Selected investment:", investment);
    navigate(`/illiquid-investments/${investment.id}/details`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Illiquid Investments</h1>
            <p className="text-sm text-gray-500">Private equity, real estate, and alternative investment portfolios</p>
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
          <IlliquidInvestmentFilterDialog
            onFiltersChange={handleFiltersChange}
            currentFilters={filters}
          />
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by fund name, asset class, sector..."
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
            <div className="text-muted-foreground">Loading investments...</div>
          </div>
        ) : viewMode === "list" ? (
          <Card>
            <CardContent>
              <IlliquidInvestmentTable 
                investments={investments} 
                onInvestmentSelect={handleInvestmentSelect}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No investments found matching your criteria.</p>
              </div>
            ) : (
              investments.map((investment) => (
                <IlliquidInvestmentCard
                  key={investment.id}
                  investment={investment}
                  onClick={() => handleInvestmentSelect(investment)}
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

export default IlliquidInvestmentsPage;