
import React, { useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface FinancialData {
  months: string[];
  netWorth: number[];
  assets: number[];
  liabilities: number[];
}

interface TotalNetWorthChartProps {
  financialData: FinancialData;
}

const LegendDot = ({ color }: { color: string }) => (
  <div 
    className="w-2 h-2 rounded-full mr-2 mt-0.5"
    style={{ backgroundColor: color }}
  />
);

const LegendLabels = () => {
  return (
    <div className="bg-white p-2 rounded border">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <LegendDot color="#22c55e" />
          <span className="text-xs text-muted-foreground">Assets</span>
        </div>
        <div className="flex items-center">
          <LegendDot color="#f87171" />
          <span className="text-xs text-muted-foreground">Liabilities</span>
        </div>
      </div>
    </div>
  );
};

const formatMoney = (value: number) => {
  return (value).toFixed(0);
};

const TotalNetWorthChart = ({ financialData }: TotalNetWorthChartProps) => {
  const [activeChart, setActiveChart] = useState('netWorth');
  const chartRef = useRef(null);

  const toggleChartView = () => {
    setActiveChart(activeChart === 'netWorth' ? 'assetsLiabilities' : 'netWorth');
  };

  // Calculate current values and percentages
  const currentNetWorth = formatMoney(financialData.netWorth[financialData.netWorth.length - 1]);
  const netWorthChange = ((financialData.netWorth[financialData.netWorth.length - 1] - financialData.netWorth[financialData.netWorth.length - 2]) * 100) / financialData.netWorth[financialData.netWorth.length - 2];
  const currentAssets = formatMoney(financialData.assets[financialData.assets.length - 1]);
  const assetsChange = ((financialData.assets[financialData.assets.length - 1] - financialData.assets[financialData.assets.length - 2]) * 100) / financialData.assets[financialData.assets.length - 2];
  const currentLiabilities = formatMoney(financialData.liabilities[financialData.liabilities.length - 1]);
  const liabilitiesChange = ((financialData.liabilities[financialData.liabilities.length - 1] - financialData.liabilities[financialData.liabilities.length - 2]) * 100) / financialData.liabilities[financialData.liabilities.length - 2];

  const getChartOptions = () => {
    const baseOptions = {
      chart: {
        type: 'area',
        height: 280,
        backgroundColor: 'transparent',
      },
      title: {
        text: null
      },
      xAxis: {
        categories: financialData.months,
        labels: {
          style: {
            color: '#888'
          }
        },
        lineColor: '#eee',
        tickColor: '#eee',
      },
      yAxis: {
        title: {
          text: null
        },
        labels: {
          formatter: function() {
            return this.value + 'M';
          },
          style: {
            color: '#888'
          }
        },
        gridLineColor: '#eee',
        min: 0,
        max: 1000,
        tickInterval: 100
      },
      legend: {
        enabled: false
      },
      tooltip: {
        valuePrefix: '$',
        valueSuffix: 'M',
      },
      plotOptions: {
        area: {
          fillOpacity: 0.3,
          marker: {
            enabled: false
          },
          cursor: 'pointer',
          point: {
            events: {
              click: function() {
                console.log(`Clicked on ${this.series.name} at ${this.category}: $${this.y}M`);
              }
            }
          }
        }
      },
      credits: {
        enabled: false
      },
    };

    if (activeChart === 'netWorth') {
      return {
        ...baseOptions,
        series: [{
          name: 'Net Worth',
          data: financialData.netWorth,
          color: '#4ade80'
        }]
      };
    } else {
      return {
        ...baseOptions,
        series: [
          {
            name: 'Assets',
            data: financialData.assets,
            color: '#4ade80'
          },
          {
            name: 'Liabilities',
            data: financialData.liabilities,
            color: '#f87171'
          }
        ]
      };
    }
  };

  const TrendIndicator = ({ value }: { value: number }) => {
    if (value > 0) {
      return (
        <Badge className="bg-green-100 text-green-800 ml-2">
          <TrendingUp className="h-3 w-3 mr-1" />
          +{value.toFixed(1)}%
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 ml-2">
          <TrendingDown className="h-3 w-3 mr-1" />
          {value.toFixed(1)}%
        </Badge>
      );
    }
  };

  return (
    <Card className="cursor-pointer" onClick={toggleChartView}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle>Total Net Worth & Evolution</CardTitle>
            <div className="flex items-center mt-2">
              <span className="text-3xl font-bold">${currentNetWorth}M</span>
              {netWorthChange !== 0 && <TrendIndicator value={netWorthChange} />}
            </div>
          </div>
          {activeChart !== 'netWorth' && (
            <div className="flex-shrink-0">
              <LegendLabels />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <HighchartsReact
            highcharts={Highcharts}
            options={getChartOptions()}
            ref={chartRef}
          />
        </div>
        
        <div className="flex justify-end mt-4">
          <div className="flex space-x-8 bg-gray-50 p-3 rounded">
            <div>
              <p className="text-xs text-muted-foreground">Total Assets</p>
              <div className="flex items-center">
                <span className="text-xl font-bold">${currentAssets}M</span>
                <TrendIndicator value={assetsChange} />
              </div>
            </div>
            
            <div className="border-l pl-8">
              <p className="text-xs text-muted-foreground">Total Liabilities</p>
              <div className="flex items-center">
                <span className="text-xl font-bold">${currentLiabilities}M</span>
                <TrendIndicator value={liabilitiesChange} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalNetWorthChart;
