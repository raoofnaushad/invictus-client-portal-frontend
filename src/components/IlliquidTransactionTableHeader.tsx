
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const IlliquidTransactionTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="bg-muted/30">
        <TableHead className="text-muted-foreground font-medium">Date</TableHead>
        <TableHead className="text-muted-foreground font-medium">Quantity</TableHead>
        <TableHead className="text-muted-foreground font-medium">Amount</TableHead>
        <TableHead className="text-muted-foreground font-medium">Currency</TableHead>
        <TableHead className="text-muted-foreground font-medium">Direction</TableHead>
        <TableHead className="text-muted-foreground font-medium">Sender/Recipient</TableHead>
        <TableHead className="text-muted-foreground font-medium">Description</TableHead>
      </TableRow>
    </TableHeader>
  );
};
