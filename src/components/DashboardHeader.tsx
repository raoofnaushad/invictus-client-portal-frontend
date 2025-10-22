
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardHeaderProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  selectedFilter: string | null;
}

const DashboardHeader = ({ selectedPeriod, onPeriodChange }: DashboardHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-0 px-8">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold cursor-pointer">Dashboard</h1>
        </div>
        <Tabs value={selectedPeriod} onValueChange={onPeriodChange}>
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
      </div>
    </div>
  );
};

export default DashboardHeader;
