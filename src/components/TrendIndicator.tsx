
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TrendIndicatorProps {
  value: number;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ value }) => {
  if (value > 0) {
    return (
      <Badge className="bg-green-100 text-green-800 ml-2">
        <TrendingUp className="h-3 w-3 mr-1" />
        +{value.toFixed(1)}%
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-red-100 text-red-800 ml-2">
        <TrendingDown className="h-3 w-3 mr-1" />
        {value.toFixed(1)}%
      </Badge>
    );
  }
};

export default TrendIndicator;
