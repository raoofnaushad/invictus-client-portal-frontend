import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";

export interface LiabilityFilters {
  searchTerm?: string;
  assetClass?: string[];
  assetSubclass?: string[];
  currency?: string[];
  financialInstitution?: string[];
  balanceRange?: {
    min: number;
    max: number;
  };
  interestRateRange?: {
    min: number;
    max: number;
  };
}

interface LiabilityFilterDialogProps {
  filters: LiabilityFilters;
  onFiltersChange: (filters: LiabilityFilters) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LiabilityFilterDialog = ({ 
  filters, 
  onFiltersChange, 
  open, 
  onOpenChange 
}: LiabilityFilterDialogProps) => {
  const [localFilters, setLocalFilters] = useState<LiabilityFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  const assetClassOptions = ['Credit', 'Loan', 'Mortgage'];
  const assetSubclassOptions = ['Credit Card', 'Personal Loan', 'Auto Loan', 'Home Loan', 'Student Loan', 'Line of Credit'];
  const currencyOptions = ['USD', 'EUR', 'GBP', 'CAD'];
  const institutionOptions = ['Plaid Bank', 'Chase', 'Bank of America', 'Wells Fargo', 'Citi'];

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    const clearedFilters: LiabilityFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onOpenChange(false);
  };

  const handleAssetClassChange = (assetClass: string, checked: boolean) => {
    const currentAssetClasses = localFilters.assetClass || [];
    const newAssetClasses = checked
      ? [...currentAssetClasses, assetClass]
      : currentAssetClasses.filter(t => t !== assetClass);
    
    setLocalFilters({
      ...localFilters,
      assetClass: newAssetClasses.length > 0 ? newAssetClasses : undefined
    });
  };

  const handleAssetSubclassChange = (assetSubclass: string, checked: boolean) => {
    const currentAssetSubclasses = localFilters.assetSubclass || [];
    const newAssetSubclasses = checked
      ? [...currentAssetSubclasses, assetSubclass]
      : currentAssetSubclasses.filter(t => t !== assetSubclass);
    
    setLocalFilters({
      ...localFilters,
      assetSubclass: newAssetSubclasses.length > 0 ? newAssetSubclasses : undefined
    });
  };

  const handleCurrencyChange = (currency: string, checked: boolean) => {
    const currentCurrencies = localFilters.currency || [];
    const newCurrencies = checked
      ? [...currentCurrencies, currency]
      : currentCurrencies.filter(c => c !== currency);
    
    setLocalFilters({
      ...localFilters,
      currency: newCurrencies.length > 0 ? newCurrencies : undefined
    });
  };

  const handleInstitutionChange = (institution: string, checked: boolean) => {
    const currentInstitutions = localFilters.financialInstitution || [];
    const newInstitutions = checked
      ? [...currentInstitutions, institution]
      : currentInstitutions.filter(i => i !== institution);
    
    setLocalFilters({
      ...localFilters,
      financialInstitution: newInstitutions.length > 0 ? newInstitutions : undefined
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 bg-white">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Liabilities</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Asset Class Filter */}
          <div>
            <Label className="text-sm font-medium">Asset Class</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {assetClassOptions.map((assetClass) => (
                <div key={assetClass} className="flex items-center space-x-2">
                  <Checkbox
                    id={`assetClass-${assetClass}`}
                    checked={localFilters.assetClass?.includes(assetClass) || false}
                    onCheckedChange={(checked) => 
                      handleAssetClassChange(assetClass, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`assetClass-${assetClass}`} 
                    className="text-sm"
                  >
                    {assetClass}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Asset Subclass Filter */}
          <div>
            <Label className="text-sm font-medium">Asset Subclass</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {assetSubclassOptions.map((assetSubclass) => (
                <div key={assetSubclass} className="flex items-center space-x-2">
                  <Checkbox
                    id={`assetSubclass-${assetSubclass}`}
                    checked={localFilters.assetSubclass?.includes(assetSubclass) || false}
                    onCheckedChange={(checked) => 
                      handleAssetSubclassChange(assetSubclass, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`assetSubclass-${assetSubclass}`} 
                    className="text-sm"
                  >
                    {assetSubclass}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Currency Filter */}
          <div>
            <Label className="text-sm font-medium">Currency</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {currencyOptions.map((currency) => (
                <div key={currency} className="flex items-center space-x-2">
                  <Checkbox
                    id={`currency-${currency}`}
                    checked={localFilters.currency?.includes(currency) || false}
                    onCheckedChange={(checked) => 
                      handleCurrencyChange(currency, checked as boolean)
                    }
                  />
                  <Label htmlFor={`currency-${currency}`} className="text-sm">
                    {currency}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Institution Filter */}
          <div>
            <Label className="text-sm font-medium">Financial Institution</Label>
            <div className="space-y-2 mt-2">
              {institutionOptions.map((institution) => (
                <div key={institution} className="flex items-center space-x-2">
                  <Checkbox
                    id={`institution-${institution}`}
                    checked={localFilters.financialInstitution?.includes(institution) || false}
                    onCheckedChange={(checked) => 
                      handleInstitutionChange(institution, checked as boolean)
                    }
                  />
                  <Label htmlFor={`institution-${institution}`} className="text-sm">
                    {institution}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Balance Range Filter */}
          <div>
            <Label className="text-sm font-medium">Balance Range</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <Label htmlFor="minBalance" className="text-xs text-gray-500">Min</Label>
                <Input
                  id="minBalance"
                  type="number"
                  placeholder="0"
                  value={localFilters.balanceRange?.min || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    balanceRange: {
                      ...localFilters.balanceRange,
                      min: e.target.value ? Number(e.target.value) : 0,
                      max: localFilters.balanceRange?.max || 1000000
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="maxBalance" className="text-xs text-gray-500">Max</Label>
                <Input
                  id="maxBalance"
                  type="number"
                  placeholder="1000000"
                  value={localFilters.balanceRange?.max || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    balanceRange: {
                      min: localFilters.balanceRange?.min || 0,
                      max: e.target.value ? Number(e.target.value) : 1000000
                    }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Interest Rate Range Filter */}
          <div>
            <Label className="text-sm font-medium">Interest Rate Range (%)</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <Label htmlFor="minInterestRate" className="text-xs text-gray-500">Min</Label>
                <Input
                  id="minInterestRate"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={localFilters.interestRateRange?.min || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    interestRateRange: {
                      ...localFilters.interestRateRange,
                      min: e.target.value ? Number(e.target.value) : 0,
                      max: localFilters.interestRateRange?.max || 100
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="maxInterestRate" className="text-xs text-gray-500">Max</Label>
                <Input
                  id="maxInterestRate"
                  type="number"
                  step="0.01"
                  placeholder="100.00"
                  value={localFilters.interestRateRange?.max || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    interestRateRange: {
                      min: localFilters.interestRateRange?.min || 0,
                      max: e.target.value ? Number(e.target.value) : 100
                    }
                  })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Clear</span>
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};