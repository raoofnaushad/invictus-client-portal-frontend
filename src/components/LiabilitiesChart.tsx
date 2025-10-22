
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown } from 'lucide-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { LiabilityData } from './LiabilitiesDashboard';

interface LiabilitiesChartProps {
  totalLiabiliy: number;
  liabilitiesData: LiabilityData;
  onCategoryClick: (category: string) => void;
}

const LiabilitiesChart: React.FC<LiabilitiesChartProps> = ({
  totalLiabiliy,
  liabilitiesData,
  onCategoryClick
}) => {
  const formatMoney = (value: number) => {
    return (value / 1000000).toLocaleString();
  };

  // Chart options for the liabilities breakdown chart
  const chartOptions = {
    chart: {
      type: 'column',
      height: 320,
      backgroundColor: 'transparent'
    },
    title: {
      text: null
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'top',
      itemStyle: {
        color: '#666',
        fontWeight: 'normal'
      }
    },
    xAxis: {
      categories: liabilitiesData?.months || [],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: null
      },
      labels: {
        formatter: function() {
          return '$' + this.value;
        }
      }
    },
    tooltip: {
      formatter: function() {
        return '<b>' + this.series.name + '</b>: $' + this.y;
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        cursor: 'pointer',
        point: {
          events: {
            click: function() {
              // Get the category name from the series
              const categoryName = this.series.name;
              console.log('Category clicked:', categoryName);
              onCategoryClick(categoryName);
            }
          }
        }
      }
    },
    series: liabilitiesData?.categories?.map((category, index) => ({
      name: category,
      data: liabilitiesData.series[index] || [],
      color: liabilitiesData.colors[index] || '#8b5cf6'
    })) || []
  };

  return (
    <Card className="mt-5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Total Liabilities Breakdown</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">${formatMoney(totalLiabiliy)}M</span>
            <Badge variant="secondary" className="text-red-600 bg-red-50">
              <TrendingDown className="w-3 h-3 mr-1" />
              -9.1%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <HighchartsReact 
            highcharts={Highcharts} 
            options={chartOptions}
            containerProps={{ style: { height: '100%', width: '100%' } }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LiabilitiesChart;
