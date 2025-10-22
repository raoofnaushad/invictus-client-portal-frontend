
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CountryGroup, RegionData } from './types';

interface CountryDetailsProps {
  selectedRegionData: CountryGroup;
  regionData: RegionData[];
}

const CountryDetails: React.FC<CountryDetailsProps> = ({ selectedRegionData, regionData }) => {
  return (
    <div className="mt-4">
      <div className="max-h-[150px] overflow-y-auto space-y-3">
        {selectedRegionData.countries.map((country) => (
          <div key={country.code} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {country.name} ({country.code})
              </span>
              <span className="text-sm font-bold">
                {country.percentage}%
              </span>
            </div>
            <Progress
              value={(country.percentage / regionData.find(r => r.name === selectedRegionData.regionName)!.value) * 100}
              className="h-1.5"
              style={{
                backgroundColor: '#e0e0e0'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryDetails;
