
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import TrendIndicator from "./TrendIndicator";
import FinancialDashboardCard from "./FinancialDashboardCard";

// Sample data
const cashFlowData = [
  {
    name: 'Jan',
    income: 500,
    expenses: -300,
    netInc: 200,
    cumulativeInc: 200,
    events: 0,
    details: {
      income: { value: "$480M", change: "+$450" },
      expenses: { value: "$170M", change: "-$15" },
      events: { value: "$0M", change: "$0" }
    }
  },
  {
    name: 'Feb',
    income: 450,
    expenses: -400,
    netInc: 50,
    cumulativeInc: 250,
    events: 0,
    details: {
      income: { value: "$450M", change: "-$30" },
      expenses: { value: "$400M", change: "+$230" },
      events: { value: "$0M", change: "$0" }
    }
  },
  {
    name: 'Mar',
    income: 700,
    expenses: -400,
    netInc: 300,
    cumulativeInc: 550,
    events: 150,
    details: {
      income: { value: "$500M", change: "+$500" },
      expenses: { value: "$185M", change: "-$20" },
      events: { value: "$150M", change: "+$300" }
    }
  },
  {
    name: 'Apr',
    income: 400,
    expenses: -300,
    netInc: 100,
    cumulativeInc: 650,
    events: 0,
    details: {
      income: { value: "$400M", change: "-$100" },
      expenses: { value: "$300M", change: "-$100" },
      events: { value: "$0M", change: "$0" }
    }
  },
  {
    name: 'May',
    income: 500,
    expenses: -550,
    netInc: -50,
    cumulativeInc: 600,
    events: -500,
    details: {
      income: { value: "$500M", change: "+$100" },
      expenses: { value: "$550M", change: "+$250" },
      events: { value: "-$500M", change: "-$500" }
    }
  },
  {
    name: 'Jun',
    income: 500,
    expenses: -200,
    netInc: 300,
    cumulativeInc: 900,
    events: 0,
    details: {
      income: { value: "$500M", change: "$0" },
      expenses: { value: "$200M", change: "-$350" },
      events: { value: "$0M", change: "+$500" }
    }
  }
];

const CashFlowChart = () => {
  const [periodicity, setPeriodicity] = useState('Monthly');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleBarClick = (month: string) => {
    setSelectedMonth(month);
    setShowDetails(true);
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedMonth(null);
  };

  // Calculate total value for selected month
  const calculateTotal = (month: string | null) => {
    if (!month) return 0;
    const monthData = cashFlowData.find(item => item.name === month);
    return monthData ? monthData.income + monthData.expenses + (monthData.events || 0) : 0;
  };

  const tooltipFormatter = function(this: any) {
    let income = 0;
    const month = this.x;

    this.points.forEach((point: any) => {
      if (point.series.name === 'Income') {
        income = point.y;
      }
    });

    return `
      <div style="
        padding: 20px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        min-width: 400px;
        font-family: 'Inter', 'Roboto', sans-serif;
      ">
        <div style="
          display: flex;
          direction: row;
          justify-content: space-between;
        ">
          <div style="flex: 1;">
            <div style="
              color: #666;
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 8px;
            ">Net Income</div>
            <div style="
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 8px;
            ">${income}</div>
          </div>
        </div>
      </div>
    `;
  };

  // Highcharts options
  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      height: 350,
      backgroundColor: 'transparent',
      events: {
        click: function() {
          if (showDetails) {
            setShowDetails(false);
            setSelectedMonth(null);
          }
        }
      }
    },
    title: {
      text: ''
    },
    xAxis: {
      categories: cashFlowData.map(item => item.name),
      crosshair: true,
      gridLineWidth: 0
    },
    yAxis: {
      title: {
        text: ''
      },
      labels: {
        formatter: function() {
          const value = Number(this.value);
          if (value === 0) return '0';
          return value > 0 ? 
            `${value}` : 
            `${value}`;
        }
      },
      gridLineColor: '#E5E7EB',
      tickAmount: 5
    },
    legend: {
      enabled: false
    },
    tooltip: {
      shared: true,
      formatter: tooltipFormatter
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        cursor: 'pointer',
        pointPadding: 0.2,
        groupPadding: 0.2,
        point: {
          events: {
            click: function() {
              handleBarClick(this.category as string);
            }
          }
        }
      },
      series: {
        borderWidth: 0
      }
    },
    series: [
      {
        name: 'Income',
        data: cashFlowData.map(item => item.income),
        color: '#10B981',
        type: 'column'
      },
      {
        name: 'Expenses',
        data: cashFlowData.map(item => item.expenses),
        color: '#EF4444',
        type: 'column'
      },
      {
        name: 'Events',
        type: 'scatter',
        data: cashFlowData.map((item, index) => {
          const value = item.events || 0;
          return value > 0 ? {
                x: index,
                y: value,
              } : null;
        }).filter(point => point !== null),
        color: '#F59E0B',
        marker: {
          enabled: true,
          radius: 4,
          symbol: 'diamond'
        },
        lineWidth: 0,
        showInLegend: true
      },
      {
        name: 'Net Inc',
        type: 'line',
        data: cashFlowData.map(item => item.netInc),
        color: '#000000',
        marker: {
          enabled: true,
          radius: 4
        },
        lineWidth: 2
      },
      {
        name: 'Cumulative Inc',
        type: 'line',
        data: cashFlowData.map(item => item.cumulativeInc),
        color: '#6B7280',
        marker: {
          enabled: true,
          radius: 4
        },
        lineWidth: 2,
        dashStyle: 'Dash'
      }
    ],
    credits: { enabled: false }
  };

  return (
    <>
      {!showDetails ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Past Cash Flows</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm">Periodicity:</span>
                <Select value={periodicity} onValueChange={setPeriodicity}>
                  <SelectTrigger className="w-24 h-8 text-xs font-semibold border-none bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4 text-sm flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span>Income</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                <span>Expenses</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-black rounded mr-2"></div>
                <span>Net Inc</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
                <span>Cumulative Inc</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                <span>Events</span>
              </div>
            </div>
            
            <div className="h-[350px]">
              <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Past Cash Flows</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold">
                    ${Math.abs(calculateTotal(selectedMonth))}M
                  </span>
                  <TrendIndicator value={2} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Periodicity:</span>
                <Select value={periodicity} onValueChange={setPeriodicity}>
                  <SelectTrigger className="w-24 h-8 text-xs font-semibold border-none bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedMonth && (
              <>
                <FinancialDashboardCard />
                <div className="mt-4 flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="text-xs font-semibold text-primary hover:text-primary/80 p-0 h-auto underline"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CashFlowChart;
