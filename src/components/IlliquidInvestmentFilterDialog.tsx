
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

interface FilterRule {
  column: string;
  value: string;
}

interface IlliquidInvestmentFilterDialogProps {
  onFiltersChange: (filters: FilterRule[]) => void;
  currentFilters: FilterRule[];
}

const filterableColumns = [
  { key: 'fundName', label: 'Fund Name' },
  { key: 'assetClass', label: 'Asset Class' },
  { key: 'status', label: 'Status' },
  { key: 'vintageYear', label: 'Vintage Year' },
  { key: 'geography', label: 'Geography' },
  { key: 'sector', label: 'Sector' },
  { key: 'currency', label: 'Currency' },
];

export function IlliquidInvestmentFilterDialog({ 
  onFiltersChange, 
  currentFilters 
}: IlliquidInvestmentFilterDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterRule[]>(currentFilters);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const addFilter = () => {
    if (selectedColumn && filterValue.trim()) {
      const newFilter: FilterRule = {
        column: selectedColumn,
        value: filterValue.trim()
      };
      
      // Check if filter for this column already exists
      const existingIndex = localFilters.findIndex(f => f.column === selectedColumn);
      if (existingIndex >= 0) {
        // Update existing filter
        const updatedFilters = [...localFilters];
        updatedFilters[existingIndex] = newFilter;
        setLocalFilters(updatedFilters);
      } else {
        // Add new filter
        setLocalFilters([...localFilters, newFilter]);
      }
      
      setSelectedColumn("");
      setFilterValue("");
    }
  };

  const removeFilter = (index: number) => {
    const updatedFilters = localFilters.filter((_, i) => i !== index);
    setLocalFilters(updatedFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setLocalFilters([]);
    onFiltersChange([]);
    setIsOpen(false);
  };

  const getColumnLabel = (columnKey: string) => {
    return filterableColumns.find(col => col.key === columnKey)?.label || columnKey;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 bg-white relative">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {currentFilters.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {currentFilters.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Investments</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Add Filter Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Add Filter</Label>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="column-select" className="text-sm mb-2 block">Column</Label>
                <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select column to filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterableColumns.map((column) => (
                      <SelectItem key={column.key} value={column.key}>
                        {column.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="filter-value" className="text-sm mb-2 block">Filter Value</Label>
                <Input
                  id="filter-value"
                  placeholder="Enter filter value"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addFilter()}
                />
              </div>
              
              <Button 
                onClick={addFilter} 
                disabled={!selectedColumn || !filterValue.trim()}
                className="w-full"
              >
                Add Filter
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {localFilters.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Active Filters</Label>
              <div className="space-y-2">
                {localFilters.map((filter, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <div className="flex-1">
                      <span className="font-medium text-sm">{getColumnLabel(filter.column)}</span>
                      <span className="text-muted-foreground text-sm mx-2">contains</span>
                      <span className="text-sm">"{filter.value}"</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilter(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={clearFilters}>
            Clear All
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
