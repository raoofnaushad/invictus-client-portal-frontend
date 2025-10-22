import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { InvestmentAccountFilters, InvestmentApiService } from "@/services/investmentApi";

interface InvestmentAccountFilterDialogProps {
  filters: InvestmentAccountFilters;
  onFiltersChange: (filters: InvestmentAccountFilters) => void;
}

export const InvestmentAccountFilterDialog = ({ 
  filters, 
  onFiltersChange 
}: InvestmentAccountFilterDialogProps) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<InvestmentAccountFilters>(filters);
  const [filterOptions, setFilterOptions] = useState({
    assetClasses: [] as string[],
    financialInstitutions: [] as string[],
    currencies: [] as string[]
  });

  useEffect(() => {
    const loadFilterOptions = async () => {
      const options = await InvestmentApiService.getInvestmentAccountFilterOptions();
      setFilterOptions(options);
    };
    loadFilterOptions();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: InvestmentAccountFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Filter Investment Accounts</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search accounts..."
              value={localFilters.search || ""}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                search: e.target.value || undefined
              }))}
            />
          </div>

          {/* Asset Class */}
          <div className="space-y-2">
            <Label>Asset Class</Label>
            <Input
              placeholder="Enter asset class..."
              value={localFilters.assetClass || ""}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                assetClass: e.target.value || undefined
              }))}
            />
          </div>

          {/* Financial Institution */}
          <div className="space-y-2">
            <Label>Financial Institution</Label>
            <Input
              placeholder="Enter financial institution..."
              value={localFilters.financialInstitution || ""}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                financialInstitution: e.target.value || undefined
              }))}
            />
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input
              placeholder="Enter currency (e.g. USD)..."
              value={localFilters.currency || ""}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                currency: e.target.value || undefined
              }))}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleClearFilters}>
            Clear All
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};