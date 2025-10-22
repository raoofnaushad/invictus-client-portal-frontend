
import React, { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PortfolioSelector from './PortfolioSelector';

interface PortfolioSelectDropdownProps {
  color: string;
  selectedAsset: string;
}

export default function PortfolioSelectDropdown({ color, selectedAsset }: PortfolioSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(selectedAsset);

  const handlePortfolioSelection = (selectedItems: string[]) => {
    if (selectedItems && selectedItems.length > 0) {
      setSelected(selectedItems[0]);
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 font-medium text-sm"
        >
          <div 
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: color }}
          />
          <span className="border-b-2 border-black leading-none">
            {selected}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <PortfolioSelector 
          onCancel={handleClose}
          onApply={handlePortfolioSelection}
        />
      </PopoverContent>
    </Popover>
  );
}
