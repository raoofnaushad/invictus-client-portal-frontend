import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Filter, X } from "lucide-react";
import { MockApiService, FilterOptions } from "@/services/mockApi";

interface FilterDialogProps {
  onFiltersChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export function FilterDialog({ onFiltersChange, currentFilters }: FilterDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(currentFilters);
  const [filterOptions, setFilterOptions] = useState<{
    statuses: string[];
    documentTypes: string[];
    assignees: string[];
  }>({
    statuses: [],
    documentTypes: [],
    assignees: []
  });

  useEffect(() => {
    MockApiService.getFilterOptions().then(setFilterOptions);
  }, []);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleStatusChange = (status: string, checked: boolean) => {
    const currentStatuses = localFilters.status || [];
    if (checked) {
      setLocalFilters({
        ...localFilters,
        status: [...currentStatuses, status]
      });
    } else {
      setLocalFilters({
        ...localFilters,
        status: currentStatuses.filter(s => s !== status)
      });
    }
  };

  const handleDocumentTypeChange = (type: string, checked: boolean) => {
    const currentTypes = localFilters.documentType || [];
    if (checked) {
      setLocalFilters({
        ...localFilters,
        documentType: [...currentTypes, type]
      });
    } else {
      setLocalFilters({
        ...localFilters,
        documentType: currentTypes.filter(t => t !== type)
      });
    }
  };

  const handleAssigneeChange = (assignee: string, checked: boolean) => {
    const currentAssignees = localFilters.assignedTo || [];
    if (checked) {
      setLocalFilters({
        ...localFilters,
        assignedTo: [...currentAssignees, assignee]
      });
    } else {
      setLocalFilters({
        ...localFilters,
        assignedTo: currentAssignees.filter(a => a !== assignee)
      });
    }
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    setIsOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.status?.length) count += currentFilters.status.length;
    if (currentFilters.documentType?.length) count += currentFilters.documentType.length;
    if (currentFilters.assignedTo?.length) count += currentFilters.assignedTo.length;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {activeFilterCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Documents</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Status Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Status</Label>
            <div className="space-y-2">
              {filterOptions.statuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={localFilters.status?.includes(status) || false}
                    onCheckedChange={(checked) => 
                      handleStatusChange(status, checked as boolean)
                    }
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Document Type Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Document Type</Label>
            <div className="space-y-2">
              {filterOptions.documentTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={localFilters.documentType?.includes(type) || false}
                    onCheckedChange={(checked) => 
                      handleDocumentTypeChange(type, checked as boolean)
                    }
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Assigned To Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Assigned To</Label>
            <div className="space-y-2">
              {filterOptions.assignees.map((assignee) => (
                <div key={assignee} className="flex items-center space-x-2">
                  <Checkbox
                    id={`assignee-${assignee}`}
                    checked={localFilters.assignedTo?.includes(assignee) || false}
                    onCheckedChange={(checked) => 
                      handleAssigneeChange(assignee, checked as boolean)
                    }
                  />
                  <Label htmlFor={`assignee-${assignee}`} className="text-sm">
                    {assignee}
                  </Label>
                </div>
              ))}
            </div>
          </div>
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