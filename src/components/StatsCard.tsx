
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  amount: string;
  percentChange: number;
  variant?: 'default' | 'highlighted';
  onClick?: () => void;
  isSelected?: boolean;
}

const StatsCard = ({ title, amount, percentChange, variant = 'default', onClick, isSelected }: StatsCardProps) => {
  const isWatarCard = title === "Managed by WATAR";
  const isTotalNetWorthCard = title === "Total Net Worth";
  
  return (
    <Card 
      className={`
        ${variant === 'highlighted' ? 'bg-blue-50 border border-blue-200' : 'bg-purple-50 border border-purple-200'} 
        mb-4 
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${isSelected && (isWatarCard || isTotalNetWorthCard) ? 'border-b-2 border-b-black' : ''}
      `}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <p className="text-lg font-semibold mb-2">{amount}</p>
            <Badge className={percentChange > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {percentChange > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {percentChange > 0 ? '+' : ''}{percentChange}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
