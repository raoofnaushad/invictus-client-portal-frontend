import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export interface BankTransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  direction?: string;
  description?: string;
  currency?: string;
  source?: string;
}

interface BankTransactionFilterDialogProps {
  filters: BankTransactionFilters;
  onFiltersChange: (filters: BankTransactionFilters) => void;
}

export const BankTransactionFilterDialog = ({ 
  filters, 
  onFiltersChange 
}: BankTransactionFilterDialogProps) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<BankTransactionFilters>(filters);

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

  const handleInputChange = (field: keyof BankTransactionFilters, value: string | number) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
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
          <DialogTitle>Filter Transactions</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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

          {/* Direction */}
          <div>
            <Label htmlFor="direction">Direction</Label>
            <Select 
              value={localFilters.direction || 'all'} 
              onValueChange={(value) => handleInputChange('direction', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All directions" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All directions</SelectItem>
                <SelectItem value="Incoming">Incoming</SelectItem>
                <SelectItem value="Outgoing">Outgoing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Search description..."
              value={localFilters.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          {/* Currency */}
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select 
              value={localFilters.currency || 'all'} 
              onValueChange={(value) => handleInputChange('currency', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All currencies" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All currencies</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source */}
          <div>
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              placeholder="Data source..."
              value={localFilters.source || ''}
              onChange={(e) => handleInputChange('source', e.target.value)}
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