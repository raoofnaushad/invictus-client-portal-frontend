import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PortfolioSelectDropdown from "./PortfolioSelectDropdown";

interface PerformanceData {
  labels: string[];
  portfolio: number[];
  benchmark: number[];
}

const PortfolioPerformanceChart = () => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  // Sample data to match the interface
  const data: PerformanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    portfolio: [5, 10, 15, 25, 30, 35],
    benchmark: [0, 5, 8, 12, 10, 15]
  };

  const handleSelectionChange = (newSelection: number[]) => {
    setSelectedIndexes(newSelection);
    console.log('Selected indexes:', newSelection);
  };

  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      height: 300,
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    title: {
      text: undefined
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: data.labels,
      gridLineWidth: 0,
      lineWidth: 0,
      tickWidth: 0,
      labels: {
        style: {
          color: '#666',
          fontSize: '11px'
        }
      }
    },
    yAxis: {
      title: {
        text: undefined
      },
      gridLineWidth: 1,
      gridLineColor: '#E5E7EB',
      labels: {
        formatter: function() {
          return this.value + '%';
        }
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.series.name}</b><br/>${this.x}: ${this.y}%`;
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true
            }
          }
        },
        cursor: 'pointer',
        point: {
          events: {
            click: function() {
              console.log(`Clicked on ${this.series.name} at ${this.category}: ${this.y}%`);
            }
          }
        }
      }
    },
    series: [{
      name: 'All my portfolio',
      data: data.portfolio,
      color: '#34D399',
      type: 'line'
    }, {
      name: 'S&P 500',
      data: data.benchmark,
      color: '#1F2937',
      type: 'line',
    }]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance (TWRR)</CardTitle>
        <div className="flex space-x-4">
          <PortfolioSelectDropdown color="#34D399" selectedAsset="All my portfolio" />
          <PortfolioSelectDropdown color="#1F2937" selectedAsset="S&P 500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartRef}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioPerformanceChart;
