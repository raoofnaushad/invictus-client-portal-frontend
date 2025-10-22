
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FilterTabs } from "./FilterTabs";

interface IlliquidInvestmentHeaderProps {
  fundName: string;
  onBackClick: () => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export const IlliquidInvestmentHeader = ({ 
  fundName, 
  onBackClick, 
  selectedPeriod, 
  onPeriodChange 
}: IlliquidInvestmentHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Illiquid Investments
        </Button>
      </div>

      {/* Investment Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{fundName}</h1>
          <p className="text-gray-500 text-sm mt-1">Placeholder for the descriptions</p>
        </div>
        <FilterTabs 
          selectedPeriod={selectedPeriod} 
          onPeriodChange={onPeriodChange} 
        />
      </div>
    </div>
  );
};
