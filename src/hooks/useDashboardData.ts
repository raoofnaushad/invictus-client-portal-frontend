
import { useState } from "react";
import { CardValues, FinancialData, AllocationData } from "@/types/dashboard";
import { 
  getAllAssetAllocationData, 
  getWatarManagedData, 
  getExternallyManagedData, 
  getUnmanagedData,
  sampleLiabilitiesDetails 
} from "@/data/dashboardData";
import { subMonths, getMonth } from "date-fns";

export const useDashboardData = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const [selectedFilter, setSelectedFilter] = useState<string | null>("Total");

  // Base financial data for charts
  const getFinancialDataByFilter = (filter: string): FinancialData => {
    const fullData = {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      assets: [600000000, 620000000, 630000000, 650000000, 670000000, 680000000, 690000000, 710000000, 730000000, 750000000, 770000000, 875000000],
      liabilities: [200000000, 200000000, 220000000, 200000000, 200000000, 200000000, 200000000, 210000000, 210000000, 220000000, 220000000, 235000000]
    };

    // Filter data based on selected period
    let periodData = { ...fullData };
    const currentMonth = new Date().getMonth(); // 0-11, where 0 is January
    
    switch (selectedPeriod) {
      case '1M':
        periodData = {
          months: fullData.months.slice(currentMonth, currentMonth + 1),
          assets: fullData.assets.slice(currentMonth, currentMonth + 1),
          liabilities: fullData.liabilities.slice(currentMonth, currentMonth + 1)
        };
        break;
      case '6M':
        const start6M = Math.max(0, currentMonth - 5);
        periodData = {
          months: fullData.months.slice(start6M, currentMonth + 1),
          assets: fullData.assets.slice(start6M, currentMonth + 1),
          liabilities: fullData.liabilities.slice(start6M, currentMonth + 1)
        };
        break;
      case 'YTD':
        periodData = {
          months: fullData.months.slice(0, currentMonth + 1),
          assets: fullData.assets.slice(0, currentMonth + 1),
          liabilities: fullData.liabilities.slice(0, currentMonth + 1)
        };
        break;
      case '1Y':
      case '5Y':
      default:
        // Show full year data for 1Y, 5Y, and Custom
        periodData = fullData;
        break;
    }

    switch (filter) {
      case 'WATAR':
        return {
          ...periodData,
          assets: periodData.assets.map(val => val * 0.43 / 1000000),
          liabilities: periodData.liabilities.map(val => val * 0.20 / 1000000),
          netWorth: periodData.assets.map((asset, index) => (asset * 0.43 / 1000000) - (periodData.liabilities[index] * 0.20 / 1000000))
        };
      case 'External':
        return {
          ...periodData,
          assets: periodData.assets.map(val => val * 0.13 / 1000000),
          liabilities: periodData.liabilities.map(val => val * 0.15 / 1000000),
          netWorth: periodData.assets.map((asset, index) => (asset * 0.13 / 1000000) - (periodData.liabilities[index] * 0.15 / 1000000))
        };
      case 'Unmanaged':
        return {
          ...periodData,
          assets: periodData.assets.map(val => val * 0.17 / 1000000),
          liabilities: periodData.liabilities.map(val => val * 0.10 / 1000000),
          netWorth: periodData.assets.map((asset, index) => (asset * 0.17 / 1000000) - (periodData.liabilities[index] * 0.10 / 1000000))
        };
      default:
        { const netWorthData = periodData.assets.map((asset, index) => asset - periodData.liabilities[index]);
        return {
          ...periodData,
          assets: periodData.assets.map(val => val/ 1000000),
          liabilities: periodData.liabilities.map(val => val / 1000000),
          netWorth: netWorthData.map(val => val / 1000000)
        }; }
    }
  };

  const getCardValues = (): CardValues => {
    const totalAssets = 875000000;
    const totalLiabilities = 235000000;
    const totalNetWorth = totalAssets - totalLiabilities;

    const watarAssets = totalAssets * 0.43;
    const watarLiabilities = totalLiabilities * 0.20;
    const watarNetWorth = watarAssets - watarLiabilities;

    const externalAssets = totalAssets * 0.13;
    const externalLiabilities = totalLiabilities * 0.15;
    const externalNetWorth = externalAssets - externalLiabilities;

    const unmanagedAssets = totalAssets * 0.17;
    const unmanagedLiabilities = totalLiabilities * 0.10;
    const unmanagedNetWorth = unmanagedAssets - unmanagedLiabilities;

    return {
      total: {
        assets: totalAssets,
        liabilities: totalLiabilities,
        netWorth: totalNetWorth
      },
      watar: {
        assets: watarAssets,
        liabilities: watarLiabilities,
        netWorth: watarNetWorth
      },
      external: {
        assets: externalAssets,
        liabilities: externalLiabilities,
        netWorth: externalNetWorth
      },
      unmanaged: {
        assets: unmanagedAssets,
        liabilities: unmanagedLiabilities,
        netWorth: unmanagedNetWorth
      }
    };
  };

  const getFilteredData = (): AllocationData[] => {
    switch (selectedFilter) {
      case 'WATAR':
        return getWatarManagedData();
      case 'External':
        return getExternallyManagedData();
      case 'Unmanaged':
        return getUnmanagedData();
      case 'Total':
      default:
        return getAllAssetAllocationData();
    }
  };

  const getLiabilitiesData = () => {
    const fullData = {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      categories: ['Mortgages', 'Credit Cards', 'Business Loans', 'Investment Loans'],
      series: [
        [50, 52, 48, 55, 58, 60, 62, 65, 63, 68, 70, 72],
        [15, 18, 20, 17, 16, 19, 21, 18, 22, 20, 23, 25],
        [35, 38, 40, 42, 45, 43, 46, 48, 50, 52, 48, 45],
        [25, 28, 30, 32, 28, 35, 38, 40, 42, 38, 35, 40]
      ],
      colors: ['#1C1C1C', '#14CA74', '#95A4FC', '#B1E3FF']
    };

    // Filter data based on selected period
    let periodData = { ...fullData };
    const currentMonth = new Date().getMonth(); // 0-11, where 0 is January
    
    switch (selectedPeriod) {
      case '1M':
        periodData = {
          ...fullData,
          months: fullData.months.slice(currentMonth, currentMonth + 1),
          series: fullData.series.map(series => series.slice(currentMonth, currentMonth + 1))
        };
        break;
      case '6M':
        const start6M = Math.max(0, currentMonth - 5);
        periodData = {
          ...fullData,
          months: fullData.months.slice(start6M, currentMonth + 1),
          series: fullData.series.map(series => series.slice(start6M, currentMonth + 1))
        };
        break;
      case 'YTD':
        periodData = {
          ...fullData,
          months: fullData.months.slice(0, currentMonth + 1),
          series: fullData.series.map(series => series.slice(0, currentMonth + 1))
        };
        break;
      case '1Y':
      case '5Y':
      default:
        // Show full year data for 1Y, 5Y, and Custom
        periodData = fullData;
        break;
    }

    const multiplier = selectedFilter === 'WATAR' ? 0.20 : 
                      selectedFilter === 'External' ? 0.15 : 
                      selectedFilter === 'Unmanaged' ? 0.10 : 1;

    return {
      ...periodData,
      series: periodData.series.map(series => 
        series.map(value => Math.round(value * multiplier))
      )
    };
  };

  const getTotalAmount = () => {
    const data = getFilteredData();
    return data.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleCardClick = (cardType: string) => {
    if (selectedFilter === cardType) {
      setSelectedFilter("Total");
    } else {
      setSelectedFilter(cardType);
    }
  };

  return {
    selectedPeriod,
    setSelectedPeriod,
    selectedFilter,
    setSelectedFilter,
    getFinancialDataByFilter,
    getCardValues,
    getFilteredData,
    getLiabilitiesData,
    getTotalAmount,
    handleCardClick,
    sampleLiabilitiesDetails
  };
};
