
import DashboardHeader from "@/components/DashboardHeader";
import DashboardStatsCards from "@/components/DashboardStatsCards";
import DashboardCharts from "@/components/DashboardCharts";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const {
    selectedPeriod,
    setSelectedPeriod,
    selectedFilter,
    getFinancialDataByFilter,
    getCardValues,
    getFilteredData,
    getLiabilitiesData,
    getTotalAmount,
    handleCardClick,
    sampleLiabilitiesDetails
  } = useDashboardData();

  const financialData = getFinancialDataByFilter(selectedFilter || "Total");
  const cardValues = getCardValues();
  const filteredAssetData = getFilteredData();
  const totalAmount = getTotalAmount();
  const liabilitiesData = getLiabilitiesData();

  return (
    <div className="bg-background min-h-screen">
      <DashboardHeader 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        selectedFilter={selectedFilter}
      />
      
      <DashboardStatsCards 
        cardValues={cardValues}
        selectedFilter={selectedFilter}
        onCardClick={handleCardClick}
      />

      <DashboardCharts 
        financialData={financialData}
        filteredAssetData={filteredAssetData}
        totalAmount={totalAmount}
        liabilitiesData={liabilitiesData}
        liabilitiesDetails={sampleLiabilitiesDetails}
      />
    </div>
  );
};

export default Dashboard;
