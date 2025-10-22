
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";

const TotalLiabilitiesCard = () => {
  // Sample liabilities data using consistent design system colors
  const liabilitiesData = [
    { type: 'Mortgages', amount: 150, color: '#AEC7ED' },
    { type: 'Business Loans', amount: 50, color: '#9E768F' },
    { type: 'Personal Loans', amount: 20, color: '#8A897C' },
    { type: 'Credit Lines', amount: 15, color: '#E8AEB7' }
  ];

  const totalLiabilities = liabilitiesData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Total Liabilities Breakdown</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">${totalLiabilities}M</span>
            <Badge variant="secondary" className="text-red-600 bg-red-50">
              <TrendingDown className="w-3 h-3 mr-1" />
              -9.1%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {liabilitiesData.map((liability, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: liability.color }}
                />
                <span className="text-sm font-medium">{liability.type}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">${liability.amount}M</div>
                <div className="text-xs text-muted-foreground">
                  {((liability.amount / totalLiabilities) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Next Payment</span>
              <div className="font-medium">Dec 15, 2024</div>
            </div>
            <div>
              <span className="text-muted-foreground">Avg Interest Rate</span>
              <div className="font-medium">4.2%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalLiabilitiesCard;
