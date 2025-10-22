
import { useState, useEffect } from "react";

interface Label {
  id: string;
  label_id: string;
  label: string;
  ocr_text: string;
  score: number;
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  type: "field" | "line_item";
}

// Convert from percentage-based coordinates to absolute coordinates
const convertToAbsoluteCoords = (label: any, imageWidth: number, imageHeight: number): Label => {
  return {
    id: label.id || `label-${Date.now()}`,
    label_id: label.label_id || `label_id-${Date.now()}`,
    label: label.field || label.label,
    ocr_text: label.text || label.ocr_text || "Click to edit...",
    score: label.score || 0.0,
    xmin: Math.round((label.x / 100) * imageWidth),
    xmax: Math.round(((label.x + label.width) / 100) * imageWidth),
    ymin: Math.round((label.y / 100) * imageHeight),
    ymax: Math.round(((label.y + label.height) / 100) * imageHeight),
    type: label.itemIndex !== undefined ? "line_item" : "field"
  };
};

// Convert from absolute coordinates to percentage-based coordinates for display
const convertToPercentageCoords = (label: Label, imageWidth: number, imageHeight: number) => {
  return {
    id: label.id,
    text: label.ocr_text,
    x: (label.xmin / imageWidth) * 100,
    y: (label.ymin / imageHeight) * 100,
    width: ((label.xmax - label.xmin) / imageWidth) * 100,
    height: ((label.ymax - label.ymin) / imageHeight) * 100,
    field: label.label,
    color: getFieldColor(label.label),
    itemIndex: label.type === "line_item" ? 0 : undefined
  };
};

const getFieldColor = (labelName: string): string => {
  const fieldColors: Record<string, string> = {
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
  return fieldColors[labelName] || "#9CA3AF";
};

const createDefaultLabels = (mode: "document" | "lineItems") => {
  const documentDefaults = [
    { field: "fund_name", x: 20, y: 15, width: 30, height: 8, text: "Prime Storage Fund III SCA RAIF" },
    { field: "call_date", x: 40, y: 30, width: 25, height: 5, text: "2024-03-18" },
    { field: "investor_name", x: 40, y: 38, width: 25, height: 5, text: "WP PCC Limited PSG Cell" },
    { field: "amount_due", x: 15, y: 50, width: 35, height: 8, text: "USD 1,863,315" },
    { field: "currency", x: 60, y: 15, width: 30, height: 5, text: "USD" }
  ];

  const lineItemDefaults = [
    { field: "date", x: 5, y: 65, width: 15, height: 4, text: "2024-03-29", itemIndex: 0 },
    { field: "description", x: 22, y: 65, width: 40, height: 4, text: "Capital Contribution for Prime Storage Fund III SCA RAIF - Sub Fund V", itemIndex: 0 },
    { field: "debit", x: 65, y: 65, width: 15, height: 4, text: "1,863,315", itemIndex: 0 },
    { field: "credit", x: 82, y: 65, width: 15, height: 4, text: "", itemIndex: 0 },
    { field: "balance", x: 82, y: 65, width: 15, height: 4, text: "", itemIndex: 0 }
  ];

  const defaults = mode === "document" ? documentDefaults : lineItemDefaults;
  
  return defaults.map((item, index) => ({
    id: `default-${mode}-${index}`,
    text: item.text,
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    field: item.field,
    color: getFieldColor(item.field),
    itemIndex: "itemIndex" in item ? item.itemIndex : undefined
  }));
};

export const useLabelingState = (
  existingLabels: any[],
  mode: "document" | "lineItems",
  onLabelsChange: (labels: any[]) => void
) => {
  const [labels, setLabels] = useState<any[]>([]);
  const [isLabeling, setIsLabeling] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentBox, setCurrentBox] = useState<any | null>(null);

  useEffect(() => {
    // If no existing labels, create default ones
    if (existingLabels.length === 0) {
      const defaultLabels = createDefaultLabels(mode);
      setLabels(defaultLabels);
    } else {
      setLabels(existingLabels);
    }
  }, [existingLabels, mode]);

  useEffect(() => {
    onLabelsChange(labels);
  }, [labels, onLabelsChange]);

  useEffect(() => {
    // Set default selected field based on available fields
    // This will be set by the parent component when fields are determined
  }, [mode]);

  const getNextItemIndex = (field: string) => {
    if (mode === "document") return undefined;
    
    const existingItems = labels.filter(label => label.field === field);
    return existingItems.length;
  };

  const addLabel = (newLabel: any) => {
    const itemIndex = getNextItemIndex(newLabel.field);
    const label = {
      ...newLabel,
      id: `label-${Date.now()}`,
      itemIndex
    };
    
    console.log('Adding label:', label);
    
    // For document mode, remove existing labels with the same field
    // For line items mode, keep all labels (they can have multiple instances)
    if (mode === "document") {
      setLabels(prev => {
        const updated = [
          ...prev.filter(existingLabel => existingLabel.field !== newLabel.field),
          label
        ];
        console.log('Updated labels (document mode):', updated);
        return updated;
      });
    } else {
      setLabels(prev => {
        const updated = [...prev, label];
        console.log('Updated labels (line items mode):', updated);
        return updated;
      });
    }
  };

  const startEditField = (fieldKey: string) => {
    console.log('Starting to edit field:', fieldKey);
    // Remove existing label for this field in document mode
    if (mode === "document") {
      setLabels(prev => {
        const filtered = prev.filter(label => label.field !== fieldKey);
        console.log('Removed existing label for field, remaining labels:', filtered);
        return filtered;
      });
    }
    // Set up for new labeling
    setSelectedField(fieldKey);
    setIsLabeling(true);
    setSelectedLabel(null);
  };

  const updateLabel = (labelId: string, text: string) => {
    console.log('Updating label:', labelId, 'with text:', text);
    setLabels(labels.map(label => 
      label.id === labelId ? { ...label, text } : label
    ));
  };

  const deleteLabel = (labelId: string) => {
    console.log('Deleting label:', labelId);
    setLabels(labels.filter(label => label.id !== labelId));
    setSelectedLabel(null);
  };

  return {
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
  };
};
