
import { useEffect } from "react";
import { LabelingToolbar } from "./labeling/LabelingToolbar";
import { LabelBox } from "./labeling/LabelBox";
import { useLabelingState } from "./labeling/hooks/useLabelingState";
import { useMouseHandlers } from "./labeling/hooks/useMouseHandlers";
import { cn } from "@/lib/utils";

interface LabelStudioProps {
  imageUrl: string;
  onLabelsChange: (labels: any[]) => void;
  extractedData: any;
  mode?: "document" | "lineItems";
  existingLabels?: any[];
}

export const LabelStudio = ({ 
  imageUrl, 
  onLabelsChange, 
  extractedData, 
  mode = "document",
  existingLabels = []
}: LabelStudioProps) => {
  const fieldColors = {
    "fund_name": "#3B82F6",
    "call_date": "#8B5CF6", 
    "investor_name": "#10B981",
    "amount_due": "#F59E0B",
    "currency": "#EF4444",
    "date": "#06B6D4",
    "description": "#8B5CF6",
    "debit": "#10B981",
    "credit": "#F59E0B",
    "balance": "#EF4444",
    // Legacy fields
    "Bank_name": "#3B82F6",
    "Account_address": "#8B5CF6", 
    "Account_name": "#10B981",
    "Account_number": "#F59E0B",
    "Statement_period": "#EF4444",
    "Transaction_date": "#06B6D4",
    "Description": "#8B5CF6",
    "Amount": "#10B981",
    "Balance": "#F59E0B"
  };

  // Get dynamic fields from extractedData for document fields
  const getDocumentFields = () => {
    const baseFields = Object.keys(extractedData).filter(key => key !== 'transactions');
    return baseFields.map(key => ({
      key,
      label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      color: fieldColors[key] || "#9CA3AF"
    }));
  };

  // Get dynamic fields from transaction data for line items
  const getLineItemFields = () => {
    if (!extractedData.transactions || !Array.isArray(extractedData.transactions) || extractedData.transactions.length === 0) {
      return [
        { key: "date", label: "Date", color: fieldColors.date },
        { key: "description", label: "Description", color: fieldColors.description },
        { key: "debit", label: "Debit", color: fieldColors.debit },
        { key: "credit", label: "Credit", color: fieldColors.credit },
        { key: "balance", label: "Balance", color: fieldColors.balance },
      ];
    }

    const allTransactionFields = new Set<string>();
    extractedData.transactions.forEach((transaction: any) => {
      Object.keys(transaction).forEach(field => {
        allTransactionFields.add(field);
      });
    });

    return Array.from(allTransactionFields).map(key => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: fieldColors[key] || "#9CA3AF"
    }));
  };

  const documentFields = getDocumentFields();
  const lineItemFields = getLineItemFields();

  const fields = mode === "document" ? documentFields : lineItemFields;

  const {
    labels,
    isLabeling,
    selectedField,
    selectedLabel,
    isDrawing,
    startPos,
    currentBox,
    setIsLabeling,
    setSelectedField,
    setSelectedLabel,
    setIsDrawing,
    setStartPos,
    setCurrentBox,
    addLabel,
    updateLabel,
    deleteLabel,
    startEditField
  } = useLabelingState(existingLabels, mode, onLabelsChange);

  useEffect(() => {
    // Set default selected field when fields are available
    if (fields && fields.length > 0 && !selectedField) {
      setSelectedField(fields[0].key);
    }
  }, [fields, selectedField, setSelectedField]);

  const {
    imageRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleLabelClick
  } = useMouseHandlers(
    isLabeling,
    isDrawing,
    startPos,
    currentBox,
    selectedField,
    fieldColors,
    extractedData,
    setIsDrawing,
    setStartPos,
    setSelectedLabel,
    setCurrentBox,
    addLabel
  );

  const toggleLabeling = () => {
    setIsLabeling(!isLabeling);
    setSelectedLabel(null);
    setIsDrawing(false);
    setCurrentBox(null);
  };

  return (
    <div className="flex flex-col h-full">
      <LabelingToolbar
        isLabeling={isLabeling}
        selectedField={selectedField}
        fields={fields}
        mode={mode}
        labelsCount={labels.length}
        selectedLabel={selectedLabel}
        onToggleLabeling={toggleLabeling}
        onFieldChange={setSelectedField}
        onDeleteLabel={deleteLabel}
      />

      <div className="flex-1 relative overflow-auto bg-gray-50 p-4 h-full">
        <div className="relative inline-block max-w-full h-full">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Document for labeling"
            className={cn(
              "max-w-full h-full rounded-lg shadow-lg select-none object-contain",
              isLabeling && "cursor-crosshair"
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              if (isDrawing) {
                setIsDrawing(false);
                setCurrentBox(null);
              }
            }}
            draggable={false}
          />
          
          {labels.map((label) => (
              <LabelBox
                key={label.id}
                label={label}
                fields={fields}
                isSelected={selectedLabel === label.id}
                onClick={handleLabelClick}
                onEdit={updateLabel}
                onBlur={() => setSelectedLabel(null)}
                onStartEdit={startEditField}
              />
          ))}
          
          {currentBox && currentBox.width! > 0 && currentBox.height! > 0 && (
            <div
              className="absolute border-2 border-dashed pointer-events-none"
              style={{
                left: `${currentBox.x}%`,
                top: `${currentBox.y}%`,
                width: `${currentBox.width}%`,
                height: `${currentBox.height}%`,
                borderColor: currentBox.color,
                backgroundColor: `${currentBox.color}20`,
              }}
            />
          )}
        </div>
      </div>

      <div className="p-4 bg-blue-50 border-t text-sm text-blue-700">
        <p>
          <strong>Instructions:</strong> Click the edit icon (✏️) on any field label to re-label that area. {isLabeling ? `Currently editing: ${fields.find(f => f.key === selectedField)?.label} - drag to select the new area.` : "Click edit icons to start labeling individual fields."} 
          {mode === "lineItems" && " For line items, you can create multiple labels for the same field type."}
        </p>
      </div>
    </div>
  );
};
