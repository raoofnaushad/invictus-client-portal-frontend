import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export interface LiabilityTransactionFilters {
  liabilityClass?: string;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: string;
  dateTo?: string;
  interestRateRange?: {
    min: number;
    max: number;
  };
  dataSource?: string;
}

interface LiabilityTransactionFilterDialogProps {
  filters: LiabilityTransactionFilters;
  onFiltersChange: (filters: LiabilityTransactionFilters) => void;
}

export const LiabilityTransactionFilterDialog = ({ 
  filters, 
  onFiltersChange 
}: LiabilityTransactionFilterDialogProps) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<LiabilityTransactionFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setOpen(false);
  };

  const handleInputChange = (field: keyof LiabilityTransactionFilters, value: string | number) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestRateChange = (type: 'min' | 'max', value: number) => {
    setLocalFilters(prev => ({
      ...prev,
      interestRateRange: {
        ...prev.interestRateRange,
        [type]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Filter Liability Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Liability Class */}
          <div>
            <Label htmlFor="liabilityClass">Liability Class</Label>
            <Select 
              value={localFilters.liabilityClass || 'all'} 
              onValueChange={(value) => handleInputChange('liabilityClass', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All liability classes" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All liability classes</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
                <SelectItem value="Loan">Loan</SelectItem>
                <SelectItem value="Mortgage">Mortgage</SelectItem>
                <SelectItem value="Line of Credit">Line of Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minAmount">Min Amount</Label>
              <Input
                id="minAmount"
                type="number"
                placeholder="0.00"
                value={localFilters.minAmount || ''}
                onChange={(e) => handleInputChange('minAmount', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="maxAmount">Max Amount</Label>
              <Input
                id="maxAmount"
                type="number"
                placeholder="0.00"
                value={localFilters.maxAmount || ''}
                onChange={(e) => handleInputChange('maxAmount', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={localFilters.dateFrom || ''}
                onChange={(e) => handleInputChange('dateFrom', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={localFilters.dateTo || ''}
                onChange={(e) => handleInputChange('dateTo', e.target.value)}
              />
            </div>
          </div>

          {/* Interest Rate Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minInterestRate">Min Interest Rate (%)</Label>
              <Input
                id="minInterestRate"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={localFilters.interestRateRange?.min || ''}
                onChange={(e) => handleInterestRateChange('min', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="maxInterestRate">Max Interest Rate (%)</Label>
              <Input
                id="maxInterestRate"
                type="number"
                step="0.01"
                placeholder="100.00"
                value={localFilters.interestRateRange?.max || ''}
                onChange={(e) => handleInterestRateChange('max', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Data Source */}
          <div>
            <Label htmlFor="dataSource">Data Source</Label>
            <Input
              id="dataSource"
              placeholder="Search data source..."
              value={localFilters.dataSource || ''}
              onChange={(e) => handleInputChange('dataSource', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleClearFilters}>
            Clear All
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};