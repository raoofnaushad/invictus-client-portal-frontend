
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { RegionData } from './types';

interface RegionListProps {
  regionData: RegionData[];
  onRegionClick: (regionName: string) => void;
}

const RegionList: React.FC<RegionListProps> = ({ regionData, onRegionClick }) => {
  return (
    <div className="space-y-2 mt-4">
      {regionData.map((region) => (
        <div 
          key={region.name}
          className="cursor-pointer p-2 rounded hover:bg-gray-50 space-y-1"
          onClick={() => onRegionClick(region.name)}
        >
          <div className="flex justify-between">
            <span className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: region.color }}
              ></div>
              {region.name}
            </span>
            <span>{region.value}%</span>
          </div>
          <Progress
            value={region.value}
            className="h-0.5"
            style={{
              backgroundColor: '#e0e0e0'
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default RegionList;
