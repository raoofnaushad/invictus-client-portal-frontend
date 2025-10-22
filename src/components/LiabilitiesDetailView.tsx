
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingDown, ArrowLeft } from 'lucide-react';
import { LiabilityDetail } from './LiabilitiesDashboard';

interface LiabilitiesDetailViewProps {
  totalLiabiliy: number;
  liabilitiesDetails: LiabilityDetail[];
  selectedLiabilityClass: string;
  onBackClick: () => void;
}

const LiabilitiesDetailView: React.FC<LiabilitiesDetailViewProps> = ({
  totalLiabiliy,
  liabilitiesDetails,
  selectedLiabilityClass,
  onBackClick
}) => {
  const [page, setPage] = useState(0);
  const size = 3;

  const formatMoney = (value: number) => {
    return (value / 1000000).toLocaleString();
  };

  const filteredDetails = liabilitiesDetails.filter(
    item => item.liabilityClass === selectedLiabilityClass
  );

  const paginatedDetails = filteredDetails.slice(page * size, (page + 1) * size);
  const hasMore = filteredDetails.length > (page + 1) * size;

  return (
    <Card className="mt-5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Total Liabilities Breakdown</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">${formatMoney(totalLiabiliy)}M</span>
            <Badge variant="secondary" className="text-red-600 bg-red-50">
              <TrendingDown className="w-3 h-3 mr-1" />
              -9.1%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bank Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Outstanding Balance</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Next Payment Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDetails.map((item, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell>{item.bank}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.balance}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                className="w-full"
              >
                View More
              </Button>
            </div>
          )}

          <div className="pt-4">
            <Button
              variant="link"
              onClick={onBackClick}
              className="p-0 h-auto font-semibold text-sm underline"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiabilitiesDetailView;
