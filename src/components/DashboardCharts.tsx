
import AssetBreakdownChart from "@/components/AssetBreakdownChart";
import TotalNetWorthChart from "@/components/TotalNetWorthChart";
import PortfolioLiquidityDashboard from "@/components/PortfolioLiquidityDashboard";
import CashFlowChart from "@/components/CashFlowChart";
import GeographicalDistributionChart from "@/components/GeographicalDistributionChart";
import PortfolioPerformanceChart from "@/components/PortfolioPerformanceChart";
import LiabilitiesDashboard from "@/components/LiabilitiesDashboard";
import { AllocationData, FinancialData } from "@/types/dashboard";
import { LiabilityDetail, LiabilityData } from "@/components/LiabilitiesDashboard";

interface DashboardChartsProps {
  financialData: FinancialData;
  filteredAssetData: AllocationData[];
  totalAmount: number;
  liabilitiesData: LiabilityData;
  liabilitiesDetails: LiabilityDetail[];
}

const DashboardCharts = ({ 
  financialData, 
  filteredAssetData, 
  totalAmount,
  liabilitiesData,
  liabilitiesDetails
}: DashboardChartsProps) => {
  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="px-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            <TotalNetWorthChart financialData={financialData} />
            <PortfolioLiquidityDashboard />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <AssetBreakdownChart 
              allocationData={filteredAssetData}
              totalAmount={totalAmount}
              percentChange={12.3}
            />
            <LiabilitiesDashboard 
              totalLiabiliy={financialData.liabilities[financialData.liabilities.length - 1]}
              liabilitiesData={liabilitiesData}
              liabilitiesDetails={liabilitiesDetails}
            />
          </div>
        </div>

        {/* Bottom Row - 3 columns */}
        <div className="grid grid-cols-3 gap-6">
          <GeographicalDistributionChart />
          <PortfolioPerformanceChart />
          <CashFlowChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
