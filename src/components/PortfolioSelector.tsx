
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

interface IndexMap {
  [key: string]: boolean;
}

interface RegionData {
  expanded: boolean;
  selected: boolean;
  indexes: IndexMap;
}

interface RegionsState {
  [key: string]: RegionData;
}

interface PortfolioSelectorProps {
  onApply: (selectedIndexes: string[]) => void;
  onCancel?: () => void;
}

const PortfolioSelector: React.FC<PortfolioSelectorProps> = ({ onApply, onCancel }) => {
  const [regions, setRegions] = useState<RegionsState>({
    'United States': {
      expanded: true,
      selected: true,
      indexes: {
        'S&P 500': true,
        'Dow Jones Industrial Average': false,
        'Nasdaq Composite': false,
        'Russell 2000': false,
        'Wilshire 5000': false,
        'Bloomberg U.S. Aggregate Bond': false,
        'Bloomberg U.S. Corporate High Yield': false,
      }
    },
    'International / Global Indexes': {
      expanded: false,
      selected: false,
      indexes: {
        'MSCI World Index': false,
        'FTSE 100': false,
        'Nikkei 225': false,
        'DAX': false,
        'Hang Seng Index': false,
      }
    }
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredRegions, setFilteredRegions] = useState<RegionsState>({...regions});

  useEffect(() => {
    if (!searchTerm) {
      setFilteredRegions({...regions});
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered: RegionsState = {};
    
    Object.keys(regions).forEach(regionName => {
      const region = regions[regionName];
      const matchingIndexes: IndexMap = {};
      let hasMatches = false;
      
      if (regionName.toLowerCase().includes(term)) {
        filtered[regionName] = {...region};
        hasMatches = true;
      } else {
        Object.keys(region.indexes).forEach(indexName => {
          if (indexName.toLowerCase().includes(term)) {
            matchingIndexes[indexName] = region.indexes[indexName];
            hasMatches = true;
          }
        });
        
        if (hasMatches) {
          filtered[regionName] = {
            ...region,
            indexes: matchingIndexes
          };
        }
      }
    });
    
    setFilteredRegions(filtered);
  }, [searchTerm, regions]);

  const toggleRegion = (regionName: string) => {
    setRegions({
      ...regions,
      [regionName]: {
        ...regions[regionName],
        expanded: !regions[regionName].expanded
      }
    });
  };

  const toggleRegionSelection = (regionName: string) => {
    const isSelected = !regions[regionName].selected;
    
    const updatedIndexes: IndexMap = {};
    Object.keys(regions[regionName].indexes).forEach(indexName => {
      updatedIndexes[indexName] = isSelected;
    });
    
    setRegions({
      ...regions,
      [regionName]: {
        ...regions[regionName],
        selected: isSelected,
        indexes: updatedIndexes
      }
    });
  };

  const toggleIndex = (regionName: string, indexName: string) => {
    const newValue = !regions[regionName].indexes[indexName];
    
    const updatedIndexes = {
      ...regions[regionName].indexes,
      [indexName]: newValue
    };
    
    const allSelected = Object.values(updatedIndexes).every(value => value);
    
    setRegions({
      ...regions,
      [regionName]: {
        ...regions[regionName],
        selected: allSelected,
        indexes: updatedIndexes
      }
    });
  };

  const selectAll = () => {
    const updatedRegions: RegionsState = {};
    
    Object.keys(regions).forEach(regionName => {
      const updatedIndexes: IndexMap = {};
      Object.keys(regions[regionName].indexes).forEach(indexName => {
        updatedIndexes[indexName] = true;
      });
      
      updatedRegions[regionName] = {
        ...regions[regionName],
        selected: true,
        indexes: updatedIndexes
      };
    });
    
    setRegions(updatedRegions);
  };

  const clearAll = () => {
    const updatedRegions: RegionsState = {};
    
    Object.keys(regions).forEach(regionName => {
      const updatedIndexes: IndexMap = {};
      Object.keys(regions[regionName].indexes).forEach(indexName => {
        updatedIndexes[indexName] = false;
      });
      
      updatedRegions[regionName] = {
        ...regions[regionName],
        selected: false,
        indexes: updatedIndexes
      };
    });
    
    setRegions(updatedRegions);
  };

  const handleApply = () => {
    const selectedIndexes: string[] = [];
    Object.keys(regions).forEach(regionName => {
      Object.keys(regions[regionName].indexes).forEach(indexName => {
        if (regions[regionName].indexes[indexName]) {
          selectedIndexes.push(indexName);
        }
      });
    });
    
    onApply(selectedIndexes);
  };

  return (
    <div className="w-full max-h-96 bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
      {/* Search */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-gray-50"
          />
        </div>
      </div>
      
      {/* Selection Actions */}
      <div className="flex justify-between px-4 py-2 border-b">
        <Button variant="link" size="sm" onClick={selectAll} className="text-xs p-0 h-auto">
          Select All
        </Button>
        <Button variant="link" size="sm" onClick={clearAll} className="text-xs p-0 h-auto">
          Clear all
        </Button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(filteredRegions).map((regionName, index) => (
          <div key={regionName}>
            <Collapsible 
              open={regions[regionName].expanded} 
              onOpenChange={() => toggleRegion(regionName)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <Checkbox
                    checked={regions[regionName].selected}
                    onCheckedChange={() => toggleRegionSelection(regionName)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="flex-1 text-left ml-2 text-sm font-medium">{regionName}</span>
                  {regions[regionName].expanded ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="pl-8">
                  {Object.keys(filteredRegions[regionName].indexes).map((indexName) => (
                    <div key={indexName} className="flex items-center px-4 py-1">
                      <Checkbox
                        checked={regions[regionName].indexes[indexName]}
                        onCheckedChange={() => toggleIndex(regionName, indexName)}
                      />
                      <span className="ml-2 text-sm">{indexName}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
            {index < Object.keys(filteredRegions).length - 1 && <Separator />}
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="flex justify-end gap-2 p-4 border-t bg-white">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleApply} className="bg-gray-900 hover:bg-gray-800">
          Apply
        </Button>
      </div>
    </div>
  );
};

export default PortfolioSelector;
