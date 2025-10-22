import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { SecurityFilters } from "@/services/investmentApi";

interface SecurityFilterDialogProps {
  filters: SecurityFilters;
  onFiltersChange: (filters: SecurityFilters) => void;
}

export const SecurityFilterDialog = ({ 
  filters, 
  onFiltersChange 
}: SecurityFilterDialogProps) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<SecurityFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: SecurityFilters = {};
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Securities</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Search</Label>
            <Input
              placeholder="Search securities..."
              value={localFilters.search || ""}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                search: e.target.value || undefined
              }))}
            />
          </div>

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

          <div className="space-y-2">
            <Label>Ticker</Label>
            <Input
              placeholder="Enter ticker symbol..."
              value={localFilters.ticker || ""}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                ticker: e.target.value || undefined
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