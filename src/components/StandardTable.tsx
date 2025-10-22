
import { ReactNode } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Column {
  key: string;
  header: string;
  className?: string;
}

interface StandardTableProps {
  columns: Column[];
  children: ReactNode;
  className?: string;
}

export const StandardTable = ({ columns, children, className = "" }: StandardTableProps) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.key} 
                className={`text-muted-foreground font-medium ${column.className || ''}`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {children}
        </TableBody>
      </Table>
    </div>
  );
};
