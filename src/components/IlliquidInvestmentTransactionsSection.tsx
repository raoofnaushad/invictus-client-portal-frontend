
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { IlliquidInvestmentTransactionTable } from "@/components/IlliquidInvestmentTransactionTable";

interface IlliquidInvestmentTransactionsSectionProps {
  investmentId: string;
}

export const IlliquidInvestmentTransactionsSection = ({ investmentId }: IlliquidInvestmentTransactionsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transactions</h3>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <IlliquidInvestmentTransactionTable investmentId={investmentId} />
        </CardContent>
      </Card>
    </div>
  );
};
