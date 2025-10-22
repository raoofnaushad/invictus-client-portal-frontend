
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Grid, List, Search } from "lucide-react";
import { FilterTabs } from "./FilterTabs";

interface PageHeaderProps {
  title: string;
  description: string;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick?: () => void;
}

export const PageHeader = ({
  title,
  description,
  selectedPeriod,
  onPeriodChange,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  onFilterClick
}: PageHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Title and Time Period Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        
        <FilterTabs 
          selectedPeriod={selectedPeriod} 
          onPeriodChange={onPeriodChange} 
        />
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2" onClick={onFilterClick}>
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('cards')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('table')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
