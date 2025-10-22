
import React, { useState } from 'react';
import LiabilitiesChart from './LiabilitiesChart';
import LiabilitiesDetailView from './LiabilitiesDetailView';

export interface LiabilityData {
  months: string[];
  categories: string[];
  series: number[][];
  colors: string[];
}

export interface LiabilityDetail {
  bank: string;
  type: string;
  balance: string;
  rate: string;
  dueDate: string;
  liabilityClass: string;
}

interface LiabilitiesDashboardProps {
  totalLiabiliy: number;
  liabilitiesData: LiabilityData;
  liabilitiesDetails: LiabilityDetail[];
}

const LiabilitiesDashboard: React.FC<LiabilitiesDashboardProps> = ({
  totalLiabiliy,
  liabilitiesData,
  liabilitiesDetails
}) => {
  const [currentView, setCurrentView] = useState<'chart' | 'detail'>('chart');
  const [selectedLiabilityClass, setSelectedLiabilityClass] = useState('');

  console.log('Category totalLiabiliy:', totalLiabiliy);
  console.log('Category liabilitiesData:', liabilitiesData);
  console.log('Category liabilitiesDetails:', liabilitiesDetails);

  const handleCategoryClick = (category: string) => {
    console.log('Category clicked:', category);
    setSelectedLiabilityClass(category);
    setCurrentView('detail');
  };

  const handleBackToChart = () => {
    setCurrentView('chart');
  };

  return (
    <>
      {currentView === 'chart' && (
        <LiabilitiesChart
          totalLiabiliy={totalLiabiliy}
          liabilitiesData={liabilitiesData}
          onCategoryClick={handleCategoryClick}
        />
      )}
      {currentView === 'detail' && (
        <LiabilitiesDetailView
          totalLiabiliy={totalLiabiliy}
          liabilitiesDetails={liabilitiesDetails}
          selectedLiabilityClass={selectedLiabilityClass}
          onBackClick={handleBackToChart}
        />
      )}
    </>
  );
};

export default LiabilitiesDashboard;
