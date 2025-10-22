import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { TransactionFilters } from "@/services/investmentApi";

interface TransactionFilterDialogProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

export const TransactionFilterDialog = ({ 
  filters, 
  onFiltersChange 
}: TransactionFilterDialogProps) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: TransactionFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Filter Transactions</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Search</Label>
            <Input
              placeholder="Search transactions..."
              value={localFilters.search || ""}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                search: e.target.value || undefined
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Input
              placeholder="Enter transaction type..."
              value={localFilters.type || ""}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                type: e.target.value || undefined
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date From</Label>
              <Input
                type="date"
                value={localFilters.dateFrom || ""}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  dateFrom: e.target.value || undefined
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Date To</Label>
              <Input
                type="date"
                value={localFilters.dateTo || ""}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  dateTo: e.target.value || undefined
                }))}
              />
            </div>
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