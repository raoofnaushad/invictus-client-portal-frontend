import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X } from "lucide-react";
import { BankAccountFilters } from "@/types/bankAccount";

interface BankAccountFilterDialogProps {
  filters: BankAccountFilters;
  onFiltersChange: (filters: BankAccountFilters) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BankAccountFilterDialog = ({ 
  filters, 
  onFiltersChange, 
  open, 
  onOpenChange 
}: BankAccountFilterDialogProps) => {
  const [localFilters, setLocalFilters] = useState<BankAccountFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  const assetSubclassOptions = ['checking', 'savings', 'money market', 'cd'];
  const currencyOptions = ['USD', 'EUR', 'GBP', 'CAD'];
  const institutionOptions = ['Plaid Bank', 'Chase', 'Bank of America', 'Wells Fargo', 'Citi'];

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    const clearedFilters: BankAccountFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onOpenChange(false);
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
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Filter Bank Accounts</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Account Type Filter */}
          <div>
            <Label className="text-sm font-medium">Account Type</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
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
                    className="text-sm capitalize"
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