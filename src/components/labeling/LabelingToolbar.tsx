
import { cn } from "@/lib/utils";
import { Tag, Trash2 } from "lucide-react";

interface Field {
  key: string;
  label: string;
  color: string;
}

interface LabelingToolbarProps {
  isLabeling: boolean;
  selectedField: string;
  fields: Field[];
  mode: "document" | "lineItems";
  labelsCount: number;
  selectedLabel: string | null;
  onToggleLabeling: () => void;
  onFieldChange: (field: string) => void;
  onDeleteLabel: (labelId: string) => void;
}

export const LabelingToolbar = ({
  isLabeling,
  selectedField,
  fields,
  mode,
  labelsCount,
  selectedLabel,
  onToggleLabeling,
  onFieldChange,
  onDeleteLabel
}: LabelingToolbarProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center space-x-4">
        {isLabeling && (
          <div className="text-sm text-blue-600 font-medium">
            Drawing mode active for: {fields.find(f => f.key === selectedField)?.label}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">
          {mode === "document" ? "Document" : "Line Items"} Labels: {labelsCount}
        </span>
        {selectedLabel && (
          <button
            onClick={() => onDeleteLabel(selectedLabel)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
