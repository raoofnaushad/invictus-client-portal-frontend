
import React, { useState, useCallback } from 'react';
import Highcharts from 'highcharts';
import * as HighchartsMap from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import mapDataWorld from '../../assets/geo.json';
import { regionData, countryGroups } from './data';
import RegionList from './RegionList';
import CountryDetails from './CountryDetails';

// Initialize Highcharts maps
// HighchartsMap(Highcharts);

const GeographicalDistributionChart: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [chartRef, setChartRef] = useState<Highcharts.Chart | null>(null);

  // Handle region click
  const handleRegionClick = useCallback((regionName: string) => {
    setSelectedRegion(regionName === selectedRegion ? null : regionName);
  }, [selectedRegion]);

  // Handle chart point click
  const handlePointClick = useCallback((event: any) => {
    const point = event.point;
    const countryCode = point.code;
    
    const region = countryGroups.find(group => 
      group.countries.some(country => country.code === countryCode)
    );
    
    if (region) {
      setSelectedRegion(region.regionName);
    }
  }, []);

  // Reset view
  const handleResetView = useCallback(() => {
    setSelectedRegion(null);
    // Comment out problematic mapZoom call
     if (chartRef) {
       chartRef.mapZoom();
     }
  }, [chartRef]);

  // Get filtered countries based on selected region
  const getFilteredCountryGroups = () => {
    if (!selectedRegion) return countryGroups;
    return countryGroups.filter(group => group.regionName === selectedRegion);
  };

  // Get country data for map with percentages
  const getCountryDataForMap = () => {
    const filteredGroups = getFilteredCountryGroups();
    return filteredGroups.map(group => ({
      type: 'map' as const,
      name: group.regionName,
      color: group.color,
      data: group.countries.map(country => ({
        code: country.code,
        value: country.percentage,
        name: country.name
      }))
    }));
  };

  // Get selected region data
  const getSelectedRegionData = () => {
    if (!selectedRegion) return null;
    return countryGroups.find(group => group.regionName === selectedRegion);
  };

  const chartOptions: HighchartsMap.Options = {
    chart: {
      map: mapDataWorld,
      backgroundColor: 'transparent',
      height: 190,
      events: {
        load: function() {
          setChartRef(this);
        }
      }
    },
    title: {
      text: '',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
      }
    },
    mapNavigation: {
      enabled: false,
      enableMouseWheelZoom: true,
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      map: {
        allAreas: false,
        joinBy: ['iso-a2', 'code'],
        states: {
          hover: {
            color: '#ff6b6b',
            brightness: 0.1
          }
        },
        dataLabels: {
          enabled: false,
          color: '#FFFFFF',
          style: {
            fontWeight: 'bold',
            fontSize: '9px',
            textOutline: '1px solid black'
          },
          format: ''
        },
        tooltip: {
        },
        point: {
          events: {
            click: handlePointClick
          }
        }
      }
    },
    series: getCountryDataForMap()
  };

  const selectedRegionData = getSelectedRegionData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographical Distribution of Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[190px] mb-4 bg-gray-100 flex items-center justify-center rounded">          
          <HighchartsReact
            highcharts={HighchartsMap}
            options={chartOptions}
            constructorType={'mapChart'}
          />
          
        </div>

        {selectedRegionData ? (
          <CountryDetails 
            selectedRegionData={selectedRegionData} 
            regionData={regionData}
          />
        ) : (
          <RegionList 
            regionData={regionData} 
            onRegionClick={handleRegionClick}
          />
        )}
        
        {selectedRegion && (
          <div className="mt-4 flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetView}
              className="text-xs font-semibold text-primary hover:text-primary/80 p-0 h-auto underline"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeographicalDistributionChart;
