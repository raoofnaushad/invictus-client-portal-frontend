import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import { UnifiedTransactionFilters, UnifiedTransactionApiService } from "@/services/unifiedTransactionApi";

interface AllTransactionsFilterDialogProps {
  filters: UnifiedTransactionFilters;
  onFiltersChange: (filters: UnifiedTransactionFilters) => void;
}

export const AllTransactionsFilterDialog = ({ 
  filters, 
  onFiltersChange 
}: AllTransactionsFilterDialogProps) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<UnifiedTransactionFilters>(filters);
  const [filterOptions, setFilterOptions] = useState({
    types: [] as string[],
    directions: [] as string[],
    sources: [] as string[],
    accountTypes: [] as string[],
    currencies: [] as string[]
  });

  useEffect(() => {
    const loadFilterOptions = async () => {
      const options = await UnifiedTransactionApiService.getFilterOptions();
      setFilterOptions(options);
    };
    loadFilterOptions();
  }, []);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: UnifiedTransactionFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setOpen(false);
  };

  const toggleArrayFilter = (
    filterKey: keyof UnifiedTransactionFilters,
    value: string,
    currentArray: string[] = []
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setLocalFilters(prev => ({
      ...prev,
      [filterKey]: newArray.length > 0 ? newArray : undefined
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Search Term */}
            <div className="space-y-2">
              <Label htmlFor="searchTerm">Search</Label>
              <Input
                id="searchTerm"
                placeholder="Search transactions..."
                value={localFilters.searchTerm || ""}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  searchTerm: e.target.value || undefined
                }))}
              />
            </div>

            {/* Transaction Type */}
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterOptions.types.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={localFilters.type?.includes(type) || false}
                      onCheckedChange={() => 
                        toggleArrayFilter('type', type, localFilters.type)
                      }
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Direction */}
            <div className="space-y-2">
              <Label>Direction</Label>
              <div className="space-y-2">
                {filterOptions.directions.map((direction) => (
                  <div key={direction} className="flex items-center space-x-2">
                    <Checkbox
                      id={`direction-${direction}`}
                      checked={localFilters.direction?.includes(direction) || false}
                      onCheckedChange={() => 
                        toggleArrayFilter('direction', direction, localFilters.direction)
                      }
                    />
                    <Label htmlFor={`direction-${direction}`} className="text-sm">
                      {direction}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount Range */}
            <div className="space-y-2">
              <Label>Amount Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={localFilters.amountRange?.min || ""}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                    setLocalFilters(prev => ({
                      ...prev,
                      amountRange: {
                        min: value || 0,
                        max: prev.amountRange?.max || 1000000
                      }
                    }));
                  }}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={localFilters.amountRange?.max || ""}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                    setLocalFilters(prev => ({
                      ...prev,
                      amountRange: {
                        min: prev.amountRange?.min || 0,
                        max: value || 1000000
                      }
                    }));
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Source */}
            <div className="space-y-2">
              <Label>Source</Label>
              <div className="space-y-2">
                {filterOptions.sources.map((source) => (
                  <div key={source} className="flex items-center space-x-2">
                    <Checkbox
                      id={`source-${source}`}
                      checked={localFilters.source?.includes(source) || false}
                      onCheckedChange={() => 
                        toggleArrayFilter('source', source, localFilters.source)
                      }
                    />
                    <Label htmlFor={`source-${source}`} className="text-sm">
                      {source}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label>Account Type</Label>
              <div className="space-y-2">
                {filterOptions.accountTypes.map((accountType) => (
                  <div key={accountType} className="flex items-center space-x-2">
                    <Checkbox
                      id={`accountType-${accountType}`}
                      checked={localFilters.accountType?.includes(accountType) || false}
                      onCheckedChange={() => 
                        toggleArrayFilter('accountType', accountType, localFilters.accountType)
                      }
                    />
                    <Label htmlFor={`accountType-${accountType}`} className="text-sm">
                      {accountType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label>Currency</Label>
              <div className="space-y-2">
                {filterOptions.currencies.map((currency) => (
                  <div key={currency} className="flex items-center space-x-2">
                    <Checkbox
                      id={`currency-${currency}`}
                      checked={localFilters.currency?.includes(currency) || false}
                      onCheckedChange={() => 
                        toggleArrayFilter('currency', currency, localFilters.currency)
                      }
                    />
                    <Label htmlFor={`currency-${currency}`} className="text-sm">
                      {currency}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};