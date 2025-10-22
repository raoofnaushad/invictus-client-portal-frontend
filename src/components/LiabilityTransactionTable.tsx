import { LiabilityDetail } from "@/types/liabilityAccount";

interface LiabilityTransactionTableProps {
  liabilityDetails: LiabilityDetail[];
}

export const LiabilityTransactionTable = ({ liabilityDetails }: LiabilityTransactionTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Liability Class</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Next Payment Date</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Last Payment Amount</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Interest Rate</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Principal Amount</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Paid Principal</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Remaining Balance</th>
          </tr>
        </thead>
        <tbody>
          {liabilityDetails.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-gray-500">
                No liability details found
              </td>
            </tr>
          ) : (
            liabilityDetails.map((detail, index) => (
              <tr 
                key={detail.id}
                className={`border-b border-border hover:bg-muted/50 ${
                  (index + 1) % 2 === 0 ? 'bg-blue-50' : 'bg-background'
                }`}
              >
                <td className="py-3 px-4 text-sm">{detail.liabilityClass}</td>
                <td className="py-3 px-4 text-sm">{detail.nextPaymentDate || 'N/A'}</td>
                <td className="py-3 px-4 text-sm font-medium">
                  {detail.lastPaymentAmount ? formatCurrency(detail.lastPaymentAmount) : 'N/A'}
                </td>
                <td className="py-3 px-4 text-sm">{detail.interestPercentage || 0}%</td>
                <td className="py-3 px-4 text-sm font-medium">
                  {detail.principalAmount ? formatCurrency(detail.principalAmount) : 'N/A'}
                </td>
                <td className="py-3 px-4 text-sm">
                  {detail.paidPrincipalAmount ? formatCurrency(detail.paidPrincipalAmount) : 'N/A'}
                </td>
                <td className="py-3 px-4 text-sm font-medium">
                  {detail.principalAmount && detail.paidPrincipalAmount ? 
                    formatCurrency(detail.principalAmount - detail.paidPrincipalAmount) : 'N/A'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};