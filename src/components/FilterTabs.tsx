
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterTabsProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  className?: string;
}

export const FilterTabs = ({ selectedPeriod, onPeriodChange, className = "" }: FilterTabsProps) => {
  return (
    <Tabs value={selectedPeriod} onValueChange={onPeriodChange} className={className}>
      <TabsList className="bg-transparent">
        <TabsTrigger 
          value="1M" 
          className="min-w-auto px-2.5 py-1 text-sm font-medium data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          1M
        </TabsTrigger>
        <TabsTrigger 
          value="6M" 
          className="min-w-auto px-2.5 py-1 text-sm font-medium data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          6M
        </TabsTrigger>
        <TabsTrigger 
          value="YTD" 
          className="min-w-auto px-2.5 py-1 text-sm font-medium data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          YTD
        </TabsTrigger>
        <TabsTrigger 
          value="1Y" 
          className="min-w-auto px-2.5 py-1 text-sm font-medium data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          1Y
        </TabsTrigger>
        <TabsTrigger 
          value="5Y" 
          className="min-w-auto px-2.5 py-1 text-sm font-medium data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          5Y
        </TabsTrigger>
        <TabsTrigger 
          value="Custom" 
          className="min-w-auto px-2.5 py-1 text-sm font-medium data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Custom
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
