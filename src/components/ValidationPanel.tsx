
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit3, MapPin } from "lucide-react";
import { getFieldColor } from "@/lib/fieldColors";

interface ValidationPanelProps {
  extractedData: Record<string, any>;
  onFieldUpdate: (field: string, value: string) => void;
  onEditBbox?: (field: string) => void;
  documentStatus?: string;
}

export const ValidationPanel = ({ extractedData, onFieldUpdate, onEditBbox, documentStatus = "processing" }: ValidationPanelProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);


  const formatFieldLabel = (key: string): string => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const fields = Object.keys(extractedData).filter(key => key !== 'transactions').map(key => ({
    key,
    label: formatFieldLabel(key),
    color: getFieldColor(key)
  }));

  const isReadOnly = documentStatus === "rejected" || documentStatus === "approved";
  const isPending = documentStatus?.toLowerCase() === 'pending';
  const hasNoData = !extractedData || Object.keys(extractedData).length === 0 || fields.length === 0 || Object.keys(extractedData).every(key => 
    key === 'transactions' || !extractedData[key] || extractedData[key] === ''
  );

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Extracted Fields</h3>
        <Edit3 className="w-4 h-4 text-gray-400" />
      </div>
      
      {isPending && hasNoData ? (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <div className="text-center">
            <p className="text-sm">Not processed yet</p>
            <p className="text-xs text-gray-400 mt-1">Document is pending processing</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map(({ key, label, color }) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: color }}
                />
                <Label className="text-xs font-medium text-gray-700">{label}</Label>
              </div>
              {onEditBbox && !isReadOnly && (
                <button
                  onClick={() => onEditBbox(key)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                  title="Edit bounding box"
                >
                  <MapPin className="w-3 h-3" />
                </button>
              )}
            </div>
            {editingField === key && !isReadOnly ? (
              <Input
                value={extractedData[key] || ""}
                onChange={(e) => onFieldUpdate(key, e.target.value)}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                className="h-8 text-sm"
                autoFocus
              />
            ) : (
              <div 
                className={`p-2 text-sm border border-gray-200 rounded min-h-[32px] flex items-center ${
                  isReadOnly ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
                }`}
                onClick={() => !isReadOnly && setEditingField(key)}
                style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
              >
                {extractedData[key] === "-" ? (
                  <span className="text-gray-400 italic">-</span>
                ) : (
                  extractedData[key] || (!isReadOnly ? "Click to edit" : "No data")
                )}
                {isReadOnly && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({documentStatus === "approved" ? "Approved" : "Rejected"})
                  </span>
                )}
              </div>
            )}
          </div>
          ))}
        </div>
      )}
    </div>
  );
};
