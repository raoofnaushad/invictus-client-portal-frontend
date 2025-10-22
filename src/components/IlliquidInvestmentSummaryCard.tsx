
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { IlliquidInvestment } from "@/types/illiquidInvestment";

interface IlliquidInvestmentSummaryCardProps {
  investment: IlliquidInvestment;
}

export const IlliquidInvestmentSummaryCard = ({ investment }: IlliquidInvestmentSummaryCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: investment.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const commitmentPercentage = (investment.called / investment.commitment) * 100;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-sm text-gray-500 mb-1">Net Asset Value</h2>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold">{formatCurrency(investment.currentValue / 1000000)}M</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-600">Committed</Badge>
                  <Badge className="bg-gray-100 text-gray-600">IRR 25%</Badge>
                  <Badge className="bg-green-100 text-green-600 flex items-center gap-1">
                    MOIC 3X
                    <TrendingUp className="h-3 w-3" />
                  </Badge>
                  <Badge className="bg-orange-100 text-orange-600">Yield 7.5%</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-8 gap-8 text-sm">
              <div>
                <span className="text-gray-500 block">Name</span>
                <span className="font-medium">{investment.fundName}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Total Value</span>
                <span className="font-medium">{formatCurrency(investment.currentValue / 1000000)}M</span>
              </div>
              <div>
                <span className="text-gray-500 block">Asset Manager</span>
                <span className="font-medium">{investment.sector === "Technology" ? "GFOA" : "Blackstone"}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Type</span>
                <span className="font-medium">{investment.assetClass}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Total Gains</span>
                <span className="font-medium text-green-600">{formatCurrency(investment.unrealizedGainLoss / 1000000)}M</span>
              </div>
              <div>
                <span className="text-gray-500 block">Realized Return</span>
                <span className="font-medium">$2M</span>
              </div>
              <div>
                <span className="text-gray-500 block">Realized</span>
                <span className="font-medium">55.8%</span>
              </div>
              <div>
                <span className="text-gray-500 block">Unrealized</span>
                <span className="font-medium">44.2%</span>
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500 mb-2 block">Invested Amount</span>
              <Progress value={commitmentPercentage} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatCurrency(investment.called / 1000000)}M</span>
                <span>{formatCurrency(investment.commitment / 1000000)}M Total Commitments</span>
              </div>
            </div>
          </div>

          <div className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold">
            {investment.fundName.split(' ').map(word => word[0]).join('').substring(0, 2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
