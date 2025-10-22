
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from 'lucide-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import TrendIndicator from './TrendIndicator';

const options: Highcharts.Options = {
  chart: {
    borderRadius: 30,
    type: 'bar',
    backgroundColor: 'transparent'
  },
  title: { text: undefined },
  xAxis: { visible: false },
  yAxis: {
    visible: false,
  },
  plotOptions: {
    series: {
      stacking: 'percent',
    },
    bar: {
      pointPadding: 0,
      groupPadding: 0,
    },
  },
  tooltip: {  
    formatter: function() {
      return '<b>' + this.series.name + '</b>: $' + this.y + 'M';
    } 
  },
  legend: { enabled: true },
  credits: { enabled: false },
  series: [
    {
      name: 'Illiquid',
      data: [310],
      type: 'bar',
      color: '#1e1e1e', // Dark grey/black
    },
    {
      name: 'Liquid',
      data: [373],
      type: 'bar',
      color: '#64B5F6', // Light blue
    },
  ],
};

// Mock data for the application
const portfolioData = {
  liquidityPercentage: 55,
  illiquidPercentage: 45,
  topMovers: [
    { category: 'Foreign Exchange', gainLoss: 12.3},
    { category: 'Derivatives', gainLoss: 12.3 },
    { category: 'Cash and Cash Equivalents', gainLoss: 12.3 },
    { category: 'Fixed Income', gainLoss: 12.3 },
    { category: 'Stocks', gainLoss: -9.1 },
    { category: 'Commodities', gainLoss: -9.1}
  ]
};

function PortfolioLiquidityDashboard() {
  const [showTopMovers, setShowTopMovers] = useState(false);

  // Handle click on liquidity bar to show top movers
  const handleBarClick = () => {
    setShowTopMovers(true);
  };

  // Handle back button click
  const handleBackClick = () => {
    setShowTopMovers(false);
  };

  // Top Movers View
  const TopMoversView = () => (
    <Card className="rounded-xl p-5 mt-5">
      <CardContent className="p-0">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold">
            Portfolio Liquidity Profile - Top 6 movers
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm">View by:</span>
            <Select defaultValue="assetClass">
              <SelectTrigger className="w-auto border-none bg-white rounded-xl text-xs font-semibold px-2 py-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assetClass">Asset Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-normal text-muted-foreground">Category</TableHead>
                  <TableHead className="text-xs font-normal text-muted-foreground">Gain/Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioData.topMovers.slice(0, 3).map((mover, index) => (
                  <TableRow key={index} className={index % 2 === 1 ? 'bg-blue-50' : ''}>
                    <TableCell className="text-xs font-normal py-2">{mover.category}</TableCell>
                    <TableCell className="text-xs font-normal py-2">
                      <TrendIndicator value={mover.gainLoss} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-normal text-muted-foreground">Category</TableHead>
                  <TableHead className="text-xs font-normal text-muted-foreground">Gain/Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioData.topMovers.slice(3, 6).map((mover, index) => (
                  <TableRow key={index} className={index % 2 === 1 ? 'bg-blue-50' : ''}>
                    <TableCell className="text-xs font-normal py-2">{mover.category}</TableCell>
                    <TableCell className="text-xs font-normal py-2">
                      <TrendIndicator value={mover.gainLoss} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-4 flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="text-xs font-semibold text-primary hover:text-primary/80 p-0 h-auto underline"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Liquidity Bar Chart View
  const LiquidityBarView = () => (
    <Card className="rounded-xl p-5 mt-5">
      <CardContent className="p-0">
        <h3 className="text-sm font-semibold mb-1">
          Portfolio Liquidity Profile
        </h3>
        <div className="text-lg font-semibold mb-4">
          55%
        </div>

        <div 
          className="h-[120px] flex overflow-hidden cursor-pointer mb-6"
          onClick={handleBarClick}
        >
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  );

  // Render the appropriate view based on the current state
  return (
    <>
      {showTopMovers ? <TopMoversView /> : <LiquidityBarView />}
    </>
  );
}

export default PortfolioLiquidityDashboard;
