
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Briefcase, DollarSign, Home, Calendar, PieChart, Car } from "lucide-react";

interface FinancialItem {
  icon: React.ReactNode;
  type: string;
  amount: string;
  change: string;
  positive: boolean;
}

export default function FinancialDashboardCard() {
  const [showMore, setShowMore] = useState(false);
  
  const financialItems: FinancialItem[] = [
    {
      icon: <Briefcase className="h-4 w-4 text-blue-500" />,
      type: "Salary",
      amount: "$250M",
      change: "+$200",
      positive: true
    },
    {
      icon: <DollarSign className="h-4 w-4 text-blue-500" />,
      type: "Dividends",
      amount: "$125M",
      change: "+$50",
      positive: true
    },
    {
      icon: <Home className="h-4 w-4 text-blue-500" />,
      type: "Rental",
      amount: "$100M",
      change: "+$100",
      positive: true
    },
    {
      icon: <Calendar className="h-4 w-4 text-blue-500" />,
      type: "Bonus",
      amount: "$75M",
      change: "+$25",
      positive: true
    },
    {
      icon: <PieChart className="h-4 w-4 text-blue-500" />,
      type: "Investments",
      amount: "$180M",
      change: "-$30",
      positive: false
    },
    {
      icon: <Car className="h-4 w-4 text-blue-500" />,
      type: "Side Gig",
      amount: "$50M",
      change: "+$10",
      positive: true
    },
  ];
  
  const displayedItems = showMore ? financialItems : financialItems.slice(0, 3);
  const hasMoreItems = financialItems.length > 3;
  
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-0">
        <div className="space-y-0">
          {displayedItems.map((item, index) => (
            <div 
              key={item.type} 
              className={`flex items-center h-15 px-4 py-3 bg-blue-50/40 border-b border-blue-200/50 ${
                index === 0 ? 'rounded-t-lg' : ''
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-3">
                {item.icon}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 underline mr-8">
                  {item.type}
                </span>
                <span className="text-sm font-semibold text-gray-900 mr-8">
                  {item.amount}
                </span>
                <span className={`text-sm font-medium ${
                  item.positive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {hasMoreItems && (
          <Button
            variant="ghost"
            onClick={() => setShowMore(!showMore)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-t-none rounded-b-lg justify-between"
          >
            {showMore ? 'View less' : 'View more'}
            {showMore ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
