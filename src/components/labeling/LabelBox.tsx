import { useState } from "react";
import { cn } from "@/lib/utils";
import { Edit2 } from "lucide-react";

interface Label {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  field: string;
  color: string;
  itemIndex?: number;
}

interface Field {
  key: string;
  label: string;
  color: string;
}

interface LabelBoxProps {
  label: Label;
  fields: Field[];
  isSelected: boolean;
  onClick: (e: React.MouseEvent, labelId: string) => void;
  onEdit: (labelId: string, newText: string) => void;
  onBlur: () => void;
  onStartEdit: (fieldKey: string) => void;
}

export const LabelBox = ({
  label,
  fields,
  isSelected,
  onClick,
  onEdit,
  onBlur,
  onStartEdit
}: LabelBoxProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const fieldLabel = fields.find(f => f.key === label.field)?.label || label.field;
  const displayLabel = label.itemIndex !== undefined 
    ? `${fieldLabel} #${label.itemIndex + 1}` 
    : fieldLabel;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e, label.id);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onBlur();
  };

  return (
    <div
      className={cn(
        "absolute border-2 cursor-pointer group transition-all hover:border-opacity-100",
        isSelected ? "border-opacity-100 z-10" : "border-opacity-60"
      )}
      style={{
        left: `${label.x}%`,
        top: `${label.y}%`,
        width: `${label.width}%`,
        height: `${label.height}%`,
        borderColor: label.color,
        backgroundColor: `${label.color}20`,
      }}
      onClick={handleClick}
    >
      <div 
        className="absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded transition-opacity z-20 flex items-center gap-1"
        style={{ 
          backgroundColor: label.color,
          opacity: isSelected || isEditing ? 1 : 0.8
        }}
      >
        {displayLabel}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartEdit(label.field);
          }}
          className="p-0.5 hover:bg-white/20 rounded"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </div>
      
      {(isSelected || isEditing) && (
        <input
          type="text"
          value={label.text}
          onChange={(e) => onEdit(label.id, e.target.value)}
          className="fixed bottom-auto left-auto mb-2 px-6 py-4 text-lg border border-input bg-background rounded-md shadow-2xl w-[600px] z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{
            left: `${Math.max(10, label.x)}%`,
            top: `${Math.max(10, label.y - 15)}%`
          }}
          onClick={(e) => e.stopPropagation()}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleBlur();
            }
            e.stopPropagation();
          }}
          autoFocus
        />
      )}
    </div>
  );
};