import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit3, MapPin } from "lucide-react";
import { getFieldColor } from "@/lib/fieldColors";

interface Transaction {
  id: number;
  verified: boolean;
  transactionIndex?: number;
  [key: string]: any; // Allow dynamic fields
}

interface TransactionTableProps {
  transactions: Transaction[];
  onTransactionUpdate: (id: number, field: string, value: string | boolean) => void;
  onEditBbox?: (field: string, transactionIndex: number) => void;
  documentStatus?: string;
}

export const TransactionTable = ({ transactions, onTransactionUpdate, onEditBbox, documentStatus = "processing" }: TransactionTableProps) => {
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const formatFieldLabel = (key: string): string => {
    if (key === 'verified' || key === 'id' || key === 'transactionIndex') return '';
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get all unique field keys from transactions (excluding system fields)
  const getTransactionFields = () => {
    if (transactions.length === 0) return [];
    
    const allFields = new Set<string>();
    transactions.forEach(transaction => {
      Object.keys(transaction).forEach(key => {
        if (key !== 'id' && key !== 'verified' && key !== 'transactionIndex') {
          allFields.add(key);
        }
      });
    });
    
    return Array.from(allFields).map(key => ({
      key,
      label: formatFieldLabel(key),
      color: getFieldColor(key)
    }));
  };

  const transactionFields = getTransactionFields();
  const totalColumns = transactionFields.length + 2; // +2 for # and ✓ columns

  const isReadOnly = documentStatus === "rejected" || documentStatus === "approved";
  const isPending = documentStatus === "pending";
  const hasNoTransactions = transactions.length === 0;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Transaction Data</h3>
        <Edit3 className="w-4 h-4 text-gray-400" />
      </div>

      {isPending && hasNoTransactions ? (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <div className="text-center">
            <p className="text-sm">Not processed yet</p>
            <p className="text-xs text-gray-400 mt-1">Transaction data will appear after processing</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 overflow-x-auto">
          {/* Dynamic Header */}
          <div className={`grid gap-2 text-xs font-medium text-gray-500 pb-2 border-b`} style={{ gridTemplateColumns: `auto ${transactionFields.map(() => '1fr').join(' ')} auto` }}>
            <div className="px-2">#</div>
              {transactionFields.map(field => (
                <div key={field.key} className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: field.color }}
                    />
                    <span className="truncate">{field.label}</span>
                  </div>
                  {onEditBbox && !isReadOnly && (
                    <button className="text-gray-400 hover:text-gray-600">
                      <MapPin className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            <div className="px-2">✓</div>
          </div>
          
          {/* Dynamic Rows */}
          {transactions.map((transaction, index) => (
            <div key={transaction.id} className={`grid gap-2 text-xs items-center py-1`} style={{ gridTemplateColumns: `auto ${transactionFields.map(() => '1fr').join(' ')} auto` }}>
              <div className="text-gray-500 px-2">{index + 1}</div>
              
              {transactionFields.map(field => (
                <div key={field.key} className="px-2">
                  {editingCell === `${transaction.id}-${field.key}` && !isReadOnly ? (
                    <Input
                      value={transaction[field.key] || ''}
                      onChange={(e) => onTransactionUpdate(transaction.id, field.key, e.target.value)}
                      onBlur={() => setEditingCell(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
                      className="h-6 text-xs"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center justify-between group">
                      <div 
                        className={`p-1 rounded truncate border-l-2 min-h-[24px] flex items-center flex-1 ${
                          isReadOnly ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
                        }`}
                        onClick={() => !isReadOnly && setEditingCell(`${transaction.id}-${field.key}`)}
                        title={transaction[field.key] || (!isReadOnly ? 'Click to edit' : 'Read only')}
                        style={{ borderLeftColor: field.color }}
                      >
                        {transaction[field.key] === "-" ? (
                          <span className="text-gray-400 italic">-</span>
                        ) : (
                          transaction[field.key] || (!isReadOnly ? "Click to edit" : "No data")
                        )}
                        {isReadOnly && (
                          <span className="ml-2 text-xs text-gray-400">
                            ({documentStatus === "approved" ? "Approved" : "Rejected"})
                          </span>
                        )}
                      </div>
                      {onEditBbox && !isReadOnly && (
                        <button
                          onClick={() => onEditBbox(field.key, transaction.transactionIndex || index)}
                          className="ml-1 p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100"
                          title="Edit bounding box"
                        >
                          <MapPin className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="px-2">
                <Checkbox
                  checked={transaction.verified}
                  onCheckedChange={(checked) => !isReadOnly && onTransactionUpdate(transaction.id, 'verified', checked as boolean)}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};