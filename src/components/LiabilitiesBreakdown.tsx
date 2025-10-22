
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";

const LiabilitiesBreakdown = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Liabilities Breakdown</CardTitle>
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold">$235M</span>
          <Badge className="bg-red-100 text-red-800">
            <TrendingDown className="h-3 w-3 mr-1" />
            -9.1%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="flex items-center">
              <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: '#1C1C1C' }}></div>
              Mortgages
            </span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center">
              <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: '#14CA74' }}></div>
              Credit Lines
            </span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center">
              <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: '#95A4FC' }}></div>
              Loans
            </span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center">
              <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: '#B1E3FF' }}></div>
              Other Debt
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiabilitiesBreakdown;
