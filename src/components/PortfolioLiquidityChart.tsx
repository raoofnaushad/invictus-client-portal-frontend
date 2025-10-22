
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PortfolioLiquidityChart = () => {
  const liquidityOptions = {
    chart: {
      type: 'bar',
      height: 200,
      backgroundColor: 'transparent'
    },
    title: { text: null },
    xAxis: {
      categories: [''],
      visible: false
    },
    yAxis: {
      visible: false,
      max: 100
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      bar: {
        stacking: 'percent',
        groupPadding: 0.2,
        pointPadding: 0.1,
        borderWidth: 0
      },
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: function() {
              console.log(`Clicked on ${this.series.name}: ${this.y}%`);
            }
          }
        }
      }
    },
    series: [{
      name: 'Liquid',
      data: [55],
      color: '#60A5FA'
    }, {
      name: 'Illiquid',
      data: [45],
      color: '#1F2937'
    }],
    credits: { enabled: false }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Liquidity Profile</CardTitle>
        <span className="text-3xl font-bold">55%</span>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <HighchartsReact highcharts={Highcharts} options={liquidityOptions} />
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
            <span className="text-sm">Liquid - 55%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-800 rounded mr-2"></div>
            <span className="text-sm">Illiquid - 45%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioLiquidityChart;
