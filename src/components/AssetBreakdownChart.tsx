import React, { useState, useRef, useCallback } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";

const colors = ['#AEC7ED', '#9E768F', '#8A897C', '#E8AEB7', '#FFF2BB', '#E9BA91', '#14CA74', '#92BFFF', '#1C1C1C'];

interface SubclassData {
  name: string;
  amount: number;
  percentage: number;
  color?: string;
}

interface AllocationData {
  name: string;
  amount: number;
  percentage: number;
  color?: string;
  subclasses: SubclassData[];
}

interface AssetBreakdownChartProps {
  allocationData: AllocationData[];
  totalAmount: number;
  percentChange: number;
}

const AssetBreakdownChart = ({ allocationData, totalAmount, percentChange }: AssetBreakdownChartProps) => {
  const coloredAllocationData = allocationData.map((item, index) => ({
    ...item,
    y: item.amount,
    color: colors[index % colors.length],
    subclasses: item.subclasses.map((subclass, subclassIndex) => ({
      ...subclass,
      y: subclass.amount,
      color: colors[(index + subclassIndex + 1) % colors.length]
    }))
  }));

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showSubclasses, setShowSubclasses] = useState(false);
  const [viewBy, setViewBy] = useState("assetClass");
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  
  const handleSetSelectedType = useCallback((type: string) => {
    setSelectedType(type);
    setShowSubclasses(true);
    setViewBy("subAssetClass");
  }, []);
  
  const handleSetShowSubclasses = useCallback((show: boolean) => {
    setShowSubclasses(show);
    if (!show) {
      setSelectedType(null);
      setViewBy("assetClass");
    }
  }, []);

  const getChartOptions = () => {
    if (showSubclasses && selectedType) {
      const selectedAsset = coloredAllocationData.find(item => item.name === selectedType);
      
      return {
        chart: {
          type: 'pie',
          backgroundColor: 'transparent',
          height: 350,
        },
        title: {
          text: undefined,
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            innerSize: '60%',
            borderWidth: 0,
            dataLabels: {
              enabled: false
            },
            states: {
              hover: {
                brightness: 0.1
              }
            }
          }
        },
        tooltip: {
          headerFormat: '',
          pointFormat: '<b>{point.name}</b>: ${point.y}M ({point.percentage:.1f}%)'
        },
        series: [{
          name: selectedType,
          data: selectedAsset?.subclasses || []
        }]
      };
    } else {
      return {
        chart: {
          type: 'pie',
          backgroundColor: 'transparent',
          height: 350,
        },
        title: {
          text: undefined,
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            innerSize: '60%',
            borderWidth: 0,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            states: {
              hover: {
                brightness: 0.1
              }
            },
            point: {
              events: {
                click: function() {
                  const name = this.name as string;
                  handleSetSelectedType(name);
                }
              }
            }
          }
        },
        tooltip: {
          headerFormat: '',
          pointFormat: '<b>{point.name}</b>: ${point.y}M ({point.percentage:.1f}%)'
        },
        series: [{
          name: 'Asset Allocation',
          colorByPoint: true,
          data: coloredAllocationData
        }]
      };
    }
  };

  const handleBackClick = () => {
    setShowSubclasses(false);
    setSelectedType(null);
    setViewBy("assetClass");
  };

  const handleViewByChange = (value: string) => {
    setViewBy(value);
    if (value === "assetClass") {
      handleSetShowSubclasses(false);
    } else {
      // If switching to subAssetClass but no type selected, don't show anything
      if (!selectedType) {
        setViewBy("assetClass");
      }
    }
  };

  const options = getChartOptions();

  const tableData = showSubclasses && selectedType 
    ? coloredAllocationData.find(item => item.name === selectedType)?.subclasses 
    : coloredAllocationData;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Total Assets Breakdown</CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-3xl font-bold">${formatMoney(totalAmount)}M</span>
              {percentChange !== 0 && (
                <Badge className={percentChange > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {percentChange > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">View by:</span>
            <Select value={viewBy} onValueChange={handleViewByChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assetClass">Asset Class</SelectItem>
                <SelectItem value="subAssetClass">Sub Asset Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-4">
          {/* Chart Section */}
          <div className="col-span-4">
            <div className="h-[350px]">
              <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartRef}
                containerProps={{ style: { height: '100%', width: '100%' } }}
              />
            </div>
          </div>

          {/* Legend Table Section */}
          <div className="col-span-3">
            <ScrollArea className="h-[350px]">
              <div className="space-y-2 pr-4">
                {tableData?.map((row) => (
                  <div 
                    key={row.name}
                    className={`flex items-center justify-between p-2 rounded hover:bg-muted/50 ${
                      !showSubclasses ? 'cursor-pointer' : 'cursor-default'
                    }`}
                    onClick={() => {
                      if (!showSubclasses) {
                        handleSetSelectedType(row.name);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ 
                          backgroundColor: showSubclasses 
                            ? coloredAllocationData.find(item => item.name === selectedType)?.subclasses.find(item => item.name === row.name)?.color 
                            : row.color
                        }}
                      />
                      <span className="text-sm font-medium">{row.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">${row.amount.toFixed(1)}M</div>
                      <div className="text-xs text-muted-foreground">{row.percentage?.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {showSubclasses && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="text-sm underline p-0 h-auto"
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

export default AssetBreakdownChart;
